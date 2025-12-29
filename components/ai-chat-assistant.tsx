"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import "highlight.js/styles/github-dark.css";
import {
  Bot,
  Loader2,
  Maximize2,
  Minimize2,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const TypingIndicator = ({ compact = false }: { compact?: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ type: "spring", stiffness: 500, damping: 30 }}
    className="flex gap-3 justify-start"
  >
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={cn(
        compact ? "h-6 w-6" : "h-8 w-8",
        "rounded-full bg-linear-to-br from-primary via-primary/90 to-primary/70 flex items-center justify-center shrink-0 shadow-lg"
      )}
    >
      <Bot className="h-4 w-4 text-white" />
    </motion.div>
    <div
      className={cn(
        "flex items-center gap-2 bg-linear-to-br from-secondary/60 to-secondary/40 rounded-2xl w-fit backdrop-blur-sm border border-border/50 shadow-md",
        compact ? "px-4 py-2" : "px-5 py-3"
      )}
    >
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={cn(
              compact ? "w-2 h-2" : "w-2.5 h-2.5",
              "bg-primary rounded-full"
            )}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">Thinking</span>
    </div>
  </motion.div>
);

export function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! **I'm Amir Hamza's** AI assistant with full access to his portfolio. Ask about his experience, skills, or projects.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Create a temporary message for streaming content
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Read the streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let streamedContent = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          // Decode the chunk and append to content
          const chunk = decoder.decode(value, { stream: true });
          streamedContent += chunk;

          // Update the assistant message with streaming content
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: streamedContent }
                : msg
            )
          );

          // Auto-scroll to bottom as content streams
          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content:
                  "Sorry, I'm having trouble connecting. Please try again later.",
              }
            : msg
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Chat Button - Bottom Right */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setIsOpen(true)}
                size="lg"
                className="h-14 w-14 rounded-full shadow-2xl hover:shadow-primary/50 transition-all duration-300 relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-linear-to-r from-primary via-primary/70 to-primary/50"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <div className="absolute inset-0.5 bg-background rounded-full flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.35, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Sparkles className="h-7 w-7 text-primary" />
                  </motion.div>
                </div>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "fixed bottom-6 right-6 z-50 bg-background/95 backdrop-blur-xl border border-border rounded-3xl shadow-2xl overflow-hidden",
              isCompact
                ? "w-[90vw] sm:w-[340px] lg:w-[400px] h-[520px] max-h-[70vh]"
                : "w-[95vw] sm:w-[400px] lg:w-[450px] h-[75vh] max-h-[80vh]"
            )}
          >
            {/* Header */}
            <div className="relative bg-linear-to-r from-primary/15 via-primary/10 to-primary/5 border-b border-border/50 px-4 py-3 backdrop-blur-sm">
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-primary via-primary/70 to-primary/50 opacity-5"
                animate={{
                  x: [0, 100, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <motion.div
                      className={cn(
                        isCompact ? "h-10 w-10" : "h-12 w-12",
                        "rounded-full bg-brand flex items-center justify-center shadow-lg"
                      )}
                      animate={{
                        boxShadow: [
                          "0 0 0 0 rgba(59, 130, 246, 0.4)",
                          "0 0 0 8px rgba(59, 130, 246, 0)",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    >
                      <Bot
                        className={cn(
                          isCompact ? "h-5 w-5" : "h-6 w-6",
                          "text-white"
                        )}
                      />
                    </motion.div>
                  </div>
                  <div>
                    <h3
                      className={cn(
                        "font-semibold text-foreground",
                        isCompact ? "text-sm" : "text-base"
                      )}
                    >
                      AI Assistant
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <motion.div
                        className="h-1.5 w-1.5 bg-green-500 rounded-full"
                        animate={{
                          opacity: [1, 0.5, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      />
                      <p className="text-xs text-muted-foreground">Online</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      onClick={() => setIsCompact((s) => !s)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 rounded-full hover:bg-accent/20 transition-colors"
                      aria-label={isCompact ? "Expand chat" : "Compact chat"}
                    >
                      {isCompact ? (
                        <Maximize2 className="h-4 w-4" />
                      ) : (
                        <Minimize2 className="h-4 w-4" />
                      )}
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      onClick={() => setIsOpen(false)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 rounded-full hover:bg-destructive/20 hover:text-destructive transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea
              className={cn(
                "scroll-smooth",
                isCompact
                  ? "h-[calc(100%-143px)] px-4 py-3@"
                  : "h-[calc(100%-160px)] px-6 py-4@"
              )}
              ref={scrollRef}
            >
              <div className="space-y-5 mt-2 pb-2">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                    className={cn(
                      "flex gap-3",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.role === "assistant" && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                          delay: index * 0.05 + 0.1,
                        }}
                        className={cn(
                          isCompact ? "h-6 w-6" : "h-8 w-8",
                          "rounded-full bg-linear-to-br from-primary via-primary/90 to-primary/70 flex items-center justify-center shrink-0 shadow-lg"
                        )}
                      >
                        <Bot className="h-4 w-4 text-white" />
                      </motion.div>
                    )}
                    <div
                      className={cn(
                        "px-4 py-3 rounded-2xl max-w-[80%] wrap-break-word shadow-md",
                        message.role === "user"
                          ? "bg-linear-to-br from-primary to-primary/90 text-primary-foreground rounded-br-sm"
                          : "bg-linear-to-br from-secondary/60 to-secondary/40 text-foreground rounded-bl-sm backdrop-blur-sm border border-border/50"
                      )}
                    >
                      {message.role === "assistant" ? (
                        <div
                          className={cn(
                            "prose prose-sm dark:prose-invert max-w-none",
                            isCompact
                              ? "text-xs leading-snug"
                              : "text-sm leading-relaxed"
                          )}
                        >
                          <ReactMarkdown
                            rehypePlugins={[rehypeHighlight, rehypeRaw]}
                            components={{
                              // Custom components for better styling
                              p: ({ children }) => (
                                <p className="mb-2 last:mb-0">{children}</p>
                              ),
                              ul: ({ children }) => (
                                <ul className="mb-2 ml-4 list-disc">
                                  {children}
                                </ul>
                              ),
                              ol: ({ children }) => (
                                <ol className="mb-2 ml-4 list-decimal">
                                  {children}
                                </ol>
                              ),
                              li: ({ children }) => (
                                <li className="mb-1">{children}</li>
                              ),
                              code: ({ className, children, ...props }) => {
                                const match = /language-(\w+)/.exec(
                                  className || ""
                                );
                                return match ? (
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                ) : (
                                  <code
                                    className="bg-primary/10 px-1 py-0.5 rounded text-xs"
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                );
                              },
                              pre: ({ children }) => (
                                <pre className="bg-muted p-2 rounded text-xs overflow-x-auto my-2">
                                  {children}
                                </pre>
                              ),
                              strong: ({ children }) => (
                                <strong className="font-semibold text-primary">
                                  {children}
                                </strong>
                              ),
                              em: ({ children }) => (
                                <em className="italic">{children}</em>
                              ),
                              a: ({ children, href }) => (
                                <a
                                  href={href}
                                  className="text-primary hover:underline"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {children}
                                </a>
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p
                          className={cn(
                            "whitespace-pre-wrap",
                            isCompact
                              ? "text-xs leading-snug"
                              : "text-sm leading-relaxed"
                          )}
                        >
                          {message.content}
                        </p>
                      )}
                      <p className="text-xs opacity-50 mt-2">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {message.role === "user" && (
                      <div
                        className={cn(
                          isCompact ? "h-6 w-6" : "h-8 w-8",
                          "rounded-full bg-linear-to-br from-primary/10 to-primary/40 flex items-center justify-center shrink-0"
                        )}
                      >
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </motion.div>
                ))}
                {isTyping && <TypingIndicator compact={isCompact} />}
              </div>
              
            </ScrollArea>

            {/* Input */}
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-background via-background/95 to-background/90 backdrop-blur-xl border-t border-border/50 p-4">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className={cn(
                      "w-full rounded-full border-border/50 bg-secondary/30 backdrop-blur-sm transition-all duration-200 focus:ring-0 focus:outline-0 focus:border-0",
                      isCompact ? "h-10 text-sm px-4 pr-12" : "h-12 px-5 pr-14",
                      !input.trim() && "border-border/30"
                    )}
                    disabled={isTyping}
                  />
                  {input.trim() && !isTyping && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    </motion.div>
                  )}
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim() || isTyping}
                    className={cn(
                      isCompact ? "h-10 w-10" : "h-12 w-12",
                      "rounded-full bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-primary/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    {isTyping ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
