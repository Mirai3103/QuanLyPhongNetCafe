import { Button, Flex, FlexProps, Image, Tag, Text, Tooltip, useToast } from "@chakra-ui/react";
import React from "react";
import { IProduct } from "../../../../server/electron/models/Product";

import { BsFillCartPlusFill } from "react-icons/bs";
import InputDialog from "@/components/InputDialog";
import { ProductContext } from "./CartProvider";
interface ProductPreviewProps extends FlexProps {
    product: IProduct;
}

export default function ProductPreview({ product, ...rest }: ProductPreviewProps) {
    const [open, setOpen] = React.useState(false);
    const toast = useToast();
    const { addToCart } = React.useContext(ProductContext);
    const handleSubmit = (value: string) => {
        if (parseInt(value) < 1 || isNaN(parseInt(value))) {
            toast({
                title: "Số lượng không hợp lệ",
                description: "Số lượng sản phẩm phải lớn hơn 0",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        }
        if (parseInt(value) > product.stock) {
            toast({
                title: "Số lượng không hợp lệ",
                description: "Số lượng sản phẩm trong kho không đủ",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        }
        addToCart(product, parseInt(value));
    };

    return (
        <Flex
            bg={"white"}
            rowGap="2px"
            shadow={"lg"}
            rounded="md"
            direction="column"
            w="250px"
            h="370px"
            p="2"
            _hover={{
                shadow: "2xl",
            }}
            {...rest}
        >
            <Image
                src={product.imageBase64}
                objectFit="cover"
                w="200px"
                h="200px"
                mx={"auto"}
                rounded="md"
                transition="all 0.3s ease-in-out"
                _hover={{
                    transform: "scale(1.05)",
                }}
            />
            <Text fontSize="xl" fontWeight="bold" textAlign="center">
                {product.name}
            </Text>
            <Tooltip label={product.description} hasArrow>
                {/* truncate */}
                <Text fontSize="sm" ml={"5"} noOfLines={1}>
                    {product.description}
                </Text>
            </Tooltip>
            <Text fontSize="sm" fontWeight="bold" ml={"5"}>
                Loại: <Tag colorScheme={"green"}>{product.type}</Tag>
            </Text>
            <Text fontSize="sm" fontWeight="bold" ml={"5"}>
                Còn <Tag colorScheme={"blue"}>{product.stock}</Tag>
                sản phẩm
            </Text>
            <Button
                leftIcon={<BsFillCartPlusFill />}
                colorScheme="green"
                mx={"auto"}
                py="2"
                w="80%"
                mt="auto"
                isDisabled={product.stock == 0}
                onClick={() => setOpen(true)}
            >
                Thêm vào giỏ
            </Button>
            <InputDialog
                onConfirm={handleSubmit}
                title="Nhập số lượng"
                content="Số lượng cần mua"
                open={open}
                setOpen={setOpen}
                cancelText="Hủy"
                submitText="Xác nhận"
                inputType="number"
            />
        </Flex>
    );
}
