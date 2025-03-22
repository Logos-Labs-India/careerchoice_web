import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface CareerMatch {
  title: string;
  description: string;
  matchPercentage: number;
  traits: string[];
}

interface CareerMatchesProps {
  data?: CareerMatch[];
  isLoading?: boolean;
  limit?: number;
  showViewAll?: boolean;
}

export function CareerMatches({ 
  data, 
  isLoading = false,
  limit = 4,
  showViewAll = true
}: CareerMatchesProps) {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Your Top Career Matches</CardTitle>
          <CardDescription>Loading your career matches...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Your Top Career Matches</CardTitle>
          <CardDescription>No career matches available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Complete all three assessments to get career recommendations.</p>
        </CardContent>
      </Card>
    );
  }

  const displayedCareers = limit ? data.slice(0, limit) : data;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Top Career Matches</CardTitle>
        <CardDescription>Based on your combined assessment results, these careers align well with your profile</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedCareers.map((career, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-primary"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-lg mb-2">{career.title}</h4>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                  {career.matchPercentage}% Match
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{career.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {career.traits.map((trait, i) => (
                  <span key={i} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                    {trait}
                  </span>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="text-primary hover:text-blue-700 p-0 h-auto">
                <span className="flex items-center">
                  Learn more
                  <ChevronRight className="h-4 w-4 ml-1" />
                </span>
              </Button>
            </div>
          ))}
        </div>
        
        {showViewAll && data.length > limit && (
          <div className="mt-8 text-center">
            <Button>
              View All {data.length} Career Matches
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CareerMatches;
