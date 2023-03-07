import { Button, Flex, Text, Icon } from "@chakra-ui/react";
import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
interface Iprops {
    type: "create" | "edit";
}

export default function InvoiceEdit({ type }: Iprops) {
    const navigate = useNavigate();
    return <div>d</div>;
}
