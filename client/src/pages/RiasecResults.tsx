import { useQuery } from "@tanstack/react-query";
import SectionNav from "@/components/dashboard/SectionNav";
import ProfileSummary from "@/components/dashboard/ProfileSummary";
import RiasecChart from "@/components/dashboard/RiasecChart";
import RiasecTraitExplainer from "@/components/dashboard/RiasecTraitExplainer";
import DownloadReport from "@/components/dashboard/DownloadReport";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const RiasecResults = () => {
  // In a real app, this would be determined by authentication
  // For this demo, we're using a hardcoded demo user ID
  const userId = 1;
  
  const { data: assessmentResults, isLoading: isLoadingAssessment } = useQuery({
    queryKey: [`/api/assessments/${userId}`],
    staleTime: Infinity,
  });
  
  const { data: riasecData, isLoading: isLoadingRiasec } = useQuery({
    queryKey: [`/api/assessments/${userId}/riasec`],
    staleTime: Infinity,
  });
  
  const isLoading = isLoadingAssessment || isLoadingRiasec;

  // RIASEC category descriptions for the expanded view
  const riasecDescriptions = {
    realistic: {
      title: "Realistic",
      description: "People with Realistic interests enjoy work activities that include practical, hands-on problems and solutions. They prefer dealing with plants, animals, and real-world materials like wood, tools, and machinery. They enjoy outside work and often do not like occupations that mainly involve paperwork or working closely with others.",
      careers: ["Engineer", "Mechanic", "Construction Manager", "Electrician", "Farmer", "Athletic Trainer"],
      strengths: ["Mechanical ability", "Physical coordination", "Technical skills", "Hands-on problem solving"]
    },
    investigative: {
      title: "Investigative",
      description: "People with Investigative interests like work activities that have to do with ideas and thinking rather than physical activity. They prefer to search for facts and figure out problems mentally rather than persuade or lead people.",
      careers: ["Scientist", "Researcher", "Medical Professional", "Data Analyst", "Mathematician", "Software Developer"],
      strengths: ["Analytical thinking", "Problem-solving", "Intellectual curiosity", "Research abilities"]
    },
    artistic: {
      title: "Artistic",
      description: "People with Artistic interests like work activities that deal with the artistic side of things, such as forms, designs, and patterns. They prefer self-expression and work that can be done without following a clear set of rules.",
      careers: ["Graphic Designer", "Writer", "Actor", "Musician", "Interior Designer", "Photographer"],
      strengths: ["Creativity", "Imagination", "Originality", "Self-expression", "Nonconformity"]
    },
    social: {
      title: "Social",
      description: "People with Social interests like work activities that assist others and promote learning and personal development. They prefer to communicate more than to work with objects, machines, or data.",
      careers: ["Teacher", "Counselor", "Social Worker", "Nurse", "Human Resources Specialist", "Physical Therapist"],
      strengths: ["Interpersonal skills", "Empathy", "Verbal ability", "Teaching", "Listening"]
    },
    enterprising: {
      title: "Enterprising",
      description: "People with Enterprising interests like work activities that have to do with starting up and carrying out projects, especially business ventures. They prefer to persuade and lead people and to make decisions rather than work on intellectual or physical tasks.",
      careers: ["Manager", "Sales Representative", "Lawyer", "Entrepreneur", "Marketing Executive", "Real Estate Agent"],
      strengths: ["Leadership", "Persuasion", "Decision-making", "Risk-taking", "Public speaking"]
    },
    conventional: {
      title: "Conventional",
      description: "People with Conventional interests like work activities that follow set procedures and routines. They prefer working with data and detail rather than with ideas. They prefer work in which there are precise standards rather than work in which you have to judge things by yourself.",
      careers: ["Accountant", "Administrative Assistant", "Financial Analyst", "Bank Teller", "Editor", "Logistics Coordinator"],
      strengths: ["Organization", "Attention to detail", "Reliability", "Efficiency", "Following procedures"]
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">RIASEC Interest Profile</h1>
          <DownloadReport userId={userId} />
        </div>
        
        <ProfileSummary 
          user={assessmentResults?.user} 
          isLoading={isLoadingAssessment} 
        />
        
        <SectionNav />
        
        <div className="space-y-8 mb-12">
          <RiasecChart 
            data={riasecData} 
            isLoading={isLoadingRiasec}
            showExplanations={true} 
          />
          
          <RiasecTraitExplainer
            data={riasecData}
            isLoading={isLoadingRiasec}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Understanding Your RIASEC Profile</CardTitle>
              <CardDescription>
                The RIASEC model, also known as Holland Codes, helps identify your vocational personality type across six domains
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-700">
                Your RIASEC profile shows your interest levels across six different categories of work. These interests often reflect your personality, values, and what you find most rewarding in a job. Understanding your code can help you find careers that match your interests and skills.
              </p>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="h-40 w-full" />
                  ))
                ) : (
                  Object.entries(riasecDescriptions).map(([key, category]) => {
                    const score = riasecData && riasecData[key as keyof typeof riasecData];
                    const formattedScore = typeof score === 'number' ? score : 0;
                    
                    return (
                      <Card key={key} className={`border-l-4 ${formattedScore > 70 ? 'border-l-primary' : 'border-l-gray-300'}`}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">{category.title}</CardTitle>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              formattedScore > 70 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {formattedScore}%
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                          <div className="mt-2">
                            <span className="text-xs font-medium text-gray-700">Sample Careers:</span>
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

export default RiasecResults;
