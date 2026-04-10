import express from "express";
import cors from "cors";
import { exec } from "child_process";
import path from "path";
import fs from "fs";

const app = express();
const PORT = parseInt(process.env.PORT || "3100");
const PROJECT_DIR = process.cwd();
const OUT_DIR = path.join(PROJECT_DIR, "out");

app.use(cors());
app.use(express.json());
app.use("/out", express.static(OUT_DIR));

interface RenderJob {
  id: string;
  status: "rendering" | "done" | "error";
  progress: number;
  outputPath: string;
  error?: string;
}

const jobs = new Map<string, RenderJob>();
let jobCounter = 0;

app.get("/health", (_req, res) => {
  res.json({ ok: true, jobs: jobs.size });
});

app.post("/render", (req, res) => {
  const { compositionId, props, outputName, durationSeconds } = req.body;

  if (!compositionId || !outputName) {
    res.status(400).json({ error: "compositionId and outputName required" });
    return;
  }

  const jobId = `job-${++jobCounter}`;
  const outputFile = `${outputName}.mp4`;
  const outputPath = path.join(OUT_DIR, outputFile);

  const job: RenderJob = {
    id: jobId,
    status: "rendering",
    progress: 0,
    outputPath: outputPath.replace(/\\/g, "/"),
  };
  jobs.set(jobId, job);

  // Build command parts
  const isCloud = !!process.env.RAILWAY_ENVIRONMENT || !!process.env.RENDER || !!process.env.FLY_APP_NAME;
  const bundleDir = path.join(PROJECT_DIR, "build");
  const hasBundleDir = fs.existsSync(bundleDir);
  const parts = hasBundleDir
    ? ["npx", "remotion", "render", "--bundle-dir", "build", compositionId, `out/${outputFile}`]
    : ["npx", "remotion", "render", compositionId, `out/${outputFile}`];
  if (isCloud) {
    parts.push("--gl=swiftshader");
  }

  // Write props to temp file (Windows CLI mangles JSON quotes)
  const propsFileName = `_props_${jobCounter}.json`;
  const propsAbsolute = path.join(OUT_DIR, propsFileName);
  let hasPropsFile = false;
  if (props && Object.keys(props).length > 0) {
    fs.writeFileSync(propsAbsolute, JSON.stringify(props));
    hasPropsFile = true;
    parts.push(`--props=out/${propsFileName}`);
  }

  if (durationSeconds) {
    const frames = Math.round(durationSeconds * 30) - 1;
    parts.push(`--frames=0-${frames}`);
  }

  const cmd = parts.join(" ");
  console.log(`[${jobId}] ${cmd}`);

  const child = exec(cmd, { cwd: PROJECT_DIR, maxBuffer: 10 * 1024 * 1024 }, (error, _stdout, stderr) => {
    if (hasPropsFile) {
      try { fs.unlinkSync(propsAbsolute); } catch {}
    }

    if (!error && fs.existsSync(outputPath)) {
      job.status = "done";
      job.progress = 100;
      console.log(`[${jobId}] Done: ${outputPath}`);
    } else {
      job.status = "error";
      job.error = (stderr || error?.message || "Unknown error").slice(-500);
      console.error(`[${jobId}] Failed: ${job.error.slice(0, 200)}`);
    }
  });

  child.stdout?.on("data", (text: string) => {
    const match = text.match(/Rendered (\d+)\/(\d+)/);
    if (match) {
      job.progress = Math.round((parseInt(match[1]) / parseInt(match[2])) * 100);
    }
  });

  child.stderr?.on("data", (text: string) => {
    const match = text.match(/Rendered (\d+)\/(\d+)/);
    if (match) {
      job.progress = Math.round((parseInt(match[1]) / parseInt(match[2])) * 100);
    }
  });

  res.json({ jobId, outputFile });
});

// ─── RENDER FROM NATURAL LANGUAGE PROMPT ───

function buildSystemPrompt(): string {
  return [
    "Eres un director creativo de motion graphics premium. Recibes una descripción en lenguaje natural y generas JSON de props para Remotion (DynamicMG).",
    "Canvas: 1080x1920 vertical, 30fps. Responde SOLO con JSON válido, sin markdown, sin backticks.",
    "",
    "Elementos: badge, title, subtitle, counter, numberTicker, progressBars, checklist, notifications, ctaButton, chart, donutChart, pieChart, barChart, gaugeDial, statCard, progressCircle, versusLayout, beforeAfter, percentageSplit, phoneFrame, laptopFrame, browserWindow, glassCard (contenedor), gradientText, highlightedText, textReveal, quoteBlock, testimonialCard, starRating, reviewScore, processSteps, timelineVertical, iconGrid, numberedList, confettiBurst, glowPulse, animatedArrow, divider, metricRow.",
    "",
    "REGLAS: 3-5 elementos por escena. Delays en SEGUNDOS (0.2, 0.5, 0.8, 1.2...). fullFrame:true. Fondo oscuro tech premium (negros profundos con toque púrpura). Particles sutiles morado. Acentos #6429cd y #ff6b35. Textos blancos. Español. Piensa como director creativo premium.",
  ].join("\n");
}

