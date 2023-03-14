import { toMoneyString } from "@/utils/helper";
import { Box, Button, Flex, FormControl, FormLabel, IconButton, Input, useToast, Icon, Text } from "@chakra-ui/react";
import { IBillDetail } from "@server/models/BillDetail";
import { IProduct } from "@server/models/Product";
import { Select } from "chakra-react-select";
import { ipcRenderer } from "electron";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";
interface IAddDetailProps {
    billDetail: IBillDetail[];
    onAdd: (billDetail: IBillDetail) => void;
    onRemove: (productId: number) => void;
    onChangeQuantity: (productId: number, quantity: number) => void;
}

export default function AddDetail({ billDetail, onAdd, onRemove, onChangeQuantity }: IAddDetailProps) {
    const [products, setProducts] = React.useState<
        {
            value: string;
            label: string;
            product: IProduct;
        }[]
    >([]);
    const [selectedProduct, setSelectedProduct] = React.useState<IProduct>();
    const [quantity, setQuantity] = React.useState<number>(1);
    React.useEffect(() => {
        ipcRenderer.invoke("product:getAllForSelect").then((data) => {
            setProducts(data.map((item: IProduct) => ({ value: item.id, label: item.name, product: item })));
        });
    }, []);
    const toast = useToast();
    const onAddDetail = () => {
        if (selectedProduct) {
            onAdd?.({
                product: selectedProduct,
                productId: selectedProduct.id,
                quantity: quantity,
                price: selectedProduct.price,
                billId: 0,
            });
            setSelectedProduct(undefined);
        } else {
            toast({
                title: "Chưa chọn sản phẩm",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Flex direction={"column"}>
            <Flex
                direction={"column"}
                borderBottom={"1px solid #ccc"}
                borderColor="gray.300"
                pb={"5px"}
                rowGap={"10px"}
            >
                <Flex direction={"row"} columnGap={"5px"}>
                    <FormControl isRequired justifyItems={"center"} justifyContent={"center"} w="50%">
                        <FormLabel>Sản phẩm</FormLabel>
                        <Select
                            options={products}
                            value={products.find((item) => item.value === selectedProduct?.id + "")}
                            onChange={(e) => setSelectedProduct((e as any).product)}
                        />
                    </FormControl>

                    <FormControl isRequired justifyItems={"center"} justifyContent={"center"} w="25%">
                        <FormLabel>Số lượng</FormLabel>
                        <Input
                            placeholder="Số lượng"
                            type={"number"}
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        />
                    </FormControl>
                    <FormControl isRequired justifyItems={"center"} justifyContent={"center"} w="25%">
                        <FormLabel>Thành tiền</FormLabel>
                        <Input
                            type={"text"}
                            value={quantity * (selectedProduct ? selectedProduct.price : 0) + " VNĐ"}
                            readOnly
                        />
                    </FormControl>
                </Flex>
                <Flex direction={"row"} columnGap={"5px"} justifyContent="flex-end">
                    <Button colorScheme="green" variant="solid" onClick={onAddDetail}>
                        Thêm
                    </Button>
                </Flex>
            </Flex>
            {billDetail.map((item, index) => (
                <Detail key={index} billDetail={item} onRemove={onRemove} onChangeQuantity={onChangeQuantity} />
            ))}
            <Box w={"full"} mt="6" borderBottomColor={"gray.400"} borderBottom="1px" borderBottomStyle={"dashed"} />
            <Flex direction={"row"} columnGap={"30px"} justifyContent="flex-end" mt="6" alignItems={"center"}>
                <Text fontSize={"xl"} fontWeight={"bold"}>
                    Tổng tiền:
                </Text>
                <Text fontSize={"lg"} fontWeight={"semibold"} mt="4px">
                    {toMoneyString(billDetail.reduce((a, b) => a + b.quantity * b.product!.price, 0))} VNĐ
                </Text>
            </Flex>
        </Flex>
    );
}

interface IDetailProps {
    billDetail: IBillDetail;
    onRemove?: (productId: number) => void;
    onChangeQuantity: (productId: number, quantity: number) => void;
}

function Detail({ billDetail, onRemove, onChangeQuantity }: IDetailProps) {
    console.log(billDetail);
    return (
        <>
            <Flex direction={"row"} columnGap={"5px"} my="4">
                <FormControl isRequired justifyItems={"center"} justifyContent={"center"} w="50%">
                    <Input placeholder="chọn sản phẩm" type={"text"} value={billDetail.product!.name} disabled />
                </FormControl>

                <FormControl isRequired justifyItems={"center"} justifyContent={"center"} w="20%">
                    <Input
                        placeholder="Ngày lập"
                        type={"number"}
                        value={billDetail.quantity}
                        onChange={(e) => onChangeQuantity?.(billDetail.productId, Number(e.target.value))}
                    />
                </FormControl>
                <FormControl isRequired justifyItems={"center"} justifyContent={"center"} w="20%">
                    <Input type={"text"} value={billDetail.quantity * billDetail.product!.price + " VNĐ"} readOnly />
                </FormControl>
                <Flex flexGrow={"1"} direction={"row"} columnGap={"5px"} justifyContent="center" alignItems={"center"}>
                    <Icon
                        onClick={() => onRemove?.(billDetail.productId)}
                        as={AiOutlineClose}
                        color="red.500"
                        cursor="pointer"
                        fontSize={"2xl"}
                        rounded={"full"}
                        _hover={{
                            bg: "red.50",
                        }}
                    />
                </Flex>
            </Flex>
            <Flex direction={"row"} columnGap={"5px"} justifyContent="flex-end"></Flex>
        </>
    );
}
