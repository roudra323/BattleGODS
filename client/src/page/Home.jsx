import React, { useState } from "react";
import { useGlobalContext } from "../context";
import { PageHOC, CustomInput, CustomButton } from "../components";

const Home = () => {
  const { contract, account, isConnected } = useGlobalContext();
  console.log(contract, account, isConnected);
  const [playerName, setPlayerName] = useState("");

  const handleClick = async () => {
    try {
      if (playerName === "") {
        alert("Please enter a valid name");
        return;
      }
      if (!isConnected) {
        alert("Please connect your wallet");
        return;
      }
      const tx = await contract.isPlayer(account);
      console.log(tx);

      // const tx = await contract.methods
      //   .registerPlayer(playerName)
      //   .send({ from: account });
      // console.log(tx);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="flex flex-col">
      <CustomInput
        label="Name"
        placeholder="Enter your name"
        value={playerName}
        handleValueChange={setPlayerName}
      />
      <CustomButton
        title="Register"
        handleClick={handleClick}
        restStyles="mt-6"
      />
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
