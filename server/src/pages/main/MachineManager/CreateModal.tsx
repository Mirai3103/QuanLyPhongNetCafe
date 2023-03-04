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
} from "@chakra-ui/react";
import { GroupBase, Select, SelectInstance } from "chakra-react-select";
import { ipcRenderer } from "electron";
import React from "react";

interface IProps {
    isOpen: boolean;
    onSuscess?: () => void;
    setOpened: (isOpen: boolean) => void;
}

export default function CreateModal({ isOpen, onSuscess, setOpened }: IProps) {
    const nameRef = React.useRef<HTMLInputElement>(null);
    const priceRef = React.useRef<HTMLInputElement>(null);
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
    const handleCreate = () => {
        const name = nameRef.current?.value;
        const price = Number(priceRef.current?.value);
        const type = typeRef.current?.getValue()[0].value;
        ipcRenderer.invoke("machine:createNew", { name, price, type }).then((m) => {
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
                            <Input ref={nameRef} placeholder="Tên máy" />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Loại máy</FormLabel>
                            <Select defaultValue={typeOptions[1]} options={typeOptions} ref={typeRef} />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Giá máy (/1 giờ)</FormLabel>
                            <Input type={"number"} placeholder="Giá máy" ref={priceRef} />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant={"outline"} mr={3} colorScheme="red" onClick={setOpened.bind(null, false)}>
                            Huỷ
                        </Button>
                        <Button colorScheme="blue" onClick={handleCreate}>
                            Tạo mới
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
