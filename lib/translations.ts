// lib/translations.ts

export type Language = 'en' | 'hi' | 'es' | 'fr' | 'de' | 'zh';

export interface Translations {
  welcome: string;
  helpTopics: string;
  passwordReset: string;
  vpn: string;
  software: string;
  printer: string;
  wifi: string;
  performance: string;
  askQuestion: string;
  send: string;
  quickQuestions: string;
  poweredBy: string;
  ticketPrompt: string;
  createTicket: string;
  talkToIT: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    welcome: "👋 Hello! I'm your IT Helpdesk Assistant.",
    helpTopics: "I can help you with:",
    passwordReset: "Password resets",
    vpn: "VPN connection issues",
    software: "Software installation",
    printer: "Printer problems",
    wifi: "WiFi setup",
    performance: "Computer performance",
    askQuestion: "Ask me anything... e.g., 'How do I reset my password?'",
    send: "Send",
    quickQuestions: "Quick Questions:",
    poweredBy: "Powered by Google Gemini AI | Secure & Private",
    ticketPrompt: "🤔 I couldn't answer this question. Would you like to create a ticket?",
    createTicket: "📧 Create IT Ticket",
    talkToIT: "🗣️ Talk to IT",
  },
  hi: {
    welcome: "👋 नमस्ते! मैं आपका IT हेल्पडेस्क सहायक हूँ।",
    helpTopics: "मैं इसमें आपकी मदद कर सकता हूँ:",
    passwordReset: "पासवर्ड रीसेट",
    vpn: "VPN कनेक्शन समस्याएं",
    software: "सॉफ्टवेयर इंस्टॉलेशन",
    printer: "प्रिंटर समस्याएं",
    wifi: "WiFi सेटअप",
    performance: "कंप्यूटर परफॉर्मेंस",
    askQuestion: "मुझसे कुछ भी पूछें... जैसे 'पासवर्ड कैसे रीसेट करें?'",
    send: "भेजें",
    quickQuestions: "त्वरित प्रश्न:",
    poweredBy: "Google Gemini AI द्वारा संचालित | सुरक्षित और निजी",
    ticketPrompt: "🤔 मैं इस प्रश्न का उत्तर नहीं दे सका। क्या आप टिकट बनाना चाहेंगे?",
    createTicket: "📧 टिकट बनाएं",
    talkToIT: "🗣️ IT से बात करें",
  },
  es: {
    welcome: "👋 ¡Hola! Soy tu asistente de IT.",
    helpTopics: "Puedo ayudarte con:",
    passwordReset: "Restablecimiento de contraseña",
    vpn: "Problemas de conexión VPN",
    software: "Instalación de software",
    printer: "Problemas de impresora",
    wifi: "Configuración de WiFi",
    performance: "Rendimiento de la computadora",
    askQuestion: "Pregúntame cualquier cosa... ej. '¿Cómo restablezco mi contraseña?'",
    send: "Enviar",
    quickQuestions: "Preguntas rápidas:",
    poweredBy: "Impulsado por Google Gemini AI | Seguro y Privado",
    ticketPrompt: "🤔 No pude responder esta pregunta. ¿Te gustaría crear un ticket?",
    createTicket: "📧 Crear Ticket",
    talkToIT: "🗣️ Hablar con IT",
  },
  fr: {
    welcome: "👋 Bonjour! Je suis votre assistant IT.",
    helpTopics: "Je peux vous aider avec:",
    passwordReset: "Réinitialisation du mot de passe",
    vpn: "Problèmes de connexion VPN",
    software: "Installation de logiciels",
    printer: "Problèmes d'imprimante",
    wifi: "Configuration WiFi",
    performance: "Performance de l'ordinateur",
    askQuestion: "Demandez-moi n'importe quoi... ex: 'Comment réinitialiser mon mot de passe?'",
    send: "Envoyer",
    quickQuestions: "Questions rapides:",
    poweredBy: "Propulsé par Google Gemini AI | Sécurisé et Privé",
    ticketPrompt: "🤔 Je n'ai pas pu répondre à cette question. Voulez-vous créer un ticket?",
    createTicket: "📧 Créer un Ticket",
    talkToIT: "🗣️ Parler à l'IT",
  },
  de: {
    welcome: "👋 Hallo! Ich bin dein IT-Support-Assistent.",
    helpTopics: "Ich kann dir helfen mit:",
    passwordReset: "Passwort zurücksetzen",
    vpn: "VPN-Verbindungsprobleme",
    software: "Software-Installation",
    printer: "Druckerprobleme",
    wifi: "WiFi-Einrichtung",
    performance: "Computerleistung",
    askQuestion: "Frag mich alles... z.B. 'Wie setze ich mein Passwort zurück?'",
    send: "Senden",
    quickQuestions: "Schnellfragen:",
    poweredBy: "Unterstützt von Google Gemini AI | Sicher & Privat",
    ticketPrompt: "🤔 Ich konnte diese Frage nicht beantworten. Möchten Sie ein Ticket erstellen?",
    createTicket: "📧 Ticket Erstellen",
    talkToIT: "🗣️ Mit IT Sprechen",
  },
  zh: {
    welcome: "👋 您好！我是您的IT帮助台助手。",
    helpTopics: "我可以帮您解决：",
    passwordReset: "密码重置",
    vpn: "VPN连接问题",
    software: "软件安装",
    printer: "打印机问题",
    wifi: "WiFi设置",
    performance: "电脑性能",
    askQuestion: "随便问... 例如'如何重置密码？'",
    send: "发送",
    quickQuestions: "快速问题：",
    poweredBy: "由Google Gemini AI驱动 | 安全私密",
    ticketPrompt: "🤔 我无法回答这个问题。您想创建工单吗？",
    createTicket: "📧 创建工单",
    talkToIT: "🗣️ 联系IT",
  },
};

export function getTranslation(lang: Language = 'en'): Translations {
  return translations[lang] || translations.en;
}

export function detectLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  
  const browserLang = navigator.language.split('-')[0] as Language;
  const supportedLangs: Language[] = ['en', 'hi', 'es', 'fr', 'de', 'zh'];
  
  return supportedLangs.includes(browserLang) ? browserLang : 'en';
}