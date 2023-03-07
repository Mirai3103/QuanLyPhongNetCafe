import {
    Flex,
    Input,
    InputGroup,
    InputLeftElement,
    TableCellProps,
    Tag,
    TagLabel,
    Text,
    Image,
    Tooltip,
} from "@chakra-ui/react";
import { IProduct, Type } from "@server/models/Product";
import { ipcRenderer } from "electron";
import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { Select } from "chakra-react-select";
import DataTable from "@/components/dataview/DataTable";
import { toMoneyString } from "@/utils/helper";
import ProductAciton from "./ProductAciton";
const headers = ["Id", "Sản phẩm", "Loại", "Giá bán", "Mô tả", "Tồn kho", ""];
const imageWithTitle = (image: string, title: string) => {
    const base64 = "data:image/jpeg;base64," + image;
    return (
        <Flex justifyContent={"start"} alignItems={"center"} columnGap={"2"}>
            <Image src={base64} alt={title} className="w-20 h-20 rounded-full object-cover" />
            <Text fontWeight={"semibold"} className="ml-2">
                {title}
            </Text>
        </Flex>
    );
};
const textTruncate = (str: string, length: number = 50, ending: string = "...") => {
    const fullStr = str;
    if (str.length > length) {
        str = str.substring(0, length - ending.length) + ending;
    }
    return <Tooltip label={fullStr}>{str}</Tooltip>;
};

const convertProductToCell = (product: IProduct): TableCellProps[] => {
    const result: TableCellProps[] = [];
    result.push({
        key: 0,
        children: product.id,
        fontSize: "md",
    });
    result.push({
        key: 1,
        children: imageWithTitle(product.imageBase64, product.name),
        fontSize: "md",
    });
    result.push({
        key: 2,
        children: product.type,
        fontSize: "md",
    });
    result.push({
        key: 3,
        children: toMoneyString(product.price),
        fontSize: "md",
    });
    result.push({
        key: 4,
        children: textTruncate(product.description),
        fontSize: "md",
    });
    result.push({
        key: 5,
        children: product.stock == -1 ? "∞" : product.stock,
        fontSize: "md",
    });
    result.push({
        key: 6,
        children: <ProductAciton product={{ ...product }} />,
        fontSize: "md",
    });
    return result;
};
export default function ListView() {
    const [products, setProducts] = React.useState<IProduct[] | null>(null);
    const [type, setType] = React.useState<
        {
            value: string;
            label: string;
        }[]
    >([]);
    const [selectedType, setSelectedType] = React.useState<string | null>("all");
    const fileredProducts = React.useMemo(() => {
        if (selectedType === "all" || selectedType === null) {
            return products;
        }
        return products?.filter((item) => item.type === selectedType);
    }, [products, selectedType]);

    React.useEffect(() => {
        ipcRenderer.invoke("product:getAll").then((res) => {
            setProducts(res);
        });
    }, []);
    React.useEffect(() => {
        ipcRenderer.invoke("product:getAllType").then((res) => {
            const types = res.map((item: Type) => {
                return {
                    value: item + "",
                    label: item + "",
                };
            });
            types.push({
                value: "all",
                label: "Tất cả",
            });
            setType(types);
        });
    }, []);
    React.useEffect(() => {
        const handleHasAChange = () => {
            ipcRenderer.invoke("product:getAll").then((res) => {
                setProducts(res);
            });
        };
        window.addEventListener("product:change", handleHasAChange);
        return () => {
            window.removeEventListener("product:change", handleHasAChange);
        };
    }, []);

    return (
        <div className=" h-full bg-white rounded-lg shadow-xl">
            <Text fontSize="2xl" fontWeight="bold" className="p-5">
                Danh sách sản phẩm
            </Text>
            <Flex mb="5" mx="3" columnGap="5" justifyItems={"end"} justifyContent={"space-between"}>
                <Select
                    className="w-1/3"
                    placeholder="Chọn loại sản phẩm"
                    options={type}
                    onChange={(e) => {
                        setSelectedType(e!.value);
                    }}
                    value={type.find((item) => item.value === selectedType)}
                />
                <InputGroup justifyItems={"center"} justifyContent={"center"} w="50%">
                    <InputLeftElement
                        pointerEvents="none"
                        children={<AiOutlineSearch size={22} className="text-gray-500" />}
                    />
                    <Input placeholder="Tìm theo tên sản phẩm" size="lg" />
                </InputGroup>
            </Flex>
            <DataTable
                size="sm"
                borderTopRadius="xl"
                dataHeaders={headers.map((header, index) => {
                    return {
                        title: header,
                        key: index,
                        children: header,
                        fontSize: "lg",
                        py: "6",
                    };
                })}
                dataRows={fileredProducts?.map((product) => convertProductToCell(product))}
                headerProps={{
                    bg: "gray.100",
                }}
            />
        </div>
    );
}
