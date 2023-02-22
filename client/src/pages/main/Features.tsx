import { Grid, GridItem, styled, Button, Text, GridItemProps } from "@chakra-ui/react";
import React from "react";
//AiFillMessage
import { AiFillMessage, AiOutlineLogout, AiFillLock } from "react-icons/ai";
//IoFastFoodSharp
import { IoFastFoodSharp } from "react-icons/io5";
//BsFillKeyFill
import { BsFillKeyFill } from "react-icons/bs";
//MdDesignServices
import { MdDesignServices } from "react-icons/md";

interface IProps {}

const CustomedGridItem = (props: GridItemProps) => {
    return <GridItem {...props} as={Button} />;
};
const StyledGridItem = styled(CustomedGridItem, {
    baseStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "cyan.600",
        flexDirection: "column",
        height: "100%",
        rowGap: "2",
    },
});
const StyledText = styled(Text, {
    baseStyle: {
        fontWeight: "500",
        fontSize: "sm",
    },
});
export default function Features({}: IProps) {
    return (
        <Grid mx="2" h={"40"} templateColumns="repeat(3, 1fr)" gap={4}>
            <StyledGridItem>
                <AiFillMessage size={40} />
                <StyledText>Tin nhắn</StyledText>
            </StyledGridItem>
            <StyledGridItem>
                <AiOutlineLogout size={40} />
                <StyledText>Đăng xuất</StyledText>
            </StyledGridItem>
            <StyledGridItem>
                <AiFillLock size={40} />
                <StyledText>Đổi mật khẩu</StyledText>
            </StyledGridItem>
            <StyledGridItem>
                <IoFastFoodSharp size={40} />
                <StyledText>Đặt món</StyledText>
            </StyledGridItem>
            <StyledGridItem>
                <BsFillKeyFill size={40} />
                <StyledText>Đổi mã PIN</StyledText>
            </StyledGridItem>
            <StyledGridItem>
                <MdDesignServices size={40} />
                <StyledText>Tiện ích</StyledText>
            </StyledGridItem>
        </Grid>
    );
}
