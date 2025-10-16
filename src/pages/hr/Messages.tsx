import React, { useState } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { Send, Search, Users, User, Clock, CheckCheck } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

interface Conversation {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeRole: string;
  avatarUrl: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  status: 'online' | 'offline';
}

const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    employeeId: 'EMP01',
    employeeName: 'Bagus Fikri',
    employeeRole: 'CEO',
    avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
    lastMessage: 'Thank you for the feedback on my recent work',
    lastMessageTime: new Date(2025, 9, 14, 10, 30),
    unreadCount: 2,
    status: 'online',
  },
  {
    id: 'conv2',
    employeeId: 'EMP02',
    employeeName: 'Ihdizein',
    employeeRole: 'Illustrator',
    avatarUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
    lastMessage: 'Can we discuss the new project requirements?',
    lastMessageTime: new Date(2025, 9, 14, 9, 15),
    unreadCount: 0,
    status: 'online',
  },
  {
    id: 'conv3',
    employeeId: 'EMP03',
    employeeName: 'Mufti Hidayat',
    employeeRole: 'Project Manager',
    avatarUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
    lastMessage: 'The team is progressing well on L6 tasks',
    lastMessageTime: new Date(2025, 9, 13, 16, 45),
    unreadCount: 1,
    status: 'offline',
  },
  {
    id: 'conv4',
    employeeId: 'EMP04',
    employeeName: 'Fauzan Ardhiansyah',
    employeeRole: 'UI Designer',
    avatarUrl: 'https://randomuser.me/api/portraits/men/4.jpg',
    lastMessage: 'I have completed the design mockups',
    lastMessageTime: new Date(2025, 9, 13, 14, 20),
    unreadCount: 0,
    status: 'offline',
  },
];

const mockMessages: Record<string, Message[]> = {
  conv1: [
    {
      id: 'msg1',
      senderId: 'HR',
      senderName: 'HR Team',
      content: 'Hi Bagus, great work on completing Level 4 tasks! Your performance has been exceptional.',
      timestamp: new Date(2025, 9, 14, 10, 15),
      read: true,
    },
    {
      id: 'msg2',
      senderId: 'EMP01',
      senderName: 'Bagus Fikri',
      content: 'Thank you for the feedback on my recent work',
      timestamp: new Date(2025, 9, 14, 10, 30),
      read: true,
    },
  ],
  conv2: [
    {
      id: 'msg3',
      senderId: 'EMP02',
      senderName: 'Ihdizein',
      content: 'Can we discuss the new project requirements?',
      timestamp: new Date(2025, 9, 14, 9, 15),
      read: true,
    },
    {
      id: 'msg4',
      senderId: 'HR',
      senderName: 'HR Team',
      content: 'Sure! Let me know when you are available for a meeting.',
      timestamp: new Date(2025, 9, 14, 9, 20),
      read: true,
    },
  ],
  conv3: [
    {
      id: 'msg5',
      senderId: 'EMP03',
      senderName: 'Mufti Hidayat',
      content: 'The team is progressing well on L6 tasks',
      timestamp: new Date(2025, 9, 13, 16, 45),
      read: false,
    },
  ],
  conv4: [
    {
      id: 'msg6',
      senderId: 'EMP04',
      senderName: 'Fauzan Ardhiansyah',
      content: 'I have completed the design mockups',
      timestamp: new Date(2025, 9, 13, 14, 20),
      read: true,
    },
  ],
};

