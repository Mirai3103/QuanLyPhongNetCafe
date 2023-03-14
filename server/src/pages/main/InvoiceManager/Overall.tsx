import { Box, Button, Flex, FlexProps, Icon, Text } from "@chakra-ui/react";
import { ipcRenderer } from "electron";
import React from "react";
//RiBillFill
import { RiBillFill } from "react-icons/ri";
//AiFillCheckCircle
import { AiFillCheckCircle } from "react-icons/ai";
//IoTimeSharp
import { IoTimeSharp } from "react-icons/io5";
//AiFillCloseCircle
import { AiFillCloseCircle } from "react-icons/ai";
import { toMoneyString } from "@/utils/helper";
export default function Overall() {
    const [overall, setOverall] = React.useState<any>(null);
    React.useEffect(() => {
        ipcRenderer.invoke("BILL:getOverrall").then((res) => {
            setOverall(res);
        });
    }, []);
    if (!overall) return null;

    return (
        <Flex bg={"white"} shadow="lg" rounded={"xl"} p="2" justifyContent={"space-evenly"}>
            <OverallStatus
                totalBill={overall?.total.length}
                totalMoney={`Lời: ` + toMoneyString(overall?.total.total)}
                title={"Tổng"}
                icon={RiBillFill}
                scheme={"blue"}
            />
            <OverallStatus
                totalBill={overall?.exportBill.length}
                totalMoney={toMoneyString(overall?.exportBill.total)}
                title={"Hoá đơn bán"}
                icon={AiFillCheckCircle}
                scheme={"green"}
            />
            <OverallStatus
                totalBill={overall?.importBill.length}
                totalMoney={toMoneyString(overall?.importBill.total)}
                title={"Hoá đơn nhập"}
                icon={RiBillFill}
                scheme={"gray"}
            />
            <OverallStatus
                totalBill={20}
                totalMoney={1205.75}
                title={"Đợi giải quyết"}
                icon={IoTimeSharp}
                scheme={"yellow"}
                border={"none"}
            />
        </Flex>
    );
}

interface Iprops extends FlexProps {
    totalBill: number;
    totalMoney: number | string;
    title: string;
    icon: React.FC;
    scheme: string;
}

function OverallStatus({ scheme = "blue", totalBill, totalMoney, title, icon, ...props }: Iprops) {
    return (
        <>
            <Flex
                px={"5px"}
                bg={"white"}
                rounded={"sm"}
                justifyContent={"center"}
                alignItems={"center"}
                justifyItems={"center"}
            >
                <Box
                    bg={`${scheme}.200`}
                    w={"55px"}
                    h={"55px"}
                    rounded={"full"}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    p={"5px"}
                >
                    <Box
                        rounded={"full"}
                        w={"full"}
                        h={"full"}
                        bg="white"
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                    >
                        <Icon
                            as={icon}
                            color={`${scheme}.500`}
                            m="5px"
                            fontSize={"2xl"}
                            bg={"white"}
                            rounded={"full"}
                        />
                    </Box>
                </Box>
                <Flex flexDir={"column"} rowGap="3px" p={3}>
                    <Text fontWeight={"semibold"}>{title}</Text>
                    <Text>
                        <Text as={"span"} fontWeight={"semibold"}>
                            {totalBill}
                        </Text>
                        <Text as={"span"}>{` `}hóa đơn</Text>
                    </Text>
                    <Text color={`${scheme}.500`} fontSize="sm">
                        {totalMoney}
                    </Text>
                </Flex>
            </Flex>

            <Flex borderRight={"1px"} borderStyle="dashed" borderColor={"gray.400"} {...props}></Flex>
        </>
    );
}
