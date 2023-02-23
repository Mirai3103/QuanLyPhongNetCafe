import React from "react";
import { setAll, selectAccount, increaseUsedTime } from "@/redux/userSplice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Header from "./Header";
import { Box, Flex, Image } from "@chakra-ui/react";
import SessionInfo from "./SessionInfo";
import Features from "./Features";
import Banner from "@/assets/supportbanner.png";
import { ipcRenderer } from "electron";
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
        // dispatch(
        //     setAll({
        //         account: {
        //             id: -84,
        //             username: "rshale2b",
        //             password: "kYLntGe",
        //             role: "user",
        //             createdAt: new Date("2022-10-16T22:24:37.000Z"),
        //             balance: 3000,
        //         },
        //         totalTime: (3000 / 10000) * 60 * 60,
        //         usedTime: 0,
        //         remainingTime: (3000 / 10000) * 60 * 60,
        //         usedCost: 0,
        //         serviceCost: 0,
        //         balance: 3000,
        //         machinePrice: 10000,
        //     })
        // );
    }, []);
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
