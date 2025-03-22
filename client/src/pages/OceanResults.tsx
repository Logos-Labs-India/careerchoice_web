import { useQuery } from "@tanstack/react-query";
import SectionNav from "@/components/dashboard/SectionNav";
import ProfileSummary from "@/components/dashboard/ProfileSummary";
import OceanChart from "@/components/dashboard/OceanChart";
import PersonalityTraitExplainer from "@/components/dashboard/PersonalityTraitExplainer";
import DownloadReport from "@/components/dashboard/DownloadReport";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const OceanResults = () => {
  // In a real app, this would be determined by authentication
  // For this demo, we're using a hardcoded demo user ID
  const userId = 1;
  
  const { data: assessmentResults, isLoading: isLoadingAssessment } = useQuery({
    queryKey: [`/api/assessments/${userId}`],
    staleTime: Infinity,
  });
  
  const { data: oceanData, isLoading: isLoadingOcean } = useQuery({
    queryKey: [`/api/assessments/${userId}/ocean`],
    staleTime: Infinity,
  });
  
  const isLoading = isLoadingAssessment || isLoadingOcean;

  const oceanDescriptions = {
    openness: {
      title: "Openness to Experience",
      description: "Reflects a person's willingness to try new things, their intellectual curiosity, and their enjoyment of novelty and variety.",
      high: "Creative, open to new ideas, intellectually curious, appreciates art and beauty",
      low: "Practical, conventional, prefers routine and tradition, focused on concrete facts",
      careers: ["Researcher", "Artist", "Entrepreneur", "Consultant", "Writer"]
    },
    conscientiousness: {
      title: "Conscientiousness",
      description: "Reflects a person's orderliness, self-discipline, achievement orientation, and preference for planned rather than spontaneous behavior.",
      high: "Organized, responsible, hardworking, goal-oriented, reliable",
      low: "Flexible, spontaneous, relaxed approach to deadlines and obligations",
      careers: ["Manager", "Financial Advisor", "Healthcare Professional", "Legal Professional", "Administrator"]
    },
    extraversion: {
      title: "Extraversion",
      description: "Reflects a person's sociability, assertiveness, and enthusiasm for social interaction.",
      high: "Outgoing, energetic, talkative, enjoys group activities, seeks excitement",
      low: "Reserved, thoughtful, prefers solitary activities, works independently",
      careers: ["Sales Representative", "Marketing Professional", "Teacher", "Event Planner", "Public Relations"]
    },
    agreeableness: {
      title: "Agreeableness",
      description: "Reflects a person's tendency to be compassionate, cooperative, warm, and considerate.",
      high: "Compassionate, kind, cooperative, trusting, helpful",
      low: "Questioning, competitive, focused on efficiency rather than people's feelings",
      careers: ["Counselor", "Human Resources", "Nurse", "Social Worker", "Customer Service"]
    },
    neuroticism: {
      title: "Neuroticism",
      description: "Reflects a person's emotional stability and tendency to experience negative emotions.",
      high: "Experiences stress and anxiety more readily, emotionally reactive",
      low: "Emotionally stable, calm under pressure, resilient to stress",
      careers: ["Surgeon", "Air Traffic Controller", "Emergency Responder", "Military Officer", "Executive"]
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">OCEAN Personality Profile</h1>
          <DownloadReport userId={userId} />
        </div>
        
        <ProfileSummary 
          user={assessmentResults?.user} 
          isLoading={isLoadingAssessment} 
        />
        
        <SectionNav />
        
        <div className="space-y-8 mb-12">
          <OceanChart 
            data={oceanData} 
            isLoading={isLoadingOcean}
            showExplanations={true} 
          />
          
          <PersonalityTraitExplainer
            data={oceanData}
            isLoading={isLoadingOcean}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Understanding Your OCEAN Profile</CardTitle>
              <CardDescription>
                The Big Five personality traits provide insights into your behavioral tendencies and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-700">
                Your OCEAN (Big Five) personality profile shows your tendencies across five major dimensions of personality. These traits influence how you interact with others, approach work, and respond to different situations. Understanding your personality can help you find environments where you'll naturally thrive.
              </p>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-48 w-full" />
                  ))
                ) : (
                  Object.entries(oceanDescriptions).map(([key, category]) => {
                    const score = oceanData && oceanData[key as keyof typeof oceanData];
                    const formattedScore = typeof score === 'number' ? score : 0;
                    const isHigh = formattedScore > 60;
                    
                    return (
                      <Card key={key} className={`border-l-4 ${isHigh ? 'border-l-purple-500' : 'border-l-gray-300'}`}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">{category.title}</CardTitle>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              isHigh ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {formattedScore}%
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                          <div className="mt-2">
                            <span className="text-xs font-medium text-gray-700">Your Tendency:</span>
                            <p className="text-xs text-gray-600 mt-1">
                              {isHigh ? category.high : category.low}
                            </p>
                          </div>
                          <div className="mt-2">
                            <span className="text-xs font-medium text-gray-700">Well-suited Careers:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {category.careers.slice(0, 3).map((career, index) => (
                                <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                  {career}
                                </span>
                              ))}
                            </div>
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

export default OceanResults;
