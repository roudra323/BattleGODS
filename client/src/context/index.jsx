import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import Web3Modal from "web3modal";
import { useNavigate } from "react-router-dom";
import ABI from "../contract";
import { createEventListeners } from "./createEventListeners";
import { GetParams } from "../utils/onboard";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });

  console.log("This is state: ", state);

  const [account, setAccount] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [showAlert, setShowAlert] = useState({
    status: false,
    type: "info",
    message: "",
  });
  const [battleName, setBattleName] = useState("");
  const [gameData, setGameData] = useState({
    players: [],
    pendingBattles: [],
    activeBattle: null,
  });
  const [updateGameData, setUpdateGameData] = useState(0);
  const [BattleGround, setBattleGround] = useState("bg-astral");
  const [step, setStep] = useState(1);
  const [errorMessage, seterrorMessage] = useState("");
  // const [account, setWalletAddress] = useState("");
  const player1Ref = useRef();
  const player2Ref = useRef();

  const contractInstance = async () => {
    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
    const contractABI = ABI;

    try {
      const { ethereum } = window;

      if (ethereum) {
        await ethereum.request({ method: "eth_requestAccounts" });

        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        const accounts = await provider.listAccounts();
        setAccount(accounts[0]);

        setState({ provider, signer, contract });
        // setContract(contract);
        if (contract) setIsConnected(true);
      } else {
        alert("Please install metamask");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchGameData = async () => {
    const fetchBattles = await state.contract.getAllBattles();
    console.log(fetchBattles);

    const pendingBattles = fetchBattles.filter(
      (battle) => battle.battleStatus === 0
    );
    let activeBattle = null;

    fetchBattles.forEach((battle) => {
      if (
        battle.players.find(
          (player) => player.toLowerCase() === account.toLowerCase()
        )
      ) {
        if (battle.winner.startsWith("0x00")) {
          activeBattle = battle;
        }
      }
    });
    setGameData({ pendingBattles: pendingBattles.slice(1), activeBattle });
  };

  //* Set the wallet address to the state
  const updateCurrentWalletAddress = async () => {
    const accounts = await window?.ethereum?.request({
      method: "eth_requestAccounts",
    });

    if (accounts) setAccount(accounts[0]);
  };

  useEffect(() => {
    updateCurrentWalletAddress();

    window?.ethereum?.on("accountsChanged", updateCurrentWalletAddress);
  }, []);

  //* Handle Error messages
  useEffect(() => {
    if (errorMessage) {
      const parsedErrorMessage = errorMessage?.reason
        ?.slice("execution reverted: ".length)
        .slice(0, -1);
      if (parsedErrorMessage) {
        setShowAlert({
          status: true,
          type: "failure",
          message: parsedErrorMessage,
        });
      }
    }
  }, [errorMessage]);

  //setting params
  useEffect(() => {
    const resetParams = async () => {
      const currentStep = await GetParams();

      setStep(currentStep.step);
    };
    resetParams();

    window?.ethereum?.on("chainChanged", () => resetParams());
    window?.ethereum?.on("accountsChanged", () => resetParams());
  }, []);

  //* Set battleground to local storage
  useEffect(() => {
    const isBattleground = localStorage.getItem("battleGround");

    if (isBattleground) {
      setBattleGround(isBattleground);
    } else {
      localStorage.setItem("battleGround", BattleGround);
    }
  }, []);

  //contract instance
  useEffect(() => {
    contractInstance();
    window?.ethereum?.on("accountsChanged", contractInstance);
  }, []);

  //handle alert
  useEffect(() => {
    if (showAlert?.status) {
      const timer = setTimeout(() => {
        setShowAlert({
          status: false,
          type: "info",
          message: "",
        });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  //useState for event listeners
  useEffect(() => {
    if (step === -1 && state.contract) {
      const contract = state.contract;
      const provider = state.provider;
      createEventListeners({
        navigate,
        contract,
        provider,
        account,
        setShowAlert,
        setUpdateGameData,
        player1Ref,
        player2Ref,
        updateCurrentWalletAddress,
        gameData,
      });
    }
  }, [step]);

  // useState for fetching game data
  useEffect(() => {
    if (state.contract) {
      fetchGameData();
    }
  }, [state.contract, updateGameData]);

  return (
    <GlobalContext.Provider
      value={{
        contract: state.contract,
        account,
        isConnected,
        showAlert,
        setShowAlert,
        battleName,
        setBattleName,
        gameData,
        BattleGround,
        setBattleGround,
        errorMessage,
        seterrorMessage,
        player1Ref,
        player2Ref,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
