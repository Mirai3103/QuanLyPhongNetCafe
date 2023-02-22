import "@fontsource/nunito/400.css";
import "@fontsource/nunito/500.css";
import "@fontsource/nunito/600.css";
import store from "./redux/store";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import routes from "./routes";
console.log(`Mã máy ${process.env.MACHINE_ID}!`);
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
const theme = extendTheme({
    fonts: {
        heading: `'nunito', sans-serif`,
        body: `'nunito', sans-serif`,
    },
});
function App() {
    return (
        <Provider store={store}>
            <ChakraProvider theme={theme}>
                <RouterProvider router={routes} />
            </ChakraProvider>
        </Provider>
    );
}

export default App;
