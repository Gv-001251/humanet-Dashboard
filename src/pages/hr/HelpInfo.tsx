import React, { useState } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
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
  Users,
  Shield,
  Zap
} from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    question: 'How do I add a new employee to the system?',
    answer: 'Navigate to the Employee section and click the "Add Employee" button. Fill in all required details including name, email, role, and skills. The employee will receive a welcome email with login credentials.',
    category: 'Employee Management',
  },
  {
    question: 'How does AutoMatch work?',
    answer: 'AutoMatch uses AI algorithms to analyze project requirements and employee skills. It suggests the best team composition based on skill matching, availability, and past performance. Simply select a project and view recommended employees.',
    category: 'AutoMatch',
  },
  {
    question: 'What is the ATS score in HireSmart?',
    answer: 'The ATS (Applicant Tracking System) score is an AI-powered rating from 0-100% that evaluates how well a resume matches job requirements. Scores above 85% indicate strong candidates. The system analyzes skills, experience, and keyword matching.',
    category: 'HireSmart',
  },
  {
    question: 'How do employees progress through Portal levels?',
    answer: 'Employees complete tasks assigned to each level (L1-L8). Upon successful completion, they earn points and progress to the next level. HR can track progress in real-time and assign custom tasks based on skill development needs.',
    category: 'Portal',
  },
  {
    question: 'How accurate is the Salary Prediction feature?',
    answer: 'Salary predictions are based on real-time market data aggregated from multiple sources across different regions and industries. The system updates quarterly and considers factors like experience, location, and industry standards.',
    category: 'Salary Prediction',
  },
  {
    question: 'Can I customize AI HR Assistant responses?',
    answer: 'Yes! The AI Assistant can be fine-tuned based on your company policies and preferences. Contact support to set up custom training data and response templates specific to your organization.',
    category: 'AI HR Assistance',
  },
  {
    question: 'How do I enable dark mode?',
    answer: 'Go to Settings > Appearance and toggle the Dark Mode switch. Your preference will be saved automatically and applied across all dashboard pages.',
    category: 'Settings',
  },
  {
    question: 'Is my employee data secure?',
    answer: 'Yes. We use enterprise-grade encryption (AES-256) for data at rest and TLS 1.3 for data in transit. Two-factor authentication is available for additional security. All data is backed up daily with 30-day retention.',
    category: 'Security',
  },
];

const HelpInfo: React.FC = () => {
  const { darkMode } = useTheme();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(faqs.map(faq => faq.category)))];
  
  const filteredFAQs = selectedCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <div className={`flex min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <div className="pt-20 px-8 py-8">
          <div className="mb-8">
            <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Help & Information
            </h1>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Documentation, guides, and support resources for Humanet HR Platform
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { icon: Book, label: 'Documentation', desc: 'Complete guides', color: 'blue' },
              { icon: Video, label: 'Video Tutorials', desc: 'Step-by-step videos', color: 'purple' },
              { icon: MessageCircle, label: 'Live Chat', desc: '24/7 support', color: 'green' },
              { icon: Mail, label: 'Email Support', desc: 'support@humanet.com', color: 'orange' },
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
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-${item.color}-50`}>
                    <Icon className={`w-6 h-6 text-${item.color}-600`} />
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
                  title: 'Dashboard Overview',
                  description: 'Learn about key metrics, charts, and navigation',
                  icon: Zap,
                },
                {
                  title: 'Employee Management',
                  description: 'Add, edit, and track employee information',
                  icon: Users,
                },
                {
                  title: 'AI-Powered Features',
                  description: 'Leverage AutoMatch, HireSmart, and AI Assistant',
                  icon: HelpCircle,
                },
                {
                  title: 'Security Best Practices',
                  description: 'Configure 2FA, session timeout, and permissions',
                  icon: Shield,
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
            <div className="flex gap-2 mb-6 overflow-x-auto">
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

          {/* System Info */}
          <div className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center gap-3 mb-6">
              <Info className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                System Information
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Platform Details
                </h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Version:</dt>
                    <dd className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>v2.5.0</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Last Updated:</dt>
                    <dd className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Oct 14, 2025</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className={darkMode ? 'text-gray-400' : 'text-gray-600'}>License:</dt>
                    <dd className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Enterprise</dd>
                  </div>
                </dl>
              </div>
              <div>
                <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Contact Support
                </h3>
                <dl className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    <a href="mailto:support@humanet.com" className="text-blue-600 hover:underline">
                      support@humanet.com
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-900'}>+91 98765 43210</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-900'}>24/7 Live Chat Available</span>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpInfo;
