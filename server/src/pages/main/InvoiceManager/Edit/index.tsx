import { useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/userSplice";
import { AccountEvents } from "@/services/type";
import { Button, Flex, Text, Icon, FormControl, FormLabel, Input, Box, useToast } from "@chakra-ui/react";
import { IAccount } from "@server/models/Account";
import { IBill } from "@server/models/Bill";
import { IBillDetail } from "@server/models/BillDetail";
import { IMachine } from "@server/models/Machine";
import { Select } from "chakra-react-select";
import { ipcRenderer } from "electron";
import React from "react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import AddDetail from "./AddDetail";
interface Iprops {
    type: "create" | "edit";
}

export default function InvoiceEdit({ type }: Iprops) {
    const navigate = useNavigate();
    const user = useAppSelector(selectUser);
    const params = useParams();
    const [selectedPaid, setSelectedPaid] = React.useState<any>(paidStatus[1].value);
    const [selectedInvoiceType, setSelectedInvoiceType] = React.useState<any>(invoiceType[0].value);
    const [selectedStatus, setSelectedStatus] = React.useState<any>(billStatus[0].value);
    const [accounts, setAccounts] = React.useState<
        {
            value: string;
            label: string;
        }[]
    >([]);
    const [machineList, setMachineList] = React.useState<
        {
            value: string;
            label: string;
        }[]
    >([]);
    const [selectedAccount, setSelectedAccount] = React.useState<any>();
    const [selectedMachine, setSelectedMachine] = React.useState<any>();
    const [billDetails, setBillDetails] = React.useState<IBillDetail[]>([]);
    const [bill, setBill] = React.useState<IBill | undefined>();
    React.useEffect(() => {
        if (type === "edit") {
            ipcRenderer.invoke("BILL:getById", { id: Number(params.id) }).then((data: IBill) => {
                setBill(data);
                setSelectedPaid(data.isPaid);
                setSelectedInvoiceType(data.type);
                setSelectedStatus(data.status);
                setSelectedAccount(data.account?.id);
                setSelectedMachine(data.machine?.id);
                setBillDetails(data.billDetails);
            });
        }
    }, []);

    const toast = useToast();
    const onAddDetail = (detail: IBillDetail) => {
        //check if product is already in list
        let item = billDetails.find((item) => item.productId === detail.productId);
        const newBillDetails = billDetails.filter((item) => item.productId !== detail.productId);
        if (item) {
            detail.quantity += item.quantity;
        }
        if (detail.quantity === 0) {
            return setBillDetails(newBillDetails);
        }
        if (detail.quantity > detail.product!.stock && detail.product!.stock !== -1) {
            toast({
                colorScheme: "red",
                title: "Số lượng sản phẩm không đủ",
            });
            return;
        }
        if (detail.quantity < 0) {
            toast({
                colorScheme: "red",
                title: "Số lượng sản phẩm không hợp lệ",
            });
            return;
        }
        // push first
        setBillDetails([detail, ...newBillDetails]);
    };
    const onChangeQuantity = (productId: number, quantity: number) => {
        let item = billDetails.find((item) => item.productId === productId);

        if (quantity < 0)
            return toast({
                colorScheme: "red",
                title: "Số lượng sản phẩm không hợp lệ",
            });
        if (quantity > item!.product!.stock && item!.product!.stock !== -1)
            return toast({
                colorScheme: "red",
                title: "Số lượng sản phẩm không đủ",
            });

        if (item) {
            item.quantity = quantity;
        }
        setBillDetails([...billDetails]);
    };
    const onRemoveDetail = (productId: number) => {
        setBillDetails(billDetails.filter((item) => item.productId !== productId));
    };
    const onSave = () => {
        const newbill = bill
            ? bill
            : {
                  isPaid: selectedPaid,
                  accountId: selectedAccount,
                  machineId: selectedMachine,
                  createdBy: user!.id,
                  status: selectedStatus,
                  type: selectedInvoiceType,
                  total: billDetails.reduce((acc, item) => acc + item.quantity * item.product!.price, 0),
              };
        ipcRenderer
            .invoke("BILL:create", {
                newbill,
                billDetails,
            })
            .then((data: IBill) => {
                if (data) {
                    navigate(-1);
                }
            });
    };

    React.useEffect(() => {
        ipcRenderer.invoke(AccountEvents.GET_ALL).then((data) => {
            data = data.filter((item: IAccount) => item.role === "user");
            setAccounts(
                data.map((item: IAccount) => {
                    return {
                        value: item.id,
                        label: item.username,
                    };
                })
            );
        });
        ipcRenderer.invoke("machine:getAll").then((m) => {
            setMachineList(
                m.map((item: IMachine) => {
                    return {
                        value: item.id,
                        label: item.name,
                    };
                })
            );
        });
    }, []);
    // get id from params
    const id = useParams().id;
    if (!id && type === "edit") {
        navigate("/main/invoice-manager");
        return null;
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between">
                <Flex columnGap={"5px"} alignItems="center">
                    <div className="text-3xl cursor-pointer hover:text-blue-500 hover:bg-slate-100 mx-4 px-4 py-2 rounded-md">
                        <MdArrowBack onClick={() => navigate(-1)} />
                    </div>
                    <Flex fontSize={"2xl"}>{type === "edit" ? `Sửa hoá đơn` : `Tạo hoá đơn`}</Flex>
                </Flex>
                <Button colorScheme={"green"} size="md" px={"12"} onClick={onSave}>
                    {type === "edit" ? `Lưu` : `Tạo hoá đơn`}
                </Button>
            </div>

            <Flex bg={"white"} mx="2" p={"6"} mt="10" rounded={"xl"} shadow="xl">
                <Flex direction={"column"} rowGap={"20px"} w={"100%"}>
                    <Flex direction={"row"} columnGap={"5px"}>
                        <Flex direction={"column"} columnGap={"5px"} w={"50%"}>
                            <Text fontSize={"lg"} fontWeight={"semibold"}>
                                Người lập
                            </Text>
                            <Text ml={"6"}>Tên nhân viên: Ngô Hữu Hoàng</Text>
                            <Text ml={"6"}>Mã nhân viên: 123456</Text>
                        </Flex>
                    </Flex>
                    <Flex direction={"row"} columnGap={"5px"}>
                        <FormControl justifyItems={"center"} justifyContent={"center"} w="33%">
                            <FormLabel>Loại hoá đơn</FormLabel>
                            <Select
                                placeholder="Chọn loại sản phẩm"
                                options={invoiceType}
                                onChange={(e) => {
                                    setSelectedInvoiceType(e!.value);
                                }}
                                required
                                value={invoiceType.find((item) => item.value === selectedInvoiceType)}
                                isReadOnly={type === "edit"}
                            />
                        </FormControl>
                    </Flex>
                    <Flex direction={"row"} columnGap={"5px"}>
                        <FormControl justifyItems={"center"} justifyContent={"center"} w="33%">
                            <FormLabel>Mã hoá đơn</FormLabel>
                            <Input placeholder="Mã hoá đơn" readOnly />
                        </FormControl>
                        <FormControl justifyItems={"center"} justifyContent={"center"} w="33%">
                            <FormLabel>Trạng thái thanh toán</FormLabel>
                            <Select
                                placeholder="Chọn loại sản phẩm"
                                options={paidStatus}
                                onChange={(e) => {
                                    setSelectedPaid(e!.value);
                                }}
                                required
                                value={paidStatus.find((item) => item.value === selectedPaid)}
                            />
                        </FormControl>
                        <FormControl justifyItems={"center"} justifyContent={"center"} w="33%">
                            <FormLabel>Ngày lập</FormLabel>
                            <Input
                                placeholder="Ngày lập"
                                type={"datetime-local"}
                                value={new Date().toISOString().slice(0, 16)}
                                readOnly
                            />
                        </FormControl>
                    </Flex>
                    {selectedInvoiceType === BillType.Export && (
                        <Flex direction={"row"} columnGap={"5px"}>
                            <FormControl justifyItems={"center"} justifyContent={"center"} w="33%">
                                <FormLabel>Tài khoản khách hàng</FormLabel>
                                <Select
                                    placeholder="trống"
                                    options={accounts}
                                    onChange={(e) => {
                                        setSelectedAccount(e!.value);
                                    }}
                                    required
                                    value={accounts.find((item) => item.value === selectedAccount)}
                                />
                            </FormControl>
                            <FormControl justifyItems={"center"} justifyContent={"center"} w="33%">
                                <FormLabel>Máy </FormLabel>
                                <Select
                                    placeholder="trống"
                                    options={machineList}
                                    onChange={(e) => {
                                        setSelectedMachine(e!.value);
                                    }}
                                    required
                                    value={machineList.find((item) => item.value === selectedMachine)}
                                />
                            </FormControl>
                            <FormControl justifyItems={"center"} justifyContent={"center"} w="33%">
                                <FormLabel>Tình trạng sử lý giao dịch</FormLabel>
                                <Select
                                    placeholder="Chọn tình trạng"
                                    options={billStatus}
                                    onChange={(e) => {
                                        setSelectedStatus(e!.value);
                                    }}
                                    required
                                    value={billStatus.find((item) => item.value === selectedStatus)}
                                />
                            </FormControl>
                        </Flex>
                    )}
                    <Box>
                        <Text fontSize={"lg"} fontWeight={"bold"}>
                            Chi tiết hoá đơn:
                        </Text>
                    </Box>
                    <AddDetail
                        billDetail={billDetails}
                        onAdd={onAddDetail}
                        onChangeQuantity={onChangeQuantity}
                        onRemove={onRemoveDetail}
                    />
                </Flex>
            </Flex>
        </div>
    );
}

const paidStatus = [
    { label: "Đã thanh toán", value: true },
    { label: "Chưa thanh toán", value: false },
];
enum BillType {
    Import = "Hoá đơn nhập",
    Export = "Hoá đơn bán",
}
const invoiceType = [
    { label: BillType.Import, value: BillType.Import },
    { label: BillType.Export, value: BillType.Export },
];

enum BillStatus {
    Accepted = "Chấp nhận",
    Pending = "Đang chờ",
    Rejected = "Từ chối",
}
const billStatus = [
    { label: BillStatus.Accepted, value: BillStatus.Accepted },
    { label: BillStatus.Pending, value: BillStatus.Pending },
    { label: BillStatus.Rejected, value: BillStatus.Rejected },
];
