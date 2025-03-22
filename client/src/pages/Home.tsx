import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, BrainCircuit, ChartPie, User } from "lucide-react";

const Home = () => {

  const features = [
    {
      icon: <ChartPie className="h-6 w-6 text-primary" />,
      title: "RIASEC Assessment",
      description: "Identify your interests across six dimensions: Realistic, Investigative, Artistic, Social, Enterprising, and Conventional."
    },
    {
      icon: <BrainCircuit className="h-6 w-6 text-green-500" />,
      title: "Aptitude Analysis",
      description: "Measure your cognitive abilities across numerical, verbal, spatial, logical, and mechanical domains."
    },
    {
      icon: <User className="h-6 w-6 text-purple-500" />,
      title: "OCEAN Personality",
      description: "Understand your personality traits: Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism."
    }
  ];

  const steps = [
    {
      number: 1,
      title: "Create an Account",
      description: "Sign up and create your personal profile"
    },
    {
      number: 2,
      title: "Complete Assessments",
      description: "Take the RIASEC, Aptitude, and OCEAN assessments"
    },
    {
      number: 3,
      title: "Get Your Results",
      description: "Receive detailed analysis of your profile"
    },
    {
      number: 4,
      title: "Explore Careers",
      description: "Discover careers that match your unique profile"
    }
  ];

  const testimonials = [
    {
      content: "The assessment was incredibly insightful. It confirmed my strengths in areas I'd suspected but also revealed talents I hadn't recognized. The career suggestions were spot-on.",
      name: "Sarah J.",
      role: "Psychology Graduate"
    },
    {
      content: "As someone considering a career change, this tool provided the clarity I needed. The comprehensive nature of the assessment gave me confidence in the results.",
      name: "Michael R.",
      role: "Marketing Professional"
    },
    {
      content: "I've used other career assessment tools before, but this one stands out because of how it combines multiple frameworks. The visualization of my results was especially helpful.",
      name: "Jennifer T.",
      role: "College Advisor"
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center space-y-10 md:space-y-0">
            <div className="md:w-1/2 md:pr-12">
              <h1 className="text-4xl md:text-5xl font-bold font-sans text-gray-900 leading-tight mb-4">
                Discover Your Career Path with <span className="text-primary">Scientific Assessment</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                CareerInsight provides comprehensive career assessments based on RIASEC, Aptitude, and OCEAN frameworks to help you find your perfect career match.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/auth?tab=signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Take the Test
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    View Sample Results
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                alt="Students analyzing career assessment results" 
                className="rounded-lg shadow-xl"
                width="600" 
                height="400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-sans text-gray-900 mb-4">Comprehensive Assessment Framework</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our platform combines three powerful assessment frameworks to give you a complete picture of your career potential.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-blue-100 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold font-sans text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="flex items-center text-primary">
                  <span className="font-medium">Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-sans text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Four simple steps to discover your ideal career path</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center">
                  <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-4 z-10">
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute h-1 bg-gray-300 top-6 left-1/2 w-full"></div>
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">{step.title}</h3>
                  <p className="text-gray-600 text-center text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Results CTA */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold font-sans text-gray-900 mb-6">
            See How Your Assessment Results Will Look
          </h2>
          <Link href="/dashboard">
            <Button size="lg" className="mx-auto">
              View Sample Dashboard
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-sans text-gray-900 mb-4">What Users Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Hear from beta testers who've experienced the platform</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center mb-4">
                  <div className="text-amber-400 flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4 italic">{testimonial.content}</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold mr-3">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
};

export default Home;
