import { Chart } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { RiasecResult } from "@shared/schema";

interface RiasecChartProps {
  data?: RiasecResult;
  isLoading?: boolean;
  showExplanations?: boolean;
}

const explanations = {
  realistic: "Preference for working with objects, machines, tools, plants, or animals",
  investigative: "Preference for working with ideas and thinking",
  artistic: "Preference for working in unstructured situations using creativity",
  social: "Preference for working with and helping people",
  enterprising: "Preference for working with people and data to lead and persuade",
  conventional: "Preference for working with data, following procedures, and maintaining order",
};

export function RiasecChart({ 
  data, 
  isLoading = false,
  showExplanations = true 
}: RiasecChartProps) {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>RIASEC Profile</CardTitle>
          <CardDescription>Loading your interest profile...</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <Skeleton className="h-[300px] w-[300px] rounded-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>RIASEC Profile</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Complete your RIASEC assessment to see your results.</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = {
    labels: [
      'Realistic',
      'Investigative',
      'Artistic',
      'Social',
      'Enterprising',
      'Conventional'
    ],
    datasets: [
      {
        label: 'Your RIASEC Profile',
        data: [
          data.realistic,
          data.investigative,
          data.artistic,
          data.social,
          data.enterprising,
          data.conventional
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointRadius: 4
      }
    ]
  };

  const chartOptions = {
    scales: {
      r: {
        angleLines: {
          display: true
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 20
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
        <CardTitle>RIASEC Profile</CardTitle>
        <CardDescription>The Holland Code assessment measures your interests across six domains to identify career preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2">
            {showExplanations && (
              <div className="space-y-4 mb-8">
                {Object.entries(data).slice(2, 8).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-sm capitalize">{key}</span>
                      <span className="text-sm text-gray-500">{value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {explanations[key as keyof typeof explanations]}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="lg:w-1/2 flex items-center justify-center">
            <div className="w-full max-w-md">
              <Chart 
                type="radar" 
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

export default RiasecChart;
