import {AppShell, Flex, SegmentedControl, Text} from "@mantine/core";
import {Bridge} from "./Bridge.tsx";
import {Notifications} from "@mantine/notifications";
import {Wallet} from "./Wallet.tsx";
import {useContext} from "react";
import {chain} from "../state/constants.ts";
import {Context} from "../state/ContextProvider.tsx";

export const RootComponent = () => {

  const {setActiveChain, walletAddress, activeChain} = useContext(Context);

  return (

    <AppShell
      withBorder={false}
      padding="md"
      header={{height: 30}}
      footer={{height: 30}}
    >
      <AppShell.Header style={{marginLeft: 25}}><Flex justify="space-between"
                                                      align="flex-start"
                                                      direction="row"
                                                      wrap="wrap"><Text size="xl" variant="gradient"
                                                                        fw={900}
                                                                        gradient={{
                                                                          from: 'tomato',
                                                                          to: 'green',
                                                                          deg: 90
                                                                        }}
                                                                        style={{width: 220}}>WEB3 React
        Project</Text>
        <Flex justify="center" align="center">
          {walletAddress && <div style={{marginRight: 20}}>{walletAddress}</div>}
          <SegmentedControl data={chain} onChange={setActiveChain} value={activeChain}/>
          <Wallet/>
        </Flex>
      </Flex></AppShell.Header>
      <AppShell.Main>
        <Bridge/>
      </AppShell.Main>
      <AppShell.Footer style={{display: "flex", alignItems: "center", justifyContent: "end"}}>
        <Text
          variant="gradient"
          fw={900}
          gradient={{from: "cyan", to: "white", deg: 90}}
          style={{width: 80, marginRight: 15}}
        >
          Vuk, 2024
        </Text></AppShell.Footer>
      <Notifications position="top-center" zIndex={1000}/>
    </AppShell>


  )
}