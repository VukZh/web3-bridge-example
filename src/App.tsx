import './App.css';
import "@mantine/core/styles.css";
import {MantineProvider} from "@mantine/core";
import {RootComponent} from "./components/RootComponent.tsx";
import {ContextProvider} from "./state/ContextProvider.tsx";

function App() {

  return (
    <MantineProvider defaultColorScheme="dark">
      <ContextProvider>
        <RootComponent/>
      </ContextProvider>
    </MantineProvider>
  )
}

export default App
