import { Box, Flex, FormControl, FormLabel, Input, Select, Text } from "@chakra-ui/react";
import React from "react";
import { useDebounce } from "usehooks-ts";
import { ProductContext } from "./CartProvider";
import ProductPreview from "./ProductPreview";
import { BsFillCartCheckFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
const fakeData = {
    id: 1,
    name: "Coca",
    price: 10000,
    type: "Nước uống",
    imageBase64: "https://cdnimg.webstaurantstore.com/images/products/xxl/479957/1901492.jpg",
    description: `Coca Cola là một trong những loại nước giải khát phổ biến nhất trên toàn thế giới, được sản xuất và phân phối bởi Công ty Coca Cola. Với hương vị ngọt ngào và sức mạnh của cafein, Coca Cola là sự lựa chọn yêu thích của nhiều người khi cần một lượng năng lượng bổ sung.
Coca Cola được sản xuất từ các thành phần chính như nước, đường và acid phosphoric, cùng với các hương liệu tự nhiên và hương vị. Đây là một loại nước uống rất thích hợp để `,
    stock: 12,
    createdAt: new Date("2022-02-12 00:00:00"),
    deletedAt: null,
};
const fakeDataArr = Array(10).fill(fakeData);

export default function ProductPage() {
    const [searchInputText, setSearchInputText] = React.useState("");
    const searchValue = useDebounce(searchInputText, 500);
    const [selectedCategory, setSelectedCategory] = React.useState("all");
    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInputText(e.target.value);
    };
    const { cartItems } = React.useContext(ProductContext);
    const navigate = useNavigate();

    const listProduct = React.useMemo(() => {
        if (searchValue === "" && selectedCategory === "all") {
            return fakeDataArr;
        }
        const newList = fakeDataArr.filter((product) => {
            if (selectedCategory !== "all" && product.type !== selectedCategory) {
                return false;
            }
            return product.name.toLowerCase().includes(searchValue.toLowerCase());
        });
        return newList;
    }, [searchValue, selectedCategory]);

    return (
        <Flex position={"relative"} w="full" h="full" bg="gray.200" className="has-scrollbar" overflowY={"auto"}>
            <Box
                position={"fixed"}
                zIndex="2"
                right={"0"}
                top={"20"}
                p="2"
                w="20"
                bg={"green.400"}
                roundedLeft="xl"
                shadow={"sm"}
                cursor={"pointer"}
                _hover={{
                    bg: "green.500",
                }}
                onClick={() => navigate("/test/cart")}
            >
                <Flex>
                    <BsFillCartCheckFill size={30} color={"white"} />
                    <Text mt={"-2"} color={"whatsapp.100"} fontSize="2xl" fontWeight="bold">
                        <sup> {cartItems.length}</sup>
                    </Text>
                </Flex>
            </Box>
            <Flex flexWrap={"wrap"} m="4" gap="2" rowGap={"4"} justifyContent={"space-around"}>
                <Flex direction={"column"} w="full" bg={"white"} p="5" mb="5" rounded={"2xl"}>
                    <Flex grow={"1"} w="full" mt={"5"}>
                        <Text fontSize="2xl" fontWeight="bold">
                            Danh sách sản phẩm
                        </Text>
                    </Flex>
                    <Flex grow={"1"} w="full" m={"4"}>
                        <FormControl>
                            <FormLabel>Tìm kiếm</FormLabel>
                            <Input
                                bg="white"
                                placeholder="Tìm kiếm"
                                value={searchInputText}
                                onChange={handleChangeInput}
                                colorScheme="green"
                                w="96"
                            />
                        </FormControl>
                        <FormControl w={"80"} mr="10">
                            <FormLabel>Loại sản phẩm</FormLabel>
                            <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                                <option value="all">Tất cả</option>
                                <option value="Nước uống">Nước uống</option>
                                <option value="Đồ ăn">Đồ ăn</option>
                                <option value="Thẻ">Thẻ</option>
                            </Select>
                        </FormControl>
                    </Flex>
                </Flex>

                {listProduct.map((product, index) => (
                    <ProductPreview product={product} key={index} />
                ))}
            </Flex>
        </Flex>
    );
}
