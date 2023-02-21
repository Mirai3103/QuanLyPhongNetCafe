import "./index.css";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import routes from "./routes";
import store from "./redux/store";
console.log("[App.tsx]", `Hello world from Electron ${process.versions.electron}!`);
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
    components: {
        Button: {
            defaultProps: {
                colorScheme: "blue",
            },
        },
    },
});

function App() {
    return (
        <ChakraProvider theme={theme}>
            <Provider store={store}>
                <RouterProvider router={routes} />
            </Provider>
        </ChakraProvider>
    );
}

export default App;
