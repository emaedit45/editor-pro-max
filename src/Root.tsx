import {Composition, Folder} from "remotion";

// Compositions
import {ShowcaseComposition} from "./compositions/Showcase";
import {MotionGraphic1Hook} from "./compositions/MotionGraphic1Hook";
import {MotionGraphic2Stats} from "./compositions/MotionGraphic2Stats";
import {MotionGraphic3CTA} from "./compositions/MotionGraphic3CTA";
import {DynamicMG} from "./compositions/DynamicMG";

// Social templates
import {TikTokVideo} from "./templates/social/TikTokVideo";
import {InstagramReel} from "./templates/social/InstagramReel";
import {YouTubeShort} from "./templates/social/YouTubeShort";

// Content templates
import {Presentation} from "./templates/content/Presentation";
import {Testimonial} from "./templates/content/Testimonial";

// Promo templates
import {Announcement} from "./templates/promo/Announcement";
import {BeforeAfterDemo} from "./compositions/BeforeAfterDemo";

// Editing templates
import {TalkingHeadEdit} from "./templates/editing/TalkingHeadEdit";
import {PodcastClip} from "./templates/editing/PodcastClip";

// Custom compositions
import {ColombiaVsMexico} from "./compositions/ColombiaVsMexico";
import {SaleADSReel} from "./compositions/SaleADSReel";
import {BrollPreview} from "./compositions/BrollPreview";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Examples">
        <Composition
          id="Showcase"
          component={ShowcaseComposition}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>

      <Folder name="Social">
        <Composition
          id="TikTok"
          component={TikTokVideo}
          durationInFrames={270}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            hook: "Did you know this?",
            body: "AI can edit videos now using just code.",
            cta: "Follow for more",
          }}
        />
        <Composition
          id="InstagramReel"
          component={InstagramReel}
          durationInFrames={240}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            headline: "Your headline here",
            subtext: "Supporting text goes here",
            brandName: "Brand",
          }}
        />
        <Composition
          id="YouTubeShort"
          component={YouTubeShort}
          durationInFrames={300}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            title: "Your Title Here",
            subtitle: "Subtitle goes here",
          }}
        />
      </Folder>

      <Folder name="Content">
        <Composition
          id="Presentation"
          component={Presentation}
          durationInFrames={450}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            slides: [
              {title: "Welcome", body: "This is slide one"},
              {title: "The Problem", body: "Here's what we're solving"},
              {title: "The Solution", body: "Here's how we solve it"},
            ],
          }}
        />
        <Composition
          id="Testimonial"
          component={Testimonial}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            quote:
              "This product completely changed how we work. Highly recommended.",
            author: "Jane Doe",
            role: "CEO at Company",
          }}
        />
      </Folder>

      <Folder name="Promo">
        <Composition
          id="Announcement"
          component={Announcement}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            preTitle: "Introducing",
            title: "Something Amazing",
            subtitle: "The future is here",
            cta: "Learn More",
          }}
        />
        <Composition
          id="BeforeAfter"
          component={BeforeAfterDemo}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>

      <Folder name="Motion-Graphics-ADS-LANZ">
        <Composition
          id="MG1-Hook"
          component={MotionGraphic1Hook}
          durationInFrames={270}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{}}
        />
        <Composition
          id="MG2-Stats"
          component={MotionGraphic2Stats}
          durationInFrames={450}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{}}
        />
        <Composition
          id="MG3-CTA"
          component={MotionGraphic3CTA}
          durationInFrames={500}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{}}
        />
        <Composition
          id="DynamicMG"
          component={DynamicMG}
          durationInFrames={300}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            scenes: [
              {
                duration: 5,
                background: {colors: ["#0a0a0a", "#1a1a3e"]},
                particles: {count: 40, direction: "up"},
                elements: [
                  {type: "badge", text: "DEMO", delay: 0.2},
                  {type: "title", text: "Dynamic MG", fontSize: 56, delay: 0.5},
                  {type: "subtitle", text: "Composición universal", delay: 0.8},
                ],
              },
              {
                duration: 5,
                background: {colors: ["#0f0f23", "#1a0a2e"]},
                particles: {count: 30, direction: "up"},
                elements: [
                  {type: "glassCard", delay: 0.3, children: [
                    {type: "counter", value: 1000, suffix: "+", label: "ventas", color: "#8b5cf6", delay: 0.5},
                    {type: "progressBars", delay: 0.8, bars: [
                      {label: "Conversión", value: 92, color: "#3b82f6"},
                      {label: "ROI", value: 85, color: "#06b6d4"},
                    ]},
                  ]},
                ],
              },
            ],
          }}
        />
      </Folder>

      <Folder name="Editing">
        <Composition
          id="TalkingHeadEdit"
          component={TalkingHeadEdit}
          durationInFrames={900}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            videoSrc: "assets/video.mp4",
            showCaptions: true,
            captionPreset: "bold" as const,
            removeSilence: false,
          }}
        />
        <Composition
          id="PodcastClip"
          component={PodcastClip}
          durationInFrames={900}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            videoSrc: "assets/video.mp4",
            clipStartSeconds: 0,
            clipEndSeconds: 30,
            showCaptions: true,
            captionPreset: "bold" as const,
          }}
        />
      </Folder>
      <Folder name="Comparativas">
        <Composition
          id="ColombiaVsMexico"
          component={ColombiaVsMexico}
          durationInFrames={577}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>

      <Folder name="Reels">
        <Composition
          id="SaleADS-Reel"
          component={SaleADSReel}
          durationInFrames={1002}
          fps={60}
          width={1080}
          height={1920}
        />
      </Folder>

      <Folder name="B-Rolls">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <Composition
            key={`broll-${i}`}
            id={`broll_${i + 1}`}
            component={BrollPreview}
            durationInFrames={150}
            fps={30}
            width={1080}
            height={1920}
            defaultProps={{ brollIndex: i }}
          />
        ))}
      </Folder>
    </>
  );
};
