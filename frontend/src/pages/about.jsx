import React, { useState, useEffect } from "react";
import {
  AcademicCapIcon,
  CodeBracketIcon,
  SparklesIcon,
  BriefcaseIcon,
  CogIcon,
  FolderIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid";

const repositories = [
  {
    name: "ChatTriggers Mob Detector",
    icon: <CogIcon className="h-8 w-8 text-blue-400" />,
    description: "A Minecraft mod that highlights specific mobs.",
    link: "https://github.com/Meeth-W/mob-detector",
  },
  {
    name: "AI Book Author",
    icon: <SparklesIcon className="h-8 w-8 text-yellow-400" />,
    description: "AI-powered tool for generating books from prompts.",
    link: "https://github.com/Meeth-W/ai-book-author",
  },
  {
    name: "NoSQL Database Project",
    icon: <FolderIcon className="h-8 w-8 text-green-400" />,
    description: "A database management project exploring NoSQL.",
    link: "https://github.com/Meeth-W/nosql-project",
  },
  {
    name: "Profile Website",
    icon: <CodeBracketIcon className="h-8 w-8 text-red-400" />,
    description: "My personal portfolio website.",
    link: "https://github.com/Meeth-W/profile-website",
  },
  {
    name: "DCD Digital Circuits",
    icon: <BriefcaseIcon className="h-8 w-8 text-purple-400" />,
    description: "A project related to digital circuit design.",
    link: "https://github.com/Meeth-W/dcd-circuits",
  },
];

function About() {
  const [currentRepo, setCurrentRepo] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRepo((prev) => (prev + 1) % repositories.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextRepo = () => {
    setCurrentRepo((prev) => (prev + 1) % repositories.length);
  };

  const prevRepo = () => {
    setCurrentRepo((prev) => (prev - 1 + repositories.length) % repositories.length);
  };

  return (
    <section className="bg-slate-900 min-h-screen text-white" id="about">
      <div className="w-full h-96 bg-slate-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">About Me</h1>
          <p className="mt-4 text-lg text-gray-300">
          Hey! I'm Meeth, an IT Engineering student at Thakur College of Engineering & Technology. <br />
          I specialize in software development, AI, and database management.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-12 mt-10 p-6">
        <img
          src="https://github.com/Meeth-W.png"
          alt="Meeth's Profile"
          className="h-40 w-40 rounded-full shadow-lg border-4 border-gray-600"
        />

        <div className="w-full md:w-2/3 bg-slate-800 p-6 rounded-lg shadow-lg relative overflow-hidden">
          <h3 className="text-xl font-semibold text-gray-200 text-center">Featured Project</h3>
          <div className="mt-4 flex flex-col items-center text-center transition-transform duration-500 ease-in-out transform">
            {repositories[currentRepo].icon}
            <h4 className="text-lg font-medium text-gray-300 mt-2">{repositories[currentRepo].name}</h4>
            <p className="text-gray-400 mt-1">{repositories[currentRepo].description}</p>
            <a href={repositories[currentRepo].link} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-blue-400 font-semibold hover:text-blue-300 transition duration-200">
              View Project →
            </a>
          </div>
          <button onClick={prevRepo} className="absolute top-1/2 left-4 transform -translate-y-1/2 p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition">
            <ArrowLeftIcon className="h-6 w-6 text-gray-300" />
          </button>
          <button onClick={nextRepo} className="absolute top-1/2 right-4 transform -translate-y-1/2 p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition">
            <ArrowRightIcon className="h-6 w-6 text-gray-300" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 px-6">
        <div className="p-6 bg-slate-800 rounded-lg shadow-lg text-center hover:scale-105 transition-transform">
          <AcademicCapIcon className="h-10 w-10 text-indigo-400 mx-auto" />
          <h3 className="text-xl font-semibold text-gray-200 mt-4">Education</h3>
          <p className="text-gray-400 mt-2">B.Tech in IT Engineering at Thakur College. Focus on AI, databases, and software development.</p>
        </div>
        <div className="p-6 bg-slate-800 rounded-lg shadow-lg text-center hover:scale-105 transition-transform">
          <BriefcaseIcon className="h-10 w-10 text-green-400 mx-auto" />
          <h3 className="text-xl font-semibold text-gray-200 mt-4">Interests</h3>
          <p className="text-gray-400 mt-2">Enjoys AI/ML, NoSQL, full-stack web dev, and Minecraft modding. Passionate about automation.</p>
        </div>
        <div className="p-6 bg-slate-800 rounded-lg shadow-lg text-center hover:scale-105 transition-transform">
          <CodeBracketIcon className="h-10 w-10 text-blue-400 mx-auto" />
          <h3 className="text-xl font-semibold text-gray-200 mt-4">Skills</h3>
          <p className="text-gray-400 mt-2">Expert in Python, JavaScript, React, AI/ML, NoSQL, and SQL.</p>
        </div>
      </div>
    </section>
  );
}

export default About;