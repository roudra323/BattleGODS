import { ethers } from "ethers";
import ABI from "../contract";

const AddNewEvent = (eventFilter, provider, cb) => {
  provider.removeListener(eventFilter);

  provider.on(eventFilter, (logs) => {
    const parseLog = new ethers.utils.Interface(ABI).parseLog(logs);
    cb(parseLog);
  });
};

export const createEventListeners = ({
  navigate,
  contract,
  provider,
  account,
  setShowAlert,
}) => {
  const NewPlayerEventFilter = contract.filters.NewPlayer();

  AddNewEvent(NewPlayerEventFilter, provider, ({ args }) => {
    console.log("New Player Created!!", args);

    if (account === args.owner) {
      setShowAlert({
        status: true,
        type: "success",
        message: "New Player Created!!",
      });
    }
  });
};
