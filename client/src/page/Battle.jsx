import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import styles from "../styles";
import { ActionButton, Alert, Card, GameInfo, PlayerInfo } from "../components";
import { useGlobalContext } from "../context";
import {
  attack,
  attackSound,
  battlegrounds,
  defense,
  defenseSound,
  player01 as player01Icon,
  player02 as player02Icon,
} from "../assets";
import { playAudio } from "../utils/animation.js";

const Battle = () => {
  const navigate = useNavigate();
  const {
    contract,
    gameData,
    account,
    showAlert,
    setShowAlert,
    BattleGround,
    seterrorMessage,
    player1Ref,
    player2Ref,
  } = useGlobalContext();
  const [player2, setPlayer2] = useState({});
  const [player1, setPlayer1] = useState({});
  const { battleName } = useParams();

  const getPlayerInfo = async () => {
    try {
      let player01Address = null;
      let player02Address = null;

      if (
        gameData.activeBattle.players[0].toLowerCase() === account.toLowerCase()
      ) {
        player01Address = gameData.activeBattle.players[0];
        player02Address = gameData.activeBattle.players[1];
      } else {
        player01Address = gameData.activeBattle.players[1];
        player02Address = gameData.activeBattle.players[0];
      }

      const p1TokenData = await contract.getPlayerToken(player01Address);
      const player01 = await contract.getPlayer(player01Address);
      const player02 = await contract.getPlayer(player02Address);

      // console.log(player01, "\n", player02);

      const p1Att = p1TokenData.attackStrength.toNumber();
      const p1Def = p1TokenData.defenseStrength.toNumber();
      const p1H = player01.playerHealth.toNumber();
      const p1M = player01.playerMana.toNumber();
      const p2H = player02.playerHealth.toNumber();
      const p2M = player02.playerMana.toNumber();

      setPlayer1({
        ...player01,
        att: p1Att,
        def: p1Def,
        health: p1H,
        mana: p1M,
      });
      setPlayer2({ ...player02, att: "X", def: "X", health: p2H, mana: p2M });
    } catch (error) {
      seterrorMessage(error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!gameData.activeBattle) navigate("/");
      // console.log("Inside useeffect");
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contract && !gameData.activeBattle) navigate("/");
      // console.log("Inside useeffect V2");
    }, 2000);

    return () => clearTimeout(timer);
  }, [gameData]);

  useEffect(() => {
    if (contract && gameData.activeBattle) getPlayerInfo();
  }, [contract, gameData, battleName]);

  const makeMove = async (choice) => {
    playAudio(choice === 1 ? attackSound : defenseSound);

    try {
      await contract.attackOrDefendChoice(choice, battleName);

      setShowAlert({
        status: true,
        type: "info",
        message: `Initiating ${choice === 1 ? "Attack" : "Defense"}`,
      });
    } catch (error) {
      seterrorMessage(error);
    }
  };

  return (
    <div
      className={`${styles.flexBetween} ${styles.gameContainer} ${BattleGround}`}
    >
      {showAlert.status && (
        <Alert type={showAlert.type} message={showAlert.message} />
      )}
      <PlayerInfo player={player2} playerIcon={player02Icon} mt />
      <div className={`${styles.flexCenter} flex-col my-10`}>
        <Card
          card={player2}
          title={player2?.playerName}
          cardRef={player2Ref}
          playerTwo
        />
        <div className="flex items-center flex-row">
          <ActionButton
            imgUrl={attack}
            handleClick={() => {
              makeMove(1);
            }}
            restStyles="mr-2 hover:border-yellow-400 "
          />
          {/* {console.log("Contract", contract)} */}
          <Card
            card={player1}
            title={player1?.playerName}
            cardRef={player1Ref}
            restStyles="mt-3"
          />
          <ActionButton
            imgUrl={defense}
            handleClick={() => {
              makeMove(2);
            }}
            restStyles="ml-6 hover:border-red-600 "
          />
        </div>
      </div>
      <PlayerInfo player={player1} playerIcon={player01Icon} />
      <GameInfo />
    </div>
  );
};

export default Battle;
