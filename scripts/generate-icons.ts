#!/usr/bin/env npx tsx
/**
 * Genera iconos para motion graphics usando Gemini Image Generation (Nano Banana).
 * Usage: GEMINI_API_KEY=xxx npx tsx scripts/generate-icons.ts
 */
import {GoogleGenerativeAI} from "@google/generative-ai";
import fs from "fs";
import path from "path";

const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyDKdLSCVX1Vx4PyNi93GdEEQvhmoRWCqi4";
const OUTPUT_DIR = path.join("public", "assets", "icons");

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-image",
  generationConfig: {
    responseModalities: ["image", "text"],
  } as any,
});

const icons = [
  {
    name: "brain-ai",
    prompt:
      "Flat minimalist icon of a glowing brain with circuit patterns, neon purple color (#8b5cf6), black background (#0a0a0a), clean vector style, motion graphics aesthetic, no text, centered, high contrast glow effect",
  },
  {
    name: "rocket",
    prompt:
      "Flat minimalist icon of a rocket launching upward with speed lines, neon green color (#39E508), black background (#0a0a0a), clean vector style, motion graphics aesthetic, no text, centered, glow trail effect",
  },
  {
    name: "chart-up",
    prompt:
      "Flat minimalist icon of a bar chart with ascending bars and an upward arrow, neon cyan color (#06b6d4), black background (#0a0a0a), clean vector style, motion graphics aesthetic, no text, centered, subtle glow",
  },
  {
    name: "checkmark-shield",
    prompt:
      "Flat minimalist icon of a shield with a checkmark inside, neon green color (#39E508) and neon purple (#8b5cf6), black background (#0a0a0a), clean vector style, motion graphics aesthetic, no text, centered, glow effect",
  },
  {
    name: "stopwatch",
    prompt:
      "Flat minimalist icon of a stopwatch/chronometer showing speed, neon purple color (#8b5cf6), black background (#0a0a0a), clean vector style, motion graphics aesthetic, no text, centered, glowing hands",
  },
  {
    name: "money-slash",
    prompt:
      "Flat minimalist icon of a dollar sign with a diagonal slash through it meaning no more wasting money, neon red-pink color (#f43f5e), black background (#0a0a0a), clean vector style, motion graphics aesthetic, no text, centered, glow effect",
  },
];

async function generateIcon(icon: {name: string; prompt: string}) {
  console.log(`Generando: ${icon.name}...`);
  try {
    const response = await model.generateContent(icon.prompt);
    const parts = response.response.candidates?.[0]?.content?.parts ?? [];

    for (const part of parts) {
      if (part.inlineData) {
        const buffer = Buffer.from(part.inlineData.data!, "base64");
        const outputPath = path.join(OUTPUT_DIR, `${icon.name}.png`);
        fs.writeFileSync(outputPath, buffer);
        console.log(`  ✓ Guardado: ${outputPath}`);
        return true;
      }
    }
    console.log(`  ✗ No se generó imagen para ${icon.name}`);
    return false;
  } catch (err: any) {
    console.error(`  ✗ Error en ${icon.name}: ${err.message}`);
    return false;
  }
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, {recursive: true});
  }

  console.log("=== Generando iconos con Gemini (Nano Banana) ===\n");

  let success = 0;
  for (const icon of icons) {
    const ok = await generateIcon(icon);
    if (ok) success++;
    // Pequeña pausa entre requests para evitar rate limiting
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log(`\n=== Completado: ${success}/${icons.length} iconos generados ===`);
}

main().catch((err) => {
  console.error("Error fatal:", err.message);
  process.exit(1);
});
