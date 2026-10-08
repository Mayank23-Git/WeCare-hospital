import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Trash2,
  Calendar,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  Stethoscope,
  Building,
  CheckCircle,
  HelpCircle,
  Clock,
  PhoneCall,
} from 'lucide-react';
import api from '../services/api';

export default function AIAssistant() {
  const navigate = useNavigate();

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: "Hello, I am WeCare Hospital's AI Doctor Recommendation Assistant. How can I help you today? Please describe your symptoms or what health concern you are experiencing, and I will recommend the most appropriate department and specialist doctors for you to consult.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const samplePrompts = [
    'I have frequent headaches and dizziness.',
    'I have had a sore throat for three days and it hurts when I swallow.',
    'I have a skin rash with severe itching on my arms.',
    'I have persistent tooth pain and sensitivity to cold.',
    'I have joint pain and morning stiffness in my knees.',
    'I have stomach pain and mild nausea after meals.',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const message = (textToSend || inputMessage).trim();
    if (!message || loading) return;

    const userMessageId = `user-${Date.now()}`;
    const userMsg = {
      id: userMessageId,
      sender: 'user',
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);
    setErrorState(null);

    try {
      const res = await api.getDoctorRecommendation(message);

      if (res.success && res.data) {
        const aiData = res.data;
        const assistantMsg = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: aiData.explanation,
          recommendation: aiData,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else if (res.isUnavailable) {
        // Handled backend error
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'assistant',
            isUnavailable: true,
            text: res.message || 'Sorry, the AI assistant is temporarily unavailable. Please browse our departments or doctors directly.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        throw new Error(res.message || 'Unable to generate recommendation.');
      }
    } catch (err) {
      console.error('AI assistant error:', err);
      // Graceful error state per requirements
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          isUnavailable: true,
          text: 'Sorry, the AI assistant is temporarily unavailable. Please browse our departments or doctors directly.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'msg-welcome-new',
        sender: 'assistant',
        text: 'Chat history cleared. Please describe your symptoms or healthcare concern to receive personalized department and doctor guidance.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setErrorState(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                AI Doctor Recommendation Assistant
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                Online
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Clinical department and specialist doctor matchmaking powered by Gemini AI
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5 mr-1" />
          Clear Chat
        </button>
      </div>

      {/* Safety Alert Banner */}
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3.5 text-xs text-amber-900 flex items-start space-x-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Medical Notice:</strong> This AI Assistant provides general guidance to help navigate hospital departments and doctors. It does not provide diagnoses or prescribe medications. If experiencing severe chest pain, shortness of breath, or stroke symptoms, please call emergency services (<a href="tel:1800932273" className="font-bold underline">1-800-WECARE-911</a>) immediately.
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md flex flex-col h-[650px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/40">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const rec = msg.recommendation;

            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 text-white shadow-sm ${
                    isUser
                      ? 'bg-sky-600'
                      : 'bg-gradient-to-tr from-teal-600 to-sky-600'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble Container */}
                <div className={`max-w-[85%] sm:max-w-[78%] space-y-3 ${isUser ? 'items-end' : 'items-start'}`}>
                  {/* Bubble Text */}
                  <div
                    className={`p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-sky-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span
                      className={`text-[10px] mt-1.5 block ${
                        isUser ? 'text-sky-200 text-right' : 'text-slate-400 text-left'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Unavailable Fallback Card */}
                  {msg.isUnavailable && (
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 text-xs animate-fadeIn">
                      <p className="text-slate-600 font-medium">
                        You can continue booking or explore our hospital catalog directly:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to="/departments"
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 font-semibold text-slate-800 transition-colors"
                        >
                          Browse Departments
                        </Link>
                        <Link
                          to="/doctors"
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 font-semibold text-slate-800 transition-colors"
                        >
                          View Doctors
                        </Link>
                        <Link
                          to="/book-appointment"
                          className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 font-semibold text-white transition-colors"
                        >
                          Book Appointment
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Structured Recommendation Content */}
                  {rec && (
                    <div className="space-y-4 animate-fadeIn">
                      {/* Emergency Callout if acute */}
                      {rec.isEmergency && (
                        <div className="bg-rose-50 border-2 border-rose-300 p-4 rounded-2xl text-xs text-rose-900 space-y-2">
                          <div className="flex items-center text-rose-700 font-bold text-sm">
                            <AlertTriangle className="w-4 h-4 mr-1.5 text-rose-600 animate-pulse" />
                            EMERGENCY CARE ADVISORY
                          </div>
                          <p className="leading-relaxed">
                            Your symptoms may require immediate medical attention. Please call our 24/7 Emergency Line (<a href="tel:1800932273" className="font-bold underline">1-800-WECARE-911</a>) or visit the nearest Emergency Room without delay.
                          </p>
                        </div>
                      )}

                      {/* Suggested Department Pill */}
                      <div className="bg-white p-4 rounded-2xl border border-sky-200/80 shadow-sm flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                            <Building className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400">
                              Suggested Hospital Department
                            </span>
                            <h4 className="text-base font-bold text-slate-900">
                              {rec.department}
                            </h4>
                          </div>
                        </div>

                        <Link
                          to={`/doctors?department=${rec.departmentId}`}
                          className="text-xs font-semibold text-sky-600 hover:underline flex items-center"
                        >
                          View Department <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                      </div>

                      {/* Recommended Doctors Cards */}
                      {rec.recommendedDoctors && rec.recommendedDoctors.length > 0 && (
                        <div className="space-y-2.5">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block px-1">
                            Available Specialist Doctors:
                          </span>

                          <div className="grid grid-cols-1 gap-3">
                            {rec.recommendedDoctors.map((docRec) => {
                              const doc = docRec.doctorDetails;
                              if (!doc) return null;

                              return (
                                <div
                                  key={doc.doctorId}
                                  className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:border-sky-300 transition-all space-y-3"
                                >
                                  <div className="flex items-start space-x-3.5">
                                    <img
                                      src={doc.image}
                                      alt={doc.name}
                                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex justify-between items-start">
                                        <h5 className="text-sm font-bold text-slate-900 truncate">
                                          {doc.name}
                                        </h5>
                                        <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                          ★ {doc.rating || 4.9}
                                        </span>
                                      </div>
                                      <p className="text-xs text-teal-600 font-semibold truncate">
                                        {doc.specialization}
                                      </p>
                                      <p className="text-[11px] text-slate-500">
                                        {doc.experience} Experience • {doc.department}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Doctor Rationale */}
                                  <div className="bg-sky-50/60 p-2.5 rounded-xl text-xs text-slate-700 leading-relaxed border border-sky-100">
                                    <strong className="text-sky-900">Why recommended: </strong>
                                    {docRec.reason}
                                  </div>

                                  {/* Availability Preview */}
                                  <div className="flex items-center text-[11px] text-slate-500">
                                    <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                                    <span>
                                      Schedule: {Array.isArray(doc.availability) ? doc.availability[0] : 'Mon - Fri'}
                                    </span>
                                  </div>

                                  {/* Card Action Buttons */}
                                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                                    <Link
                                      to={`/doctors?department=${doc.departmentId}`}
                                      className="flex-1 py-2 px-3 text-center rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                                    >
                                      View Doctor
                                    </Link>
                                    <Link
                                      to={`/book-appointment?doctor=${doc.doctorId}&department=${doc.departmentId}`}
                                      className="flex-1 py-2 px-3 text-center rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 shadow-sm transition-colors flex items-center justify-center"
                                    >
                                      <Calendar className="w-3.5 h-3.5 mr-1.5" />
                                      Book Appointment
                                    </Link>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Disclaimer footer */}
                      <p className="text-[11px] text-slate-400 italic px-1 leading-relaxed">
                        {rec.disclaimer}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex items-start space-x-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-teal-600 to-sky-600 flex items-center justify-center text-white shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200/80 p-4 rounded-3xl rounded-tl-none shadow-sm flex items-center space-x-1.5 text-xs text-slate-500">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce [animation-delay:0.4s]"></span>
                <span className="ml-2 font-medium text-slate-600">Analyzing symptoms and identifying specialists...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Example Prompt Chips Bar */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200/80 flex items-center space-x-2 overflow-x-auto scrollbar-none text-xs">
          <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap uppercase">
            Try Examples:
          </span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1 rounded-full bg-white border border-slate-200 hover:border-sky-300 hover:text-sky-700 text-slate-600 whitespace-nowrap transition-colors shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Describe your symptoms (e.g. 'I have a sore throat for three days...')"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm text-slate-900 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="px-5 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white font-bold text-sm shadow-sm transition-all flex items-center shrink-0"
            >
              <Send className="w-4 h-4 mr-1.5" />
              Send
            </button>
          </form>
          <p className="text-[10px] text-slate-400 text-center mt-2">
            Press Enter to send. Your conversation is evaluated safely in real time.
          </p>
        </div>
      </div>
    </div>
  );
}
