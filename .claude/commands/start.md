Set up Editor Pro Max for first use. Run these steps automatically without asking:

1. Check if `node_modules/` exists. If not, run `npm install` and wait for it to complete.
2. Run `npx tsc --noEmit` to verify TypeScript compiles cleanly.
3. Show a welcome message:

```
✦ Editor Pro Max — @soyenriquerocha

Ready to edit. Here's what I can do:

CREATE FROM SCRATCH
  "Make me a TikTok about..."
  "Create a presentation with 5 slides..."
  "Build an announcement video for..."

EDIT EXISTING VIDEO
  Place your video in public/assets/ then tell me:
  "Add captions to my video"
  "Cut the silence from my talking head"
  "Extract a 30-second clip for Instagram"

PREVIEW & RENDER
  npm run dev → preview in browser
  npx remotion render <id> out/video.mp4 → export

What would you like to make?
```

Do NOT skip any step. Do NOT ask for confirmation — just run setup and show the welcome.
