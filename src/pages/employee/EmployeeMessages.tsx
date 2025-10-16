import React, { useState } from 'react';
import { EmployeeSidebar } from '../../components/layout/EmployeeSidebar';
import { Header } from '../../components/layout/Header';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Send, 
  Search, 
  Users, 
  User, 
  Clock, 
  CheckCheck,
  Paperclip,
  Smile,
  MoreVertical,
  Shield,
  Phone,
  Video
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

interface Chat {
  id: string;
  type: 'individual' | 'team' | 'hr';
  name: string;
  avatarUrl?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  status?: 'online' | 'offline';
  members?: string[];
}

const EmployeeMessages: React.FC = () => {
  const { darkMode } = useTheme();

  const [chats] = useState<Chat[]>([
    {
      id: 'hr1',
      type: 'hr',
      name: 'HR Team',
      avatarUrl: 'https://randomuser.me/api/portraits/women/50.jpg',
      lastMessage: 'Your leave request has been approved',
      lastMessageTime: new Date(2025, 9, 14, 10, 30),
      unreadCount: 1,
      status: 'online',
    },
    {
      id: 'team1',
      type: 'team',
      name: 'E-Commerce Project Team',
      lastMessage: 'Great work on the product page! 🎉',
      lastMessageTime: new Date(2025, 9, 14, 9, 15),
      unreadCount: 3,
      members: ['Bagus Fikri', 'Ihdizein', 'Mufti Hidayat', 'Fauzan'],
    },
    {
      id: 'team2',
      type: 'team',
      name: 'Mobile App Team',
      lastMessage: 'Sprint planning meeting at 3 PM',
      lastMessageTime: new Date(2025, 9, 13, 16, 45),
      unreadCount: 0,
      members: ['Sarah', 'John'],
    },
    {
      id: 'ind1',
      type: 'individual',
      name: 'Ihdizein',
      avatarUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
      lastMessage: 'Can you review my design mockups?',
      lastMessageTime: new Date(2025, 9, 13, 14, 20),
      unreadCount: 0,
      status: 'online',
    },
    {
      id: 'ind2',
      type: 'individual',
      name: 'Mufti Hidayat',
      avatarUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
      lastMessage: 'Thanks for the update!',
      lastMessageTime: new Date(2025, 9, 12, 11, 10),
      unreadCount: 0,
      status: 'offline',
    },
  ]);

  const [mockMessages] = useState<Record<string, Message[]>>({
    hr1: [
      {
        id: 'msg1',
        senderId: 'HR',
        senderName: 'HR Team',
        content: 'Hi Bagus, we received your leave request for October 20-22.',
        timestamp: new Date(2025, 9, 14, 10, 15),
        read: true,
      },
      {
        id: 'msg2',
        senderId: 'EMP01',
        senderName: 'Bagus Fikri',
        content: 'Thank you! It\'s for a family event.',
        timestamp: new Date(2025, 9, 14, 10, 20),
        read: true,
      },
      {
        id: 'msg3',
        senderId: 'HR',
        senderName: 'HR Team',
        content: 'Your leave request has been approved',
        timestamp: new Date(2025, 9, 14, 10, 30),
        read: false,
      },
    ],
    team1: [
      {
        id: 'msg4',
        senderId: 'TM2',
        senderName: 'Ihdizein',
        content: 'Hey team! I\'ve uploaded the new design mockups',
        timestamp: new Date(2025, 9, 14, 9, 0),
        read: true,
      },
      {
        id: 'msg5',
        senderId: 'EMP01',
        senderName: 'Bagus Fikri',
        content: 'Looks great! I\'ll start implementing the product page',
        timestamp: new Date(2025, 9, 14, 9, 10),
        read: true,
      },
      {
        id: 'msg6',
        senderId: 'TM3',
        senderName: 'Mufti Hidayat',
        content: 'Great work on the product page! 🎉',
        timestamp: new Date(2025, 9, 14, 9, 15),
        read: false,
      },
    ],
  });

  const [selectedChat, setSelectedChat] = useState<Chat | null>(chats[0]);
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'individual' | 'team' | 'hr'>('all');

  const filteredChats = chats.filter(chat => {
    const typeMatch = filterType === 'all' || chat.type === filterType;
    const searchMatch = chat.name.toLowerCase().includes(searchQuery.toLowerCase());
    return typeMatch && searchMatch;
  });

  const handleSendMessage = () => {
    if (!inputValue.trim() || !selectedChat) return;
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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

  const getChatIcon = (chat: Chat) => {
    if (chat.type === 'team') return Users;
    if (chat.type === 'hr') return Shield;
    return User;
  };

  return (
    <div className={`flex min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <EmployeeSidebar />
      <div className="flex-1 ml-64">
        <Header />
        <div className="pt-20 px-8 py-8 h-screen flex flex-col">
          <div className="mb-6">
            <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Messages
            </h1>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Chat with team members, colleagues, and HR
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            {(['all', 'individual', 'team', 'hr'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition ${
                  filterType === type
                    ? 'bg-blue-600 text-white'
                    : darkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className={`flex-1 rounded-xl shadow-sm border flex overflow-hidden ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            {/* Left Sidebar - Conversations List */}
            <div className={`w-80 border-r flex flex-col ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className={`p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 placeholder-gray-500'
                    }`}
                  />
                </div>
              </div>

              <div className={`flex-1 overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                {filteredChats.map(chat => {
                  const Icon = getChatIcon(chat);
                  const isSelected = selectedChat?.id === chat.id;
                  return (
                    <div
                      key={chat.id}
                      onClick={() => setSelectedChat(chat)}
                      className={`p-4 border-b cursor-pointer transition ${
                        isSelected
                          ? darkMode
                            ? 'bg-gray-700 border-gray-600'
                            : 'bg-blue-50 border-blue-200'
                          : darkMode
                          ? 'bg-gray-800 border-gray-700 hover:bg-gray-750'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          {chat.avatarUrl ? (
                            <img
                              src={chat.avatarUrl}
                              alt={chat.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              darkMode ? 'bg-gray-700' : 'bg-gray-200'
                            }`}>
                              <Icon className={`w-6 h-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                            </div>
                          )}
                          {chat.status && (
                            <span
                              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${
                                darkMode ? 'border-gray-800' : 'border-white'
                              } ${chat.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {chat.name}
                            </h3>
                            {chat.unreadCount > 0 && (
                              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full ml-2 flex-shrink-0">
                                {chat.unreadCount}
                              </span>
                            )}
                          </div>
                          {chat.type === 'team' && chat.members && (
                            <p className="text-xs mb-1 text-gray-500">
                              {chat.members.length} members
                            </p>
                          )}
                          <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {chat.lastMessage}
                          </p>
                          <p className="text-xs mt-1 flex items-center gap-1 text-gray-500">
                            <Clock className="w-3 h-3" />
                            {formatTime(chat.lastMessageTime)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Side - Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedChat ? (
                <>
                  <div className={`p-4 border-b flex items-center justify-between ${
                    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      {selectedChat.avatarUrl ? (
                        <img
                          src={selectedChat.avatarUrl}
                          alt={selectedChat.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-200'
                        }`}>
                          {React.createElement(getChatIcon(selectedChat), { 
                            className: `w-6 h-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}` 
                          })}
                        </div>
                      )}
                      <div>
                        <h2 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {selectedChat.name}
                        </h2>
                        {selectedChat.type === 'team' && selectedChat.members && (
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {selectedChat.members.join(', ')}
                          </p>
                        )}
                        {selectedChat.status && (
                          <p className={`text-xs flex items-center gap-1 ${
                            selectedChat.status === 'online' ? 'text-green-500' : 'text-gray-500'
                          }`}>
                            <span className={`w-2 h-2 rounded-full ${
                              selectedChat.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                            }`} />
                            {selectedChat.status === 'online' ? 'Online' : 'Offline'}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                        <Phone className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                      </button>
                      <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                        <Video className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                      </button>
                      <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                        <MoreVertical className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                      </button>
                    </div>
                  </div>

                  <div className={`flex-1 overflow-y-auto p-6 space-y-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                    {mockMessages[selectedChat.id]?.map(message => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.senderId === 'EMP01' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.senderId !== 'EMP01' && (
                          <div className="w-8 h-8 flex-shrink-0">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-blue-600 text-white">
                              {message.senderName.charAt(0)}
                            </div>
                          </div>
                        )}
                        <div
                          className={`max-w-md rounded-2xl px-4 py-3 ${
                            message.senderId === 'EMP01'
                              ? 'bg-blue-600 text-white'
                              : darkMode
                              ? 'bg-gray-800 text-gray-100 border border-gray-700'
                              : 'bg-white text-gray-900 border border-gray-200'
                          }`}
                        >
                          {message.senderId !== 'EMP01' && (
                            <p className={`text-xs font-semibold mb-1 ${
                              darkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {message.senderName}
                            </p>
                          )}
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className={`text-xs ${
                              message.senderId === 'EMP01' ? 'text-blue-200' : 'text-gray-500'
                            }`}>
                              {message.timestamp.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                            {message.senderId === 'EMP01' && message.read && (
                              <CheckCheck className="w-4 h-4 text-blue-200" />
                            )}
                          </div>
                        </div>
                        {message.senderId === 'EMP01' && (
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Input Area */}
                  <div className={`border-t p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="flex gap-3 items-center">
                      <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}>
                        <Paperclip className="w-5 h-5" />
                      </button>
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={`Message ${selectedChat.name}...`}
                        className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          darkMode
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 placeholder-gray-500'
                        }`}
                      />
                      <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}>
                        <Smile className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim()}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Send className="w-5 h-5" />
                        Send
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className={`flex-1 flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                  <div className="text-center">
                    <Users className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      No Conversation Selected
                    </h3>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Select a chat to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeMessages;
