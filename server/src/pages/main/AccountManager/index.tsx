import React from "react";
import { Button, Flex, Icon, Spacer, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import ListView from "./ListView";
interface IProps {}

export default function AccountManager({}: IProps) {
    return (
        <Flex direction="column" rowGap="10" mt="3">
            <Flex justifyContent="space-between">
                <Text fontSize="2xl" fontWeight="bold">
                    Quản lý tài khoản
                </Text>
                <div>
                    <Button
                        leftIcon={
                            <Icon
                                fontSize="24"
                                _groupHover={{
                                    color: "white",
                                }}
                                as={AiOutlinePlus}
                            />
                        }
                        variant="solid"
                    >
                        Tạo tài khoản
                    </Button>
                </div>
            </Flex>
            <ListView />
        </Flex>
    );
}
