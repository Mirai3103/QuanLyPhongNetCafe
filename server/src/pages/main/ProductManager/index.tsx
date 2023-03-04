import { Button, Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import ListView from "./ListView";

export default function ProductManager() {
    const navigate = useNavigate();
    return (
        <Flex direction="column" rowGap="10" mt="3">
            <Flex justifyContent="space-between">
                <Text fontSize="2xl" fontWeight="bold">
                    Quản lý sản phẩm
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
                        onClick={() => navigate("/main/product-manager/create")}
                    >
                        Tạo sản phẩm
                    </Button>
                </div>
            </Flex>
            <ListView />
        </Flex>
    );
}
