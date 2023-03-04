import React from "react";
import { Button, Flex, Icon, Spacer, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import ListView from "./ListView";
import { useNavigate } from "react-router-dom";
interface IProps {}

export default function AccountManager({}: IProps) {
    const navigate = useNavigate();
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
                        onClick={() => navigate("/main/account-manager/create")}
                    >
                        Tạo tài khoản
                    </Button>
                </div>
            </Flex>
            <ListView />
        </Flex>
    );
}
