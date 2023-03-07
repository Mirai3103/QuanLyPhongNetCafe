import { IAccount } from "@server/models/Account";
import React from "react";
import { Form, useNavigate, useParams } from "react-router-dom";
//MdArrowBack
import { MdArrowBack } from "react-icons/md";
import { Button, Flex, FormControl, FormLabel, Input, Text } from "@chakra-ui/react";
import { ipcRenderer } from "electron";
import { Select } from "chakra-react-select";
import { useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/userSplice";
import { Role, allRoleOsptions, permission } from "@/utils/constants";
import { AccountEvents } from "@/services/type";
export default function CreateAccount() {
    const navigate = useNavigate();
    const [account, setAccounts] = React.useState<IAccount>({
        balance: 0,
        password: "",
        username: "",
        role: Role.User,
        initialBalance: 0,
    } as any);
    const user = useAppSelector(selectUser);
    const roleOptions = React.useMemo(() => {
        const lowerRoleIndex = permission.findIndex((role) => role === user?.account.role);
        const lowerRoles = permission.slice(lowerRoleIndex + 1);
        return lowerRoles.map((role) => allRoleOsptions.find((option) => option.value === role)!);
    }, [user?.account.role]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        if (name === "initialBalance") {
            setAccounts((prev) => ({ ...prev!, balance: Number(value) }));
        }
        setAccounts((prev) => ({ ...prev!, [name]: value }));
    };
    const handleRoleChange = (value: any) => {
        setAccounts((prev) => ({ ...prev!, role: value.value }));
    };
    const onClickSave = () => {
        console.log(account);
        ipcRenderer.invoke(AccountEvents.REGISTER, account).then((data) => {
            if (data) {
                navigate("/main/account-manager");
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
                    <Flex fontSize={"2xl"}>
                        Tạo tài khoản{" "}
                        <Text ml={"2"} fontWeight={"semibold"}>
                            {account?.username || ""}{" "}
                        </Text>
                    </Flex>
                </Flex>
                <Button colorScheme={"green"} size="md" px={"12"} onClick={onClickSave}>
                    Tạo
                </Button>
            </div>
            <Flex bg={"white"} mx="2" p={"6"} mt="10" rounded={"xl"} shadow="xl">
                <Flex w="full" flexDirection={"column"} rowGap={"20px"} mx="10">
                    <FormControl isRequired>
                        <FormLabel>Tên đăng nhập</FormLabel>
                        <Input
                            placeholder="tên đăng nhập"
                            value={account?.username}
                            name="username"
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input
                            type={"password"}
                            placeholder="Password"
                            value={account?.password}
                            name="password"
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Số dư</FormLabel>
                        <Input
                            type={"number"}
                            placeholder="Số dư tài khoản"
                            value={account?.balance}
                            name="initialBalance"
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Vai trò</FormLabel>
                        <Select
                            value={allRoleOsptions.find((option) => option.value === account?.role)}
                            colorScheme="blue"
                            options={roleOptions}
                            onChange={handleRoleChange}
                        />
                    </FormControl>
                </Flex>
            </Flex>
        </div>
    );
}
