import {AppShell, Flex, Text} from "@mantine/core";
import {Bridge} from "./Bridge.tsx";
import {Notifications} from "@mantine/notifications";

export const RootComponent = () => {
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
                                                                          from: "white",
                                                                          to: "cyan",
                                                                          deg: 90,
                                                                        }}
                                                                        style={{width: 220}}>WEB3 bridge
        example</Text>
        <Flex justify="center" align="center">
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