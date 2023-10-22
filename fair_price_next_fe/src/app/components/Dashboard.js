"use client";

import React, { useState, useEffect, useRef } from 'react';
import { eventBus } from './EventBus';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    Tooltip,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
  } from "chart.js";
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components using ChartJS.register
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Tooltip,
  );

function Dashboard() {

    const chartRef = useRef();
    const ref = useRef();

    const [tickerData, setTickerData] = useState('');

    // const data = [
    //     { year: 2010, count: 10 },
    //     { year: 2011, count: 20 },
    //     { year: 2012, count: 15 },
    //     { year: 2013, count: 25 },
    //     { year: 2014, count: 22 },
    //     { year: 2015, count: 30 },
    //     { year: 2016, count: 28 },
    //   ];

    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'First dataset',
            data: [33, 53, 85, 41, 44, 65],
            fill: true,
            backgroundColor: 'rgba(75,192,192,0.2)',
            borderColor: 'rgba(75,192,192,1)'
          },
          {
            label: 'Second dataset',
            data: [33, 25, 35, 51, 54, 76],
            fill: false,
            borderColor: '#742774',
          },
        ],
      };

    useEffect(() => {
        
        const dataHandler = (data) => {
            setTickerData(data);
            console.log('Data received: ', data);
        };
    
        eventBus.on('updateData', dataHandler);
    
        return () => {
          eventBus.off('updateData', dataHandler);
        };
      }, []);

    return (
        <>
            Dashboard
            <p>Ticker Data: {tickerData}</p>


            {/* <div style="width: 500px;"><canvas id="dimensions"></canvas></div><br/> */}
            {/* <div style="width: 800px;"><canvas id="acquisitions"></canvas></div> */}

            {/* {tickerData && <Doughnut data={tickerData} />} */}
            {/* {data && <Doughnut data={data} />} */}

            {/* <Line
                datasetIdKey='id'
                data={{
                    labels: ['Jun', 'Jul', 'Aug'],
                    datasets: [
                    {
                        id: 1,
                        label: '',
                        data: [5, 6, 7],
                    },
                    {
                        id: 2,
                        label: '',
                        data: [3, 2, 1],
                    },
                    ],
                }}
            /> */}


            {/* <Line ref={ref} data={data} /> */}

            {/* <Line
                data={{
                labels: [
                    "2023-01",
                    "2023-02",
                    "2023-03",
                    "2023-04",
                    "2023-05",
                    "2023-06",
                    "2023-07",
                ],
                datasets: [
                    {
                    data: [100, 120, 115, 134, 168, 132, 200],
                    backgroundColor: "purple",
                    },
                ],
                }}
            /> */}

            {tickerData &&
                <Bar
                    data={{
                        labels: [
                            "2023-01",
                            "2023-02",
                            "2023-03",
                            "2023-04",
                            "2023-05",
                            "2023-06",
                            "2023-07",
                        ],
                        datasets: [
                            {
                            data: [100, 120, 115, 134, 168, 132, 200],
                            backgroundColor: "blue",
                            },
                        ],
                    }}
                    // data={{tickerData}}
                />
            }
        </>
    );
}

export default Dashboard;