import express from "express";
import { Server, Socket } from "socket.io";
import http from "http";
import realtimeService from "../services/RealtimeService";
import { AppDataSource } from "../models/db/index";
import Machine, { Status } from "../models/Machine";
const app = express();
const server = http.createServer(app);
app.get("/", (req, res) => {
    res.send("Cút đi");
});
server.listen(4444, () => {
    console.log("listening on *:4444");
});

const io = new Server(server);

io.use(async (socket, next) => {
    // get machine_id from socket.handshake.query
    // check if machine_id is valid
    // if valid, call next()
    // else, call next(new Error("invalid machine_id"))
    const handshakeData = socket.request;
    const machineId = (handshakeData as any)._query.machine_id;
    const MachineRespo = AppDataSource.getRepository(Machine);
    const machine = await MachineRespo.findOne({ where: { id: machineId } });
    machine.status = Status.On;
    await MachineRespo.save(machine);
    (socket as any).machineId = machineId;

    if (machine) {
        return next();
    } else {
        return next(new Error("invalid machine_id"));
    }
});

io.on("connection", realtimeService.onConnect);
