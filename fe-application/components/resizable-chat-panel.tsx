"use client"

import React from "react"
import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Bot, Loader2, GripVertical, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ResizableChatPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hypertensionData: any[]
  lowBirthWeightData: any[]
  selectedDataset: "hypertension" | "low_birth_weight"
}

const MIN_WIDTH = 400
const MAX_WIDTH = 800
const DEFAULT_WIDTH = 540

export function ResizableChatPanel({
  open,
  onOpenChange,
  hypertensionData,
  lowBirthWeightData,
  selectedDataset,
}: ResizableChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your healthcare data assistant. Ask me anything about your hypertension and low birth weight data. Try asking about top performers, averages, or comparisons between years.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [panelWidth, setPanelWidth] = useState(DEFAULT_WIDTH)
  const [isResizing, setIsResizing] = useState(false)

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

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await mockChatAPI(input, selectedDataset, hypertensionData, lowBirthWeightData)

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response,
          timestamp: new Date(),
        },
      ])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error processing your request. Please try again.",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

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
            <h2 className="font-semibold">Healthcare Data Assistant</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{panelWidth}px</span>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 ml-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex items-start gap-3 max-w-[85%]",
                message.role === "user" ? "ml-auto flex-row-reverse" : "",
              )}
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                {message.role === "assistant" ? <AvatarImage src="/placeholder.svg?height=32&width=32" /> : null}
                <AvatarFallback
                  className={message.role === "assistant" ? "bg-primary text-primary-foreground" : "bg-muted"}
                >
                  {message.role === "assistant" ? "AI" : "U"}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "rounded-lg p-3 break-words",
                  message.role === "assistant" ? "bg-muted text-foreground" : "bg-primary text-primary-foreground",
                )}
              >
                <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 max-w-[85%]">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
              </Avatar>
              <div className="rounded-lg p-3 bg-muted">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p className="text-sm">Analyzing your data...</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestions */}
        <div className="px-4 ml-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {["Show top performers", "Compare years", "District averages", "Worst performing blocks"].map(
              (suggestion) => (
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
              ),
            )}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t ml-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex items-center gap-2"
          >
            <Input
              placeholder="Ask about your healthcare data..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2">
            Drag the left edge to resize • Min: {MIN_WIDTH}px • Max: {MAX_WIDTH}px
          </p>
        </div>
      </div>
    </>
  )
}

// Enhanced mock API function with more detailed responses
async function mockChatAPI(
  query: string,
  selectedDataset: string,
  hypertensionData: any[],
  lowBirthWeightData: any[],
): Promise<string> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

  const currentData = selectedDataset === "hypertension" ? hypertensionData : lowBirthWeightData
  const datasetName = selectedDataset === "hypertension" ? "hypertension management" : "low birth weight prevention"

  // Simple keyword-based responses
  const lowerQuery = query.toLowerCase()

  if (lowerQuery.includes("top") || lowerQuery.includes("best") || lowerQuery.includes("highest")) {
    const topBlock = [...currentData].sort((a, b) => b["Achievement (Mar, 25) "] - a["Achievement (Mar, 25) "])[0]
    const improvement = topBlock["Achievement (Mar, 25) "] - topBlock["Achievement (Mar, 24) "]

    return `🏆 Top Performer: ${topBlock.Blocks} in ${topBlock.District} district leads with ${topBlock["Achievement (Mar, 25) "].toFixed(1)}% achievement in March 2025.

📈 Improvement: ${improvement > 0 ? `+${improvement.toFixed(1)}%` : `${improvement.toFixed(1)}%`} from March 2024
🎯 Rank: #${topBlock["Absolute Rank (Mar, 25) "]} (was #${topBlock["Absolute Rank (Mar, 24) "]} in 2024)
📊 Score: ${topBlock["Absolute Score (Mar, 25) "]}% absolute score`
  }

  if (lowerQuery.includes("worst") || lowerQuery.includes("lowest") || lowerQuery.includes("bottom")) {
    const worstBlock = [...currentData].sort((a, b) => a["Achievement (Mar, 25) "] - b["Achievement (Mar, 25) "])[0]
    const change = worstBlock["Achievement (Mar, 25) "] - worstBlock["Achievement (Mar, 24) "]

    return `⚠️ Needs Attention: ${worstBlock.Blocks} in ${worstBlock.District} district has the lowest achievement at ${worstBlock["Achievement (Mar, 25) "].toFixed(1)}% in March 2025.

📉 Change: ${change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`} from March 2024
📍 Current Rank: #${worstBlock["Absolute Rank (Mar, 25) "]}
💡 Recommendation: This block may need additional support and resources.`
  }

  if (lowerQuery.includes("average") || lowerQuery.includes("mean")) {
    const avg2025 = currentData.reduce((sum, item) => sum + item["Achievement (Mar, 25) "], 0) / currentData.length
    const avg2024 = currentData.reduce((sum, item) => sum + item["Achievement (Mar, 24) "], 0) / currentData.length
    const overallChange = avg2025 - avg2024

    return `📊 Average Performance for ${datasetName}:

🎯 March 2025: ${avg2025.toFixed(1)}%
📅 March 2024: ${avg2024.toFixed(1)}%
📈 Overall Change: ${overallChange >= 0 ? `+${overallChange.toFixed(1)}%` : `${overallChange.toFixed(1)}%`}

${overallChange >= 0 ? "✅ Positive trend across the region!" : "⚠️ Declining trend - intervention may be needed."}`
  }

  if (lowerQuery.includes("compare") || lowerQuery.includes("difference") || lowerQuery.includes("year")) {
    const improvements = currentData.filter((item) => item["Change "] > 0).length
    const declines = currentData.filter((item) => item["Change "] < 0).length
    const stable = currentData.length - improvements - declines

    return `📊 Year-over-Year Comparison (Mar 2024 vs Mar 2025):

📈 Improved: ${improvements} blocks (${((improvements / currentData.length) * 100).toFixed(1)}%)
📉 Declined: ${declines} blocks (${((declines / currentData.length) * 100).toFixed(1)}%)
➡️ Stable: ${stable} blocks (${((stable / currentData.length) * 100).toFixed(1)}%)

🎯 Key Insight: ${improvements > declines ? "More blocks are improving than declining - positive overall trend!" : "More attention needed as declines outweigh improvements."}`
  }

  if (lowerQuery.includes("district")) {
    const districts = Array.from(new Set(currentData.map((item) => item.District)))
    const districtPerformance = districts
      .map((district) => {
        const districtBlocks = currentData.filter((item) => item.District === district)
        const avgPerformance =
          districtBlocks.reduce((sum, item) => sum + item["Achievement (Mar, 25) "], 0) / districtBlocks.length
        return { district, avgPerformance, blockCount: districtBlocks.length }
      })
      .sort((a, b) => b.avgPerformance - a.avgPerformance)

    return `🗺️ District Performance Overview:

${districtPerformance
  .map((d, i) => `${i + 1}. ${d.district}: ${d.avgPerformance.toFixed(1)}% avg (${d.blockCount} blocks)`)
  .join("\n")}

🏆 Best District: ${districtPerformance[0].district}
📍 Total Districts: ${districts.length}`
  }

  // Default response with helpful suggestions
  return `🤖 I'm analyzing the ${datasetName} data for you. Here are some questions you can ask:

💡 Try asking about:
• "Show me the top performing blocks"
• "What's the average achievement?"
• "Compare performance between years"
• "Which districts are doing best?"
• "Show me the worst performing areas"

📊 Current Dataset: ${currentData.length} blocks across ${Array.from(new Set(currentData.map((item) => item.District))).length} districts

What would you like to know?`
}
