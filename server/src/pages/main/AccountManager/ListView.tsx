import {
    Flex,
    Input,
    InputGroup,
    InputLeftElement,
    Tab,
    TabList,
    Tabs,
    Text,
    IconButton,
    TableCellProps,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemProps,
    Tag,
    TagLabel,
} from "@chakra-ui/react";
import React from "react";
import { AiOutlineSearch, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiDetail } from "react-icons/bi";
import { MdOutlineMonetizationOn } from "react-icons/md";
import DataTable from "../../../components/dataview/DataTable";
import { IAccount } from "../../../../electron/models/Account";
import { ipcRenderer } from "electron";
import { AccountEvents } from "../../../services/type";
import { useDebounce } from "usehooks-ts";
import { toMoneyString, toVietnameseDatetime } from "@/utils/helper";
import AccountAction from "./AccountAction";
interface IProps {}
const tabs = [
    {
        name: "Tất cả tài khoản",
        value: "all",
    },
    {
        name: "Đang hoạt động",
        value: "active",
    },
    {
        name: "Đang không hoạt động",
        value: "inactive",
    },
];
const headers = ["Id", "Tên tài khoản", "Số dư", "Vai trò", "Trạng thái", "Ngày tạo", ""];

const statusComponent = (status: string) => {
    return (
        <Tag size={"md"} variant="subtle" colorScheme={status.includes("offline") ? `red` : `green`}>
            <TagLabel>{status}</TagLabel>
        </Tag>
    );
};

const convertAccountToRowProps = (account: IAccount): TableCellProps[] => {
    const result: TableCellProps[] = [];
    result.push({
        key: 0,
        children: account.id,
        fontSize: "md",
    });
    result.push({
        key: 1,
        children: <Text fontWeight={"semibold"}>{account.username}</Text>,
        fontSize: "md",
    });
    result.push({
        key: 2,
        children: <>{toMoneyString(account.balance)}</>,
        fontSize: "md",
    });
    result.push({
        key: 3,
        children: account.role,
        fontSize: "md",
    });
    result.push({
        key: 4,
        children: statusComponent("offline"),
        fontSize: "md",
    });
    result.push({
        key: 6,
        children: toVietnameseDatetime(account.createdAt),
        fontSize: "md",
    });
    result.push({
        key: 7,
        children: <AccountAction id={account.id} />,
    });
    return result;
};

export default function ListView({}: IProps) {
    const [accounts, setAccounts] = React.useState<IAccount[] | undefined>(undefined);

    React.useEffect(() => {
        ipcRenderer.invoke(AccountEvents.GET_ALL).then((data) => {
            setAccounts(data);
        });
    }, []);
    React.useEffect(() => {
        const onRefresh = () => {
            ipcRenderer.invoke(AccountEvents.GET_ALL).then((data) => {
                setAccounts(data);
            });
        };
        window.addEventListener("refresh-account", onRefresh);
        return () => {
            window.removeEventListener("refresh-account", onRefresh);
        };
    }, []);
    const [searchKeywords, setSearchKeywords] = React.useState("");
    const debouncedSearchKeywords = useDebounce(searchKeywords, 1000);
    const data = React.useMemo(() => {
        if (accounts === undefined) {
            return undefined;
        }
        if (debouncedSearchKeywords === "") {
            return accounts?.map(convertAccountToRowProps);
        }

        return accounts
            .filter((account) => {
                return (
                    account.username.includes(debouncedSearchKeywords) ||
                    (account.id + "").includes(debouncedSearchKeywords)
                );
            })
            .map(convertAccountToRowProps);
    }, [debouncedSearchKeywords, accounts]);

    const [tabIndex, setTabIndex] = React.useState(0);
    const handleTabChange = (index: number) => {
        setTabIndex(index);
    };
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchKeywords(e.target.value);
    };

    return (
        <div className=" h-full bg-white rounded-lg shadow-xl">
            <Tabs colorScheme="blue" onChange={handleTabChange}>
                <TabList bg="gray.100" borderTopRadius="xl">
                    <Tab mx="3" fontWeight="semibold" fontSize="lg" value="all">
                        Tất cả tài khoản
                    </Tab>
                    <Tab mx="3" fontWeight="semibold" fontSize="lg" value="active">
                        Đang hoạt động
                    </Tab>
                    <Tab mx="3" fontWeight="semibold" fontSize="lg" value="inactive">
                        Đang không hoạt động
                    </Tab>
                </TabList>
                <Flex my="5" mx="3" columnGap="5" justifyItems={"end"} justifyContent={"end"}>
                    <InputGroup justifyItems={"center"} justifyContent={"center"} w="50%">
                        <InputLeftElement
                            pointerEvents="none"
                            children={<AiOutlineSearch size={22} className="text-gray-500" />}
                        />
                        <Input
                            placeholder="Tìm theo tên tài khoản"
                            size="lg"
                            value={searchKeywords}
                            onChange={handleSearchChange}
                        />
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
                    dataRows={data}
                    headerProps={{
                        bg: "gray.100",
                    }}
                />
            </Tabs>
        </div>
    );
}
