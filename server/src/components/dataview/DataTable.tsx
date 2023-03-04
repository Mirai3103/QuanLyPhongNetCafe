import React, { ReactNode } from "react";
import { TableProps, TableRowProps, Box, Spinner, Flex } from "@chakra-ui/react";
import {
    Table,
    TableCellProps,
    TableColumnHeaderProps,
    TableContainer,
    TableHeadProps,
    Tbody,
    Td,
    Tfoot,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";

interface IProps extends TableProps {
    dataHeaders: Array<TableColumnHeaderProps>;
    dataRows?: Array<Array<TableCellProps>> | undefined;
    headerProps?: TableHeadProps;
    rowProps?: TableRowProps;
    footer?: ReactNode;
}

export default function DataTable({ dataHeaders, dataRows, headerProps, rowProps, footer, ...rest }: IProps) {
    return (
        <TableContainer>
            <Box overflowY={"auto"} height={"500px"} className="has-scrollbar">
                <Table {...rest} size="sm">
                    <Thead {...headerProps}>
                        <Tr>
                            {dataHeaders.map((header, index) => (
                                <Th key={index} {...header}>
                                    {header.children}
                                </Th>
                            ))}
                        </Tr>
                    </Thead>

                    <Tbody>
                        {dataRows ? (
                            dataRows.map((row, index) => (
                                <Tr key={index} {...rowProps}>
                                    {row.map((cell, index) => (
                                        <Td key={index} {...cell}>
                                            {cell.children}
                                        </Td>
                                    ))}
                                </Tr>
                            ))
                        ) : (
                            <Tr>
                                <Td>
                                    <Spinner
                                        mx={"auto"}
                                        thickness="4px"
                                        speed="0.65s"
                                        emptyColor="gray.200"
                                        color="blue.500"
                                        size="xl"
                                    />
                                </Td>
                            </Tr>
                        )}
                    </Tbody>

                    {footer ? <Tfoot>{footer}</Tfoot> : null}
                </Table>
            </Box>
        </TableContainer>
    );
}
