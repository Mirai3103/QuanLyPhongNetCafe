import React from "react";
import { setAll, selectAccount, increaseUsedTime, selectUsedTime, selectRemainingTime } from "@/redux/userSplice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Header from "./Header";
import { Box, Flex, Image } from "@chakra-ui/react";
import SessionInfo from "./SessionInfo";
import Features from "./Features";
import Banner from "@/assets/supportbanner.png";
import { ipcRenderer } from "electron";
import { ISession } from "../../../../server/electron/models/Session";
interface IProps {}

export default function MainPage({}: IProps) {
    const dispatch = useAppDispatch();
    const account = useAppSelector(selectAccount);
    React.useEffect(() => {
        //one minute
        const interval = setInterval(() => {
            dispatch(increaseUsedTime());
        }, 60000);
        return () => clearInterval(interval);
    }, []);
    React.useEffect(() => {
        ipcRenderer.invoke("session-initial").then((data) => {
            dispatch(setAll(data));
        });
    }, []);
    React.useEffect(() => {
        const handleSyncSuccess = (e: any, data: ISession) => {
            dispatch(
                setAll({
                    account: data.account
                        ? {
                              ...account,
                          }
                        : undefined,
                    remainingTime: data.totalTime ? data.totalTime - data.usedTime : undefined,
                    usedTime: data.usedTime,
                    usedCost: data.usedCost,
                    totalTime: data.totalTime,
                    serviceCost: data.serviceCost,
                    machinePrice: undefined,
                } as any)
            );
        };
        ipcRenderer.on("sync-time-success", handleSyncSuccess);
        return () => {
            ipcRenderer.removeListener("sync-time-success", handleSyncSuccess);
        };
    }, []);
    const remainingTime = useAppSelector(selectRemainingTime);
    React.useEffect(() => {
        if (remainingTime <= 0) {
            //toDo: logout
            ipcRenderer
                .invoke("time-up", {
                    machineId: process.env.MACHINE_ID,
                })
                .then(() => {
                    ipcRenderer.invoke("open-login-window");
                });
        }
    }, [remainingTime]);
    return (
        <Flex direction="column" w="full" h="full" bg="gray.100">
            <Header username={account?.username} />
            <SessionInfo />
            <Features />
            <Box w={"full"} px="4" mt={"4"}>
                <Image rounded={"lg"} shadow="lg" src={Banner} w="full" objectFit="fill" />
            </Box>
        </Flex>
    );
}
