import React from 'react';
import { Line } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';

interface CustomLineChartProps {
    data: any; 
    options: ChartOptions;
    disableAnnotations?: boolean;
}

const CustomLineChart: React.FC<CustomLineChartProps> = ({
    data,
    options,
    disableAnnotations = false,
}) =>  {
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
