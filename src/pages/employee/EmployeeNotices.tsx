import React, { useState } from 'react';
import { EmployeeSidebar } from '../../components/layout/EmployeeSidebar';
import { Header } from '../../components/layout/Header';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Bell, 
  Pin, 
  AlertCircle, 
  Calendar, 
  FileText, 
  Megaphone,
  Bookmark,
  BookmarkCheck,
  Clock
} from 'lucide-react';

interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'Announcement' | 'Urgent' | 'Event' | 'Policy' | 'Holiday' | 'General';
  priority: 'Low' | 'Medium' | 'High';
  pinned: boolean;
  postedBy: string;
  postedDate: Date;
  expiryDate?: Date;
  isRead: boolean;
  isBookmarked: boolean;
}

const EmployeeNotices: React.FC = () => {
  const { darkMode } = useTheme();

  const [notices, setNotices] = useState<Notice[]>([
    {
      id: 'N001',
      title: 'Diwali Holiday Announcement',
      content: 'Office will remain closed from October 31st to November 3rd for Diwali celebrations. Wishing everyone a Happy Diwali!',
      category: 'Holiday',
      priority: 'High',
      pinned: true,
      postedBy: 'HR Team',
      postedDate: new Date(2025, 9, 10),
      expiryDate: new Date(2025, 10, 3),
      isRead: false,
      isBookmarked: true,
    },
    {
      id: 'N002',
      title: 'New HR Policy Update',
      content: 'Updated work-from-home policy: Employees can now work remotely up to 3 days per week. Please review the full policy document on the portal.',
      category: 'Policy',
      priority: 'High',
      pinned: true,
      postedBy: 'HR Team',
      postedDate: new Date(2025, 9, 12),
      isRead: false,
      isBookmarked: false,
    },
    {
      id: 'N003',
      title: 'Team Building Event - October 25th',
      content: 'Join us for a team building event at Tech Park Resort. Activities include team games, dinner, and networking. RSVP by October 20th.',
      category: 'Event',
      priority: 'Medium',
      pinned: false,
      postedBy: 'HR Team',
      postedDate: new Date(2025, 9, 13),
      expiryDate: new Date(2025, 9, 25),
      isRead: true,
      isBookmarked: true,
    },
    {
      id: 'N004',
      title: 'Portal System Launch',
      content: 'New SkillEnhancer portal is now live! Start completing tasks from L1-L8 to enhance your skills and earn points. Top performers will receive rewards.',
      category: 'Announcement',
      priority: 'Medium',
      pinned: false,
      postedBy: 'HR Team',
      postedDate: new Date(2025, 9, 8),
      isRead: true,
      isBookmarked: false,
    },
    {
      id: 'N005',
      title: 'URGENT: Server Maintenance',
      content: 'Scheduled server maintenance on October 18th from 12 AM to 4 AM. All systems will be temporarily unavailable. Please save your work.',
      category: 'Urgent',
      priority: 'High',
      pinned: false,
      postedBy: 'IT Team',
      postedDate: new Date(2025, 9, 14),
      expiryDate: new Date(2025, 9, 18),
      isRead: false,
      isBookmarked: false,
    },
    {
      id: 'N006',
      title: 'Monthly Town Hall Meeting',
      content: 'Join us for our monthly all-hands meeting on October 20th at 3 PM. CEO will share company updates and Q&A session.',
      category: 'Event',
      priority: 'Medium',
      pinned: false,
      postedBy: 'HR Team',
      postedDate: new Date(2025, 9, 9),
      expiryDate: new Date(2025, 9, 20),
      isRead: true,
      isBookmarked: false,
    },
  ]);

  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);

  const categoryColors = {
    Announcement: 'bg-blue-50 text-blue-700 border-blue-200',
    Urgent: 'bg-red-50 text-red-700 border-red-200',
    Event: 'bg-purple-50 text-purple-700 border-purple-200',
    Policy: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    Holiday: 'bg-green-50 text-green-700 border-green-200',
    General: 'bg-gray-50 text-gray-700 border-gray-200',
  };

  const categoryIcons = {
    Announcement: Megaphone,
    Urgent: AlertCircle,
    Event: Calendar,
    Policy: FileText,
    Holiday: Calendar,
    General: FileText,
  };

  const handleToggleRead = (id: string) => {
    setNotices(notices.map(notice => 
      notice.id === id ? { ...notice, isRead: !notice.isRead } : notice
    ));
  };

  const handleToggleBookmark = (id: string) => {
    setNotices(notices.map(notice => 
      notice.id === id ? { ...notice, isBookmarked: !notice.isBookmarked } : notice
    ));
  };

  const filteredNotices = notices.filter(notice => {
    const categoryMatch = filterCategory === 'All' || notice.category === filterCategory;
    const unreadMatch = !showUnreadOnly || !notice.isRead;
    const bookmarkMatch = !showBookmarkedOnly || notice.isBookmarked;
    return categoryMatch && unreadMatch && bookmarkMatch;
  });

  const pinnedNotices = filteredNotices.filter(n => n.pinned);
  const regularNotices = filteredNotices.filter(n => !n.pinned);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const unreadCount = notices.filter(n => !n.isRead).length;

  return (
    <div className={`flex min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <EmployeeSidebar />
      <div className="flex-1 ml-64">
        <Header />
        <div className="pt-20 px-8 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold mb-2 flex items-center gap-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Notices
                {unreadCount > 0 && (
                  <span className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </h1>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                Stay updated with company announcements and important information
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                  showUnreadOnly
                    ? 'bg-blue-600 text-white'
                    : darkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                <Bell className="w-4 h-4" />
                Unread Only
              </button>
              <button
                onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                  showBookmarkedOnly
                    ? 'bg-blue-600 text-white'
                    : darkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                <BookmarkCheck className="w-4 h-4" />
                Bookmarked
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {['All', 'Announcement', 'Urgent', 'Event', 'Policy', 'Holiday', 'General'].map(category => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                  filterCategory === category
                    ? 'bg-blue-600 text-white'
                    : darkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Pinned Notices */}
          {pinnedNotices.length > 0 && (
            <div className="mb-8">
              <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <Pin className="w-5 h-5 text-blue-600" />
                Pinned Notices
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pinnedNotices.map(notice => {
                  const Icon = categoryIcons[notice.category];
                  return (
                    <div
                      key={notice.id}
                      className={`border-2 rounded-xl p-6 relative ${
                        darkMode 
                          ? `bg-gray-800 border-gray-700 ${!notice.isRead ? 'ring-2 ring-blue-500' : ''}` 
                          : `${categoryColors[notice.category]} ${!notice.isRead ? 'ring-2 ring-blue-500' : ''}`
                      } shadow-md`}
                    >
                      {!notice.isRead && (
                        <div className="absolute top-4 right-4">
                          <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                            NEW
                          </span>
                        </div>
                      )}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Icon className="w-5 h-5" />
                          <span className={`text-xs font-bold uppercase ${
                            darkMode ? 'text-gray-300' : ''
                          }`}>{notice.category}</span>
                        </div>
                        <button
                          onClick={() => handleToggleBookmark(notice.id)}
                          className={`p-1 rounded hover:bg-white/50 transition`}
                        >
                          {notice.isBookmarked ? (
                            <BookmarkCheck className="w-5 h-5 text-yellow-600" />
                          ) : (
                            <Bookmark className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : ''}`}>{notice.title}</h3>
                      <p className={`text-sm mb-4 whitespace-pre-wrap ${darkMode ? 'text-gray-300' : ''}`}>{notice.content}</p>
                      <div className={`flex items-center justify-between text-xs ${darkMode ? 'text-gray-400' : ''}`}>
                        <div className="flex items-center gap-2">
                          <span>Posted by {notice.postedBy}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(notice.postedDate)}
                          </span>
                        </div>
                      </div>
                      {notice.expiryDate && (
                        <div className={`mt-2 text-xs ${darkMode ? 'text-gray-500' : 'opacity-75'}`}>
                          Valid until: {formatDate(notice.expiryDate)}
                        </div>
                      )}
                      <div className="mt-4">
                        <button
                          onClick={() => handleToggleRead(notice.id)}
                          className={`text-xs font-medium px-3 py-1 rounded ${
                            notice.isRead
                              ? darkMode
                                ? 'bg-gray-700 text-gray-300'
                                : 'bg-gray-200 text-gray-700'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {notice.isRead ? 'Mark as Unread' : 'Mark as Read'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Regular Notices */}
          <div>
            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              All Notices
            </h2>
            <div className="space-y-4">
              {regularNotices.map(notice => {
                const Icon = categoryIcons[notice.category];
                return (
                  <div
                    key={notice.id}
                    className={`rounded-xl p-6 border relative ${
                      darkMode 
                        ? `bg-gray-800 border-gray-700 ${!notice.isRead ? 'ring-2 ring-blue-500' : ''}` 
                        : `bg-white border-gray-200 ${!notice.isRead ? 'ring-2 ring-blue-500' : ''}`
                    } hover:shadow-md transition`}
                  >
                    {!notice.isRead && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                          NEW
                        </span>
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          darkMode ? 'bg-gray-700' : categoryColors[notice.category]
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className={`text-xs font-bold px-2 py-1 rounded ${
                            darkMode ? 'bg-gray-700 text-gray-300' : categoryColors[notice.category]
                          }`}>
                            {notice.category}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleBookmark(notice.id)}
                        className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                      >
                        {notice.isBookmarked ? (
                          <BookmarkCheck className="w-5 h-5 text-yellow-600" />
                        ) : (
                          <Bookmark className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                        )}
                      </button>
                    </div>
                    <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{notice.title}</h3>
                    <p className={`text-sm mb-4 whitespace-pre-wrap ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{notice.content}</p>
                    <div className={`flex items-center gap-4 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      <span>Posted by {notice.postedBy}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(notice.postedDate)}
                      </span>
                      {notice.expiryDate && (
                        <>
                          <span>•</span>
                          <span>Valid until: {formatDate(notice.expiryDate)}</span>
                        </>
                      )}
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() => handleToggleRead(notice.id)}
                        className={`text-xs font-medium px-3 py-1 rounded ${
                          notice.isRead
                            ? darkMode
                              ? 'bg-gray-700 text-gray-300'
                              : 'bg-gray-200 text-gray-700'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {notice.isRead ? 'Mark as Unread' : 'Mark as Read'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {filteredNotices.length === 0 && (
            <div className={`text-center py-12 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <Bell className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No notices found</p>
              <p className={`text-sm mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Try adjusting your filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeNotices;
