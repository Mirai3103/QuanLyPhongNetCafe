import nodeLogo from "./assets/node.svg";
import { useState } from "react";
import { sendMainProcessMessage } from "./samples/node-api";
import { RouterProvider } from "react-router-dom";
import routes from "./routes";
console.log("[App.tsx]", `Hello world from Electron ${process.versions.electron}!`);

function App() {
    return <RouterProvider router={routes} />;
}

export default App;
