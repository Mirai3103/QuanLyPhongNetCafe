import { Grid, Flex, GridItem, Input, styled, InputProps } from "@chakra-ui/react";
import { useAppSelector } from "../../redux/hooks";
import { selectUser } from "../../redux/userSplice";
import { toTimeString, toMoneyString } from "../../../../server/src/utils/helper";

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
    const state = useAppSelector(selectUser);
    return (
        <Grid bg="white" m="4" p={"4"} shadow="lg" borderRadius="md" templateColumns="repeat(5, 1fr)" gap={2}>
            <StyledGridItem colSpan={3}>Tổng thời gian:</StyledGridItem>
            <StyledGridItem colSpan={2}>
                <CustomedInput size={"sm"} value={toTimeString(state.totalTime)} />
            </StyledGridItem>
            <StyledGridItem colSpan={3}> Thời gian sử dụng:</StyledGridItem>
            <StyledGridItem colSpan={2}>
                <CustomedInput size={"sm"} value={toTimeString(state.usedTime)} />
            </StyledGridItem>
            <StyledGridItem colSpan={3}> Thời gian còn lại:</StyledGridItem>
            <StyledGridItem colSpan={2}>
                <CustomedInput size={"sm"} value={toTimeString(state.remainingTime)} />
            </StyledGridItem>
            <StyledGridItem colSpan={3}> Tổng chi phí:</StyledGridItem>
            <StyledGridItem colSpan={2}>
                <CustomedInput size={"sm"} value={toMoneyString(state.usedCost + state.serviceCost)} />
            </StyledGridItem>
            <StyledGridItem colSpan={3}> Chi phí dịch vụ:</StyledGridItem>
            <StyledGridItem colSpan={2}>
                <CustomedInput size={"sm"} value={toMoneyString(state.serviceCost)} />
            </StyledGridItem>
            <StyledGridItem colSpan={3}> Số dư tài khoản:</StyledGridItem>
            <StyledGridItem colSpan={2}>
                <CustomedInput size={"sm"} value={toMoneyString(state.balance)} />
            </StyledGridItem>
        </Grid>
    );
}
