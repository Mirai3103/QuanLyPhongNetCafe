import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useToast,
} from "@chakra-ui/react";
import { IMachine } from "@server/models/Machine";
import { GroupBase, Select, SelectInstance } from "chakra-react-select";
import { ipcRenderer } from "electron";
import React from "react";

interface IProps {
    isOpen: boolean;
    onSuscess?: () => void;
    setOpened: (isOpen: boolean) => void;
    machine: IMachine;
}

export default function UpdateModal({ machine, isOpen, onSuscess, setOpened }: IProps) {
    const [name, setName] = React.useState(machine.name);
    const [price, setPrice] = React.useState(machine.price);
    const typeRef = React.useRef<
        SelectInstance<
            {
                value: MachineType;
                label: string;
            },
            false,
            GroupBase<{
                value: MachineType;
                label: string;
            }>
        >
    >(null);
    const toast = useToast();

    const handleCreate = () => {
        const type = typeRef.current?.getValue()[0].value;
        if (!name || !price || !type) {
            toast({
                title: "Lỗi",
                colorScheme: "red",
                description: "Vui lòng điền đầy đủ thông tin",
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        machine.name = name;
        machine.price = price;
        machine.type = type;

        ipcRenderer.invoke("machine:update", machine).then((m) => {
            if (m) {
                onSuscess?.();
                setOpened(false);
            }
        });
    };
    return (
        <>
            <Modal isOpen={isOpen} onClose={setOpened.bind(null, false)}>
                <ModalOverlay />
                <ModalContent mt={"40"}>
                    <ModalHeader>Tạo máy mới</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>Tên máy</FormLabel>
                            <Input
                                placeholder="Tên máy"
                                onChange={(e) => setName(e.target.value)}
                                value={machine.name}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Loại máy</FormLabel>
                            <Select
                                defaultValue={typeOptions.find((o) => o.value === machine.type)}
                                options={typeOptions}
                                ref={typeRef}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Giá máy (/1 giờ)</FormLabel>
                            <Input
                                type={"number"}
                                placeholder="Giá máy"
                                onChange={(e) => setPrice(Number(e.target.value || "0"))}
                                value={price}
                            />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant={"outline"} mr={3} colorScheme="red" onClick={setOpened.bind(null, false)}>
                            Huỷ
                        </Button>
                        <Button colorScheme="blue" onClick={handleCreate}>
                            Cập nhật
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
enum MachineType {
    Vip = "vip",
    Normal = "normal",
}
const typeOptions = [
    {
        value: MachineType.Vip,
        label: "Vip",
    },
    {
        value: MachineType.Normal,
        label: "Thường",
    },
];
