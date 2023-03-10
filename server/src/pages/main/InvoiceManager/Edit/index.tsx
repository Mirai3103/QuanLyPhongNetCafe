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
                title: "S??? l?????ng s???n ph???m kh??ng ?????",
            });
            return;
        }
        if (detail.quantity < 0) {
            toast({
                colorScheme: "red",
                title: "S??? l?????ng s???n ph???m kh??ng h???p l???",
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
                title: "S??? l?????ng s???n ph???m kh??ng h???p l???",
            });
        if (quantity > item!.product!.stock && item!.product!.stock !== -1)
            return toast({
                colorScheme: "red",
                title: "S??? l?????ng s???n ph???m kh??ng ?????",
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
                    <Flex fontSize={"2xl"}>{type === "edit" ? `S???a ho?? ????n` : `T???o ho?? ????n`}</Flex>
                </Flex>
                <Button colorScheme={"green"} size="md" px={"12"} onClick={onSave}>
                    {type === "edit" ? `L??u` : `T???o ho?? ????n`}
                </Button>
            </div>

            <Flex bg={"white"} mx="2" p={"6"} mt="10" rounded={"xl"} shadow="xl">
                <Flex direction={"column"} rowGap={"20px"} w={"100%"}>
                    <Flex direction={"row"} columnGap={"5px"}>
                        <Flex direction={"column"} columnGap={"5px"} w={"50%"}>
                            <Text fontSize={"lg"} fontWeight={"semibold"}>
                                Ng?????i l???p
                            </Text>
                            <Text ml={"6"}>T??n nh??n vi??n: Ng?? H???u Ho??ng</Text>
                            <Text ml={"6"}>M?? nh??n vi??n: 123456</Text>
                        </Flex>
                    </Flex>
                    <Flex direction={"row"} columnGap={"5px"}>
                        <FormControl justifyItems={"center"} justifyContent={"center"} w="33%">
                            <FormLabel>Lo???i ho?? ????n</FormLabel>
                            <Select
                                placeholder="Ch???n lo???i s???n ph???m"
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
                            <FormLabel>M?? ho?? ????n</FormLabel>
                            <Input placeholder="M?? ho?? ????n" readOnly />
                        </FormControl>
                        <FormControl justifyItems={"center"} justifyContent={"center"} w="33%">
                            <FormLabel>Tr???ng th??i thanh to??n</FormLabel>
                            <Select
                                placeholder="Ch???n lo???i s???n ph???m"
                                options={paidStatus}
                                onChange={(e) => {
                                    setSelectedPaid(e!.value);
                                }}
                                required
                                value={paidStatus.find((item) => item.value === selectedPaid)}
                            />
                        </FormControl>
                        <FormControl justifyItems={"center"} justifyContent={"center"} w="33%">
                            <FormLabel>Ng??y l???p</FormLabel>
                            <Input
                                placeholder="Ng??y l???p"
                                type={"datetime-local"}
                                value={new Date().toISOString().slice(0, 16)}
                                readOnly
                            />
                        </FormControl>
                    </Flex>
                    {selectedInvoiceType === BillType.Export && (
                        <Flex direction={"row"} columnGap={"5px"}>
                            <FormControl justifyItems={"center"} justifyContent={"center"} w="33%">
                                <FormLabel>T??i kho???n kh??ch h??ng</FormLabel>
                                <Select
                                    placeholder="tr???ng"
                                    options={accounts}
                                    onChange={(e) => {
                                        setSelectedAccount(e!.value);
                                    }}
                                    required
                                    value={accounts.find((item) => item.value === selectedAccount)}
                                />
                            </FormControl>
                            <FormControl justifyItems={"center"} justifyContent={"center"} w="33%">
                                <FormLabel>M??y </FormLabel>
                                <Select
                                    placeholder="tr???ng"
                                    options={machineList}
                                    onChange={(e) => {
                                        setSelectedMachine(e!.value);
                                    }}
                                    required
                                    value={machineList.find((item) => item.value === selectedMachine)}
                                />
                            </FormControl>
                            <FormControl justifyItems={"center"} justifyContent={"center"} w="33%">
                                <FormLabel>T??nh tr???ng s??? l?? giao d???ch</FormLabel>
                                <Select
                                    placeholder="Ch???n t??nh tr???ng"
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
                            Chi ti???t ho?? ????n:
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
    { label: "???? thanh to??n", value: true },
    { label: "Ch??a thanh to??n", value: false },
];
enum BillType {
    Import = "Ho?? ????n nh???p",
    Export = "Ho?? ????n b??n",
}
const invoiceType = [
    { label: BillType.Import, value: BillType.Import },
    { label: BillType.Export, value: BillType.Export },
];

enum BillStatus {
    Accepted = "Ch???p nh???n",
    Pending = "??ang ch???",
    Rejected = "T??? ch???i",
}
const billStatus = [
    { label: BillStatus.Accepted, value: BillStatus.Accepted },
    { label: BillStatus.Pending, value: BillStatus.Pending },
    { label: BillStatus.Rejected, value: BillStatus.Rejected },
];
