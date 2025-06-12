"use client"

import React from "react"
import { useState, useCallback, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, Loader2, GripVertical, X, Trash2, Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { getChatResponseFromModel, getChatResponseFromModelOLLAMA } from "@/helper"
import Dictaphone from "./dictaphone"
import Markdown from 'react-markdown'

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  error?: boolean
}

interface ResizableChatPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const MIN_WIDTH = 400
const MAX_WIDTH = 900
const DEFAULT_WIDTH = 850

export function ResizableChatPanel({ open, onOpenChange }: ResizableChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your AI assistant powered by ML Agent. Ask me anything of your data - I can help with questions, explanations, analysis, and much more! You can also use the microphone button to speak your questions.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [panelWidth, setPanelWidth] = useState(DEFAULT_WIDTH)
  const [isResizing, setIsResizing] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsResizing(true)
    e.preventDefault()
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return

      const newWidth = window.innerWidth - e.clientX
      const clampedWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth))
      setPanelWidth(clampedWidth)
    },
    [isResizing],
  )

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
  }, [])

  // Add global mouse event listeners
  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        document.body.style.cursor = ""
        document.body.style.userSelect = ""
      }
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  const generateMessageId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: generateMessageId(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = input.trim()
    setInput("")
    setIsLoading(true)

    try {
      const data = await getChatResponseFromModel(currentInput);

      console.log(data)

      const assistantMessage: ChatMessage = {
        id: generateMessageId(),
        role: "assistant",
        content: data.response || "I apologize, but I couldn't generate a response. Please try again.",
        timestamp: new Date(),
        error: !data?.done,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: ChatMessage = {
        id: generateMessageId(),
        role: "assistant",
        content: "❌ Network error: Unable to connect to the AI service. Please check your connection and try again.",
        timestamp: new Date(),
        error: true,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Chat cleared! I'm ready to help you with anything you'd like to know. You can type or use voice input!",
        timestamp: new Date(),
      },
    ])
  }

  const copyMessage = async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (error) {
      console.error("Failed to copy message:", error)
    }
  }

  const handleSpeechTranscript = (transcript: string) => {
    setInput(transcript)
    // Auto-focus the input after speech recognition
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  const suggestedQuestions = [
    "Which blocks have high rates of SAM/MAM and also low mathematics/language scores in class 3 and 5?",
    "Are operational Anganwadi Centres with functional toilets and drinking water facilities associated with lower rates of SAM or MAM?",
    "Are there blocks where immunization coverage is low and foundational learning outcomes in class 3 are also poor?",
  ]

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={() => onOpenChange(false)} />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 h-full bg-background border-l shadow-lg z-50 flex flex-col"
        style={{ width: `${panelWidth}px` }}
      >
        {/* Resize Handle */}
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-1 cursor-col-resize bg-border hover:bg-primary/50 transition-colors group z-10",
            isResizing && "bg-primary",
          )}
          onMouseDown={handleMouseDown}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Header */}
        <div className="p-4 border-b ml-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <div>
              <h2 className="font-semibold">InsightPro - AI Assistant</h2>
              <p className="text-xs text-muted-foreground">Powered by ML Agent • Voice & Text</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={clearChat} title="Clear chat">
              <Trash2 className="h-4 w-4" />
            </Button>
            {/* <span className="text-xs text-muted-foreground">{panelWidth}px</span> */}
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 ml-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex items-start gap-3 group", message.role === "user" ? "flex-row-reverse" : "")}
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback
                  className={cn(
                    "text-xs",
                    message.role === "assistant"
                      ? message.error
                        ? "bg-red-100 text-red-600"
                        : "bg-primary text-primary-foreground"
                      : "bg-muted",
                  )}
                >
                  {message.role === "assistant" ? (message.error ? "!" : "AI") : "U"}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "rounded-lg p-3 break-words max-w-[80%] relative",
                  message.role === "assistant"
                    ? message.error
                      ? "bg-red-50 text-red-900 border border-red-200"
                      : "bg-muted text-foreground"
                    : "bg-primary text-primary-foreground",
                )}
              >
                <Markdown>{message.content}</Markdown>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                    onClick={() => copyMessage(message.id, message.content)}
                    title="Copy message"
                  >
                    {copiedMessageId === message.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
              </Avatar>
              <div className="rounded-lg p-3 bg-muted">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p className="text-sm">AI is thinking...</p>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions */}
        {messages.length <= 3 && (
          <div className="px-4 ml-4 pb-2">
            <p className="text-xs text-muted-foreground mb-2">Try asking or speaking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.slice(0, 3).map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => setInput(suggestion)}
                  disabled={isLoading}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t ml-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex items-end gap-2"
          >
            <div className="flex-1">
              <Input
                ref={inputRef}
                placeholder="Ask me anything or use voice..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="resize-none"
              />
            </div>
            <Dictaphone onTranscript={handleSpeechTranscript} disabled={isLoading} />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send • Shift+Enter for new line • Click mic to speak • Drag left edge to resize
          </p>
        </div>
      </div>
    </>
  )
}