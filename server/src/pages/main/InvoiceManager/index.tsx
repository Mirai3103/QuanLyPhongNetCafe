import { Button, Flex, Text, Icon } from "@chakra-ui/react";
import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import ListView from "./ListView";
import Overall from "./Overall";

export default function InvoiceManager() {
    const navigate = useNavigate();
    return (
        <Flex direction="column" rowGap="10" mt="3">
            <Flex justifyContent="space-between">
                <Text fontSize="2xl" fontWeight="bold">
                    Quản lý hoá đơn
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
                        // onClick={() => navigate("-1")}
                    >
                        Tạo hoá đơn
                    </Button>
                </div>
            </Flex>
            <Overall />
            <ListView />
        </Flex>
    );
}
