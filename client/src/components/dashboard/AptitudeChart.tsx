import { Chart } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { AptitudeResult } from "@shared/schema";

interface AptitudeChartProps {
  data?: AptitudeResult;
  isLoading?: boolean;
  showExplanations?: boolean;
}

const explanations = {
  numerical: "Ability to work with numbers and mathematical concepts",
  verbal: "Ability in comprehension and language skills",
  spatial: "Ability in visualization and spatial orientation",
  logical: "Ability in problem-solving and logical analysis",
  mechanical: "Understanding of mechanical principles and systems",
};

const getRatingText = (value: number): string => {
  if (value >= 85) return "Excellent";
  if (value >= 70) return "Above Average";
  if (value >= 50) return "Good";
  if (value >= 30) return "Average";
  return "Developing";
};

export function AptitudeChart({ 
  data, 
  isLoading = false,
  showExplanations = true 
}: AptitudeChartProps) {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Aptitude Assessment</CardTitle>
          <CardDescription>Loading your cognitive abilities profile...</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Aptitude Assessment</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Complete your aptitude assessment to see your results.</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = {
    labels: ['Numerical', 'Verbal', 'Spatial', 'Logical', 'Mechanical'],
    datasets: [
      {
        label: 'Your Aptitude Profile',
        data: [data.numerical, data.verbal, data.spatial, data.logical, data.mechanical],
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value: number) => `${value}%`
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Aptitude Assessment</CardTitle>
        <CardDescription>Aptitude assessments measure your natural abilities across different cognitive domains</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2">
            {showExplanations && (
              <div className="space-y-6 mb-8">
                {Object.entries(data).slice(2, 7).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium capitalize">{key} Reasoning</span>
                      <span className="text-gray-500">{value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-green-500 h-3 rounded-full" 
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {getRatingText(value)} - {explanations[key as keyof typeof explanations]}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="lg:w-1/2 flex items-center justify-center">
            <div className="w-full max-w-md">
              <Chart 
                type="bar" 
                data={chartData}
                options={chartOptions}
                height={300}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AptitudeChart;
