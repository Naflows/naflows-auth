import { useEffect, useRef, useState } from "react";
import type { ServicesForUserProps } from "../../../../../../../../../types/ServicesForUserProps";
import type { ServiceTraffic } from "../../../../../../../../../types/TrafficTypes";
import axios from "axios";
import { Chart } from "chart.js/auto";


const TrafficOverview = ({
    service,
}: {
    service: ServicesForUserProps | null;
}) => {


    const [traffic, setTraffic] = useState<ServiceTraffic | null>(null);
    const [isServiceOverwhelmed, setIsServiceOverwhelmed] = useState<"normal" | "warning" | "shutdown">("normal");
    const [updateTraffic, setUpdateTraffic] = useState<boolean>(true);

    useEffect(() => {
        if (updateTraffic) {
            const fetchData = async () => {
                const response = await axios.post(`${process.env.DUMMY_API_URL_DEV}/user/secure/service/traffic`, {
                    service_id: service?.id
                }, {
                    withCredentials: true
                });
                const trafficData = response.data.traffic.data as ServiceTraffic;
                console.log("Fetched traffic data:", trafficData);
                setTraffic(trafficData);
                setUpdateTraffic(false);
                // Use chartjs to render traffic data on canvas with id "trafficChart"
            };
            fetchData();
        }
    }, [updateTraffic])

    const chartRef = useRef<Chart | null>(null);

    useEffect(() => {
        if (!service || !traffic) return;

        // Calculate requests per second (RPS) over the last minute
        const oneMinuteAgo = Date.now() - 60000;
        const recentRequests = traffic.requests.filter(req => req.timestamp >= oneMinuteAgo);
        const rps = recentRequests.length / 60; // requests per second
        console.log(`Current RPS: ${rps}, Service RPS Limit: ${service.settings?.rates}`);

        const maxRPS = service.settings?.rates * 2 || 100;

        if (rps > maxRPS) {
            setIsServiceOverwhelmed("shutdown");
        } else if (rps > (service.settings?.rates || 100)) {
            setIsServiceOverwhelmed("warning");
        } else {
            setIsServiceOverwhelmed("normal");
        }
    }, [traffic, service])

    useEffect(() => {
        if (!traffic?.requests?.length) return;

        const canvas = document.getElementById("trafficChart") as HTMLCanvasElement;
        if (!canvas) return;

        // Process both types
        const types: ("USER" | "DEVELOPER")[] = ["USER", "DEVELOPER"];
        const datasets = types.map((type) => {
            // Filter and sort requests by type
            const sortedRequests = traffic.requests
                .filter(req => req.type === type)
                .sort((a, b) => a.timestamp - b.timestamp);

            // Calculate RPS by binning into 1-minute intervals
            const rpsMap = new Map<number, number>();

            sortedRequests.forEach(req => {
                const minuteBin = Math.floor(req.timestamp / 60000) * 60000;
                rpsMap.set(minuteBin, (rpsMap.get(minuteBin) || 0) + 1);
            });


            return { type, rpsMap };
        });

        // Get all unique time bins
        const allBins = new Set<number>();
        datasets.forEach(({ rpsMap }) => {
            rpsMap.forEach((_, bin) => allBins.add(bin));
        });

        const sortedBins = Array.from(allBins).sort((a, b) => a - b);
        const labels = sortedBins.map(bin => new Date(bin));

        // Create datasets with data for each bin
        const chartDatasets = datasets.map(({ type, rpsMap }) => {
            const colors = {
                USER: { border: "rgba(75, 192, 192, 1)", bg: "rgba(75, 192, 192, 0.1)" },
                DEVELOPER: { border: "rgba(153, 102, 255, 1)", bg: "rgba(153, 102, 255, 0.1)" }
            };
            const color = colors[type];

            return {
                label: `${type} - RPS`,
                data: sortedBins.map(bin => (rpsMap.get(bin) || 0)),
                borderColor: color.border,
                backgroundColor: color.bg,
                borderWidth: 2,
                tension: 0.1,
                fill: false,
                pointRadius: 4,
                pointBackgroundColor: color.border,
                pointBorderColor: "#fff",
                pointBorderWidth: 1,
            };
        });

        // Destroy existing chart
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const roundedMaxRPS = (service?.settings?.rates || 100) * 1.5;
        const maxRPS = Math.max(...chartDatasets.flatMap(ds => ds.data as number[]));
        const min = roundedMaxRPS;


        chartRef.current = new Chart(ctx, {
            type: "line",
            data: {
                labels,
                datasets: [
                    // ensure each dataset from chartDatasets fills the area under the line
                    ...chartDatasets.map(ds => ({ ...ds, fill: true })),
                    {
                        label: `RPS Limit (${service?.settings?.rates || 100})`,
                        data: labels.map(() => (service?.settings?.rates || 100)),
                        borderColor: "rgba(255, 99, 132, 0.6)",
                        backgroundColor: "rgba(255, 99, 132, 0.12)",
                        borderWidth: 2,
                        tension: 0.1,
                        fill: false,
                        pointRadius: 0,
                        borderDash: [6, 4],
                    }
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: "top",
                    },
                    title: {
                        display: true,
                        text: "Traffic Performance - Requests Per Second",
                    },
                },
                scales: {
                    x: {
                        type: "time",
                        time: {
                            unit: "minute",
                            displayFormats: {
                                minute: "HH:mm",
                            },
                        },
                        title: {
                            display: true,
                            text: "Time",
                        },
                    },
                    y: {
                        beginAtZero: true,
                        max: (min || 1), // Set max to double the RPS limit
                        title: {
                            display: true,
                            text: "RPS",
                        },
                    },
                },
            },
        });


        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [traffic, updateTraffic]);

    useEffect(() => {
        const interval = window.setInterval(() => {
            setUpdateTraffic(true);
        }, 1000); // Update every 1 second

        return () => {
            window.clearInterval(interval);
        };
    }, []);

    return (
        <div className="traffic-overview">
            <div className="service__actions__field__header">
                <h3 className="service__actions__field__title">Traffic</h3>
                <p className="service__actions__field__description">Monitor the network traffic of your service to ensure optimal performance and security.</p>
            </div>
            <div className="network__traffic__placeholder">

                <div className={`network__information__container`}>
                    <div className={`network__information ${isServiceOverwhelmed}`}>
                        {isServiceOverwhelmed === "warning" ? (
                            <p className="warning__text">Your service is overwhelmed due to high traffic. Naflows is automatically scaling your service to handle the increased load.</p>
                        ) : isServiceOverwhelmed === "normal" ? (
                            <p className="normal__text">Your service is operating within normal traffic limits.</p>
                        ) : (
                            <p className="shutdown__text">Naflows is shutting down your service due to excessive traffic. Please try again later.</p>
                        )}
                    </div>
                    <canvas id="trafficChart"></canvas>

                </div>


                <div className="traffic__chart__details">
                    <p className="footer__informations">
                        The traffic chart displays the number of requests per second (RPS) made to your service over time, categorized by user type. Monitoring this data helps you understand usage patterns and ensure your service operates within its allocated limits. If you notice spikes or unusual activity, consider reviewing your service's configuration or scaling options.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default TrafficOverview;