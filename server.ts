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
  const parts = ["npx", "remotion", "render", compositionId, `out/${outputFile}`];

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
