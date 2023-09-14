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
  const { address, isConnected, isDisconnected } = useAccount();

  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });

  const contractInstance = async () => {
    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
    const contractABI = ABI;
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        setState({ provider, signer, contract });
      } else {
        alert("Please install metamask");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    contractInstance();
  }, [address, isConnected, isDisconnected]);

  return (
    <GlobalContext.Provider
      value={{
        state: state,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
