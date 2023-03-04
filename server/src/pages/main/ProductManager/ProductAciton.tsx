import MenuItemLink from "@/components/MenuItemLink";
import YesNoDialog from "@/components/YesNoDialog";
import {
    Flex,
    IconButton,
    Link,
    Menu,
    MenuButton,
    MenuList,
    Modal,
    ModalContent,
    ModalHeader,
    ModalOverlay,
} from "@chakra-ui/react";
import { IProduct } from "@server/models/Product";
import { ipcRenderer } from "electron";
import React from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { BiDetail } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineMonetizationOn } from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface IProps {
    product: IProduct;
}
const StyledMenuItem = MenuItemLink;

export default function ProductAciton({ product }: IProps) {
    const [isOpenDelete, setIsOpenDelete] = React.useState(false);
    const onDelete = () => {
        ipcRenderer
            .invoke("product:delete", {
                id: product.id,
            })
            .then((res) => {
                const event = new CustomEvent("product:change");
                window.dispatchEvent(event);
            });
        setIsOpenDelete(false);
    };
    const navigate = useNavigate();
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
                    <StyledMenuItem
                        onClick={() => navigate(`/main/product-manager/edit/${product.id}`)}
                        color={"green.500"}
                    >
                        <AiOutlineEdit />
                        Sửa thông tin
                    </StyledMenuItem>
                    <StyledMenuItem color={"red.500"} onClick={() => setIsOpenDelete(true)}>
                        <AiOutlineDelete />
                        Xoá sản phẩm
                    </StyledMenuItem>
                    <StyledMenuItem>
                        <BiDetail />
                        Chi tiết sản phẩm
                    </StyledMenuItem>
                </MenuList>
            </Menu>
        </Flex>
    );
}
