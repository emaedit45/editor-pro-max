Set up Editor Pro Max for first use. Run these steps automatically without asking:

1. Check if `node_modules/` exists. If not, run `npm install` and wait for it to complete.
2. Run `npx tsc --noEmit` to verify TypeScript compiles cleanly.
3. Open the landing page in the browser: run `open -a "Google Chrome" landing.html` (macOS) or `xdg-open landing.html` (Linux).
4. Show a welcome message:

```
✦ Editor Pro Max — @soyenriquerocha

The landing page is open in your browser.
Click "Comenzar a Editar" to open Remotion Studio.

Or tell me what you want to create:

CREATE FROM SCRATCH
  "Hazme un TikTok sobre..."
  "Create a presentation with 5 slides..."
  "Build an announcement video for..."

EDIT EXISTING VIDEO
  Place your video in public/assets/ then tell me:
  "Add captions to my video"
  "Cut the silence from my talking head"
  "Extract a 30-second clip for Instagram"

BROWSE FOR REFERENCES
  "I want the style from Apple's videos"
  "Browse TikTok caption trends"
  "Find me reference styles for tech presentations"

SKILLS: 8 specialized AI skills loaded
  Remotion best practices, motion design, award-winning animations,
  animated components, FFmpeg, explainer videos, rendering, web browsing

PREVIEW & RENDER
  npm run dev → Remotion Studio
  npx remotion render <id> out/video.mp4 → export

What would you like to make?
```

Do NOT skip any step. Do NOT ask for confirmation — just run setup, open the landing page, and show the welcome.
