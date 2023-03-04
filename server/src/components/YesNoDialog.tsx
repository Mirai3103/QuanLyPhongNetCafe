import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogCloseButton,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    useDisclosure,
} from "@chakra-ui/react";
import React from "react";

interface IProps {
    onConfirm: () => void;
    title: string;
    content: string;
    onCanceled?: () => void;
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
}

export default function YesNoDialog({ onConfirm, title, content, onCanceled, isOpen, setOpen }: IProps) {
    const cancelRef = React.useRef();
    const handleYes = () => {
        setOpen(false);
        onConfirm();
    };
    return (
        <AlertDialog
            motionPreset="slideInBottom"
            onClose={setOpen.bind(null, false)}
            isOpen={isOpen}
            isCentered
            leastDestructiveRef={cancelRef as any}
        >
            <AlertDialogOverlay />

            <AlertDialogContent>
                <AlertDialogHeader>{title}</AlertDialogHeader>
                <AlertDialogCloseButton />
                <AlertDialogBody>{content}</AlertDialogBody>
                <AlertDialogFooter>
                    <Button
                        ref={cancelRef as any}
                        onClick={() => {
                            setOpen(false);
                            onCanceled?.();
                        }}
                        variant="outline"
                    >
                        Không
                    </Button>
                    <Button colorScheme="red" ml={3} onClick={handleYes}>
                        Có
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
