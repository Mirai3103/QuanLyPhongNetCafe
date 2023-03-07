import DataTable from "@/components/dataview/DataTable";
import { toMoneyString, toTimeString } from "@/utils/helper";
import {
    Flex,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputLeftElement,
    Tab,
    TableCellProps,
    TabList,
    Tabs,
    Tag,
    TagLabel,
} from "@chakra-ui/react";
import { Label } from "@fluentui/react";
import { IBill } from "@server/models/Bill";
import { ipcRenderer } from "electron";
import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import InvoiceAction from "./InvoiceAction";
enum BillType {
    Import = "Hoá đơn nhập",
    Export = "Hoá đơn bán",
}
const tabIndex = [BillType.Export, BillType.Import];
export default function ListView() {
    const [importBills, setImportBills] = React.useState<IBill[] | null>(null);
    const [exportBills, setExportBills] = React.useState<IBill[] | null>(null);
    React.useEffect(() => {
        ipcRenderer.invoke("BILL:getAll").then((res: IBill[]) => {
            setExportBills(res.filter((bill) => bill.type === BillType.Export));
            setImportBills(res.filter((bill) => bill.type === BillType.Import));
        });
    }, []);
    const [selectedType, setSelectedType] = React.useState<BillType>(BillType.Export);
    if (!importBills || !exportBills) return null;
    const renderBill = selectedType === BillType.Export ? exportBills : importBills;
    const headers = selectedType === BillType.Export ? headersExport : headersImport;

    return (
        <div className=" h-full bg-white rounded-lg -mt-2 shadow-xl">
            <Tabs colorScheme="blue" onChange={(value) => setSelectedType(tabIndex[value])}>
                <TabList bg="gray.100" borderTopRadius="xl">
                    <Tab
                        mx="3"
                        fontWeight="semibold"
                        fontSize="lg"
                        value={0}
                        isSelected={selectedType === BillType.Export}
                    >
                        Hoá đơn bán
                    </Tab>
                    <Tab
                        mx="3"
                        fontWeight="semibold"
                        fontSize="lg"
                        value={1}
                        isSelected={selectedType === BillType.Import}
                    >
                        Hoá đơn nhập
                    </Tab>
                </TabList>
                <Flex my="5" mx="3" columnGap="5" justifyItems={"end"} justifyContent={"end"}>
                    <FormControl justifyItems={"center"} justifyContent={"center"} w="25%">
                        <FormLabel>Bắt đầu từ</FormLabel>
                        <Input placeholder="Bắt đầu từ" size="lg" type={"datetime-local"} />
                    </FormControl>
                    <FormControl justifyItems={"center"} justifyContent={"center"} w="25%">
                        <FormLabel>Kết thúc từ</FormLabel>
                        <Input placeholder="Kết thúc từ" size="lg" type={"datetime-local"} />
                    </FormControl>
                    <FormControl justifyItems={"center"} justifyContent={"center"} w="50%">
                        <FormLabel>Tìm kiếm</FormLabel>
                        <InputGroup>
                            <InputLeftElement
                                pointerEvents="none"
                                children={<AiOutlineSearch size={22} className="text-gray-500" />}
                            />
                            <Input placeholder="Tìm bằng id, username hoặc tên nhân viên" size="lg" />
                        </InputGroup>
                    </FormControl>
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
                    dataRows={renderBill.map(convertProductToCell)}
                    headerProps={{
                        bg: "gray.100",
                    }}
                />
            </Tabs>
        </div>
    );
}
const headersExport = [
    "ID",
    "Tên tài khoản",
    "Ngày tạo",
    "Tổng tiền",
    "Trạng thái",
    "Người tạo",
    "Máy",
    "Tình trạng",
    "",
];
const headersImport = ["ID", "Ngày tạo", "Tổng tiền", "Người tạo", "Tình trạng", ""];
const convertProductToCell = (bill: IBill): TableCellProps[] => {
    const result: TableCellProps[] = [];

    result.push({
        key: 0,
        children: bill.id,
        fontSize: "md",
    });
    if (bill.type === BillType.Import) {
        result.push({
            key: 1,
            children: bill.createdAt.toLocaleString("vi-VN"),
            fontSize: "md",
        });
        result.push({
            key: 3,
            children: toMoneyString(bill.total),
            fontSize: "md",
        });
        result.push({
            key: 5,
            children: bill?.employee?.name || "none",
            fontSize: "md",
        });
        result.push({
            key: 7,
            children: bill.isPaid ? "Đã thanh toán" : "Chưa thanh toán",
            fontSize: "md",
        });
        result.push({
            key: 8,
            children: <InvoiceAction id={bill.id} />,
            fontSize: "md",
        });
        return result;
    }
    result.push({
        key: 1,
        children: bill.account ? bill.account.username : "Vãng lai",
        fontSize: "md",
    });
    result.push({
        key: 2,
        children: bill.createdAt.toLocaleString("vi-VN"),
        fontSize: "md",
    });
    result.push({
        key: 3,
        children: toMoneyString(bill.total),
        fontSize: "md",
    });
    result.push({
        key: 4,
        children: statusComponent(bill.status),
        fontSize: "md",
    });
    result.push({
        key: 5,
        children: bill?.employee?.name || "none",
        fontSize: "md",
    });
    result.push({
        key: 6,
        children: bill.machine.name,
        fontSize: "md",
    });
    result.push({
        key: 7,
        children: bill.isPaid ? "Đã thanh toán" : "Chưa thanh toán",
        fontSize: "md",
    });
    result.push({
        key: 8,
        children: <InvoiceAction id={bill.id} />,
        fontSize: "md",
    });

    return result;
};
const BillStatus: any = {
    "Chấp nhận": "green",
    "Đang chờ": "yellow",
    "Từ chối": "red",
};
const statusComponent = (status: string) => {
    return (
        <Tag size={"md"} variant="subtle" colorScheme={BillStatus[status]} key={status}>
            <TagLabel>{status}</TagLabel>
        </Tag>
    );
};
