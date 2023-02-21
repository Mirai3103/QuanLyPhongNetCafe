import { Flex, FlexProps, Icon } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import NavItem from "./NavItem";
import { BsDot } from "react-icons/bs";

export interface LinkItemProps {
    name: string;
    icon: IconType;
    url?: string;
    children?: Array<LinkItemProps>;
}
interface NavCollapseProps extends FlexProps {
    navChild: Array<LinkItemProps>;
    name: string;
}
const NavCollapse = ({ name, navChild, ...rest }: NavCollapseProps) => {
    const [show, setShow] = React.useState(false);
    const location = useLocation();
    const isActive = navChild.some((item) => (item.url ? location.pathname.includes(item.url ? item.url : "") : false));
    React.useEffect(() => {
        if (isActive) {
            setShow(true);
        }
    }, [isActive]);
    const onExpand = () => {
        setShow(!show);
    };

    return (
        <>
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
                onClick={onExpand}
                {...rest}
            >
                <Icon
                    mr="4"
                    fontSize="16"
                    _groupHover={{
                        color: "white",
                    }}
                    as={isActive ? FiChevronUp : FiChevronDown}
                />
                {name}
            </Flex>
            <Flex direction="column" ml="6  ">
                {show
                    ? navChild.map((item) => (
                          <NavItem key={item.name} icon={BsDot} url={item.url}>
                              {item.name}
                          </NavItem>
                      ))
                    : null}
            </Flex>
        </>
    );
};

export default NavCollapse;
