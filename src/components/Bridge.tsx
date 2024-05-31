import {Button, Flex, Input, NumberInput, Stack, Text} from "@mantine/core";
import {createPublicClient, createWalletClient, http, isAddress, custom} from "viem";
import {polygon, bsc} from "viem/chains";
import {bridgeContractAbi} from "../abi/bridgeContractABI.ts";
import {useContext, useEffect, useState} from "react";
import {IconArrowLeftTail, IconArrowRightTail} from "@tabler/icons-react";
import {notifications} from "@mantine/notifications";
// @ts-ignore
import {ErrorType} from "viem/_types/errors/utils";
import {Context} from "../state/ContextProvider.tsx";

const makeNotification = (msg: string) => {
  notifications.show({
    title: "Error",
    message: msg,
    autoClose: 4000,
    style: {position: "fixed", bottom: "50px", right: "10px", maxWidth: "600px"},
    color: "red",
  });
};
export const Bridge = () => {

  const decimals = 18;

  let lastLogIndex: number | null = null;

  const {activeChain, setActiveChain} = useContext(Context);

  const polygonPublicClient = createPublicClient({
    chain: polygon,
    transport: http("https://polygon-pokt.nodies.app"), // has eth_newFilter
  });

  const bscPublicClient = createPublicClient({
    chain: bsc,
    transport: http("https://bsc-dataseed1.ninicoin.io"), // has eth_newFilter
  });

  const sendCoins = async (address, chain: "bsc" | "polygon", amount: number) => {
    const clientWallet = createWalletClient({
      chain: chain == "bsc" ? bsc : polygon,
      transport: custom(window.ethereum!)
    })
    try {
      const [account] = await clientWallet.getAddresses()
      const res = await clientWallet.writeContract({
        address: chain === "bsc" ? process.env.BSC_TOKEN_ADDRESS : process.env.POLYGON_TOKEN_ADDRESS,
        abi: bridgeContractAbi,
        functionName: 'burnB',
        account,
        args: [address, amount * 10 ** decimals],
      })
      console.log("res", res)

      const newChain: any = activeChain === 'bsc' ? polygon : bsc;
      await clientWallet.switchChain({id: newChain.id});
      setActiveChain(activeChain === 'bsc' ? "polygon" : "bsc")
      const [account2] = await clientWallet.getAddresses()

      const clientWallet2 = createWalletClient({
        chain: chain == "bsc" ? polygon : bsc,
        transport: custom(window.ethereum!)
      })

      const res2 = await clientWallet2.writeContract({
        address: chain === "bsc" ? process.env.POLYGON_TOKEN_ADDRESS : process.env.BSC_TOKEN_ADDRESS,
        abi: bridgeContractAbi,
        functionName: 'mintB',
        account: account2,
        args: [address, amount * 10 ** decimals],
      })
      console.log("res2", res2)

    } catch (e: ErrorType) {
      console.error(e)
      makeNotification(e.message.toString())
    }
  }


  useEffect(() => {

    const unwatchPolygonPublicClient = polygonPublicClient.watchContractEvent({
      address: process.env.POLYGON_TOKEN_ADDRESS as `0x${string}`,
      abi: bridgeContractAbi,
      eventName: 'BurnBridge',
      pollingInterval: 10000,
      onLogs: logs => {
        const log0 = logs[0];
        if (
          lastLogIndex !== log0?.logIndex
        ) {
          lastLogIndex = log0?.logIndex;
        }
      },
      fromBlock: 57521163n,
    })

    const unwatchBSCPublicClient = bscPublicClient.watchContractEvent({
      address: process.env.BSC_TOKEN_ADDRESS as `0x${string}`,
      abi: bridgeContractAbi,
      eventName: 'BurnBridge',
      // args: { from: '0xc961145a54C96E3aE9bAA048c4F4D6b04C13916b' },
      pollingInterval: 10000,
      onLogs: logs => {
        const log0 = logs[0];
        if (
          lastLogIndex !== log0?.logIndex
        ) {
          lastLogIndex = log0?.logIndex;
        }
      },
      fromBlock: 39139288n,
    })


    return () => {
      unwatchPolygonPublicClient();
      unwatchBSCPublicClient();
    }
  }, [])

  const getBalance = async (address, chain: "bsc" | "polygon") => {
    const client = chain === "bsc" ? bscPublicClient : polygonPublicClient;
    const contractAddress = chain === "bsc" ? process.env.BSC_TOKEN_ADDRESS : process.env.POLYGON_TOKEN_ADDRESS;

    try {
      const res = await client.readContract({
        address: contractAddress as `0x${string}`,
        abi: bridgeContractAbi,
        functionName: 'balanceOf',
        args: [address],
      })
      console.log("res", res)
      if (chain === "bsc") {
        setBalanceBSC(res as number)
      } else {
        setBalancePolygon(res as number)
      }
    } catch (e: ErrorType) {
      console.error(e)
      makeNotification(e.message.toString())
    }
  }


  const [addressBSC, setAddressBSC] = useState<string>('');
  const [addressPolygon, setAddressPolygon] = useState<string>('');

  const [balanceBSC, setBalanceBSC] = useState<number>(0);
  const [balancePolygon, setBalancePolygon] = useState<number>(0);

  const [amountBSC, setAmountBSC] = useState<number>(0);
  const [amountPolygon, setAmountPolygon] = useState<number>(0);


  return (
    <Flex justify="space-around">

      <Stack>
        <Text size="xl">BSC</Text>
        <Input placeholder="BSC address" w={400} error={!isAddress(addressBSC)} value={addressBSC}
               onChange={e => setAddressBSC(e.target.value)}/>
        <Flex justify="space-between">
          <Text>balance: {Number(balanceBSC) / 10 ** decimals}</Text>
          <Button onClick={() => getBalance(addressBSC, "bsc")} disabled={!isAddress(addressBSC)}>Get balance</Button>
        </Flex>

        <br/>
        <Flex justify="space-between">
          <Button rightSection={<IconArrowRightTail/>} disabled={amountBSC <= 0 || !isAddress(addressBSC)}
                  onClick={() => sendCoins(addressBSC, "bsc", amountBSC)}>Send to Polygon</Button>
          <NumberInput
            placeholder="Amount"
            min={0}
            value={amountBSC}
            onChange={e => setAmountBSC(Number(e))}
          />
        </Flex>
      </Stack>
      <Stack>
        <Text size="xl">Polygon</Text>
        <Input placeholder="Polygon address" w={400} error={!isAddress(addressPolygon)} value={addressPolygon}
               onChange={e => setAddressPolygon(e.target.value)}/>
        <Flex justify="space-between">
          <Text>balance: {Number(balancePolygon) / 10 ** decimals}</Text>
          <Button onClick={() => getBalance(addressPolygon, "polygon")} disabled={!isAddress(addressPolygon)}>Get
            balance</Button>
        </Flex>
        <br/>
        <Flex justify="space-between">
          <NumberInput
            placeholder="Amount"
            min={0}
            value={amountPolygon}
            onChange={e => setAmountPolygon(Number(e))}
          />
          <Button leftSection={<IconArrowLeftTail/>} disabled={amountPolygon <= 0 || !isAddress(addressPolygon)}
                  onClick={() => sendCoins(addressPolygon, "polygon", amountPolygon)}>Send to BSC</Button>
        </Flex>
      </Stack>
    </Flex>
  )
}