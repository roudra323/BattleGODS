import React, { useState } from "react";
import { useGlobalContext } from "../context";
import { PageHOC, CustomInput, CustomButton } from "../components";

const Home = () => {
  const { contract, account, isConnected, setShowAlert } = useGlobalContext();
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
      const isPlayer = await contract.isPlayer(account);
      console.log(isPlayer);

      if (!isPlayer) {
        await contract.registerPlayer(playerName, playerName);
        setShowAlert({
          status: true,
          type: "info",
          message: `${playerName} is being summoned!!`,
        });
      }
    } catch (err) {
      console.log("This is from home.jsx -> \n", err.code);

      setShowAlert({
        status: true,
        type: "failure",
        message: err.code,
      });
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
