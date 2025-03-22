import { useQuery } from "@tanstack/react-query";
import SectionNav from "@/components/dashboard/SectionNav";
import ProfileSummary from "@/components/dashboard/ProfileSummary";
import AptitudeChart from "@/components/dashboard/AptitudeChart";
import DownloadReport from "@/components/dashboard/DownloadReport";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const AptitudeResults = () => {
  // In a real app, this would be determined by authentication
  // For this demo, we're using a hardcoded demo user ID
  const userId = 1;
  
  const { data: assessmentResults, isLoading: isLoadingAssessment } = useQuery({
    queryKey: [`/api/assessments/${userId}`],
    staleTime: Infinity,
  });
  
  const { data: aptitudeData, isLoading: isLoadingAptitude } = useQuery({
    queryKey: [`/api/assessments/${userId}/aptitude`],
    staleTime: Infinity,
  });
  
  const isLoading = isLoadingAssessment || isLoadingAptitude;

  const aptitudeDescriptions = {
    numerical: {
      title: "Numerical Reasoning",
      description: "The ability to understand, interpret, and work with numerical information. This includes arithmetic, statistical analysis, and mathematical problem-solving.",
      careers: ["Data Scientist", "Financial Analyst", "Economist", "Actuary", "Engineer"],
      improve: ["Practice mental arithmetic", "Learn statistics", "Solve numeric puzzles", "Take advanced math courses"]
    },
    verbal: {
      title: "Verbal Reasoning",
      description: "The ability to understand and work with written and spoken language. This includes reading comprehension, vocabulary usage, and effective communication.",
      careers: ["Writer", "Lawyer", "Marketing Specialist", "Teacher", "Human Resources Manager"],
      improve: ["Read widely", "Expand vocabulary", "Practice writing", "Join debate or discussion groups"]
    },
    spatial: {
      title: "Spatial Reasoning",
      description: "The ability to visualize and manipulate objects in your mind. This includes understanding how objects relate to each other in space and mentally transforming shapes.",
      careers: ["Architect", "Graphic Designer", "Engineer", "Surgeon", "Interior Designer"],
      improve: ["Practice with 3D puzzles", "Draw and sketch", "Build models", "Learn CAD software"]
    },
    logical: {
      title: "Logical Reasoning",
      description: "The ability to analyze information and form conclusions through deductive and inductive reasoning. This includes identifying patterns, evaluating arguments, and problem-solving.",
      careers: ["Software Developer", "Lawyer", "Scientist", "Management Consultant", "Systems Analyst"],
      improve: ["Solve logic puzzles", "Study formal logic", "Practice critical thinking", "Learn computer programming"]
    },
    mechanical: {
      title: "Mechanical Reasoning",
      description: "The ability to understand mechanical principles and physical forces. This includes how machines work, physical laws, and practical problem-solving with tools and equipment.",
      careers: ["Mechanical Engineer", "Technician", "Product Designer", "Automotive Mechanic", "Pilot"],
      improve: ["Take apart and rebuild devices", "Study physics", "Work on DIY projects", "Use mechanical simulation software"]
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Aptitude Assessment</h1>
          <DownloadReport userId={userId} />
        </div>
        
        <ProfileSummary 
          user={assessmentResults?.user} 
          isLoading={isLoadingAssessment} 
        />
        
        <SectionNav />
        
        <div className="space-y-8 mb-12">
          <AptitudeChart 
            data={aptitudeData} 
            isLoading={isLoadingAptitude}
            showExplanations={true} 
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Understanding Your Aptitude Profile</CardTitle>
              <CardDescription>
                Aptitude assessments measure your natural abilities across different cognitive domains
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-700">
                Your aptitude profile shows your natural abilities in different types of thinking and problem-solving. These cognitive abilities influence how easily you can learn certain skills and how well you might perform in different career fields.
              </p>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-48 w-full" />
                  ))
                ) : (
                  Object.entries(aptitudeDescriptions).map(([key, category]) => {
                    const score = aptitudeData && aptitudeData[key as keyof typeof aptitudeData];
                    const formattedScore = typeof score === 'number' ? score : 0;
                    
                    return (
                      <Card key={key} className={`border-l-4 ${formattedScore > 70 ? 'border-l-green-500' : 'border-l-gray-300'}`}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">{category.title}</CardTitle>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              formattedScore > 70 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {formattedScore}%
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                          <div className="mt-2">
                            <span className="text-xs font-medium text-gray-700">Related Careers:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {category.careers.slice(0, 3).map((career, index) => (
                                <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                  {career}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="mt-2">
                            <span className="text-xs font-medium text-gray-700">Ways to Improve:</span>
                            <p className="text-xs text-gray-600 mt-1">
                              {category.improve[0]}, {category.improve[1]}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AptitudeResults;
