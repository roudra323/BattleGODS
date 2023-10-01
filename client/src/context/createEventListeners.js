import { ethers } from "ethers";
import { defenseSound } from "../assets";
import ABI from "../contract";
import { playAudio, sparcle } from "../utils/animation";

const AddNewEvent = (eventFilter, provider, cb) => {
  provider.removeListener(eventFilter);

  provider.on(eventFilter, (logs) => {
    const parseLog = new ethers.utils.Interface(ABI).parseLog(logs);
    cb(parseLog);
  });
};

const getCoords = (cardRef) => {
  const { left, top, width, height } = cardRef.current.getBoundingClientRect();

  return {
    pageX: left + width / 2,
    pageY: top + height / 2.25,
  };
};

export const createEventListeners = ({
  navigate,
  contract,
  provider,
  account,
  setShowAlert,
  setUpdateGameData,
  player1Ref,
  player2Ref,
  gameData,
}) => {
  const NewPlayerEventFilter = contract.filters.NewPlayer();

  AddNewEvent(NewPlayerEventFilter, provider, ({ args }) => {
    // console.log("New Player Created!!", args);

    if (account === args.owner) {
      setShowAlert({
        status: true,
        type: "success",
        message: "New Player Created!!",
      });
    }
  });

  const NewGameTokenEventFilter = contract.filters.NewGameToken();

  AddNewEvent(NewGameTokenEventFilter, provider, ({ args }) => {
    console.log("New game token created!!", args);

    if (account.toLowerCase() === args.owner.toLowerCase()) {
      setShowAlert({
        status: true,
        type: "success",
        message: "New Game Token Created!!",
      });
      navigate("/create-battle");
    }
  });

  const NewBattleEventFilter = contract.filters.NewBattle();

  AddNewEvent(NewBattleEventFilter, provider, ({ args }) => {
    console.log("New Battle Created!!", args, account);

    if (
      account.toLowerCase() === args.player1.toLowerCase() ||
      account.toLowerCase() === args.player2.toLowerCase()
    ) {
      navigate(`/battle/${args.battleName}`);
    }
    setUpdateGameData((prevUpdateGameData) => prevUpdateGameData + 1);
  });

  const BattleMoveEventFilter = contract.filters.BattleMove();
  AddNewEvent(BattleMoveEventFilter, provider, ({ args }) => {
    console.log("Battle move initiated!!", args);
  });

  const RoundEndedEventFilter = contract.filters.RoundEnded();
  AddNewEvent(RoundEndedEventFilter, provider, ({ args }) => {
    console.log("Round Ended!!", args, account);

    for (let i = 0; args.damagedPlayers.length > i; i++) {
      if (
        args.damagedPlayers[i] !== "0x0000000000000000000000000000000000000000"
      ) {
        if (args.damagedPlayers[i] === account) {
          sparcle(getCoords(player1Ref));
        } else if (args.damagedPlayers[i] !== account) {
          sparcle(getCoords(player2Ref));
        }
      } else {
        playAudio(defenseSound);
      }
    }
    setUpdateGameData((prevUpdateGameData) => prevUpdateGameData + 1);
  });

  const BattleEndedEventFilter = contract.filters.BattleEnded();
  AddNewEvent(BattleEndedEventFilter, provider, ({ args }) => {
    console.log("Battle Ended!!", args, account);

    if (account.toLowerCase() === args.winner.toLowerCase()) {
      setShowAlert({
        status: true,
        type: "success",
        message: "You Won!!",
      });
    } else if (account.toLowerCase() === args.loser.toLowerCase()) {
      setShowAlert({
        status: true,
        type: "failure",
        message: "You Lost!!",
      });
    }

    // const timer = setTimeout(() => {
    //   if (!gameData.activeBattle) navigate("/");
    // }, 1000);

    // return () => clearTimeout(timer);
    navigate("/create-battle");
    // console.log("Battle Ended!!", args, account);
  });
};
