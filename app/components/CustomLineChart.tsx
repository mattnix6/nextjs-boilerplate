import React from 'react';
import { Line } from 'react-chartjs-2';
import { ChartOptions, ChartData } from 'chart.js';

interface CustomLineChartProps {
    data: ChartData<'line'>;
    options: ChartOptions<'line'>;
    disableAnnotations?: boolean;
}

const CustomLineChart: React.FC<CustomLineChartProps> = ({
    data,
    options,
    disableAnnotations = false,
}) =>  {
    const chartOptions: ChartOptions<'line'> = {
        ...options,
        plugins: {
            ...options.plugins,
        },
    };
    
    if (disableAnnotations && chartOptions.plugins?.annotation) {
        delete chartOptions.plugins.annotation;
    }

    return <Line data={data} options={chartOptions} />;
};

export default CustomLineChart;
