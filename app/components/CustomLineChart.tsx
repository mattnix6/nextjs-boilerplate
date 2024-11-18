import React from 'react';
import { Line } from 'react-chartjs-2';

const CustomLineChart = ({ data, options, disableAnnotations = false }) => {
    const chartOptions = {
        ...options,
        plugins: {
            ...options?.plugins,
            annotation: disableAnnotations ? false : options?.plugins?.annotation,
        },
    };

    return <Line data={data} options={chartOptions} />;
};

export default CustomLineChart;
