import { IMachine, Status } from "../../../../electron/models/Machine";
import React from "react";
//HiComputerDesktop ;RiComputerFill
import { HiComputerDesktop } from "react-icons/hi2";
import { Flex, Text, FlexProps, Button, MenuButton, MenuList, MenuItem, Menu, Tooltip } from "@chakra-ui/react";
// RiComputerFill,AiFillLock, FaMoneyBill ,AiFillEdit, MdDeleteForever
import { AiFillLock } from "react-icons/ai";
import { FaMoneyBill } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import { RiComputerFill } from "react-icons/ri";
import YesNoDialog from "@/components/YesNoDialog";
import { ipcRenderer } from "electron";
import UpdateModal from "./UpdateModal";
interface IProps extends FlexProps {
    machine: IMachine;
    onListMachineChange: () => void;
}
const MenuButtonAsFlex = MenuButton as React.FC<FlexProps>;

export default function MachineBox({ machine, onListMachineChange, ...rest }: IProps) {
    if (machine.id % 2 == 0) {
        machine.status = Status.Locked;
    }
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const onConfirmDelete = () => {
        ipcRenderer
            .invoke("machine:delete", {
                id: machine.id,
            })
            .then((res) => {
                if (res) {
                    setIsDeleteDialogOpen(false);
                    onListMachineChange();
                }
            });
    };
    const [isUpdateModalOpen, setIsUpdateModalOpen] = React.useState(false);

    return (
        <Menu>
            <YesNoDialog
                title="Cảnh báo"
                content={`Bạn có chắc chắn muốn xoá ${machine.name} không?`}
                isOpen={isDeleteDialogOpen}
                onConfirm={onConfirmDelete}
                setOpen={setIsDeleteDialogOpen}
            />
            <UpdateModal
                machine={machine}
                isOpen={isUpdateModalOpen}
                setOpened={setIsUpdateModalOpen}
                onSuscess={onListMachineChange}
            />

            <MenuButtonAsFlex
                as={Flex}
                direction={"column"}
                alignItems="center"
                justifyItems={"center"}
                rowGap="1"
                rounded={"md"}
                {...rest}
                _hover={{
                    bg: "gray.100",
                }}
                p={2}
                cursor={"pointer"}
            >
                <Flex
                    w="full"
                    justifyItems={"center"}
                    alignItems="center"
                    textAlign={"center"}
                    justifyContent="center"
                    color={machine.status == Status.Locked ? "green.500" : "red.500"}
                >
                    {machine.status == Status.Locked ? (
                        <RiComputerFill className="text-7xl" />
                    ) : (
                        <HiComputerDesktop className="text-7xl" />
                    )}
                </Flex>

                <Text textAlign={"center"} fontWeight={"semibold"}>
                    {machine.name}
                </Text>
            </MenuButtonAsFlex>

            <MenuList>
                <MenuItem icon={<RiComputerFill />}>Mở máy</MenuItem>
                <MenuItem icon={<AiFillLock />}>Khoá máy</MenuItem>
                <MenuItem icon={<FaMoneyBill />}>Nạp tiền</MenuItem>
                <MenuItem icon={<AiFillEdit />} onClick={() => setIsUpdateModalOpen(true)}>
                    Sửa thông tin
                </MenuItem>
                <MenuItem color={"red.500"} icon={<MdDeleteForever />} onClick={() => setIsDeleteDialogOpen(true)}>
                    Xoá
                </MenuItem>
            </MenuList>
        </Menu>
    );
}
