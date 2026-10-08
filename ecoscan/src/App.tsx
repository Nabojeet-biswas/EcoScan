import { useState } from "react";
import { Route, Routes, Navigate } from "react-router";
import { SplashScreen } from "@/components/common/SplashScreen";
import { LandingPage } from "@/pages/LandingPage";
import { ScannerPage } from "./pages/ScannerPage";
import { Feed } from "./pages/Feed";
import { Layout } from "@/components/Layout";

function App() {
  const [splashComplete, setSplashComplete] = useState(false);

  return (
    <>
      <SplashScreen onComplete={() => setSplashComplete(true)} />
      {splashComplete && (
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/scanner" element={<ScannerPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </>
  );
}

export default App;
