import { Box, BoxProps, Flex, useColorModeValue, Text } from "@chakra-ui/react";
import NavCollapse, { LinkItemProps } from "./NavCollapse";
import NavItem from "./NavItem";

export interface SidebarProps extends BoxProps {
    onClose: () => void;
    items: Array<LinkItemProps>;
}

const SidebarContent = ({ items, onClose, ...rest }: SidebarProps) => {
    return (
        <Box
            transition="3s ease"
            bg={useColorModeValue("white", "gray.900")}
            borderRight="1px"
            borderRightColor={useColorModeValue("gray.200", "gray.700")}
            w={{ base: "72" }}
            pos="fixed"
            h="full"
            {...rest}
        >
            <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                    Logo
                </Text>
            </Flex>
            {items.map((link) =>
                link.children ? (
                    <NavCollapse key={link.name} name={link.name} navChild={link.children}></NavCollapse>
                ) : (
                    <NavItem key={link.name} icon={link.icon} url={link.url}>
                        {link.name}
                    </NavItem>
                )
            )}
        </Box>
    );
};

export default SidebarContent;