function buildUserPrompt(prompt: string, durationSeconds: number, context?: string): string {
  const lines = [
    "Crea un motion graphic de " + durationSeconds + " segundos con esta visión creativa:",
    "",
    prompt,
    "",
  ];
  if (context) {
    lines.push("Contexto del video: " + context, "");
  }
  lines.push(
    "Genera JSON con esta estructura:",
    '{"scenes":[{"duration":' + durationSeconds + ',"fullFrame":true,"background":{"type":"gradient","colors":["#050510","#0a0618"],"angle":180},"particles":{"count":12,"color":"rgba(100,41,205,0.2)","direction":"up"},"elements":[...]}]}'
  );
  return lines.join("\n");
}

app.post("/render-from-prompt", async (req, res) => {
  const { prompt, outputName, durationSeconds = 5, context } = req.body;

  if (!prompt || !outputName) {
    res.status(400).json({ error: "prompt and outputName required" });
    return;
  }

  try {
    console.log("[prompt] Converting: " + prompt.slice(0, 100) + "...");

    const apiKey = process.env.LOVABLE_API_KEY || "";
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: buildSystemPrompt() },
          { role: "user", content: buildUserPrompt(prompt, durationSeconds, context) },
        ],
        max_tokens: 4000,
      }),
    });

    if (!aiResponse.ok) {
      throw new Error("AI gateway error: " + aiResponse.status);
    }

    const aiData = await aiResponse.json() as any;
    const rawText = aiData.choices?.[0]?.message?.content || "";
    const cleanJson = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let props: any;
    try {
      props = JSON.parse(cleanJson);
    } catch {
      throw new Error("AI returned invalid JSON");
    }

    const elemCount = props.scenes?.[0]?.elements?.length || 0;
    console.log("[prompt] Generated " + elemCount + " elements");

    // Render with Remotion
    const jobId = "job-" + (++jobCounter);
    const outputFile = outputName + ".mp4";
    const outputPath = path.join(OUT_DIR, outputFile);

    const job: RenderJob = {
      id: jobId,
      status: "rendering",
      progress: 0,
      outputPath: outputPath.replace(/\\/g, "/"),
    };
    jobs.set(jobId, job);

    const propsFileName = "_props_" + jobCounter + ".json";
    const propsAbsolute = path.join(OUT_DIR, propsFileName);
    fs.writeFileSync(propsAbsolute, JSON.stringify(props));

    const isCloudEnv = !!process.env.RAILWAY_ENVIRONMENT || !!process.env.RENDER || !!process.env.FLY_APP_NAME;
    const bundleDirPath = path.join(PROJECT_DIR, "build");
    const hasBundleDirRFP = fs.existsSync(bundleDirPath);
    const parts = hasBundleDirRFP
      ? ["npx", "remotion", "render", "--bundle-dir", "build", "DynamicMG", "out/" + outputFile]
      : ["npx", "remotion", "render", "DynamicMG", "out/" + outputFile];
    parts.push("--props=out/" + propsFileName);
    parts.push("--frames=0-" + (Math.round(durationSeconds * 30) - 1));
    if (isCloudEnv) {
      parts.push("--gl=swiftshader");
    }

    const cmd = parts.join(" ");
    console.log("[" + jobId + "] " + cmd);

    const child = exec(cmd, { cwd: PROJECT_DIR, maxBuffer: 10 * 1024 * 1024 }, (error, _stdout, stderr) => {
      try { fs.unlinkSync(propsAbsolute); } catch {}
      if (!error && fs.existsSync(outputPath)) {
        job.status = "done";
        job.progress = 100;
      } else {
        job.status = "error";
        job.error = (stderr || error?.message || "Unknown error").slice(-500);
      }
    });

    child.stdout?.on("data", (chunk: string) => {
      const match = chunk.match(/Rendered (\d+)\/(\d+)/);
      if (match) job.progress = Math.round((parseInt(match[1]) / parseInt(match[2])) * 100);
    });
    child.stderr?.on("data", (chunk: string) => {
      const match = chunk.match(/Rendered (\d+)\/(\d+)/);
      if (match) job.progress = Math.round((parseInt(match[1]) / parseInt(match[2])) * 100);
    });

    res.json({ jobId, outputFile, generatedProps: props });
  } catch (err: any) {
    console.error("[prompt] Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── SYNC B-ROLLS TO STUDIO ───
// FloowVideo sends all broll placements, server writes them so Studio can see them

app.post("/sync-brolls", (req, res) => {
  const { placements } = req.body;
  if (!placements || !Array.isArray(placements)) {
    res.status(400).json({ error: "placements array required" });
    return;
  }

  const propsFile = path.join(PROJECT_DIR, "public", "broll-props.json");
  fs.writeFileSync(propsFile, JSON.stringify(placements, null, 2));
  console.log("[sync] Wrote " + placements.length + " B-roll placements to broll-props.json");
  res.json({ ok: true, count: placements.length });
});

app.get("/status/:jobId", (req, res) => {
  const job = jobs.get(req.params.jobId);
  if (!job) {
    res.status(404).json({ error: "Job not found" });
    return;
  }
  res.json(job);
});

app.listen(PORT, () => {
  console.log(`Remotion render server on http://localhost:${PORT}`);
  console.log(`Project: ${PROJECT_DIR}`);
  console.log(`Output: ${OUT_DIR}`);
});
