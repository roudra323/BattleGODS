import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { WagmiConfig, createConfig, sepolia } from "wagmi";
import { createPublicClient, http } from "viem";
import { Home, CreateBattle, JoinBattle, Battle, BattleGround } from "./page";
import { GlobalProvider } from "./context";
import "./index.css";
import { OnboardModal } from "./components";

const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: sepolia,
    transport: http(),
  }),
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <WagmiConfig config={config}>
    <BrowserRouter>
      <GlobalProvider>
        <OnboardModal />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-battle" element={<CreateBattle />} />
          <Route path="/join-battle" element={<JoinBattle />} />
          <Route path="/battleground" element={<BattleGround />} />
          <Route path="/battle/:battleName" element={<Battle />} />
        </Routes>
      </GlobalProvider>
    </BrowserRouter>
  </WagmiConfig>
);
