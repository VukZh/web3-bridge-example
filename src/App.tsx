import './App.css';
import "@mantine/core/styles.css";
import {MantineProvider} from "@mantine/core";
import {RootComponent} from "./components/RootComponent.tsx";

function App() {

  return (
    <MantineProvider defaultColorScheme="dark">
        <RootComponent/>
    </MantineProvider>

  )
}

export default App
