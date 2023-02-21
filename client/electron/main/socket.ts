import io from "socket.io-client";
import dotenv from "dotenv";

dotenv.config({
    path: "E:/DoAnKi2Nam2/client/.env",
});
const socket = io("http://localhost:4444", {
    query: {
        machine_id: process.env.MACHINE_ID,
    },
});
socket.on("connect", () => {
    console.log("connected");
});

socket.on("disconnect", () => {
    console.log("disconnected");
});
