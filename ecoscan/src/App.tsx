import { useState } from "react";
import { Route, Routes } from "react-router";
import { SplashScreen } from "@/components/common/SplashScreen";
import { LandingPage } from "@/pages/LandingPage";
import { ScannerPage } from "./pages/ScannerPage";

function App() {
  const [splashComplete, setSplashComplete] = useState(false);

  return (
    <>
      <SplashScreen onComplete={() => setSplashComplete(true)} />
      {splashComplete && (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/scanner" element={<ScannerPage />} />
        </Routes>
      )}
    </>
  );
}

export default App;
