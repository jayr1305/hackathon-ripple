"use client"

import { useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardContent } from "@/components/dashboard-content"

import healthAncRegisteredPregnantWoman1_1 from '@/data/health/1-1_pregnant_woman_registered_for_antenatal_care.json'
import healthInstitutionalDeliveries1_2 from '@/data/health/1-2_institutional_deliveries_against_total_reported_deliveries.json'
import healthLowBerthJson1_3 from '@/data/health/1-3_low_birth_weight_babies.json'
import healthNqaStandardFacilites1_4 from '@/data/health/1-4_national_quality_assurance_standards_certified_facilities_in_the_block.json'
import healthHypertensionJson1_5 from '@/data/health/1-5_persons_screened_for_hypertension_against_targeted_population_in_the_block.json'
import healthScreenedForDiabetes1_6 from '@/data/health/1-6_persons_screened_for_diabetes_against_targeted_population_in_the_block.json'
import healthTbTreatedSuccesfully1_7 from '@/data/health/1-7_tuberculosis_cases_treated_successfully_against_tb_cases_notified_a_year_ago.json'
import healthSuplementaryTakenByPragnantWoman1_8 from '@/data/health/1-8_pregnant_women_taking_supplementary_nutrition_under_the_icds_programme_regularly.json'
import healthSuplementaryTakenByChildren1_9 from '@/data/health/1-9_children_from_6_months_to_6_years_taking_Supplementary_Nutrition_under_the_icds_programme_regularly.json'


// Sample data based on your structure


const healthRelatedData = {
  healthAncRegisteredPregnantWoman1_1: {
    title: "Percentage of pregnant women registered for Antenatal care (ANC) within the first trimester",
    data: JSON.parse(JSON.stringify(healthAncRegisteredPregnantWoman1_1, null, 2)),
  },
  healthInstitutionalDeliveries1_2: {
    title: "Percentage of institutional deliveries against total reported deliveries",
    data: JSON.parse(JSON.stringify(healthInstitutionalDeliveries1_2, null, 2)),
  },
  healthLowBerthJson1_3: {
    title: "Percentage of low-birth weight babies (less than 2500g) (-ve)	1",
    data: JSON.parse(JSON.stringify(healthLowBerthJson1_3, null, 2)),
  },
  healthNqaStandardFacilites1_4: {
    title: "Percentage of National Quality Assurance Standards (NQAS) certified facilities in the Block",
    data: JSON.parse(JSON.stringify(healthNqaStandardFacilites1_4, null, 2)),
  },
  healthHypertensionJson1_5: {
    title: "Percentage of persons screened for hypertension against targeted population in the Block",
    data: JSON.parse(JSON.stringify(healthHypertensionJson1_5, null, 2)),
  },
  healthScreenedForDiabetes1_6: {
    title: "Percentage of persons screened for diabetes against targeted population in the Block",
    data: JSON.parse(JSON.stringify(healthScreenedForDiabetes1_6, null, 2)),
  },
  healthTbTreatedSuccesfully1_7: {
    title: "Percentage of Tuberculosis (TB) cases treated successfully against TB cases notified a year ago",
    data: JSON.parse(JSON.stringify(healthTbTreatedSuccesfully1_7, null, 2)),
  },
  healthSuplementaryTakenByPragnantWoman1_8: {
    title: "Percentage of pregnant women taking Supplementary Nutrition under the ICDS programme regularly",
    data: JSON.parse(JSON.stringify(healthSuplementaryTakenByPragnantWoman1_8, null, 2)),
  },
  healthSuplementaryTakenByChildren1_9: {
    title: "Percentage of children from 6 months to 6 years taking Supplementary Nutrition under the ICDS programme regularly",
    data: JSON.parse(JSON.stringify(healthSuplementaryTakenByChildren1_9, null, 2)),
  },
};

const hypertensionData = JSON.parse(JSON.stringify(healthHypertensionJson1_5, null, 2));
const lowBirthWeightData = JSON.parse(JSON.stringify(healthLowBerthJson1_3, null, 2));


export default function Dashboard() {
  const [selectedDataset, setSelectedDataset] = useState<"hypertension" | "low_birth_weight">("hypertension")
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null)

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar selectedDataset={selectedDataset} onDatasetChange={setSelectedDataset} />
        <main className="flex-1 bg-gray-50">
          <DashboardContent
            healthRelatedData={healthRelatedData}
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
