"use client"

import { useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardContent } from "@/components/dashboard-content"

import hypertensionJson from '@/data/hypertension_Sheet1.json'
import lowBerthJson from '@/data/low_birth_weight_Sheet1.json'


// Sample data based on your structure
const hypertensionData = JSON.parse(JSON.stringify(hypertensionJson, null, 2));

const lowBirthWeightData = JSON.parse(JSON.stringify(lowBerthJson, null, 2));


export default function Dashboard() {
  const [selectedDataset, setSelectedDataset] = useState<"hypertension" | "low_birth_weight">("hypertension")
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null)

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar selectedDataset={selectedDataset} onDatasetChange={setSelectedDataset} />
        <main className="flex-1 bg-gray-50">
          <DashboardContent
            hypertensionData={hypertensionData}
            lowBirthWeightData={lowBirthWeightData}
            selectedDataset={selectedDataset}
            selectedBlock={selectedBlock}
            onBlockSelect={setSelectedBlock}
          />
        </main>
      </div>
    </SidebarProvider>
  )
}
