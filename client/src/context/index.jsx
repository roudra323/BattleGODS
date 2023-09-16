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

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });
  const [account, setAccount] = useState("None");
  const [isConnected, setIsConnected] = useState(false);
  const [showAlert, setShowAlert] = useState({
    status: false,
    type: "info",
    message: "",
  });

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

  useEffect(() => {
    contractInstance();
    window?.ethereum?.on("accountsChanged", contractInstance);
  }, []);

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

  return (
    <GlobalContext.Provider
      value={{
        contract: state.contract,
        account,
        isConnected,
        showAlert,
        setShowAlert,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
