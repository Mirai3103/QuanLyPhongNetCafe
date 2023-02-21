import { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";

interface IProps {}
const series = [
    {
        name: "Desktops",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
    },
];

const options: ApexOptions = {
    chart: {
        height: 350,
        type: "line",
        zoom: {
            enabled: false,
        },
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        curve: "straight",
    },
    title: {
        text: "Lợi nhuận theo tháng",
        align: "left",
    },
    grid: {
        row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
        },
    },
    xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    },
};

const statePie = {
    series: [44, 55, 13, 43],
};
const optionsPie: ApexOptions = {
    chart: {
        width: 380,
        type: "pie",
    },
    labels: ["Máy Trung", "Máy thường", "Máy Cao Cấp", "Máy thi dấu"],
    responsive: [
        {
            breakpoint: 480,
            options: {
                chart: {
                    width: 200,
                },
                legend: {
                    position: "bottom",
                },
            },
        },
    ],
};

const stateBar = {
    series: [
        {
            data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380],
        },
    ],
    options: {
        chart: {
            type: "bar",
            height: 350,
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: true,
            },
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories: [
                "South Korea",
                "Canada",
                "United Kingdom",
                "Netherlands",
                "Italy",
                "France",
                "Japan",
                "United States",
                "China",
                "Germany",
            ],
        },
    },
};
export default function Main({}: IProps) {
    return (
        <div className="w-full h-full flex flex-col gap-y-3">
            <div className="bg-white shadow-md rounded-lg border p-3">
                <ReactApexChart options={options} series={series} type="line" height={350} />
            </div>
            <div className="flex">
                <div className="bg-white shadow-md rounded-lg border p-3 ">
                    <ReactApexChart options={optionsPie} series={statePie.series} type="pie" width={400} />
                </div>
                {/* <div className="bg-white shadow-md rounded-lg border p-3  w-full">
                    <ReactApexChart
                        options={stateBar.options as any}
                        series={stateBar.series}
                        type="bar"
                        height={350}
                    />
                </div> */}
            </div>
        </div>
    );
}
