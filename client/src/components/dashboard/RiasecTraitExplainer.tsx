import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight,
  Wrench,
  Microscope,
  Paintbrush,
  Users,
  Briefcase,
  ClipboardCheck
} from 'lucide-react';
import type { RiasecResult } from '@shared/schema';

interface RiasecTraitExplainerProps {
  data?: RiasecResult;
  isLoading?: boolean;
}

function RiasecTraitExplainer({ data, isLoading = false }: RiasecTraitExplainerProps) {
  const [currentTraitIndex, setCurrentTraitIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Define RIASEC traits with detailed information
  const traits = [
    {
      key: 'realistic',
      title: 'Realistic',
      description: 'Practical, physical, hands-on problem solver',
      icon: <Wrench className="h-8 w-8 text-blue-500" />,
      highDescription: 'You prefer to work with objects, machines, tools, plants, or animals. You enjoy creating, building, and fixing things, and value practical, concrete solutions.',
      lowDescription: 'You tend to prefer more abstract or social activities over mechanical or outdoor work. You may prefer environments that involve less physical labor or technical skills.',
      color: 'blue',
      careers: ['Mechanic', 'Engineer', 'Carpenter', 'Electrician', 'Farmer', 'Military Officer', 'Athletic Trainer']
    },
    {
      key: 'investigative',
      title: 'Investigative',
      description: 'Analytical, intellectual, scientific explorer',
      icon: <Microscope className="h-8 w-8 text-purple-500" />,
      highDescription: 'You prefer to analyze and evaluate information to understand and solve problems. You enjoy researching, exploring ideas, and using logic and scientific thinking.',
      lowDescription: 'You may prefer practical applications over theoretical knowledge. You might choose careers that require less research, analysis, or scientific thinking.',
      color: 'purple',
      careers: ['Scientist', 'Researcher', 'Doctor', 'Professor', 'Psychologist', 'Mathematician', 'Data Analyst']
    },
    {
      key: 'artistic',
      title: 'Artistic',
      description: 'Creative, original, independent innovator',
      icon: <Paintbrush className="h-8 w-8 text-rose-500" />,
      highDescription: 'You value self-expression, creativity, and originality. You enjoy working in unstructured environments where you can express your artistic abilities and innovative ideas.',
      lowDescription: 'You may prefer more structured, conventional environments. You might feel more comfortable with clear guidelines and established procedures.',
      color: 'rose',
      careers: ['Artist', 'Designer', 'Writer', 'Musician', 'Actor', 'Architect', 'Photographer']
    },
    {
      key: 'social',
      title: 'Social',
      description: 'Cooperative, supportive, helping others',
      icon: <Users className="h-8 w-8 text-green-500" />,
      highDescription: 'You enjoy working with and helping others. You value building relationships, teaching, guiding, and providing support to improve people\'s lives and well-being.',
      lowDescription: 'You may prefer working independently or with data/things rather than directly helping or teaching others. You might be more task-oriented than people-oriented.',
      color: 'green',
      careers: ['Teacher', 'Counselor', 'Social Worker', 'Nurse', 'Therapist', 'HR Specialist', 'Coach']
    },
    {
      key: 'enterprising',
      title: 'Enterprising',
      description: 'Persuasive, leadership, influencing others',
      icon: <Briefcase className="h-8 w-8 text-amber-500" />,
      highDescription: 'You excel at persuading, leading, and managing others to achieve goals. You value status, power, and making an impact through business, politics, or leadership roles.',
      lowDescription: 'You may prefer supportive roles over leadership positions. You might be less interested in persuading others or taking risks for financial or status rewards.',
      color: 'amber',
      careers: ['Manager', 'Sales Representative', 'Lawyer', 'Entrepreneur', 'Real Estate Agent', 'Financial Advisor', 'Marketing Executive']
    },
    {
      key: 'conventional',
      title: 'Conventional',
      description: 'Organized, detail-oriented, follows procedures',
      icon: <ClipboardCheck className="h-8 w-8 text-indigo-500" />,
      highDescription: 'You excel at organizing, managing data, and working with detailed information. You value accuracy, stability, and clear processes, thriving in structured environments.',
      lowDescription: 'You may prefer less structured environments with fewer rules and procedures. You might be more comfortable with flexibility and creativity than with precision and routine.',
      color: 'indigo',
      careers: ['Accountant', 'Administrative Assistant', 'Financial Analyst', 'Banker', 'Office Manager', 'Database Administrator', 'Quality Control Specialist']
    }
  ];

  // Get the current trait
  const currentTrait = traits[currentTraitIndex];
  
  // Get the value of the current trait from the data
  const traitValue = data ? data[currentTrait.key as keyof RiasecResult] as number : 0;
  const isHighTrait = traitValue > 60;

  // Navigate to previous trait
  const prevTrait = () => {
    setDirection(-1);
    setCurrentTraitIndex((prev) => (prev === 0 ? traits.length - 1 : prev - 1));
  };

  // Navigate to next trait
  const nextTrait = () => {
    setDirection(1);
    setCurrentTraitIndex((prev) => (prev === traits.length - 1 ? 0 : prev + 1));
  };

  // Animation variants for page transitions
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  // For the progress bar
  const progressVariants = {
    empty: { width: 0 },
    filled: (custom: number) => ({
      width: `${custom}%`,
      transition: { duration: 0.5 }
    })
  };

  // Helper function to get the color classes based on trait
  const getColorClasses = (traitColor: string, isHighTrait: boolean) => {
    const colorMap: Record<string, { bg: string, bgLight: string, border: string, text: string }> = {
      amber: {
        bg: "bg-amber-500",
        bgLight: "bg-amber-100",
        border: "border-amber-200",
        text: "text-amber-800"
      },
      blue: {
        bg: "bg-blue-500",
        bgLight: "bg-blue-100", 
        border: "border-blue-200",
        text: "text-blue-800"
      },
      green: {
        bg: "bg-green-500",
        bgLight: "bg-green-100",
        border: "border-green-200",
        text: "text-green-800"
      },
      rose: {
        bg: "bg-rose-500",
        bgLight: "bg-rose-100",
        border: "border-rose-200",
        text: "text-rose-800"
      },
      purple: {
        bg: "bg-purple-500",
        bgLight: "bg-purple-100",
        border: "border-purple-200",
        text: "text-purple-800"
      },
      indigo: {
        bg: "bg-indigo-500",
        bgLight: "bg-indigo-100",
        border: "border-indigo-200",
        text: "text-indigo-800"
      }
    };
    
    return colorMap[traitColor] || {
      bg: "bg-gray-500",
      bgLight: "bg-gray-100",
      border: "border-gray-200",
      text: "text-gray-800"
    };
  };
  
  // Get the colors for the current trait
  const traitColors = getColorClasses(currentTrait.color, isHighTrait);

  if (isLoading) {
    return (
      <Card className="w-full h-64 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500">Loading your RIASEC profile...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden relative">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold text-lg">RIASEC Traits Explained</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevTrait}
            className="h-8 w-8 rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-500">
            {currentTraitIndex + 1} of {traits.length}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={nextTrait}
            className="h-8 w-8 rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={currentTraitIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="p-6"
        >
          <div className="flex items-center gap-4 mb-4">
            {currentTrait.icon}
            <div>
              <h3 className="font-bold text-xl">{currentTrait.title}</h3>
              <p className="text-gray-500 text-sm">{currentTrait.description}</p>
            </div>
          </div>

          <div className="mt-6 mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Low</span>
              <span>High</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${traitColors.bg} rounded-full`}
                variants={progressVariants}
                custom={traitValue}
                initial="empty"
                animate="filled"
              />
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold mb-2">Your Tendency</h4>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`p-4 rounded-lg ${
                isHighTrait 
                  ? `${traitColors.bgLight} border ${traitColors.border}` 
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <p className="text-gray-700">
                {isHighTrait ? currentTrait.highDescription : currentTrait.lowDescription}
              </p>
            </motion.div>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold mb-2">Career Matches</h4>
            <div className="flex flex-wrap gap-2">
              {currentTrait.careers.map((career, index) => (
                <motion.span
                  key={career}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className={`px-3 py-1 rounded-full text-sm ${
                    isHighTrait 
                      ? `${traitColors.bgLight} ${traitColors.text}` 
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {career}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <CardContent className="pt-0 pb-4">
        <div className="flex justify-center mt-4">
          {traits.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 w-6 mx-0.5 rounded-full ${
                index === currentTraitIndex ? "bg-primary" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default RiasecTraitExplainer;