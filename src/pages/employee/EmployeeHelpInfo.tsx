import React, { useState } from 'react';
import { EmployeeSidebar } from '../../components/layout/EmployeeSidebar';
import { Header } from '../../components/layout/Header';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  HelpCircle, 
  Book, 
  MessageCircle, 
  Mail, 
  Phone, 
  FileText, 
  Video, 
  ChevronDown, 
  ChevronRight,
  ExternalLink,
  Info,
  Target,
  Award,
  Users,
  Zap
} from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    question: 'How do I update my skills in the Skill Enhancer?',
    answer: 'Go to Skill Enhancer page and click "Add Skill" button. Enter the skill name, category, and proficiency level. You can also update progress on existing skills by clicking "Update Progress" button. HR will be notified automatically of any changes.',
    category: 'Skill Development',
  },
  {
    question: 'How does the Portal level system work?',
    answer: 'The Portal has 8 levels (L1-L8). Complete assigned tasks at each level to earn points and progress. Higher levels unlock more advanced tasks and opportunities. Your progress is tracked in real-time and visible to HR.',
    category: 'Portal',
  },
  {
    question: 'How can I track my project progress?',
    answer: 'Visit the "My Projects" page to see all assigned projects. Each project shows your role, progress percentage, milestones, tasks, and team members. You can view project files and communicate with team members directly.',
    category: 'Projects',
  },
  {
    question: 'What do the achievement badges mean?',
    answer: 'Achievement badges are earned by completing tasks, reaching milestones, or demonstrating excellence. Categories include Skills, Projects, Tasks, and Collaboration. View all your badges in the Progress page.',
    category: 'Progress',
  },
  {
    question: 'How do I message my team members?',
    answer: 'Go to Messages page and select from three types of chats: Individual (one-on-one), Team (project teams), or HR (direct HR communication). You can search conversations and filter by type.',
    category: 'Communication',
  },
  {
    question: 'What are the different notice categories?',
    answer: 'Notices are categorized as: Announcement (general info), Urgent (immediate attention), Event (upcoming activities), Policy (company policies), Holiday (office closures), and General. You can filter and bookmark important notices.',
    category: 'Notices',
  },
  {
    question: 'How do I enable dark mode?',
    answer: 'Go to Settings > Appearance and toggle the Dark Mode switch. Your preference will be saved automatically and applied across all pages of the dashboard.',
    category: 'Settings',
  },
  {
    question: 'Can I change my notification preferences?',
    answer: 'Yes! Go to Settings > Notifications to control email alerts, push notifications, task reminders, project updates, message alerts, and notice notifications. Customize based on your preferences.',
    category: 'Settings',
  },
  {
    question: 'How are points and rankings calculated?',
    answer: 'Points are earned by completing tasks, reaching milestones, and demonstrating skills. Your rank is based on total points compared to all employees. View your rank and progress trends in the Progress page.',
    category: 'Progress',
  },
  {
    question: 'What if I forget my password?',
    answer: 'Click "Forgot Password" on the login page. You\'ll receive a password reset link via email. You can also change your password anytime from Settings > Security.',
    category: 'Account',
  },
];

const EmployeeHelpInfo: React.FC = () => {
  const { darkMode } = useTheme();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(faqs.map(faq => faq.category)))];
  
  const filteredFAQs = selectedCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <div className={`flex min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <EmployeeSidebar />
      <div className="flex-1 ml-64">
        <Header />
        <div className="pt-20 px-8 py-8">
          <div className="mb-8">
            <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Help & Information
            </h1>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Guides, tutorials, and support resources for employees
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { icon: Book, label: 'User Guide', desc: 'Step-by-step guides', color: 'blue' },
              { icon: Video, label: 'Video Tutorials', desc: 'Watch and learn', color: 'purple' },
              { icon: MessageCircle, label: 'Chat Support', desc: 'Get instant help', color: 'green' },
              { icon: Mail, label: 'Email HR', desc: 'hr@humanet.com', color: 'orange' },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className={`p-6 rounded-xl border cursor-pointer transition ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 hover:border-blue-500' 
                      : 'bg-white border-gray-200 hover:border-blue-500 hover:shadow-lg'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                    darkMode ? 'bg-gray-700' : `bg-${item.color}-50`
                  }`}>
                    <Icon className={`w-6 h-6 ${darkMode ? 'text-blue-400' : `text-${item.color}-600`}`} />
                  </div>
                  <h3 className={`font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.label}</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Getting Started */}
          <div className={`rounded-xl shadow-sm p-6 mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Getting Started
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Complete Your Profile',
                  description: 'Update your contact info and preferences in Settings',
                  icon: Users,
                },
                {
                  title: 'Explore Skill Enhancer',
                  description: 'Add skills and track your learning progress',
                  icon: Award,
                },
                {
                  title: 'Check Your Tasks',
                  description: 'View assigned tasks and project deadlines',
                  icon: Target,
                },
                {
                  title: 'Track Your Progress',
                  description: 'Monitor performance metrics and achievements',
                  icon: Zap,
                },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className={`flex gap-4 p-4 rounded-lg border cursor-pointer transition ${
                      darkMode 
                        ? 'border-gray-700 hover:bg-gray-700' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      darkMode ? 'bg-blue-900' : 'bg-blue-50'
                    }`}>
                      <Icon className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {item.title}
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.description}
                      </p>
                    </div>
                    <ExternalLink className={`w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* FAQs */}
          <div className={`rounded-xl shadow-sm p-6 mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Frequently Asked Questions
            </h2>

            {/* Category Filter */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* FAQ List */}
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <div
                  key={index}
                  className={`border rounded-lg overflow-hidden ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}
                >
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                    className={`w-full flex items-center justify-between p-4 transition ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 text-left">
                      {expandedFAQ === index ? (
                        <ChevronDown className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                      ) : (
                        <ChevronRight className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                      )}
                      <div>
                        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {faq.question}
                        </h3>
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          {faq.category}
                        </span>
                      </div>
                    </div>
                  </button>
                  {expandedFAQ === index && (
                    <div className={`p-4 pt-0 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* System Info & Support */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* System Info */}
            <div className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center gap-3 mb-6">
                <Info className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  System Information
                </h2>
              </div>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Version:</dt>
                  <dd className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>v2.5.0</dd>
                </div>
                <div className="flex justify-between">
                  <dt className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Last Updated:</dt>
                  <dd className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Oct 14, 2025</dd>
                </div>
                <div className="flex justify-between">
                  <dt className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Your Role:</dt>
                  <dd className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Employee</dd>
                </div>
                <div className="flex justify-between">
                  <dt className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Department:</dt>
                  <dd className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Engineering</dd>
                </div>
              </dl>
            </div>

            {/* Contact Support */}
            <div className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center gap-3 mb-6">
                <MessageCircle className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Contact Support
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email HR</p>
                    <a href="mailto:hr@humanet.com" className="text-blue-600 hover:underline font-medium">
                      hr@humanet.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Call HR</p>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>+91 98765 43210</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Live Chat</p>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Available 24/7</span>
                  </div>
                </div>
              </div>
              <button className="w-full mt-6 bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
                Contact HR Team
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeHelpInfo;
