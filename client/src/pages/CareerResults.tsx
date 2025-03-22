import { useQuery } from "@tanstack/react-query";
import SectionNav from "@/components/dashboard/SectionNav";
import ProfileSummary from "@/components/dashboard/ProfileSummary";
import CareerMatches from "@/components/dashboard/CareerMatches";
import DownloadReport from "@/components/dashboard/DownloadReport";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ExternalLink } from "lucide-react";

const CareerResults = () => {
  // In a real app, this would be determined by authentication
  // For this demo, we're using a hardcoded demo user ID
  const userId = 1;
  
  const { data: assessmentResults, isLoading: isLoadingAssessment } = useQuery({
    queryKey: [`/api/assessments/${userId}`],
    staleTime: Infinity,
  });
  
  const { data: careerMatches, isLoading: isLoadingCareers } = useQuery({
    queryKey: [`/api/assessments/${userId}/careers`],
    staleTime: Infinity,
  });
  
  const isLoading = isLoadingAssessment || isLoadingCareers;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Career Matches</h1>
          {assessmentResults?.user?.assessmentComplete ? (
            <DownloadReport userId={userId} />
          ) : (
            <Link href="/assessment">
              <Button>Take the Test</Button>
            </Link>
          )}
        </div>
        
        <ProfileSummary 
          user={assessmentResults?.user} 
          isLoading={isLoadingAssessment} 
        />
        
        <SectionNav />
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content - 70% */}
          <div className="lg:w-[70%] space-y-8 mb-12">
            <CareerMatches 
              data={careerMatches} 
              isLoading={isLoadingCareers}
              showViewAll={false}
            />
            
            <Card>
              <CardHeader>
                <CardTitle>How We Match Careers to Your Profile</CardTitle>
                <CardDescription>
                  Understanding how your assessment results are used to identify potential career paths
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-gray-700">
                  CareerInsight's algorithm analyzes your combined assessment results to identify careers that align with your unique profile.
                  We use sophisticated matching algorithms that consider:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="bg-blue-50 border-none">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-blue-700">RIASEC Alignment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-blue-700/80">
                        We match your interest profile to occupations that typically appeal to people with similar patterns of interests.
                        High compatibility occurs when your strongest interest areas align with a career's primary domains.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-50 border-none">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-green-700">Aptitude Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-green-700/80">
                        Your cognitive abilities are compared to the typical aptitude profiles required for success in different careers.
                        We identify where your strongest abilities match with careers that value those specific skills.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-purple-50 border-none">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-purple-700">Personality Fit</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-purple-700/80">
                        Your OCEAN personality traits are compared to work environments and job characteristics where people with similar
                        traits tend to report higher job satisfaction and performance.
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="bg-gray-100 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Career Exploration Recommendations</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-1">Research Your Top Matches</h4>
                      <p className="text-sm text-gray-600">
                        Explore detailed information about each career including typical responsibilities, education requirements, and salary ranges.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-1">Informational Interviews</h4>
                      <p className="text-sm text-gray-600">
                        Connect with professionals working in your matched careers to gain firsthand insights about the day-to-day realities.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-1">Skill Development Plan</h4>
                      <p className="text-sm text-gray-600">
                        Identify gaps between your current skills and those required for your top career matches, then create a plan to develop them.
                      </p>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-700">
                        Remember that these matches are suggestions, not guarantees. Career decisions should incorporate many factors including
                        your values, life circumstances, and available opportunities.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-primary/10 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-primary">Need more guidance?</h3>
                    <p className="text-sm text-gray-600">Speak with a career counselor to interpret your results in more depth.</p>
                  </div>
                  <Button variant="outline" className="whitespace-nowrap">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Find a Career Counselor
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {!isLoading && careerMatches && careerMatches.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Industry Sectors for Your Profile</CardTitle>
                  <CardDescription>
                    Broader industry categories where your assessment results indicate potential fit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Technology & Data</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Your strong investigative and logical aptitudes suggest excellent potential in technology fields
                        focused on analysis and problem-solving.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-blue-50">Data Science</Badge>
                        <Badge variant="outline" className="bg-blue-50">Software Development</Badge>
                        <Badge variant="outline" className="bg-blue-50">Research & Development</Badge>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Research & Academia</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Your openness to experience and strong investigative interests align well with careers
                        in research and academic environments.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-blue-50">Scientific Research</Badge>
                        <Badge variant="outline" className="bg-blue-50">Higher Education</Badge>
                        <Badge variant="outline" className="bg-blue-50">Think Tanks</Badge>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Professional Services</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Your combination of verbal reasoning and conscientiousness suggests potential
                        for success in detail-oriented professional services.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-blue-50">Technical Writing</Badge>
                        <Badge variant="outline" className="bg-blue-50">Consulting</Badge>
                        <Badge variant="outline" className="bg-blue-50">Analysis</Badge>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Human-Centered Fields</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Your high social interests and agreeableness indicate potential in careers
                        focused on understanding and improving human experiences.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-blue-50">User Experience</Badge>
                        <Badge variant="outline" className="bg-blue-50">Human Resources</Badge>
                        <Badge variant="outline" className="bg-blue-50">Education</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600 mb-4">
                      Looking for more detailed information about careers in these sectors?
                    </p>
                    <Link href="/">
                      <Button>
                        Explore Career Database
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Chatbot window - 30% */}
          <div className="lg:w-[30%] h-auto">
            <Card className="sticky top-20 h-[calc(100vh-150px)] flex flex-col">
              <CardHeader className="border-b pb-3">
                <CardTitle className="text-lg flex items-center">
                  <svg 
                    className="h-5 w-5 mr-2 text-primary" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  Career Assistant
                </CardTitle>
                <CardDescription>
                  Ask questions about your career assessment results
                </CardDescription>
              </CardHeader>
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                <div className="flex items-start mb-4">
                  <div className="bg-primary/10 rounded-lg p-3 max-w-[80%] ml-auto">
                    <p className="text-sm">What careers would be good for someone with high investigative and artistic scores?</p>
                  </div>
                </div>
                <div className="flex items-start mb-4">
                  <div className="bg-white rounded-lg p-3 border max-w-[80%]">
                    <p className="text-sm">
                      With high investigative and artistic scores, you might excel in careers like:
                      <br /><br />
                      • Research Scientist
                      <br />
                      • UX/UI Designer
                      <br />
                      • Architect
                      <br />
                      • Medical Illustrator
                      <br />
                      • Technical Writer
                      <br /><br />
                      These careers blend analytical thinking with creative expression. Would you like more specific recommendations based on your complete assessment?
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask a question about your results..."
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                  <Button size="sm" className="whitespace-nowrap">
                    <svg 
                      className="h-4 w-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerResults;