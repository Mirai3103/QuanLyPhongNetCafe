import {
    Button,
    FormControl,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spacer,
    Text,
} from "@chakra-ui/react";
import React from "react";
interface InputDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    title: string;
    content: string;
    submitText?: string;
    cancelText?: string;
    onConfirm?: (value: string) => void;
    onCancel?: () => void;
    inputType?: "text" | "number" | "password" | "email";
}

export default function InputDialog({
    open,
    setOpen,
    submitText,
    cancelText,
    title,
    content,
    onConfirm,
    onCancel,
    inputType,
}: InputDialogProps) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const handleSubmit = () => {
        onConfirm && onConfirm(inputRef.current?.value || "");
        setOpen(false);
    };
    const handleCancel = () => {
        onCancel && onCancel();
        setOpen(false);
    };
    return (
        <Modal blockScrollOnMount={false} isOpen={open} onClose={handleCancel}>
            <ModalOverlay />
            <ModalContent mt={"40"}>
                <ModalHeader> {title} </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text fontWeight="bold" mb="1rem">
                        {content}
                    </Text>
                    <FormControl>
                        <Input ref={inputRef} w="100%" type={inputType || "text"} />
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button variant="outline" colorScheme={"red"} onClick={handleCancel}>
                        {cancelText || "Cancel"}
                    </Button>
                    <Button colorScheme="green" ml={3} onClick={handleSubmit}>
                        {submitText || "Submit"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
