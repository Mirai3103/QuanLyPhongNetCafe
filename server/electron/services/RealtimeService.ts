import { Socket } from "socket.io";

class RealtimeService {
    onConnect(socket: Socket) {
        console.log("a user connected");
        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
    }
}

export default new RealtimeService();
