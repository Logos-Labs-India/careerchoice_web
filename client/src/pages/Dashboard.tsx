import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import SectionNav from "@/components/dashboard/SectionNav";
import ProfileSummary from "@/components/dashboard/ProfileSummary";
import RiasecChart from "@/components/dashboard/RiasecChart";
import AptitudeChart from "@/components/dashboard/AptitudeChart";
import OceanChart from "@/components/dashboard/OceanChart";
import CareerMatches from "@/components/dashboard/CareerMatches";
import DownloadReport from "@/components/dashboard/DownloadReport";
import { Button } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const Dashboard = () => {
  // In a real app, this would be determined by authentication
  // For this demo, we're using a hardcoded demo user ID
  const userId = 1;
  
  const { data: assessmentResults, isLoading } = useQuery({
    queryKey: [`/api/assessments/${userId}`],
    staleTime: Infinity,
  });

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Loading assessment results...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your Assessment Results</h1>
          <DownloadReport userId={userId} />
        </div>
        
        <ProfileSummary user={assessmentResults?.user} />
        
        <SectionNav />
        
        <div className="grid grid-cols-1 gap-8 mb-12">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2">Your RIASEC Profile</h3>
                <p className="text-gray-600 mb-4">Your strongest interests are in the Investigative and Social domains</p>
                <div className="flex justify-between items-center">
                  <div className="flex">
                    <div className="bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs font-medium mr-2">Investigative 82%</div>
                    <div className="bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs font-medium">Social 70%</div>
                  </div>
                  <Link href="/results/riasec">
                    <a className="text-primary text-sm font-medium hover:text-blue-700 flex items-center">
                      View details
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </a>
                  </Link>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2">Your Aptitude Analysis</h3>
                <p className="text-gray-600 mb-4">You show strong abilities in logical and verbal reasoning</p>
                <div className="flex justify-between items-center">
                  <div className="flex">
                    <div className="bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs font-medium mr-2">Logical 88%</div>
                    <div className="bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs font-medium">Verbal 82%</div>
                  </div>
                  <Link href="/results/aptitude">
                    <a className="text-primary text-sm font-medium hover:text-blue-700 flex items-center">
                      View details
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </a>
                  </Link>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2">Your OCEAN Personality</h3>
                <p className="text-gray-600 mb-4">You show high openness to experience and agreeableness</p>
                <div className="flex justify-between items-center">
                  <div className="flex">
                    <div className="bg-purple-100 text-purple-800 rounded-full px-2 py-1 text-xs font-medium mr-2">Openness 85%</div>
                    <div className="bg-purple-100 text-purple-800 rounded-full px-2 py-1 text-xs font-medium">Agreeableness 75%</div>
                  </div>
                  <Link href="/results/ocean">
                    <a className="text-primary text-sm font-medium hover:text-blue-700 flex items-center">
                      View details
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </a>
                  </Link>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2">Top Career Match</h3>
                <p className="text-gray-600 mb-4">Data Scientist (92% match)</p>
                <div className="flex justify-between items-center">
                  <div className="flex">
                    <div className="bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs font-medium">4 Careers Above 80%</div>
                  </div>
                  <Link href="/results/careers">
                    <a className="text-primary text-sm font-medium hover:text-blue-700 flex items-center">
                      View all matches
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <CareerMatches 
            data={assessmentResults?.careerMatches}
            limit={2}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
