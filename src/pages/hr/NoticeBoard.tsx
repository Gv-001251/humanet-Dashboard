import React, { useState } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { Plus, Pin, AlertCircle, Calendar, FileText, Megaphone, X, Edit, Trash2 } from 'lucide-react';

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
}

const mockNotices: Notice[] = [
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
  },
];

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

const NoticeBoard: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>(mockNotices);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    category: 'General' as Notice['category'],
    priority: 'Medium' as Notice['priority'],
  });

  const filteredNotices = filterCategory === 'All' 
    ? notices 
    : notices.filter(notice => notice.category === filterCategory);

  const pinnedNotices = filteredNotices.filter(n => n.pinned);
  const regularNotices = filteredNotices.filter(n => !n.pinned);

  const handleCreateNotice = () => {
    if (!newNotice.title.trim() || !newNotice.content.trim()) return;

    const notice: Notice = {
      id: `N${String(notices.length + 1).padStart(3, '0')}`,
      title: newNotice.title,
      content: newNotice.content,
      category: newNotice.category,
      priority: newNotice.priority,
      pinned: false,
      postedBy: 'HR Team',
      postedDate: new Date(),
    };

    setNotices([notice, ...notices]);
    setNewNotice({ title: '', content: '', category: 'General', priority: 'Medium' });
    setShowCreateModal(false);
  };

  const handleTogglePin = (id: string) => {
    setNotices(notices.map(notice => 
      notice.id === id ? { ...notice, pinned: !notice.pinned } : notice
    ));
  };

  const handleDeleteNotice = (id: string) => {
    setNotices(notices.filter(notice => notice.id !== id));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <div className="pt-20 px-8 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Notice Board</h1>
              <p className="text-gray-600">Post and manage company-wide announcements and notices</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Post New Notice
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex gap-2 overflow-x-auto">
            {['All', 'Announcement', 'Urgent', 'Event', 'Policy', 'Holiday', 'General'].map(category => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                  filterCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Pinned Notices */}
          {pinnedNotices.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Pin className="w-5 h-5 text-blue-600" />
                Pinned Notices
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pinnedNotices.map(notice => {
                  const Icon = categoryIcons[notice.category];
                  return (
                    <div
                      key={notice.id}
                      className={`border-2 rounded-xl p-6 ${categoryColors[notice.category]} shadow-md`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Icon className="w-5 h-5" />
                          <span className="text-xs font-bold uppercase">{notice.category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleTogglePin(notice.id)}
                            className="p-1 hover:bg-white/50 rounded"
                          >
                            <Pin className="w-4 h-4 fill-current" />
                          </button>
                          <button
                            onClick={() => handleDeleteNotice(notice.id)}
                            className="p-1 hover:bg-white/50 rounded text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{notice.title}</h3>
                      <p className="text-sm mb-4 whitespace-pre-wrap">{notice.content}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span>Posted by {notice.postedBy}</span>
                        <span>{formatDate(notice.postedDate)}</span>
                      </div>
                      {notice.expiryDate && (
                        <div className="mt-2 text-xs opacity-75">
                          Valid until: {formatDate(notice.expiryDate)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Regular Notices */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">All Notices</h2>
            <div className="space-y-4">
              {regularNotices.map(notice => {
                const Icon = categoryIcons[notice.category];
                return (
                  <div
                    key={notice.id}
                    className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${categoryColors[notice.category]}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className={`text-xs font-bold px-2 py-1 rounded ${categoryColors[notice.category]}`}>
                            {notice.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleTogglePin(notice.id)}
                          className="p-2 hover:bg-gray-100 rounded"
                        >
                          <Pin className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteNotice(notice.id)}
                          className="p-2 hover:bg-gray-100 rounded text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{notice.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 whitespace-pre-wrap">{notice.content}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Posted by {notice.postedBy}</span>
                      <span>•</span>
                      <span>{formatDate(notice.postedDate)}</span>
                      {notice.expiryDate && (
                        <>
                          <span>•</span>
                          <span>Valid until: {formatDate(notice.expiryDate)}</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {filteredNotices.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No notices found for this category</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Notice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Post New Notice</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  placeholder="Enter notice title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
                <textarea
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  placeholder="Enter notice content"
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select
                    value={newNotice.category}
                    onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value as Notice['category'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="General">General</option>
                    <option value="Announcement">Announcement</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Event">Event</option>
                    <option value="Policy">Policy</option>
                    <option value="Holiday">Holiday</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                  <select
                    value={newNotice.priority}
                    onChange={(e) => setNewNotice({ ...newNotice, priority: e.target.value as Notice['priority'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNotice}
                  disabled={!newNotice.title.trim() || !newNotice.content.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300"
                >
                  Post Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeBoard;
