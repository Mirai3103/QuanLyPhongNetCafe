import { Flex, Tag, Text } from "@chakra-ui/react";
import React from "react";

interface IProps {
    username?: string;
}

export default function header({ username = "User" }: IProps) {
    return (
        <Flex shadow="md" w="full" p="2" px="3" bg="blue.50" justifyContent={"space-between"} justifyItems="center">
            <Text fontWeight={"600"}>{username}</Text>
            <Tag fontWeight={"600"} size="md" variant="subtle" colorScheme="green">
                Đã kết nối
            </Tag>
        </Flex>
    );
}
