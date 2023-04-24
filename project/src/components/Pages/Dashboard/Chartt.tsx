import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function Chart(props) {
    const options: any = {
        responsive: true,
        barThickness: 10,
        barPercentage: 0.1,
        scales: {
            xAxes: [{
                gridLines: {
                    borderDash: [8, 4],
                    color: "#ffffff"
                }
            }],
            yAxes: [{
                gridLines: {
                    borderDash: [8, 4],
                    color: "#348632"
                }
            }]
        }
        ,
        plugins: {
            // legend: {
            //     position: "top",
            // },
            title: {
                display: true,
            },
        },
    };

      const labels = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
      ];

    // const option: any = {
    //     scales: {
    //         xAxes: [{
    //             gridLines: {
    //                 borderDash: [8, 4],
    //                 color: "#348632",
    //                 display: false
    //             }
    //         }],
    //         yAxes: [{
    //             gridLines: {
    //                 borderDash: [8, 4],
    //                 color: "black",

    //             }
    //         }]
    //     }
    // }

    const data = {
        labels: props.labels,
        datasets: [
            {
                label: "customer",
                data: props.data1,
                backgroundColor: "#FFCD2C",
                borderWidth: 2,
                borderRadius: Number.MAX_VALUE,
                borderDash: [10, 5]
            },
            {
                label: "leads",
                data: props.data2,
                backgroundColor: "#FFFFFF",
                borderWidth: 2,
                borderRadius: Number.MAX_VALUE,
            },
        ],
    };
    return (
        <>
            <div style={{ width: "1200px", margin: "auto auto" }}>
                <Bar options={options} data={data} />
            </div>
        </>
    );
}

export default Chart;