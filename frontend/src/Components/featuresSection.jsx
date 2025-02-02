import { CloudArrowUpIcon, CpuChipIcon, AcademicCapIcon, UserCircleIcon, GlobeAltIcon, PencilSquareIcon } from '@heroicons/react/24/solid';

const features = [
  {
    title: 'File Storage',
    description: 'Securely store and access your files from anywhere with seamless cloud integration.',
    icon: CloudArrowUpIcon,
  },
  {
    title: 'AI Assistant',
    description: 'Get instant responses, automate tasks, and enhance productivity with AI-powered assistance.',
    icon: CpuChipIcon,
  },
  {
    title: 'College Resources',
    description: 'Organize assignments, access notes, and find essential academic resources in one place.',
    icon: AcademicCapIcon,
  },
  {
    title: 'Profile Website',
    description: 'Explore my portfolio and projects. Click to visit!',
    icon: UserCircleIcon,
    link: '/profile',
  },
  {
    title: 'Web Scraper & Research Tool',
    description: 'Extract data, gather insights, and speed up your research with advanced web scraping.',
    icon: GlobeAltIcon,
  },
  {
    title: 'Notes App',
    description: 'Take notes, create to-do lists, and stay organized with a minimalistic notes application.',
    icon: PencilSquareIcon,
  }
];

export default function FeaturesSection() {
  return (
    <div className="max-w-screen-xl mx-auto py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="relative group p-8 bg-slate-800 shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition duration-300"
          >
            <feature.icon className="w-12 h-12 text-blue-400 mb-4" />
            <h2 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
              {feature.title}
            </h2>
            <p className="mt-2 text-gray-400">{feature.description}</p>
            {feature.link && (
              <a
                href={feature.link}
                className="mt-4 inline-block text-blue-400 hover:underline"
              >
                Visit Now →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
