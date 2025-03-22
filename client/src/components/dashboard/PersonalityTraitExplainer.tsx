import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OceanResult } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain, 
  UserCheck, 
  Users, 
  Heart, 
  Lightbulb, 
  ChevronRight, 
  ChevronLeft 
} from "lucide-react";

interface PersonalityTraitExplainerProps {
  data?: OceanResult;
  isLoading?: boolean;
}

interface PersonalityTrait {
  key: keyof Omit<OceanResult, "id" | "userId" | "completedAt">;
  title: string;
  description: string;
  icon: React.ReactNode;
  highDescription: string;
  lowDescription: string;
  color: string;
  careers: string[];
}

export function PersonalityTraitExplainer({ 
  data,
  isLoading = false 
}: PersonalityTraitExplainerProps) {
  const [currentTraitIndex, setCurrentTraitIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Personality trait information
  const traits: PersonalityTrait[] = [
    {
      key: "openness",
      title: "Openness to Experience",
      description: "Reflects your curiosity, creativity, and preference for variety and intellectual stimulation.",
      icon: <Lightbulb className="h-8 w-8 text-amber-500" />,
      highDescription: "You enjoy new experiences, have a vivid imagination, and appreciate art, beauty, and innovation. You're likely creative and open to unconventional ideas.",
      lowDescription: "You prefer familiarity, routine, and practicality. You tend to be more conventional and focused on concrete facts rather than abstract theories.",
      color: "amber",
      careers: ["Researcher", "Artist", "Entrepreneur", "Writer", "Designer"]
    },
    {
      key: "conscientiousness",
      title: "Conscientiousness",
      description: "Reflects your organization, dependability, and self-discipline.",
      icon: <UserCheck className="h-8 w-8 text-blue-500" />,
      highDescription: "You're organized, responsible, and thorough in your work. You plan ahead, are goal-oriented, and can be relied upon to follow through on commitments.",
      lowDescription: "You approach tasks more spontaneously and may prefer flexibility over rigid schedules. You might find detailed work tedious and prefer a more relaxed approach.",
      color: "blue",
      careers: ["Manager", "Financial Advisor", "Administrator", "Engineer", "Doctor"]
    },
    {
      key: "extraversion",
      title: "Extraversion",
      description: "Reflects your sociability, energy, and tendency to seek stimulation from the outside world.",
      icon: <Users className="h-8 w-8 text-green-500" />,
      highDescription: "You're outgoing, energetic, and draw energy from social interactions. You likely enjoy being the center of attention and meeting new people.",
      lowDescription: "You're more reserved and find social interactions draining at times. You prefer deeper one-on-one conversations and need time alone to recharge.",
      color: "green",
      careers: ["Sales Representative", "Event Planner", "Teacher", "Public Relations", "Hospitality"]
    },
    {
      key: "agreeableness",
      title: "Agreeableness",
      description: "Reflects your compassion, cooperativeness, and interest in social harmony.",
      icon: <Heart className="h-8 w-8 text-rose-500" />,
      highDescription: "You're empathetic, kind, and prioritize getting along with others. You tend to trust people easily and prefer cooperation over competition.",
      lowDescription: "You're more skeptical and willing to challenge others' views. You may prioritize objective truth over people's feelings and can be more competitive.",
      color: "rose",
      careers: ["Counselor", "Nurse", "Social Worker", "Human Resources", "Teacher"]
    },
    {
      key: "neuroticism",
      title: "Emotional Stability",
      description: "Reflects your tendency to experience negative emotions and how you handle stress.",
      icon: <Brain className="h-8 w-8 text-purple-500" />,
      highDescription: "You experience emotions intensely and may be more sensitive to stress. This sensitivity can make you more empathetic and self-aware.",
      lowDescription: "You're calm under pressure and less affected by stressful situations. You tend to maintain emotional balance even in difficult circumstances.",
      color: "purple",
      careers: ["Emergency Responder", "Air Traffic Controller", "Surgeon", "Military Officer", "Executive"]
    }
  ];

  if (isLoading || !data) {
    return (
      <Card className="w-full h-[300px] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>Loading personality traits...</p>
        </div>
      </Card>
    );
  }

  const currentTrait = traits[currentTraitIndex];
  const traitValue = data[currentTrait.key];
  const isHighTrait = typeof traitValue === 'number' && traitValue > 60;

  const nextTrait = () => {
    setDirection(1);
    setCurrentTraitIndex((prev) => (prev + 1) % traits.length);
  };

  const prevTrait = () => {
    setDirection(-1);
    setCurrentTraitIndex((prev) => (prev - 1 + traits.length) % traits.length);
  };

  // Animation variants
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 500 : -500,
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

  return (
    <Card className="w-full overflow-hidden relative">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold text-lg">Personality Traits Explained</h3>
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

export default PersonalityTraitExplainer;