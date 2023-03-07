import MenuItemLink from "@/components/MenuItemLink";
import YesNoDialog from "@/components/YesNoDialog";
import { AccountEvents } from "@/services/type";
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    IconButton,
    Input,
    Menu,
    MenuButton,
    MenuItem,
    MenuItemProps,
    MenuList,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    Text,
    Radio,
    RadioGroup,
    useToast,
    AlertDialog,
} from "@chakra-ui/react";
import { ipcRenderer } from "electron";
import React from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { BiDetail } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineMonetizationOn } from "react-icons/md";
import { Link } from "react-router-dom";
interface IProps {
    id: number;
}
const StyledMenuItem = MenuItemLink;
export default function InvoiceAction({ id }: IProps) {
    const [isOpenDelete, setIsOpenDelete] = React.useState(false);
    const onDelete = () => {
        // ipcRenderer
        //     .invoke("account:deleteAccount", {
        //         id,
        //     })
        //     .then((res) => {
        //         if (res) {
        //             const event = new CustomEvent("refresh-invoice");
        //             window.dispatchEvent(event);
        //         }
        //     });
    };

    return (
        <Flex columnGap="5" w={"full"} justifyContent="flex-end">
            <YesNoDialog
                title="Xoá hoá đơn"
                content={`Bạn có chắc muốn xoá hoá đơn không?`}
                isOpen={isOpenDelete}
                onConfirm={onDelete}
                setOpen={setIsOpenDelete}
            />
            <Menu>
                <MenuButton
                    as={IconButton}
                    variant="ghost"
                    colorScheme="cyan"
                    color="black"
                    aria-label="Delete"
                    icon={<BsThreeDotsVertical className="text-lg" />}
                ></MenuButton>
                <MenuList>
                    <StyledMenuItem as={Link} to={`/main/account-manager/edit/${id}`}>
                        <AiOutlineEdit />
                        Sửa thông tin
                    </StyledMenuItem>
                    <StyledMenuItem color={"red.500"} onClick={() => setIsOpenDelete(true)}>
                        <AiOutlineDelete />
                        Xoá hoá đơn
                    </StyledMenuItem>
                    <StyledMenuItem>
                        <BiDetail />
                        Chi tiết hoá đơn
                    </StyledMenuItem>
                </MenuList>
            </Menu>
        </Flex>
    );
}
