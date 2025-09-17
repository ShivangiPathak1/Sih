"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇧🇩" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", flag: "🇮🇳" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া", flag: "🇮🇳" },
  { code: "ur", name: "Urdu", nativeName: "اردو", flag: "🇵🇰" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
]

interface LanguageContextType {
  currentLanguage: Language
  setLanguage: (languageCode: string) => void
  supportedLanguages: Language[]
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

const translations: Record<string, Record<string, string>> = {
  en: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.analytics": "Analytics",
    "nav.users": "Users",
    "nav.content": "Content",
    "nav.support": "Support",
    "nav.settings": "Settings",
    "nav.logout": "Logout",
    "nav.notifications": "Notifications",
    "nav.profile": "Profile",
    "nav.admin": "Admin",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.welcome": "Welcome back",
    "dashboard.overview": "Overview",
    "dashboard.activeUsers": "Active Users",
    "dashboard.lessonsCompleted": "Lessons Completed",
    "dashboard.lessonsCompletedToday": "Lessons Completed Today",
    "dashboard.lessonsInProgress": "Lessons in Progress",
    "dashboard.pendingApprovals": "Pending Approvals",
    "dashboard.supportTickets": "Support Tickets",
    "dashboard.totalUsers": "Total Users",
    "dashboard.totalContent": "Total Content",
    "dashboard.totalRevenue": "Total Revenue",
    "dashboard.realTimeActivity": "Real-time Platform Activity",
    "dashboard.realTimeActivityDesc": "Live activity monitoring across the platform",
    "dashboard.lastUpdated": "Last updated",
    "dashboard.recentActivity": "Recent Activity",
    "dashboard.quickStats": "Quick Stats",
    "dashboard.contentItems": "Content Items",
    "dashboard.engagementRate": "Engagement Rate",
    "dashboard.recentContentSubmissions": "Recent Content Submissions",
    "dashboard.systemStatus": "System Status",
    "dashboard.serverStatus": "Server Status",
    "dashboard.database": "Database",
    "dashboard.cdn": "CDN",
    "dashboard.backupStatus": "Backup Status",
    "dashboard.online": "Online",
    "dashboard.healthy": "Healthy",
    "dashboard.active": "Active",
    "dashboard.upToDate": "Up to date",
    "dashboard.fromLastMonth": "from last month",
    "dashboard.fromLastWeek": "from last week",

    // User Management
    "users.title": "User Management",
    "users.addUser": "Add User",
    "users.exportReport": "Export Report",
    "users.searchPlaceholder": "Search users...",
    "users.filterByRole": "Filter by role",
    "users.filterByStatus": "Filter by status",
    "users.bulkActions": "Bulk Actions",
    "users.lock": "Lock",
    "users.unlock": "Unlock",
    "users.delete": "Delete",
    "users.name": "Name",
    "users.email": "Email",
    "users.role": "Role",
    "users.status": "Status",
    "users.lastLogin": "Last Login",
    "users.actions": "Actions",

    // Support
    "support.title": "Support Oversight",
    "support.createTicket": "Create Ticket",
    "support.totalTickets": "Total Tickets",
    "support.openTickets": "Open Tickets",
    "support.resolvedToday": "Resolved Today",
    "support.avgResponseTime": "Average Response Time",
    "support.resolutionRate": "Resolution Rate",
    "support.customerSatisfaction": "Customer Satisfaction",
    "support.firstContactResolution": "First Contact Resolution",
    "support.inProgress": "In Progress",
    "support.preview": "Preview",
    "support.message": "Message",
    "support.edit": "Edit",
    "support.resolve": "Resolve",
    "support.contactUser": "Contact User",

    // Content Management
    "content.title": "Content Management",
    "content.totalDownloads": "Total Downloads",
    "content.contentViews": "Content Views",
    "content.averageRating": "Average Rating",
    "content.activeContent": "Active Content",
    "content.addContent": "Add Content",
    "content.uploadFile": "Upload File",
    "content.category": "Category",
    "content.grade": "Grade",
    "content.subject": "Subject",

    // Analytics
    "analytics.title": "Analytics",
    "analytics.dailyActiveUsers": "Daily Active Users",
    "analytics.lessonsCompleted": "Lessons Completed", 
    "analytics.sessionTime": "Average Session Time",
    "analytics.platformGrowth": "Platform Growth",
    "analytics.userEngagement": "User Engagement Trends",
    "analytics.contentPerformance": "Content Performance",
    "analytics.reports": "Reports",

    // Settings
    "settings.title": "Settings",
    "settings.profile": "Profile Settings",
    "settings.security": "Security Settings",
    "settings.language": "Language Settings",
    "settings.notifications": "Notification Settings",
    "settings.general": "General",
    "settings.appearance": "Appearance",
    "settings.system": "System Settings",
    "settings.changePassword": "Change Password",
    "settings.twoFactor": "Two-Factor Authentication",

    // Common
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.view": "View",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.export": "Export",
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.warning": "Warning",
    "common.info": "Information",
    "common.confirm": "Confirm",
    "common.close": "Close",
    "common.back": "Back",
    "common.next": "Next",
    "common.previous": "Previous",
    "common.submit": "Submit",
    "common.upload": "Upload",
    "common.download": "Download",
    "common.refresh": "Refresh",
    "common.actions": "Actions",
    "common.status": "Status",
    "common.date": "Date",
    "common.time": "Time",
    "common.name": "Name",
    "common.description": "Description",
  },
  hi: {
    // Navigation
    "nav.dashboard": "डैशबोर्ड",
    "nav.analytics": "विश्लेषण",
    "nav.users": "उपयोगकर्ता",
    "nav.content": "सामग्री",
    "nav.support": "सहायता",
    "nav.settings": "सेटिंग्स",
    "nav.logout": "लॉग आउट",
    "nav.notifications": "अधिसूचनाएं",
    "nav.profile": "प्रोफ़ाइल",
    "nav.admin": "प्रशासक",

    // Dashboard
    "dashboard.title": "डैशबोर्ड",
    "dashboard.welcome": "वापस स्वागत है",
    "dashboard.overview": "अवलोकन",
    "dashboard.activeUsers": "सक्रिय उपयोगकर्ता",
    "dashboard.lessonsCompleted": "पूर्ण पाठ",
    "dashboard.lessonsCompletedToday": "आज पूर्ण किए गए पाठ",
    "dashboard.lessonsInProgress": "प्रगति में पाठ",
    "dashboard.pendingApprovals": "लंबित अनुमोदन",
    "dashboard.supportTickets": "सहायता टिकट",
    "dashboard.totalUsers": "कुल उपयोगकर्ता",
    "dashboard.totalContent": "कुल सामग्री",
    "dashboard.totalRevenue": "कुल राजस्व",
    "dashboard.realTimeActivity": "रीयल-टाइम प्लेटफॉर्म गतिविधि",
    "dashboard.realTimeActivityDesc": "प्लेटफॉर्म पर लाइव गतिविधि निगरानी",
    "dashboard.lastUpdated": "अंतिम अपडेट",
    "dashboard.recentActivity": "हाल की गतिविधि",
    "dashboard.quickStats": "त्वरित आंकड़े",
    "dashboard.contentItems": "सामग्री आइटम",
    "dashboard.engagementRate": "सहभागिता दर",
    "dashboard.recentContentSubmissions": "हाल की सामग्री सबमिशन",
    "dashboard.systemStatus": "सिस्टम स्थिति",
    "dashboard.serverStatus": "सर्वर स्थिति",
    "dashboard.database": "डेटाबेस",
    "dashboard.cdn": "सीडीएन",
    "dashboard.backupStatus": "बैकअप स्थिति",
    "dashboard.online": "ऑनलाइन",
    "dashboard.healthy": "स्वस्थ",
    "dashboard.active": "सक्रिय",
    "dashboard.upToDate": "अद्यतित",
    "dashboard.fromLastMonth": "पिछले महीने से",
    "dashboard.fromLastWeek": "पिछले सप्ताह से",

    // User Management
    "users.title": "उपयोगकर्ता प्रबंधन",
    "users.addUser": "उपयोगकर्ता जोड़ें",
    "users.exportReport": "रिपोर्ट निर्यात करें",
    "users.searchPlaceholder": "उपयोगकर्ता खोजें...",
    "users.filterByRole": "भूमिका के अनुसार फ़िल्टर करें",
    "users.filterByStatus": "स्थिति के अनुसार फ़िल्टर करें",
    "users.bulkActions": "बल्क एक्शन",
    "users.lock": "लॉक करें",
    "users.unlock": "अनलॉक करें",
    "users.delete": "हटाएं",
    "users.name": "नाम",
    "users.email": "ईमेल",
    "users.role": "भूमिका",
    "users.status": "स्थिति",
    "users.lastLogin": "अंतिम लॉगिन",
    "users.actions": "क्रियाएं",

    // Support
    "support.title": "सहायता निरीक्षण",
    "support.createTicket": "टिकट बनाएं",
    "support.totalTickets": "कुल टिकट",
    "support.openTickets": "खुले टिकट",
    "support.resolvedToday": "आज हल किए गए",
    "support.avgResponseTime": "औसत प्रतिक्रिया समय",
    "support.resolutionRate": "समाधान दर",
    "support.customerSatisfaction": "ग्राहक संतुष्टि",
    "support.firstContactResolution": "पहले संपर्क में समाधान",
    "support.inProgress": "प्रगति में",
    "support.preview": "पूर्वावलोकन",
    "support.message": "संदेश",
    "support.edit": "संपादित करें",
    "support.resolve": "हल करें",
    "support.contactUser": "उपयोगकर्ता से संपर्क करें",

    // Content Management
    "content.title": "सामग्री प्रबंधन",
    "content.totalDownloads": "कुल डाउनलोड",
    "content.contentViews": "सामग्री दृश्य",
    "content.averageRating": "औसत रेटिंग",
    "content.activeContent": "सक्रिय सामग्री",
    "content.addContent": "सामग्री जोड़ें",
    "content.uploadFile": "फ़ाइल अपलोड करें",
    "content.category": "श्रेणी",
    "content.grade": "कक्षा",
    "content.subject": "विषय",

    // Analytics
    "analytics.title": "विश्लेषण",
    "analytics.dailyActiveUsers": "दैनिक सक्रिय उपयोगकर्ता",
    "analytics.lessonsCompleted": "पूर्ण पाठ",
    "analytics.sessionTime": "औसत सत्र समय",
    "analytics.platformGrowth": "प्लेटफॉर्म वृद्धि",
    "analytics.userEngagement": "उपयोगकर्ता सहभागिता रुझान",
    "analytics.contentPerformance": "सामग्री प्रदर्शन",
    "analytics.reports": "रिपोर्ट",

    // Settings
    "settings.title": "सेटिंग्स",
    "settings.profile": "प्रोफ़ाइल सेटिंग्स",
    "settings.security": "सुरक्षा सेटिंग्स",
    "settings.language": "भाषा सेटिंग्स",
    "settings.notifications": "अधिसूचना सेटिंग्स",
    "settings.general": "सामान्य",
    "settings.appearance": "दिखावट",
    "settings.system": "सिस्टम सेटिंग्स",
    "settings.changePassword": "पासवर्ड बदलें",
    "settings.twoFactor": "द्विगुणित प्रमाणीकरण",

    // Common
    "common.save": "सहेजें",
    "common.cancel": "रद्द करें",
    "common.edit": "संपादित करें",
    "common.delete": "हटाएं",
    "common.view": "देखें",
    "common.search": "खोजें",
    "common.filter": "फ़िल्टर",
    "common.export": "निर्यात",
    "common.loading": "लोड हो रहा है...",
    "common.error": "त्रुटि",
    "common.success": "सफलता",
    "common.warning": "चेतावनी",
    "common.info": "जानकारी",
    "common.confirm": "पुष्टि करें",
    "common.close": "बंद करें",
    "common.back": "वापस",
    "common.next": "अगला",
    "common.previous": "पिछला",
    "common.submit": "जमा करें",
    "common.upload": "अपलोड करें",
    "common.download": "डाउनलोड करें",
    "common.refresh": "ताज़ा करें",
    "common.actions": "क्रियाएं",
    "common.status": "स्थिति",
    "common.date": "तारीख",
    "common.time": "समय",
    "common.name": "नाम",
    "common.description": "विवरण",
  },
  // Add more languages as needed...
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0])

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem("selectedLanguage")
    if (savedLanguage) {
      const language = SUPPORTED_LANGUAGES.find((lang) => lang.code === savedLanguage)
      if (language) {
        setCurrentLanguage(language)
      }
    }
  }, [])

  const setLanguage = (languageCode: string) => {
    console.log("LanguageProvider: Changing language to:", languageCode)
    const language = SUPPORTED_LANGUAGES.find((lang) => lang.code === languageCode)
    if (language) {
      console.log("LanguageProvider: Setting language:", language)
      setCurrentLanguage(language)
      localStorage.setItem("selectedLanguage", languageCode)
    } else {
      console.log("LanguageProvider: Language not found:", languageCode)
    }
  }

  const t = (key: string): string => {
    const languageTranslations = translations[currentLanguage.code] || translations.en
    const translation = languageTranslations[key] || key
    // Debug logging for first few translations
    if (Math.random() < 0.1) {
      console.log(`Translation: ${key} -> ${translation} (${currentLanguage.code})`)
    }
    return translation
  }

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        supportedLanguages: SUPPORTED_LANGUAGES,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}
