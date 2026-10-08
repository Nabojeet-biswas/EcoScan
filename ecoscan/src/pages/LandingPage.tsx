import { useNavigate } from "react-router";
import { useEffect } from "react";
import { HeroSection } from "@/features/landing/components/HeroSection";
import { detectionService } from "@/features/waste/services/detectionService";
import { useNavbarConfig } from "@/context/NavbarContext";

export function LandingPage() {
  const navigate = useNavigate();
  const { setConfig } = useNavbarConfig();
  const mode = detectionService.getMode();

  useEffect(() => {
    setConfig({
      onScanClick: () => navigate("/scanner"),
      onHomeClick: () => navigate("/"),
    });
  }, [navigate, setConfig]);

  return (
    <HeroSection
      onScanClick={() => navigate("/scanner")}
      mode={mode}
    />
  );
}