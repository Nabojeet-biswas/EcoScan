import { useNavigate } from "react-router";
import { Navbar } from "@/components/common/Navbar";
import { HeroSection } from "@/features/landing/components/HeroSection";
import { detectionService } from "@/features/waste/services/detectionService";

export function LandingPage() {
  const navigate = useNavigate();
  const mode = detectionService.getMode();

  return (
    <div className="min-h-screen bg-bg text-fg">
      <Navbar
        onScanClick={() => navigate("/scanner")}
        onHomeClick={() => navigate("/")}
      />
      <HeroSection
        onScanClick={() => navigate("/scanner")}
        mode={mode}
      />
    </div>
  );
}
