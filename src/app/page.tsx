import { StoryProvider } from "@/components/shell/StoryContext";
import { SmoothScrollProvider } from "@/components/shell/SmoothScrollProvider";
import { HeaderHUD } from "@/components/shell/HeaderHUD";
import { VoiceCaptionBar } from "@/components/shell/VoiceCaptionBar";
import { ReferenceDrawer } from "@/components/shell/ReferenceDrawer";
import { HeroStage } from "@/components/stages/HeroStage";
import { ProblemSection } from "@/components/stages/ProblemSection";
import { StormRadarAct } from "@/components/stages/StormRadarAct";
import { AkaySectionAct } from "@/components/stages/AkaySectionAct";
import { ArchitectureSection } from "@/components/stages/ArchitectureSection";
import { FieldInterlude } from "@/components/stages/FieldInterlude";
import { AkomDispatchAct } from "@/components/stages/AkomDispatchAct";
import { RainBreakStage } from "@/components/stages/RainBreakStage";
import { ChronometerAct } from "@/components/stages/ChronometerAct";
import { PilotEndingSection } from "@/components/stages/PilotEndingSection";

export default function HomePage() {
  return (
    <StoryProvider>
      <SmoothScrollProvider>
        <HeaderHUD />
        <main>
          <HeroStage />
          <ProblemSection />
          <StormRadarAct />
          <AkaySectionAct />
          <ArchitectureSection />
          <FieldInterlude />
          <AkomDispatchAct />
          <RainBreakStage />
          <ChronometerAct />
          <PilotEndingSection />
        </main>
        <VoiceCaptionBar />
        <ReferenceDrawer />
      </SmoothScrollProvider>
    </StoryProvider>
  );
}
