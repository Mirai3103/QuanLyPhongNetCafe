import { Button, FormControl, FormLabel, Input, useToast } from "@chakra-ui/react";
import React from "react";
import { ipcRenderer } from "electron";

interface IProps {}

export default function LoginPage({}: IProps) {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const toast = useToast();
    const handleLogin = () => {
        if (username === "" || password === "") {
            toast({
                title: `Vui lòng nhập đầy đủ thông tin`,
                status: "error",
                isClosable: true,
                position: "top",
                duration: 5000,
            });
            return;
        }
        ipcRenderer.invoke("login", { username, password });
    };

    React.useEffect(() => {
        const handleError = (_: any, arg: any) => {
            toast({
                title: `${arg} `,
                status: "error",
                isClosable: true,
                position: "top",
                duration: 5000,
            });
        };
        const handleLoginSuccess = (_: any, arg: any) => {
            toast({
                title: `Đăng nhập thành công `,
                status: "success",
                isClosable: true,
                position: "top",
                duration: 5000,
            });
            console.log(arg);
        };
        ipcRenderer.on("error", handleError);
        ipcRenderer.on("login", handleLoginSuccess);

        return () => {
            ipcRenderer.removeListener("error", handleError);
            ipcRenderer.removeListener("login", handleLoginSuccess);
        };
    }, []);
    return (
        <div className="bg-[#FBFCFF] w-screen h-screen grid place-content-center place-items-center">
            <div className="bg-white shadow-md w-[30rem] p-5 flex text-xl flex-col gap-y-2">
                <div className="text-center font-bold text-3xl"> Đăng nhập</div>
                <div className="text-center font-normal text-base">Đăng nhập để sử dụng máy</div>
                <FormControl>
                    <FormLabel>Tài khoản</FormLabel>
                    <Input
                        className="text-xl"
                        placeholder="Tài khoản"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        colorScheme="purple"
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Mật khẩu</FormLabel>
                    <Input
                        className="text-xl"
                        placeholder="Mật khẩu"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        type="password"
                        colorScheme="purple"
                    />
                </FormControl>
                <div className="mt-5 flex justify-center">
                    <Button colorScheme="purple" variant="solid" onClick={handleLogin}>
                        Đăng nhập
                    </Button>
                </div>
            </div>
        </div>
    );
}
