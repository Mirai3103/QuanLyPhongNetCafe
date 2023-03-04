import { BrowserWindow } from "electron";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export interface Global {
    win: BrowserWindow | null;
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
}
declare var global: Global & typeof globalThis;
