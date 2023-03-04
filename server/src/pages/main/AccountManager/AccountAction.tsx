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
export default function AccountAction({ id }: IProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const moneyRef = React.useRef<HTMLInputElement>(null);
    const toast = useToast();
    const [isOpenDelete, setIsOpenDelete] = React.useState(false);
    const onDelete = () => {
        ipcRenderer
            .invoke("account:deleteAccount", {
                id,
            })
            .then((res) => {
                if (res) {
                    const event = new CustomEvent("refresh-account");
                    window.dispatchEvent(event);
                }
            });
    };

    const onSubmit = () => {
        const money = Number(moneyRef.current?.value);
        if (Number.isNaN(money) || money <= 0) {
            toast({
                title: "Lỗi",
                description: "Số tiền không hợp lệ",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        ipcRenderer
            .invoke(AccountEvents.RECHARGE, {
                id,
                money,
            })
            .then((res) => {
                if (res) {
                    toast({
                        title: "Thành công",
                        description: "Nạp tiền thành công",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    });
                }
                onClose();
                //
                const event = new CustomEvent("refresh-account");
                window.dispatchEvent(event);
            });
    };

    return (
        <Flex columnGap="5" w={"full"} justifyContent="flex-end">
            <YesNoDialog
                title="Xoá tài khoản"
                content={`Bạn có chắc muốn xoá tài khoản này không?`}
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
                        Xoá tài khoản
                    </StyledMenuItem>
                    <StyledMenuItem>
                        <BiDetail />
                        Chi tiết tài khoản
                    </StyledMenuItem>
                    <StyledMenuItem color={"green.500"} onClick={onOpen}>
                        <MdOutlineMonetizationOn />
                        Nạp tiền
                    </StyledMenuItem>
                    <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent mt={"60"}>
                            <ModalHeader>Nạp tài khoản</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody pb={6}>
                                <FormControl>
                                    <FormLabel>Số tiền</FormLabel>
                                    <Input placeholder="Số tiền" ref={moneyRef} />
                                </FormControl>
                            </ModalBody>

                            <ModalFooter>
                                <Button colorScheme="blue" mr={3} onClick={onSubmit}>
                                    Nạp tiền
                                </Button>
                                <Button onClick={onClose}>Cancel</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </MenuList>
            </Menu>
        </Flex>
    );
}
