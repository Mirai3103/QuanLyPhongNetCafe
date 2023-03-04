import { Flex, MenuItem, MenuItemProps } from "@chakra-ui/react";

const MenuItemLink = (
    props: MenuItemProps & {
        to?: string;
    }
) => {
    return (
        <MenuItem
            as={Flex}
            borderRadius="sm"
            mx="2"
            py={"2"}
            w={"auto"}
            columnGap="2"
            justifyItems={"center"}
            fontSize="lg"
            {...props}
        />
    );
};

export default MenuItemLink;