const Messages: React.FC = () => {
  const [conversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0]);
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBroadcast, setShowBroadcast] = useState(false);

  const filteredConversations = conversations.filter(conv =>
    conv.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.employeeRole.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!inputValue.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: `msg${Date.now()}`,
      senderId: 'HR',
      senderName: 'HR Team',
      content: inputValue,
      timestamp: new Date(),
      read: false,
    };

    setMessages(prev => ({
      ...prev,
      [selectedConversation.id]: [...(prev[selectedConversation.id] || []), newMessage],
    }));

    setInputValue('');
  };

  const handleBroadcastMessage = () => {
    if (!inputValue.trim()) return;

    const timestamp = new Date();
    conversations.forEach(conv => {
      const broadcastMessage: Message = {
        id: `broadcast${Date.now()}-${conv.id}`,
        senderId: 'HR',
        senderName: 'HR Team',
        content: `📢 BROADCAST MESSAGE:\n\n${inputValue}`,
        timestamp,
        read: false,
      };

      setMessages(prev => ({
        ...prev,
        [conv.id]: [...(prev[conv.id] || []), broadcastMessage],
      }));
    });

    setInputValue('');
    setShowBroadcast(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (showBroadcast) {
        handleBroadcastMessage();
      } else {
        handleSendMessage();
      }
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <div className="pt-20 px-8 py-8 h-screen flex flex-col">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
              <p className="text-gray-600">Communicate with employees individually or broadcast to all</p>
            </div>
            <button
              onClick={() => setShowBroadcast(!showBroadcast)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Users className="w-5 h-5" />
              {showBroadcast ? 'Cancel Broadcast' : 'Broadcast Message'}
            </button>
          </div>

          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex overflow-hidden">
            {/* Left Sidebar - Conversations List */}
            <div className="w-80 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map(conv => (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setSelectedConversation(conv);
                      setShowBroadcast(false);
                    }}
                    className={`p-4 border-b cursor-pointer transition ${
                      selectedConversation?.id === conv.id
                        ? 'bg-blue-50 border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <img
                          src={conv.avatarUrl}
                          alt={conv.employeeName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <span
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                            conv.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">{conv.employeeName}</h3>
                          {conv.unreadCount > 0 && (
                            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mb-1">{conv.employeeRole}</p>
                        <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(conv.lastMessageTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Chat Area */}
            <div className="flex-1 flex flex-col">
              {showBroadcast ? (
                <div className="flex-1 flex flex-col">
                  <div className="p-4 border-b bg-blue-50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="font-bold text-gray-900">Broadcast to All Employees</h2>
                        <p className="text-sm text-gray-600">Message will be sent to {conversations.length} employees</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                      <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Broadcast Message</h3>
                      <p className="text-gray-600">Type your message below to send to all employees</p>
                    </div>
                  </div>
                </div>
              ) : selectedConversation ? (
                <>
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={selectedConversation.avatarUrl}
                          alt={selectedConversation.employeeName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <span
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                            selectedConversation.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                          }`}
                        />
                      </div>
                      <div>
                        <h2 className="font-bold text-gray-900">{selectedConversation.employeeName}</h2>
                        <p className="text-sm text-gray-600">{selectedConversation.employeeRole}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                    {messages[selectedConversation.id]?.map(message => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.senderId === 'HR' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.senderId !== 'HR' && (
                          <div className="w-8 h-8 flex-shrink-0">
                            <img
                              src={selectedConversation.avatarUrl}
                              alt={message.senderName}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          </div>
                        )}
                        <div
                          className={`max-w-md rounded-2xl px-4 py-3 ${
                            message.senderId === 'HR'
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-900 border border-gray-200'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p
                              className={`text-xs ${
                                message.senderId === 'HR' ? 'text-blue-200' : 'text-gray-500'
                              }`}
                            >
                              {message.timestamp.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                            {message.senderId === 'HR' && message.read && (
                              <CheckCheck className="w-4 h-4 text-blue-200" />
                            )}
                          </div>
                        </div>
                        {message.senderId === 'HR' && (
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Conversation Selected</h3>
                    <p className="text-gray-600">Select an employee to start messaging</p>
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="border-t p-4 bg-white">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      showBroadcast
                        ? 'Type broadcast message for all employees...'
                        : selectedConversation
                        ? `Message ${selectedConversation.employeeName}...`
                        : 'Select a conversation to start messaging...'
                    }
                    disabled={!showBroadcast && !selectedConversation}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                  <button
                    onClick={showBroadcast ? handleBroadcastMessage : handleSendMessage}
                    disabled={!inputValue.trim() || (!showBroadcast && !selectedConversation)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
