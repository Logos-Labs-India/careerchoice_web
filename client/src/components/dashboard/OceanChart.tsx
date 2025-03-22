import { Chart } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { OceanResult } from "@shared/schema";

interface OceanChartProps {
  data?: OceanResult;
  isLoading?: boolean;
  showExplanations?: boolean;
}

const explanations = {
  openness: "Intellectually curious, creative, and open to new experiences",
  conscientiousness: "Organized, disciplined, and goal-oriented",
  extraversion: "Outgoing, energetic, and social",
  agreeableness: "Cooperative, considerate, and empathetic towards others",
  neuroticism: "Tendency towards negative emotions (lower scores indicate better emotional stability)",
};

export function OceanChart({ 
  data, 
  isLoading = false,
  showExplanations = true 
}: OceanChartProps) {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>OCEAN Personality Profile</CardTitle>
          <CardDescription>Loading your personality profile...</CardDescription>
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
          <CardTitle>OCEAN Personality Profile</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Complete your OCEAN personality assessment to see your results.</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = {
    labels: ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism'],
    datasets: [
      {
        data: [data.openness, data.conscientiousness, data.extraversion, data.agreeableness, data.neuroticism],
        backgroundColor: [
          'rgba(139, 92, 246, 0.7)',
          'rgba(139, 92, 246, 0.6)',
          'rgba(139, 92, 246, 0.5)',
          'rgba(139, 92, 246, 0.4)',
          'rgba(139, 92, 246, 0.3)'
        ],
        borderColor: [
          'rgba(139, 92, 246, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(139, 92, 246, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20
        }
      }
    },
    plugins: {
      legend: {
        position: 'right' as const
      }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>OCEAN Personality Profile</CardTitle>
        <CardDescription>The Big Five personality traits provide insights into your behavioral tendencies and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2">
            {showExplanations && (
              <div className="space-y-6 mb-8">
                {Object.entries(data).slice(2, 7).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium capitalize">{key}</span>
                      <span className="text-gray-500">{value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-purple-500 h-3 rounded-full" 
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
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
                type="polarArea" 
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

export default OceanChart;
