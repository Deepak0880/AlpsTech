
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface ChatbotProps {
  onClose: () => void;
  isMinimized?: boolean;
  onMinimize?: () => void;
}

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const Chatbot = ({ onClose, isMinimized = false, onMinimize }: ChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! How can I help you with your computer course queries today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the input field when chatbot opens
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  }, []);

  // Auto-scroll to the bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Show typing indicator
    setIsTyping(true);

    // Simulate bot response with variable timing for natural feel
    const responseTime = Math.floor(Math.random() * 1000) + 500; // Between 500-1500ms
    setTimeout(() => {
      setIsTyping(false);
      const botResponse = getBotResponse(input);
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, responseTime);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("course") && (input.includes("enroll") || input.includes("register") || input.includes("join"))) {
      return "You can enroll in a course by navigating to the Courses page, selecting a course, and clicking the Enroll button. You need to be logged in as a student to enroll.";
    } 
    else if (input.includes("result") || input.includes("score") || input.includes("grade")) {
      return "You can view your results by logging in to your student account and visiting the Results page. Results are posted after evaluation by the admin.";
    }
    else if (input.includes("login") || input.includes("account") || input.includes("sign in")) {
      return "You can log in by clicking the Login button in the navigation bar. Use your registered email and password. Contact admin if you're having trouble accessing your account.";
    }
    else if (input.includes("course") && (input.includes("list") || input.includes("available") || input.includes("what"))) {
      return "We offer various computer courses including Web Development, Database Management, Programming Fundamentals, and more. Visit our Courses page to see the full list with detailed descriptions.";
    }
    else if (input.includes("help") || input.includes("support")) {
      return "For any technical support, please contact our support team at support@alpstech.com or call our helpline at +91 (123) 456-7890.";
    }
    else if (input.includes("thank")) {
      return "You're welcome! I'm here to help if you have any more questions about our courses or services.";
    }
    else if (input.includes("hello") || input.includes("hi") || input.includes("hey")) {
      return "Hello there! How can I assist you with our computer center services today?";
    }
    else {
      return "I'm not sure I understand. Could you rephrase or ask about course enrollment, viewing results, or account login?";
    }
  };

  const toggleMinimize = () => {
    if (onMinimize) {
      onMinimize();
    }
  };

  return (
    <div 
      className={cn(
        "fixed bottom-20 right-6 w-80 md:w-96 bg-white rounded-lg shadow-xl border overflow-hidden z-50",
        isMinimized 
          ? "h-16 animate-in zoom-in duration-300" 
          : "h-96 animate-in slide-in-from-bottom duration-300"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b bg-brand-blue text-white">
        <h3 className="font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 animate-pulse-slow" />
          <span className="animate-in slide-in-from-left">AlpsTech's Assistant</span>
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMinimize}
            className="text-white hover:bg-blue-700 h-8 w-8"
          >
            {isMinimized ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-in zoom-in duration-300"><path d="m18 15-6-6-6 6"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-in zoom-in duration-300"><path d="m6 9 6 6 6-6"/></svg>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-blue-700 h-8 w-8"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-in zoom-in duration-300"
            >
              <path d="M18 6 6 18"/>
              <path d="m6 6 12 12"/>
            </svg>
          </Button>
        </div>
      </div>
      
      {!isMinimized && (
        <>
          <div className="flex flex-col h-[calc(100%-8rem)] overflow-y-auto p-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "max-w-[80%] rounded-lg p-3 mb-2 transition-all duration-300",
                  message.sender === "user"
                    ? "bg-brand-blue text-white self-end animate-in slide-in-from-right"
                    : "bg-gray-200 text-gray-800 self-start animate-in slide-in-from-left"
                )}
              >
                <p>{message.text}</p>
                <span className="text-xs mt-1 opacity-70 block">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            {isTyping && (
              <div className="max-w-[80%] rounded-lg p-3 mb-2 bg-gray-200 text-gray-800 self-start animate-in fade-in duration-300">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce animation-delay-300"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce animation-delay-500"></div>
                </div>
              </div>
            )}
            {isLoading && !isTyping && (
              <div className="max-w-[80%] rounded-lg p-3 mb-2 bg-gray-200 text-gray-800 self-start animate-pulse">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 border-t bg-white">
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 animate-in fade-in duration-300"
                autoComplete="off"
              />
              <Button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="transition-all duration-300 hover:scale-105"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={cn(
                    "transition-transform duration-300",
                    input.trim() ? "scale-100 opacity-100" : "scale-90 opacity-70"
                  )}
                >
                  <path d="m22 2-7 20-4-9-9-4Z"/>
                  <path d="M22 2 11 13"/>
                </svg>
              </Button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Chatbot;
