import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { Send, Bot, User, Sparkles, TrendingUp, FileText, Users, Calendar, Loader2 } from 'lucide-react';
import { HRAssistanceService } from '../../services/api/hrAssistanceService';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'task' | 'analysis';
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  prompt: string;
}

const quickActions: QuickAction[] = [
  {
    id: '1',
    title: 'Analyze Employee Performance',
    description: 'Get insights on team productivity and skill gaps',
    icon: TrendingUp,
    prompt: 'Analyze the performance of all employees and identify top performers and areas of improvement',
  },
  {
    id: '2',
    title: 'Generate Job Description',
    description: 'Create AI-powered job descriptions for new roles',
    icon: FileText,
    prompt: 'Generate a comprehensive job description for a Senior Frontend Developer position',
  },
  {
    id: '3',
    title: 'Recommend Team Composition',
    description: 'Get AI suggestions for optimal team structure',
    icon: Users,
    prompt: 'Recommend the best team composition for a new e-commerce project requiring frontend, backend, and design skills',
  },
  {
    id: '4',
    title: 'Schedule Optimization',
    description: 'Optimize meeting schedules and workload distribution',
    icon: Calendar,
    prompt: 'Analyze current team schedules and suggest optimal meeting times and workload distribution',
  },
];

const HRAssistance: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI HR Assistant. I can help you with employee analytics, hiring decisions, task automation, team optimization, and much more. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'text',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Performance Analysis
    if (lowerMessage.includes('performance') || lowerMessage.includes('analyze')) {
      return `📊 **Performance Analysis Report**\n\nBased on current data:\n\n✅ **Top Performers:**\n- Mufti Hidayat (L6, 890 points, 95% accuracy)\n- Fauzan Ardhiansyah (L5, 650 points, 88% accuracy)\n\n⚠️ **Areas of Improvement:**\n- 15% of employees stuck at L2-L3 for over 3 months\n- Average task completion time increased by 12% this quarter\n\n💡 **Recommendations:**\n1. Implement mentorship program pairing L5+ with L2-L3 employees\n2. Introduce skill-specific workshops for struggling areas\n3. Consider workload redistribution for overburdened team members`;
    }

    // Job Description
    if (lowerMessage.includes('job description') || lowerMessage.includes('jd')) {
      return `📝 **Senior Frontend Developer - Job Description**\n\n**Position:** Senior Frontend Developer\n**Experience:** 5+ years\n**Location:** Coimbatore, Tamil Nadu\n\n**Key Responsibilities:**\n- Lead frontend architecture and design decisions\n- Mentor junior developers and conduct code reviews\n- Optimize application performance and user experience\n- Collaborate with design and backend teams\n\n**Required Skills:**\n- Expert in React.js, TypeScript, and modern JavaScript\n- Strong CSS/SCSS and responsive design expertise\n- Experience with state management (Redux, Context API)\n- Knowledge of testing frameworks (Jest, React Testing Library)\n\n**Preferred:**\n- Experience with Next.js and SSR\n- Familiarity with CI/CD pipelines\n- Open source contributions\n\n**Salary Range:** ₹12-18 LPA (based on experience)`;
    }

    // Team Composition
    if (lowerMessage.includes('team') || lowerMessage.includes('composition')) {
      return `👥 **Optimal Team Composition for E-Commerce Project**\n\n**Recommended Team (7 members):**\n\n**Frontend (2):**\n- Fauzan Ardhiansyah (UI Designer, L5) - UI/UX and component design\n- Bagus Fikri (CEO, L4) - Strategic oversight and React development\n\n**Backend (2):**\n- Mufti Hidayat (Project Manager, L6) - Architecture and API design\n- 1 additional Backend Developer (recommended hire)\n\n**Design (1):**\n- Ihdizein (Illustrator, L3) - Graphics and branding\n\n**QA/Testing (1):**\n- Recommended hire for dedicated testing\n\n**DevOps (1):**\n- Recommended hire for deployment and CI/CD\n\n**Estimated Timeline:** 4-6 months\n**Budget:** ₹45-60 lakhs total cost`;
    }

    // Schedule Optimization
    if (lowerMessage.includes('schedule') || lowerMessage.includes('meeting')) {
      return `📅 **Schedule Optimization Analysis**\n\n**Current Issues:**\n- 23 meetings scheduled per week (avg 4.6 per day)\n- 35% meeting overlap causing productivity loss\n- Peak meeting time: 2-4 PM (conflicts with deep work hours)\n\n**Optimized Schedule:**\n\n**Morning Block (9-11 AM):**\n- Daily standup: 9:00-9:15 AM\n- Deep work: 9:30-11:30 AM\n\n**Afternoon Block (2-5 PM):**\n- Collaborative meetings: 2-3:30 PM\n- Review sessions: 3:30-4:30 PM\n\n**Recommendations:**\n1. Move all 1-on-1s to Tuesday/Thursday afternoons\n2. Reserve Fridays for async work (no meetings)\n3. Implement "No Meeting Wednesdays" mornings\n4. Use Slack for quick syncs instead of 15-min meetings`;
    }

    // Hiring
    if (lowerMessage.includes('hire') || lowerMessage.includes('recruit')) {
      return `🎯 **Hiring Recommendations**\n\nBased on current project pipeline and team gaps:\n\n**Priority Roles:**\n1. **Backend Developer** (Immediate)\n   - Reason: 3 projects awaiting backend resources\n   - Suggested salary: ₹8-12 LPA\n   - Skills: Node.js, MongoDB, AWS\n\n2. **QA Engineer** (High Priority)\n   - Reason: Quality issues increased 18% last quarter\n   - Suggested salary: ₹6-9 LPA\n\n3. **DevOps Engineer** (Medium Priority)\n   - Reason: Manual deployment taking 3+ hours\n   - Suggested salary: ₹10-15 LPA\n\n**Recommended Hiring Strategy:**\n- Use HireSmart for ATS filtering\n- Target candidates with 85+ ATS scores\n- Prioritize candidates with startup experience`;
    }

    // Default response
    return `I understand you're asking about "${userMessage}". I can help you with:\n\n- 📊 Employee performance analytics\n- 📝 Job description generation\n- 👥 Team composition recommendations\n- 📅 Schedule optimization\n- 💰 Salary predictions\n- 🎯 Hiring strategies\n- 📈 Skill gap analysis\n- 🤖 Task automation\n\nPlease provide more specific details about what you'd like to know, or use one of the quick action buttons below!`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
    };

    const queryText = inputValue;
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await HRAssistanceService.askQuery(queryText);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        sender: 'ai',
        timestamp: new Date(response.timestamp),
        type: 'text',
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(queryText),
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
      };
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (prompt: string) => {
    setInputValue(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <div className="pt-20 px-8 py-8 h-screen flex flex-col">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Bot className="w-8 h-8 text-blue-600" />
              AI HR Assistance
            </h1>
            <p className="text-gray-600">
              Intelligent assistant powered by AI/ML for automated HR tasks and smart decision-making
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {quickActions.map(action => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action.prompt)}
                  className="bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-500 hover:shadow-lg transition text-left"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                  </div>
                  <h3 className="font-semibold text-sm text-gray-900 mb-1">{action.title}</h3>
                  <p className="text-xs text-gray-600">{action.description}</p>
                </button>
              );
            })}
          </div>

          {/* Chat Container */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'ai' && (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-2xl rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {message.sender === 'user' && (
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about HR tasks, analytics, hiring, or automation..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isTyping ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Thinking
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRAssistance;
