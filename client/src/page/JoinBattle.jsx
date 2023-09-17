import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGlobalContext } from "../context";
import { PageHOC, CustomButton, CustomInput } from "../components";
import styles from "../styles";

const JoinBattle = () => {
  const { contract, gameData, setShowAlert, setBattleName, account } =
    useGlobalContext();
  const navigate = useNavigate();

  const handleClick = async (battleName) => {
    setBattleName(battleName);

    try {
      await contract.joinBattle(battleName);
      setShowAlert({
        status: true,
        type: "success",
        message: `Joining ${battleName} battle`,
      });
    } catch (error) {}
  };
  return (
    <>
      <h2 className={styles.joinHeadText}>Available Battles:</h2>
      <div className={styles.joinContainer}>
        {gameData.pendingBattles.length ? (
          gameData.pendingBattles
            .filter((battle) => !battle.players.includes(account))
            .map((battle, index) => (
              <div key={battle.name + index} className={styles.flexBetween}>
                <p className={styles.joinBattleTitle}>
                  {index + 1}. {battle.name}
                </p>
                <CustomButton
                  title="Join"
                  handleClick={() => handleClick(battle.name)}
                />
              </div>
            ))
        ) : (
          <p className={styles.joinLoading}>
            Reload the page to see available battles
          </p>
        )}
      </div>
      <p className={styles.infoText} onClick={() => navigate("/create-battle")}>
        Or create a new battle
      </p>
    </>
  );
};

export default PageHOC(
  JoinBattle,
  <>
    Join <br /> a Battle
  </>,
  <>Join an existing battle and start playing</>
);
