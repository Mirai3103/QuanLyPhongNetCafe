import { useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/userSplice";
import {
    Avatar,
    Box,
    Flex,
    FlexProps,
    HStack,
    IconButton,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    useColorModeValue,
    VStack,
} from "@chakra-ui/react";
import { FiBell, FiChevronDown } from "react-icons/fi";
import { Text } from "@chakra-ui/react";
export interface MobileProps extends FlexProps {
    onOpen: () => void;
}
const NavBar = ({ onOpen, ...rest }: MobileProps) => {
    const user = useAppSelector(selectUser);
    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 4 }}
            height="20"
            alignItems="center"
            bg={useColorModeValue("white", "gray.900")}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue("gray.200", "gray.700")}
            justifyContent={{ base: "flex-end" }}
            {...rest}
        >
            <HStack spacing={{ base: "6" }}>
                <IconButton size="lg" variant="ghost" aria-label="open menu" icon={<FiBell size="24" />} />
                <Flex alignItems={"center"}>
                    <Menu>
                        <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: "none" }}>
                            <HStack>
                                <Avatar
                                    size={"md"}
                                    src={
                                        "https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                                    }
                                />
                                <VStack
                                    display={{ base: "none", md: "flex" }}
                                    alignItems="flex-start"
                                    spacing="1px"
                                    ml="2"
                                >
                                    <Text fontSize="lg" fontWeight="semibold">
                                        {user?.name}
                                    </Text>
                                    <Text fontSize="sm" color="gray.600">
                                        {user?.account.role}
                                    </Text>
                                </VStack>
                                <Box display={{ base: "none", md: "flex" }}>
                                    <FiChevronDown />
                                </Box>
                            </HStack>
                        </MenuButton>
                        <MenuList
                            bg={useColorModeValue("white", "gray.900")}
                            borderColor={useColorModeValue("gray.200", "gray.700")}
                        >
                            <MenuItem>Profile</MenuItem>
                            <MenuItem>Settings</MenuItem>
                            <MenuItem>Billing</MenuItem>
                            <MenuDivider />
                            <MenuItem>Sign out</MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </HStack>
        </Flex>
    );
};

export default NavBar;
