import { Grid, Flex, GridItem, Input, styled, InputProps } from "@chakra-ui/react";
const StyledGridItem = styled(GridItem, {
    baseStyle: {
        display: "flex",
        alignItems: "center",
        fontWeight: "500",
    },
});

const CustomedInput = (props: InputProps) => {
    return <Input {...props} size="sm" isReadOnly={true} focusBorderColor="gray.200" />;
};
interface IProps {}

export default function SessionInfo({}: IProps) {
    return (
        <Grid bg="white" m="4" p={"4"} shadow="lg" borderRadius="md" templateColumns="repeat(5, 1fr)" gap={2}>
            <StyledGridItem colSpan={3}>Tổng thời gian:</StyledGridItem>
            <StyledGridItem colSpan={2}>
                <CustomedInput size={"sm"} value={"06:02"} />
            </StyledGridItem>
            <StyledGridItem colSpan={3}> Thời gian sử dụng:</StyledGridItem>
            <StyledGridItem colSpan={2}>
                <CustomedInput size={"sm"} value={"00:00"} />
            </StyledGridItem>
            <StyledGridItem colSpan={3}> Thời gian còn lại:</StyledGridItem>
            <StyledGridItem colSpan={2}>
                <CustomedInput size={"sm"} value={"06:02"} />
            </StyledGridItem>
            <StyledGridItem colSpan={3}> Tổng chi phí:</StyledGridItem>
            <StyledGridItem colSpan={2}>
                <CustomedInput size={"sm"} value={"0"} />
            </StyledGridItem>
            <StyledGridItem colSpan={3}> Chi phí dịch vụ:</StyledGridItem>
            <StyledGridItem colSpan={2}>
                <CustomedInput size={"sm"} value={"0"} />
            </StyledGridItem>
            <StyledGridItem colSpan={3}> Số dư tài khoản:</StyledGridItem>
            <StyledGridItem colSpan={2}>
                <CustomedInput size={"sm"} value={"67000"} />
            </StyledGridItem>
        </Grid>
    );
}
