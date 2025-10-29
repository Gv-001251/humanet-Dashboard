import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/common/Button';
import { ChevronDown, ChevronUp, Mail, Video, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How to upload resumes?',
    answer: 'Go to HireSmart page, click "Upload Resumes" button, and select PDF, DOCX, or CSV files from your computer. You can upload multiple files at once.'
  },
  {
    question: 'What is ATS score?',
    answer: 'ATS (Applicant Tracking System) score is an AI-calculated percentage (0-100%) that measures how well a candidate\'s resume matches the job requirements. A score above 70% is generally considered good.'
  },
  {
    question: 'How does AutoMatch work?',
    answer: 'AutoMatch analyzes project requirements and employee skills/availability to recommend the best team composition.'
  },
  {
    question: 'How to predict salaries?',
    answer: 'Navigate to Salary Analysis, fill in the form with role, skills, experience, location, and other details. Click "Predict Salary" to get salary range predictions.'
  },
  {
    question: 'What are role permissions?',
    answer: 'HumaNet supports multiple roles: HR (full hiring access), Team Lead (project management), CEO (all analytics), Investor (performance insights), and Admin (full system access). Each role sees different dashboard views and analytics.'
  },
  {
    question: 'How to configure ATS settings?',
    answer: 'Go to Settings > ATS Configuration tab. Here you can set default threshold values and manage skills keyword list that the ATS algorithm uses for scoring resumes.'
  }
];

const videos = [
  { id: '1', title: 'Getting Started with HumaNet', duration: '5:30' },
  { id: '2', title: 'HireSmart Resume Parsing Tutorial', duration: '8:15' },
  { id: '3', title: 'AutoMatch Project Staffing Demo', duration: '6:45' },
  { id: '4', title: 'Salary Prediction & Analytics', duration: '7:20' }
];

export const HelpInfo: React.FC = () => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Support ticket submitted!');
    setContactForm({ name: '', email: '', message: '' });
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Help & Information</h1>
          <p className="text-gray-600">FAQs, video tutorials, and support</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* FAQs */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <HelpCircle className="w-5 h-5 mr-2 text-blue-600" />
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      {expandedFAQ === index ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    {expandedFAQ === index && (
                      <div className="px-4 pb-4 text-gray-600">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Video Tutorials */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Video className="w-5 h-5 mr-2 text-green-600" />
                Video Tutorials
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videos.map(video => (
                  <div key={video.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="w-full h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-3 flex items-center justify-center">
                      <Video className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="font-medium text-gray-900">{video.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{video.duration}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">About HumaNet</h2>
              <div className="space-y-3 text-gray-600">
                <p>
                  <strong>HumaNet</strong> is an AI-powered human capital intelligence platform designed for modern HR teams.
                </p>
                <p>
                  Built for <strong>VibEAIthon Hackathon</strong> by a passionate team committed to revolutionizing talent management with cutting-edge AI.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <p className="text-blue-900 font-medium">Team Members:</p>
                  <ul className="mt-2 space-y-1 text-blue-800">
                    <li>• Anjali Sharma - Full Stack Developer</li>
                    <li>• Rahul Verma - AI/ML Engineer</li>
                    <li>• Priya Singh - UI/UX Designer</li>
                    <li>• Vikram Rao - Product Lead</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <p className="font-medium text-gray-900">Key Features:</p>
                  <ul className="mt-2 space-y-1 text-gray-700 text-sm">
                    <li>✓ AI Resume Parsing with ATS Scoring</li>
                    <li>✓ Smart Project Staffing Recommendations</li>
                    <li>✓ Salary Benchmarking & Predictions</li>
                    <li>✓ Real-time Analytics & Insights</li>
                    <li>✓ Role-based Access Control</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-purple-600" />
                Contact Support
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    required
                    value={contactForm.name}
                    onChange={e => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    required
                    type="email"
                    value={contactForm.email}
                    onChange={e => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    required
                    value={contactForm.message}
                    onChange={e => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={5}
                  />
                </div>
                <Button type="submit" variant="primary" className="w-full">
                  Submit Ticket
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2 font-medium">Quick Links:</p>
                <ul className="text-sm text-blue-600 space-y-1">
                  <li><a href="#" className="hover:underline">Documentation</a></li>
                  <li><a href="#" className="hover:underline">API Reference</a></li>
                  <li><a href="#" className="hover:underline">Release Notes</a></li>
                  <li><a href="#" className="hover:underline">Community Forum</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
