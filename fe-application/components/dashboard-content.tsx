"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Users, MapPin, Calendar, Bot } from "lucide-react"
import { MetricCard } from "@/components/metric-card"
import { GaugeChart } from "@/components/gauge-chart"
import { TrendChart } from "@/components/trend-chart"
import { DistributionChart } from "@/components/distribution-chart"
import { Button } from "@/components/ui/button"
import { ResizableChatPanel } from "@/components/resizable-chat-panel"
import { AIBuddyOverlay } from "./ai-buddy-overlay"

interface DashboardContentProps {
  hypertensionData: any[]
  lowBirthWeightData: any[]
  selectedDataset: "hypertension" | "low_birth_weight"
  selectedBlock: string | null
  onBlockSelect: (block: string | null) => void
}

const customStyles = `
  @keyframes spin-slow {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  .animate-spin-slow {
    animation: spin-slow 8s linear infinite;
  }
  
  .bg-gradient-radial {
    background: radial-gradient(circle, var(--tw-gradient-stops));
  }
`

export function DashboardContent({
  hypertensionData,
  lowBirthWeightData,
  selectedDataset,
  selectedBlock,
  onBlockSelect,
}: DashboardContentProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const datasetTitle = selectedDataset === "hypertension" ? "Hypertension Management" : "Low Birth Weight Prevention"
  const currentData = selectedDataset === "hypertension" ? hypertensionData : lowBirthWeightData
  const filteredData = currentData

  // Calculate aggregate metrics
  const totalBlocks = currentData.length
  const avgAchievement2025 = currentData.reduce((sum, item) => sum + item["Achievement (Mar, 25) "], 0) / totalBlocks
  const avgChange = currentData.reduce((sum, item) => sum + item["Change "], 0) / totalBlocks
  const topPerformers = currentData.filter(
    (item) => item["Achievement (Mar, 25 ) Status w.r.t. State Average (Mar,25 ) "] === "Above",
  ).length
  const [isOverlayOpen, setIsOverlayOpen] = useState(true)

  return (
    <>
      <AIBuddyOverlay isOpen={isOverlayOpen} onClose={() => setIsOverlayOpen(false)} />
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{datasetTitle}</h1>
            <p className="text-muted-foreground">Monitoring health outcomes across districts and blocks</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Button
                variant="outline"
                className="relative w-64 justify-start text-muted-foreground overflow-hidden border-blue-200/50 bg-background/80 backdrop-blur-sm hover:bg-blue-50/50 hover:border-blue-300/70 transition-all duration-300 group"
                onClick={() => setIsChatOpen(true)}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const x = e.clientX - rect.left
                  const y = e.clientY - rect.top
                  e.currentTarget.style.setProperty("--mouse-x", `${x}px`)
                  e.currentTarget.style.setProperty("--mouse-y", `${y}px`)
                }}
                style={{
                  boxShadow: `
        0 0 20px rgba(196, 38, 3, 0.16),
        0 0 40px rgba(182, 23, 23, 0.9),
        inset 0 1px 0 rgba(255, 255, 255, 0.1)
      `,
                }}
              >
                {/* Base rotating glow */}
                <div className="absolute inset-0 rounded-md opacity-75">
                  <div className="absolute inset-0 rounded-md bg-gradient-to-r from-transparent via-blue-400/20 to-transparent animate-spin-slow"></div>
                </div>

                {/* Cursor following glow */}
                <div
                  className="absolute w-32 h-32 rounded-full bg-gradient-radial from-blue-400/30 via-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    left: "var(--mouse-x, 50%)",
                    top: "var(--mouse-y, 50%)",
                    transform: "translate(-50%, -50%)",
                    filter: "blur(8px)",
                  }}
                ></div>

                {/* Button content */}
                <div className="relative z-10 flex items-center">
                  <Bot className="mr-2 h-4 w-4 text-blue-500" />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium">
                    Ask Data Dost...
                  </span>
                </div>

                {/* Inner glow border */}
                <div className="absolute inset-0 rounded-md border border-blue-300/30 group-hover:border-blue-400/50 transition-colors duration-300"></div>
              </Button>
            </div>
            <Badge variant="outline" className="gap-1">
              <Calendar className="h-3 w-3" />
              Mar 2025
            </Badge>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Average Achievement"
            value={`${avgAchievement2025.toFixed(1)}%`}
            change={avgChange}
            description="Current period performance"
            icon={TrendingUp}
          />
          <MetricCard
            title="Total Blocks"
            value={totalBlocks.toString()}
            description="Monitored locations"
            icon={MapPin}
          />
          <MetricCard
            title="Top Performers"
            value={topPerformers.toString()}
            description="Above state average"
            icon={Users}
          />
          <MetricCard
            title="Improvement Rate"
            value={`${((topPerformers / totalBlocks) * 100).toFixed(1)}%`}
            change={15.2}
            description="Performance improvement"
            icon={TrendingUp}
          />
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <GaugeChart title="Achievement Score" value={avgAchievement2025} max={200} unit="%" color="blue" />
          <GaugeChart
            title="Absolute Score"
            value={currentData.reduce((sum, item) => sum + item["Absolute Score (Mar, 25) "], 0) / totalBlocks}
            max={100}
            unit="pts"
            color="green"
          />
          <GaugeChart
            title="Performance Change"
            value={Math.abs(avgChange)}
            max={200}
            unit="Δ%"
            color={avgChange >= 0 ? "green" : "red"}
          />
          <GaugeChart
            title="State Compliance"
            value={(topPerformers / totalBlocks) * 100}
            max={100}
            unit="%"
            color="orange"
            highlighted={true}
          />
        </div>

        {/* Detailed Analytics */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Achievement comparison between Mar 2024 and Mar 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="weekly" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
                  </TabsList>
                  <TabsContent value="weekly" className="space-y-4">
                    <TrendChart data={currentData} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>District Distribution</CardTitle>
                <CardDescription>Performance by district</CardDescription>
              </CardHeader>
              <CardContent>
                <DistributionChart data={currentData} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Block Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Block Performance Details</CardTitle>
            <CardDescription>Detailed performance metrics for each block</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredData.map((item, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedBlock === item.Blocks ? "bg-muted border-primary" : ""
                  }`}
                  onClick={() => onBlockSelect(selectedBlock === item.Blocks ? null : item.Blocks)}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{item.Blocks}</h4>
                        <Badge variant="outline">{item.District}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Rank: #{item["Absolute Rank (Mar, 25) "]}</span>
                        <span>Score: {item["Absolute Score (Mar, 25) "]}%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{item["Achievement (Mar, 25) "].toFixed(1)}%</div>
                      <div
                        className={`flex items-center gap-1 text-sm ${
                          item["Change "] >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {item["Change "] >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {Math.abs(item["Change "]).toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  {selectedBlock === item.Blocks && (
                    <div className="mt-4 pt-4 border-t grid gap-4 md:grid-cols-2">
                      <div>
                        <h5 className="font-medium mb-2">March 2024 Performance</h5>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Achievement:</span>
                            <span>{item["Achievement (Mar, 24) "]}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Absolute Score:</span>
                            <span>{item["Absolute Score (Mar, 24) "]}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Rank:</span>
                            <span>#{item["Absolute Rank (Mar, 24) "]}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">March 2025 Performance</h5>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Achievement:</span>
                            <span>{item["Achievement (Mar, 25) "]}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Absolute Score:</span>
                            <span>{item["Absolute Score (Mar, 25) "]}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Status vs State Avg:</span>
                            <Badge
                              variant={
                                item["Achievement (Mar, 25 ) Status w.r.t. State Average (Mar,25 ) "] === "Above"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {item["Achievement (Mar, 25 ) Status w.r.t. State Average (Mar,25 ) "]}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Independent AI Chat Panel */}
        <ResizableChatPanel open={isChatOpen} onOpenChange={setIsChatOpen} />
      </div>
    </>
  )
}
