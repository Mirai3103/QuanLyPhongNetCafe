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
import { IProduct, Type } from "@server/models/Product";
import { Select } from "chakra-react-select";
import { ipcRenderer } from "electron";
import React from "react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProduct() {
    const id = useParams().id;
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
    const [product, setProduct] = React.useState<IProduct | null>(null);
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
        ipcRenderer.invoke("product:getById", { id }).then((data) => {
            setProduct(data);
            nameRef.current!.value = data.name;
            priceRef.current!.value = data.price + "";
            descriptionRef.current!.value = data.description;
            stockRef.current!.value = data.stock === -1 ? "" : data.stock + "";
            setIsProcessingOutside(data.stock === -1);
            setImageBase64("data:image/jpg;base64," + data.imageBase64);
            setSelectedType(data.type + "");
        });
    }, [id]);

    const toast = useToast();

    const handleCreate = () => {
        const name = nameRef.current?.value;
        const price = priceRef.current?.value;
        const description = descriptionRef.current?.value;
        const stock = stockRef.current?.value;
        if (!name || !price || !description || !selectedType || !imageBase64) {
            toast({
                title: "Vui l??ng ??i???n ?????y ????? th??ng tin c?? d???u *",
                status: "error",
            });
            return;
        }
        if (!isProcessingOutside && !stock) {
            toast({
                title: "Vui l??ng ??i???n ?????y ????? th??ng tin c?? d???u *",
                status: "error",
            });
            return;
        }
        const base64 = imageBase64.split(",")[1];
        const payload = {
            ...product!,
            imageBase64: base64,
            name,
            price: Number(price),
            description,
            type: selectedType,
            stock: isProcessingOutside ? -1 : Number(stock),
        };
        ipcRenderer.invoke("product:update", payload).then((res) => {
            if (res) {
                navigate(-1);
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
                    <Flex fontSize={"2xl"}>S???a s???n ph???m</Flex>
                </Flex>
                <Button colorScheme={"green"} size="md" px={"12"} onClick={handleCreate}>
                    L??u
                </Button>
            </div>
            <Flex bg={"white"} mx="2" p={"6"} mt="10" rounded={"xl"} shadow="xl">
                <Flex w="full" flexDirection={"column"} rowGap={"20px"} mx="10">
                    <FormControl isRequired>
                        <FormLabel>T??n s???n ph???m</FormLabel>
                        <Input placeholder="t??n s???n ph???m" name="title" ref={nameRef} />
                    </FormControl>
                    <Flex columnGap={"20px"} flexDirection={"row"}>
                        <FormControl isRequired>
                            <FormLabel> Gi?? b??n</FormLabel>
                            <Input type={"number"} placeholder="Gi?? b??n" name="price" ref={priceRef} />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Lo???i s???n ph???m</FormLabel>
                            <Select
                                colorScheme="blue"
                                placeholder="Ch???n lo???i s???n ph???m"
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
                                title="Ch??? bi???n ??? ngo??i?"
                            >
                                <Tooltip label="S??? ?????t mua ??? ngo??i khi c?? kh??ch mu???n" placement="top">
                                    <span>Ch??? bi???n ??? ngo??i?</span>
                                </Tooltip>
                            </Checkbox>
                        </FormControl>
                        <FormControl isRequired={!isProcessingOutside}>
                            <FormLabel>T???n kho</FormLabel>
                            <Input
                                type={"number"}
                                placeholder="S??? l?????ng t???n kho"
                                name="stock"
                                disabled={isProcessingOutside}
                                ref={stockRef}
                            />
                        </FormControl>
                    </Flex>
                    <FormControl isRequired>
                        <FormLabel>M?? t???</FormLabel>
                        <Textarea
                            placeholder="M?? t??? chi ti???t s???n ph???m"
                            name="description"
                            resize="unset"
                            ref={descriptionRef}
                        />
                    </FormControl>{" "}
                    <FormControl isRequired>
                        <FormLabel>???nh minh h???a</FormLabel>
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
                                        <span>Ch???n ???nh</span>
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
