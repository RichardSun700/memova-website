/**
 * Memova Official Website - Home Page
 * Design: Kinetic Flow - motion-led, visual-first storytelling
 * Colors: Memova Blue (#8E9CC7), Navy (#2D3A5C), Light (#F5F7FB)
 * Typography: Space Grotesk (display) + DM Sans (body)
 */
import { useRef } from "react";
import HeroSection from "@/components/sections/HeroSection";
import AppDisclosureSection from "@/components/sections/AppDisclosureSection";
import WorkflowSection from "@/components/sections/WorkflowSection";
import PrivacySection from "@/components/sections/PrivacySection";
import MemorySection from "@/components/sections/MemorySection";
import UseCasesSection from "@/components/sections/UseCasesSection";
import AgentPluginsSection from "@/components/sections/AgentPluginsSection";
import SocialProofSection from "@/components/sections/SocialProofSection";
import CTASection from "@/components/sections/CTASection";
import Navbar from "@/components/Navbar";

export default function Home() {
  const workflowRef = useRef<HTMLDivElement>(null);

  const scrollToWorkflow = () => {
    workflowRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[var(--memova-light)]">
      <Navbar />
      <HeroSection onSeeWorkflow={scrollToWorkflow} />
      <AppDisclosureSection />
      <div ref={workflowRef} id="workflow">
        <WorkflowSection />
      </div>
      <PrivacySection />
      <MemorySection />
      <UseCasesSection />
      <AgentPluginsSection />
      <SocialProofSection />
      <CTASection />
    </div>
  );
}
