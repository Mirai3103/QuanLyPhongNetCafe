import { Flex, FlexProps, Icon, Link as ChakraLink } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { Link, useLocation } from "react-router-dom";

export interface NavItemProps extends FlexProps {
    icon: IconType;
    children: string;
    url?: string;
}

const NavItem = ({ url, icon, children, ...rest }: NavItemProps) => {
    const location = useLocation();

    // url in path
    const isActive = url ? location.pathname.includes(url ? url : "") : false;

    return (
        <ChakraLink as={Link} to={url ? url : "#"} style={{ textDecoration: "none" }} _focus={{ boxShadow: "none" }}>
            <Flex
                align="center"
                py="4"
                px="4"
                mx="4"
                my="1"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={
                    isActive
                        ? {}
                        : {
                              bg: "cyan.400",
                              color: "white",
                          }
                }
                backgroundColor={isActive ? "cyan.400" : ""}
                color={isActive ? "white" : ""}
                {...rest}
            >
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        _groupHover={{
                            color: "white",
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </ChakraLink>
    );
};

export default NavItem;
