import nodeLogo from "./assets/node.svg";
import { useState } from "react";
// import store from "./redux/store";
import { sendMainProcessMessage } from "./samples/node-api";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import routes from "./routes";
console.log(`Mã máy ${process.env.MACHINE_ID}!`);
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

function App() {
    return (
        // <Provider store={store}>
        <ChakraProvider>
            <RouterProvider router={routes} />
        </ChakraProvider>
        // </Provider>
    );
}

export default App;
