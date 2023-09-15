import React from "react";
import { useGlobalContext } from "../context";
import { PageHOC } from "../components";

const Home = () => {
  const { contract, account, isConnected } = useGlobalContext();
  return (
    <div>
      <h1 className="text-white">
        {/* {console.log(contract, "\n", account, "\n", isConnected)} */}
      </h1>
    </div>
  );
};

export default PageHOC(
  Home,
  <>
    Welcome to Avax Gods <br /> a Web3 NFT Card Game
  </>,
  <>
    Connect your wallet to start playing <br /> the ultimate Web3 Battle Card
    Game
  </>
);
