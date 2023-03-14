import { Box, Button, Flex, Icon, Spinner, Text } from "@chakra-ui/react";
import { IMachine } from "@server/models/Machine";
import { ipcRenderer } from "electron";
import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import CreateModal from "./CreateModal";
import MachineBox from "./MachineBox";
import UpdateModal from "./UpdateModal";
// HiComputerDesktop ,RiComputerFill
interface IProps {}

export default function MachineManager({}: IProps) {
    const [machineList, setMachineList] = React.useState<IMachine[] | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
    React.useEffect(() => {
        ipcRenderer.invoke("machine:getAll").then((m) => {
            setMachineList(m);
        });
    }, []);

    if (machineList === null) {
        return (
            <Flex
                w={"full"}
                rounded="lg"
                shadow={"md"}
                bg="white"
                alignItems={"center"}
                justifyContent="center"
                justifyItems={"center"}
                minH="40"
            >
                <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
            </Flex>
        );
    }
    const onListMachineChange = () => {
        ipcRenderer.invoke("machine:getAll").then((m) => {
            setMachineList(m);
        });
    };
    return (
        <Box w={"full"} display="flex" flexDirection={"column"} rowGap="20px">
            <CreateModal isOpen={isCreateModalOpen} setOpened={setIsCreateModalOpen} onSuscess={onListMachineChange} />

            <Flex justifyContent="space-between">
                <Text fontSize="2xl" fontWeight="bold">
                    Quản lý máy
                </Text>
                <div>
                    <Button
                        leftIcon={
                            <Icon
                                fontSize="24"
                                _groupHover={{
                                    color: "white",
                                }}
                                as={AiOutlinePlus}
                            />
                        }
                        variant="solid"
                        onClick={setIsCreateModalOpen.bind(null, true)}
                    >
                        Tạo máy mới
                    </Button>
                </div>
            </Flex>
            <Flex
                w={"full"}
                rounded="lg"
                shadow={"md"}
                bg="white"
                alignItems={"center"}
                justifyContent="center"
                justifyItems={"center"}
                minH="40"
                flexWrap={"wrap"}
                rowGap={4}
                columnGap={4}
                py={8}
            >
                {machineList.map((m) => (
                    <MachineBox machine={m} key={m.id} width="40" onListMachineChange={onListMachineChange} />
                ))}
            </Flex>
        </Box>
    );
}
