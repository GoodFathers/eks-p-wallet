import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Balance from "./components/pages/Balance";
import Network from "./components/pages/Network";
import Training from "./components/pages/Training";
import PPOB from "./components/pages/PPOB";
import Security from "./components/pages/Security";
import Settings from "./components/pages/Settings";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/balance" element={<Balance />} />
          <Route path="/network" element={<Network />} />
          <Route path="/training" element={<Training />} />
          <Route path="/ppob" element={<PPOB />} />
          <Route path="/security" element={<Security />} />
          <Route path="/settings" element={<Settings />} />
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
