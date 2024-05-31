import React, {createContext} from "react";
import {chain} from "./constants.ts";

interface IContext {
  activeChain: string,
  walletAddress: string,
  setActiveChain: React.Dispatch<React.SetStateAction<IContext['activeChain']>>,
  setWalletAddress: React.Dispatch<React.SetStateAction<IContext['walletAddress']>>,
}


export const Context = createContext<IContext | null>(null);
export const ContextProvider = ({children}: React.PropsWithChildren<object>) => {
  const [activeChain, setActiveChain] = React.useState<IContext['activeChain']>(chain[0]);
  const [walletAddress, setWalletAddress] = React.useState<IContext['walletAddress']>("");

  return (
    <Context.Provider value={{activeChain, setActiveChain, walletAddress, setWalletAddress}}>
      {children}
    </Context.Provider>
  );
}