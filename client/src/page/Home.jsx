import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../context";
import { PageHOC, CustomInput, CustomButton } from "../components";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { contract, account, isConnected, setShowAlert, gameData } =
    useGlobalContext();
  console.log(contract, account, isConnected);
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();

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
      const isPlayerExist = await contract.isPlayer(account);
      console.log(isPlayerExist);

      const allPlayers = await contract.getAllPlayers();
      console.log(allPlayers);

      if (!isPlayerExist) {
        await contract.registerPlayer(playerName, playerName);
        setShowAlert({
          status: true,
          type: "info",
          message: `${playerName} is being summoned!!`,
        });
      } else {
        setShowAlert({
          status: true,
          type: "info",
          message: `${playerName} is already registered!!`,
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

  useEffect(() => {
    if (gameData?.activeBattle?.battleStatus === 1) {
      console.log("This is game data", gameData);
      navigate(`/battle/${gameData.activeBattle.name}`);
    } else if (gameData?.activeBattle?.battleStatus === 0) {
      setWaitBattle(true);
    }
  }, [gameData, account]);

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
