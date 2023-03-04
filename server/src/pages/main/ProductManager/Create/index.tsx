import {
    Button,
    Checkbox,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Tooltip,
    Image,
    useToast,
} from "@chakra-ui/react";
import { Label } from "@fluentui/react";
import { Type } from "@server/models/Product";
import { Select } from "chakra-react-select";
import { ipcRenderer } from "electron";
import React from "react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function CreateProduct() {
    const navigate = useNavigate();
    const [type, setType] = React.useState<
        {
            value: string;
            label: string;
        }[]
    >([]);
    const [isProcessingOutside, setIsProcessingOutside] = React.useState(false);
    const [selectedType, setSelectedType] = React.useState<string | undefined>();
    const [imageBase64, setImageBase64] = React.useState<string | undefined>();
    const nameRef = React.useRef<HTMLInputElement>(null);
    const priceRef = React.useRef<HTMLInputElement>(null);
    const descriptionRef = React.useRef<HTMLTextAreaElement>(null);
    const stockRef = React.useRef<HTMLInputElement>(null);
    React.useEffect(() => {
        ipcRenderer.invoke("product:getAllType").then((res) => {
            const types = res.map((item: Type) => {
                return {
                    value: item + "",
                    label: item + "",
                };
            });
            setType(types);
        });
    }, []);

    const toast = useToast();

    const handleCreate = () => {
        const name = nameRef.current?.value;
        const price = priceRef.current?.value;
        const description = descriptionRef.current?.value;
        const stock = stockRef.current?.value;
        if (!name || !price || !description || !selectedType || !imageBase64) {
            toast({
                title: "Vui lòng điền đầy đủ thông tin có dấu *",
                status: "error",
            });
            return;
        }
        if (!isProcessingOutside && !stock) {
            toast({
                title: "Vui lòng điền đầy đủ thông tin có dấu *",
                status: "error",
            });
            return;
        }
        const base64 = imageBase64.split(",")[1];
        const product = {
            name,
            price,
            description,
            type: selectedType,
            initialStock: isProcessingOutside ? -1 : stock,
            imageBase64: base64,
        };
        ipcRenderer.invoke("product:create", product).then((res) => {
            if (res) {
                navigate("/main/product-manager");
            }
        });
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between">
                <Flex columnGap={"5px"} alignItems="center">
                    <div className="text-3xl cursor-pointer hover:text-blue-500 hover:bg-slate-100 mx-4 px-4 py-2 rounded-md">
                        <MdArrowBack onClick={() => navigate(-1)} />
                    </div>
                    <Flex fontSize={"2xl"}>Tạo sản phẩm</Flex>
                </Flex>
                <Button colorScheme={"green"} size="md" px={"12"} onClick={handleCreate}>
                    Tạo
                </Button>
            </div>
            <Flex bg={"white"} mx="2" p={"6"} mt="10" rounded={"xl"} shadow="xl">
                <Flex w="full" flexDirection={"column"} rowGap={"20px"} mx="10">
                    <FormControl isRequired>
                        <FormLabel>Tên sản phẩm</FormLabel>
                        <Input placeholder="tên sản phẩm" name="title" ref={nameRef} />
                    </FormControl>
                    <Flex columnGap={"20px"} flexDirection={"row"}>
                        <FormControl isRequired>
                            <FormLabel> Giá bán</FormLabel>
                            <Input type={"number"} placeholder="Giá bán" name="price" ref={priceRef} />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Loại sản phẩm</FormLabel>
                            <Select
                                colorScheme="blue"
                                placeholder="Chọn loại sản phẩm"
                                options={type}
                                value={type.find((item) => item.value === selectedType)}
                                onChange={(e) => {
                                    setSelectedType(e!.value);
                                }}
                            />
                        </FormControl>
                    </Flex>
                    <Flex columnGap={"20px"} flexDirection={"row"} alignItems={"center"}>
                        <FormControl>
                            <Checkbox
                                onChange={(e) => setIsProcessingOutside(e.target.checked)}
                                colorScheme="green"
                                checked={isProcessingOutside}
                                title="Chế biến ở ngoài?"
                            >
                                <Tooltip label="Sẽ đặt mua ở ngoài khi có khách muốn" placement="top">
                                    <span>Chế biến ở ngoài?</span>
                                </Tooltip>
                            </Checkbox>
                        </FormControl>
                        <FormControl isRequired={!isProcessingOutside}>
                            <FormLabel>Tồn kho</FormLabel>
                            <Input
                                type={"number"}
                                placeholder="Số lượng tồn kho"
                                name="stock"
                                disabled={isProcessingOutside}
                                ref={stockRef}
                            />
                        </FormControl>
                    </Flex>
                    <FormControl isRequired>
                        <FormLabel>Mô tả</FormLabel>
                        <Textarea
                            placeholder="Mô tả chi tiết sản phẩm"
                            name="description"
                            resize="unset"
                            ref={descriptionRef}
                        />
                    </FormControl>{" "}
                    <FormControl isRequired>
                        <FormLabel>Ảnh minh họa</FormLabel>
                        <input
                            id="anhminhhoa"
                            type="file"
                            onChange={(e) => {
                                const file = e.target.files![0];
                                const reader = new FileReader();
                                reader.readAsDataURL(file);
                                reader.onload = () => {
                                    setImageBase64(reader.result as string);
                                };
                            }}
                            accept="image/*"
                            hidden
                        />
                        <Label htmlFor="anhminhhoa" className="cursor-pointer">
                            {imageBase64 ? (
                                <Flex
                                    w="full"
                                    h="full"
                                    justifyContent="center"
                                    alignItems="center"
                                    border="2px dashed"
                                    borderColor="gray.300"
                                    borderRadius="md"
                                    p="6"
                                    px={"40"}
                                >
                                    <Image src={imageBase64} objectFit="cover" w="full" h="auto" />
                                </Flex>
                            ) : (
                                <Flex
                                    w="full"
                                    h="full"
                                    justifyContent="center"
                                    alignItems="center"
                                    border="2px dashed"
                                    borderColor="gray.300"
                                    borderRadius="md"
                                    p="6"
                                    bg={"gray.50"}
                                >
                                    <Flex fontSize="xl" color="gray.500" alignItems="center">
                                        <span>Chọn ảnh</span>
                                    </Flex>
                                </Flex>
                            )}
                        </Label>
                    </FormControl>
                </Flex>
            </Flex>
        </div>
    );
}
