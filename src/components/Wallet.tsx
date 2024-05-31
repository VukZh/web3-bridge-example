'use server'

import {Button} from "@mantine/core";
import {IconWallet} from "@tabler/icons-react";
import {createWalletClient, custom} from "viem";
import {bsc, polygon} from "viem/chains";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {FC, use, useContext, useEffect} from "react";
import {Context} from "../state/ContextProvider.tsx";

const walletIcon = <IconWallet size={24}/>;

export const Wallet: FC = () => {

  const {walletAddress, setWalletAddress, activeChain, setActiveChain} = useContext(Context);

  const clientWallet = createWalletClient({
    chain: activeChain === 'bsc' ? bsc : polygon,
    transport: custom(window.ethereum!)
  })

  useEffect(() => {
    const newChain: any = activeChain === 'bsc' ? bsc : polygon
    const switchChain = async () => {
      await clientWallet.switchChain({id: newChain.id})
    }
    switchChain().then(() => {
      activeChain === "bsc" ? setActiveChain("bsc") : setActiveChain("polygon")
    }).catch(() => {
      activeChain === "bsc" ? setActiveChain("polygon") : setActiveChain("bsc")
    })
  }, [activeChain]);

  const execClientW = async () => {
    const [address] = await clientWallet.requestAddresses();
    setWalletAddress(address);
  }
  return <Button m={5} color={walletAddress ? 'green' : 'tomato'} leftSection={walletIcon} w={40} pr={0}
                 onClick={execClientW}></Button>
}

