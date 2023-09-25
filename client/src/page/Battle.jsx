import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import styles from "../styles";
// import { ActionButton, Alert, Card, GameInfo, PlayerInfo } from "../components";
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
  const { contract, gamedata, account, showAlert, setShowAlert, BattleGround } =
    useGlobalContext();
  const [player2, setPlayer2] = useState({});
  const [player1, setPlayer1] = useState({});
  const { battleName } = useParams();

  const getPlayerInfo = async () => {
    try {
      let player01Address = null;
      let player02Address = null;

      if (
        gamedata.activeBattle.players[0].toLowerCase() === account.toLowerCase()
      ) {
        player01Address = gamedata.activeBattle.players[0];
        player02Address = gamedata.activeBattle.players[1];
      } else {
        player01Address = gamedata.activeBattle.players[1];
        player02Address = gamedata.activeBattle.players[0];
      }

      const p1TokenData = await contract.getPlayerToken(player01Address);
      const player01 = await contract.getPlayer(player01Address);
      const player02 = await contract.getPlayer(player02Address);

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
      console.log(error);
    }
  };

  // useEffect(() => {
  //   if (contract && gamedata.activeBattle) getPlayerInfo();
  // }, [contract, gamedata, battleName]);

  return (
    <div
      className={`${styles.flexBetween} ${styles.gameContainer} ${BattleGround}`}
    >
      {showAlert.status && (
        <Alert type={showAlert.type} message={showAlert.message} />
      )}
      <PlayerInfo player={player2} playerIcon={player02Icon} mt />
    </div>
  );
};

export default Battle;
