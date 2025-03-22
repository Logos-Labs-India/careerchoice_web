import React, { useRef, useEffect } from "react";
import { Chart as ChartJS, 
  ChartData, 
  ChartOptions, 
  registerables, 
  Chart as ChartInstance } from 'chart.js';

ChartJS.register(...registerables);

interface ChartProps {
  type: 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'polarArea';
  data: ChartData;
  options?: ChartOptions;
  width?: number;
  height?: number;
  className?: string;
}

export function Chart({ 
  type, 
  data, 
  options, 
  width = 400, 
  height = 400, 
  className 
}: ChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<ChartInstance>();

  useEffect(() => {
    if (!chartRef.current) return;
    
    // If chart exists, destroy it before creating a new one
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Create new chart
    const chart = new ChartJS(chartRef.current, {
      type,
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        ...options
      }
    });
    
    chartInstance.current = chart;
    
    // Cleanup on unmount
    return () => {
      chart.destroy();
    };
  }, [type, data, options]);

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <canvas ref={chartRef} width={width} height={height}></canvas>
    </div>
  );
}
