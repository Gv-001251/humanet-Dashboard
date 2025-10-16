import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import {
  LayoutDashboard,
  Users,
  BarChart2,
  FileText,
  Bot,
  BadgePercent,
  HelpCircle,
  MessageSquare,
  BookOpen,
  TrendingUp,
  Shield,
  Video,
  Bell,
  Settings,
  LogOut
} from "lucide-react";


export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useTheme();


  const navItemClasses = (path: string) =>
    `w-full flex items-center gap-2 px-3 py-2 text-[0.93rem] font-medium rounded-lg mb-1 transition-all
    ${location.pathname === path ? "bg-blue-600 text-white shadow-md" : darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"}`;


  return (
    <div className={`w-60 h-screen fixed left-0 top-0 border-r flex flex-col justify-between
      ${darkMode ? "bg-gradient-to-b from-gray-800 to-gray-900 border-gray-700" : "bg-gradient-to-b from-blue-50 to-white border-gray-200"}
    `}>
      {/* TOP: Logo & Brand */}
      <div>
        <div className={`p-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Humanet</h1>
              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>HR Portal</p>
            </div>
          </div>
        </div>
        {/* MAIN NAV SECTIONS */}
        <nav className="px-3 py-4">
          {/* Core HR Management */}
          <button className={navItemClasses("/hr/dashboard")}       onClick={() => navigate("/hr/dashboard")}>         <LayoutDashboard className="w-5 h-5" /> Dashboard</button>
          <button className={navItemClasses("/hr/employee")}        onClick={() => navigate("/hr/employee")}>          <Users className="w-5 h-5" /> Employee</button>
          <button className={navItemClasses("/hr/automatch")}       onClick={() => navigate("/hr/automatch")}>         <BarChart2 className="w-5 h-5" /> AutoMatch</button>
          <button className={navItemClasses("/hr/hire")}            onClick={() => navigate("/hr/hire")}>               <FileText className="w-5 h-5" /> HireSmart</button>
          <button className={navItemClasses("/hr/portal")}          onClick={() => navigate("/hr/portal")}>              <BookOpen className="w-5 h-5" /> Portal</button>
          <button className={navItemClasses("/hr/salary-prediction")} onClick={() => navigate("/hr/salary-prediction")}> <BadgePercent className="w-5 h-5" /> SalaryPrediction</button>
          <button className={navItemClasses("/hr/hr-assistance")}   onClick={() => navigate("/hr/hr-assistance")}>      <Bot className="w-5 h-5" /> HR Assistance</button>
          
          {/* Advanced AI/Verification */}
          <button className={navItemClasses("/hr/fraud-detection")} onClick={() => navigate("/hr/fraud-detection")}>   <Shield className="w-5 h-5" /> Fraud Detection</button>
          <button className={navItemClasses("/hr/proctored-interview")} onClick={() => navigate("/hr/proctored-interview")}> <Video className="w-5 h-5" /> Proctored Interview</button>
          <button className={navItemClasses("/hr/hike-expectation-analyzer")} onClick={() => navigate("/hr/hike-expectation-analyzer")}> <TrendingUp className="w-5 h-5" /> Hike Analyzer</button>
          
          {/* Communication */}
          <button className={navItemClasses("/hr/message")}         onClick={() => navigate("/hr/message")}>            <MessageSquare className="w-5 h-5" /> Message</button>
          <button className={navItemClasses("/hr/noticeboard")}     onClick={() => navigate("/hr/noticeboard")}>        <Bell className="w-5 h-5" /> NoticeBoard</button>

          {/* Offer Management (NEW) */}
          <button className={navItemClasses("/hr/offers")} onClick={() => navigate("/hr/offers")}> <FileText className="w-5 h-5" /> Offers</button>
        </nav>
      </div>

      {/* BOTTOM: Settings, Help, Logout (always visible) */}
      <div className={`p-3 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
        <button className={navItemClasses("/hr/settings")}   onClick={() => navigate("/hr/settings")}>      <Settings className="w-5 h-5" /> Settings</button>
        <button className={navItemClasses("/hr/help-info")}  onClick={() => navigate("/hr/help-info")}>     <HelpCircle className="w-5 h-5" /> Help & Info</button>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
          }}
          className={`w-full flex items-center gap-2 px-3 py-2 text-[0.93rem] font-medium rounded-lg mt-1 ${
            darkMode ? "text-red-400 hover:bg-gray-700" : "text-red-700 hover:bg-red-50"
          }`}
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </div>
  );
};
