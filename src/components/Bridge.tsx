import {Button, Flex, Input, NumberInput, Stack, Text} from "@mantine/core";
import {createPublicClient, http, isAddress} from "viem";
import {polygon, bsc} from "viem/chains";
import {bridgeContractAbi} from "../abi/bridgeContractABI.ts";
import {useEffect, useState} from "react";
import {IconArrowLeftTail, IconArrowRightTail} from "@tabler/icons-react";
import {notifications} from "@mantine/notifications";
// @ts-ignore
import {ErrorType} from "viem/_types/errors/utils";

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

  const polygonPublicClient = createPublicClient({
    chain: polygon,
    transport: http("https://polygon-pokt.nodies.app"), // has eth_newFilter
  });

  const bscPublicClient = createPublicClient({
    chain: bsc,
    transport: http("https://bsc-dataseed1.ninicoin.io"), // has eth_newFilter
  });

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
        console.log("logs  ", log0?.args?.addr, log0?.args?.amount)
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
    onLogs: (logs) => console.log("logs - ", logs),
    fromBlock: 39139288n,
  })


  useEffect(() => {
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
          <Button rightSection={<IconArrowRightTail/>}>Send to Polygon</Button>
          <NumberInput
            placeholder="Amount"
            min={0}
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
          />
          <Button leftSection={<IconArrowLeftTail/>}>Send to BSC</Button>
        </Flex>
      </Stack>
    </Flex>
  )
}