import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../context";
import { PageHOC, CustomInput, CustomButton } from "../components";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const {
    contract,
    account,
    isConnected,
    setShowAlert,
    gameData,
    seterrorMessage,
  } = useGlobalContext();
  // console.log(contract, account, isConnected);
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
      // console.log(isPlayerExist);

      const allPlayers = await contract.getAllPlayers();
      // console.log(allPlayers);

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
      seterrorMessage(err);
    }
  };

  useEffect(() => {
    const createPlayerToken = async () => {
      const playerExists = await contract.isPlayer(account);
      const playerTokenExists = await contract.isPlayerToken(account);

      if (playerExists && playerTokenExists) navigate("/create-battle");
    };

    if (contract) createPlayerToken();
  }, [contract]);

  useEffect(() => {
    if (gameData.activeBattle) {
      navigate(`/battle/${gameData.activeBattle.name}`);
    }
  }, [gameData]);

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
