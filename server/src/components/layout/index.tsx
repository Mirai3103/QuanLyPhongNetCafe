import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/userSplice";
import { AccountEvents } from "@/services/type";
import { Box, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { ipcRenderer } from "electron";
import React from "react";
import { IconType } from "react-icons";
import { FiCompass, FiHome, FiSettings, FiStar, FiTrendingUp } from "react-icons/fi";
import { Outlet } from "react-router-dom";
import NavBar from "./Navbar";
import SidebarContent from "./Sidebar";

interface LinkItemProps {
    name: string;
    icon: IconType;
    url?: string;
    children?: Array<LinkItemProps>;
}
const LinkItems: Array<LinkItemProps> = [
    { name: "Trang chủ", icon: FiHome, url: "/main/home" },
    {
        name: "Quản lý",
        icon: FiTrendingUp,
        children: [
            { name: "Quản lý nhân viên", icon: FiTrendingUp, url: "/main/employee" },
            { name: "Quản lý khách hàng", icon: FiTrendingUp, url: "/main/customer" },
            { name: "Quản lý tài khoản", icon: FiTrendingUp, url: "/main/account-manager" },
        ],
    },
    { name: "Thống kê", icon: FiCompass },
    { name: "Điều khiển", icon: FiStar },
    { name: "Cài đặt", icon: FiSettings },
];
export default function MainLayout() {
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        ipcRenderer.invoke(AccountEvents.GET_INFO).then((u) => {
            if (u === null) {
                ipcRenderer.send("openLogin");
                return;
            }

            dispatch(setUser(JSON.parse(JSON.stringify(u))));
        });
    }, []);

    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <Box
            maxW="100vw"
            minH="100vh"
            className="has-scrollbar"
            overflow="auto"
            maxH="100vh"
            bg={useColorModeValue("gray.50", "gray.900")}
        >
            <SidebarContent onClose={() => onClose} display={{ base: "block" }} items={LinkItems} />
            {/* <SidebarContent onClose={onClose} /> */}
            <NavBar onOpen={onOpen} />
            <Box ml={{ base: 72 }} p="4">
                <Outlet />
            </Box>
        </Box>
    );
}
