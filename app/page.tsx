import Hero from "@/components/sections/Hero";
import WhyUs from "@/components/sections/WhyUs";
import Courses from "@/components/sections/Courses";
import CourseQuiz from "@/components/forms/CourseQuiz";
import FreeEducation from "@/components/sections/FreeEducation";
import Environment from "@/components/sections/Environment";
import Achievements from "@/components/sections/Achievements";
import PuzzleGame from "@/components/sections/PuzzleGame";
import LearningProcess from "@/components/sections/LearningProcess";
import MainCTA from "@/components/sections/MainCTA";
import LocationMap from "@/components/map/LocationMap";

export default function Home() {
  return (
    <div className="flex flex-col gap-0 pb-0">
      <Hero />
      <WhyUs />
      <Courses />
      <CourseQuiz />
      <FreeEducation />
      <Environment />
      <Achievements />
      <PuzzleGame />
      <LearningProcess />
      <MainCTA />
      <LocationMap />
    </div>
  );
}
