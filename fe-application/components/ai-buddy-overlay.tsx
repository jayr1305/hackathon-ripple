"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, FileText, Plus } from "lucide-react"

interface AIBuddyOverlayProps {
  isOpen: boolean
  onClose: () => void
}

const glowStyles = `
  @keyframes flow-glow {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  
  .flowing-border {
    position: relative;
    background: linear-gradient(-45deg, 
      transparent, 
      rgba(255, 165, 0, 0.3), 
      rgba(255, 140, 0, 0.5), 
      rgba(255, 165, 0, 0.3), 
      transparent,
      rgba(255, 69, 0, 0.3),
      rgba(255, 140, 0, 0.5),
      rgba(255, 165, 0, 0.3),
      transparent
    );
    background-size: 400% 400%;
    animation: flow-glow 4s ease-in-out infinite;
    padding: 4px;
    border-radius: 16px;
  }
  
  .flowing-border::before {
    content: '';
    position: absolute;
    inset: 0;
    padding: 2px;
    background: linear-gradient(-45deg, 
      transparent, 
      rgba(255, 165, 0, 0.2), 
      rgba(255, 140, 0, 0.4), 
      rgba(255, 165, 0, 0.2), 
      transparent,
      rgba(255, 69, 0, 0.2),
      rgba(255, 140, 0, 0.4),
      rgba(255, 165, 0, 0.2),
      transparent
    );
    background-size: 400% 400%;
    animation: flow-glow 4s ease-in-out infinite reverse;
    border-radius: 16px;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: xor;
    -webkit-mask-composite: xor;
  }
  
  /* Custom Torchlight Cursor */
  .torchlight-cursor {
    cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' fill='none'%3E%3Cpath d='M14 2C14 0.895431 14.8954 0 16 0C17.1046 0 18 0.895431 18 2V4C18 5.10457 17.1046 6 16 6C14.8954 6 14 5.10457 14 4V2Z' fill='%23F5F5F5'/%3E%3Cpath d='M8.5 7.5C7.67157 6.67157 7.67157 5.32843 8.5 4.5C9.32843 3.67157 10.6716 3.67157 11.5 4.5L12.9393 5.93934C13.7676 6.76777 13.7676 8.11091 12.9393 8.93934C12.1109 9.76777 10.7678 9.76777 9.93937 8.93934L8.5 7.5Z' fill='%23F5F5F5'/%3E%3Cpath d='M23.5 4.5C24.3284 3.67157 25.6716 3.67157 26.5 4.5C27.3284 5.32843 27.3284 6.67157 26.5 7.5L25.0607 8.93934C24.2322 9.76777 22.8891 9.76777 22.0607 8.93934C21.2322 8.11091 21.2322 6.76777 22.0607 5.93934L23.5 4.5Z' fill='%23F5F5F5'/%3E%3Cpath d='M11 16C11 13.2386 13.2386 11 16 11C18.7614 11 21 13.2386 21 16V24C21 26.7614 18.7614 29 16 29C13.2386 29 11 26.7614 11 24V16Z' fill='%23FF8C00'/%3E%3Cpath d='M12 16C12 13.7909 13.7909 12 16 12C18.2091 12 20 13.7909 20 16V24C20 26.2091 18.2091 28 16 28C13.7909 28 12 26.2091 12 24V16Z' fill='%23FFA500'/%3E%3Ccircle cx='16' cy='16' r='3' fill='%23FFFFFF' fillOpacity='0.95'/%3E%3Ccircle cx='16' cy='16' r='1.5' fill='%23FFF8DC' fillOpacity='0.8'/%3E%3C/svg%3E") 16 16, auto;
  }
  
  .cursor-glow {
    position: absolute;
    width: 180px;
    height: 180px;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.4) 0%,
      rgba(255, 140, 0, 0.3) 15%,
      rgba(255, 165, 0, 0.2) 30%,
      rgba(255, 69, 0, 0.1) 50%,
      transparent 70%
    );
    border-radius: 50%;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.4s ease;
    filter: blur(12px);
    z-index: 1;
    box-shadow: 
      0 0 20px rgba(255, 140, 0, 0.15),
      0 0 40px rgba(255, 165, 0, 0.1);
  }

  .cursor-glow::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50px;
    height: 50px;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.6) 0%,
      rgba(255, 255, 255, 0.3) 30%,
      rgba(255, 140, 0, 0.2) 60%,
      transparent 100%
    );
    border-radius: 50%;
    filter: blur(3px);
  }

  .cursor-glow::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 16px;
    height: 16px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    filter: blur(1px);
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
  }

  .modal-content:hover .cursor-glow {
    opacity: 0.8;
    filter: blur(10px);
  }

  .modal-content:hover {
    background: radial-gradient(
      circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      rgba(255, 255, 255, 0.03) 0%,
      rgba(255, 140, 0, 0.01) 20%,
      transparent 40%
    ),
    white;
  }

  .modal-content {
    box-shadow: 
      0 25px 50px -12px rgba(0, 0, 0, 0.25),
      0 0 0 1px rgba(255, 140, 0, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
`

export function AIBuddyOverlay({ isOpen, onClose }: AIBuddyOverlayProps) {
  const [currentStep, setCurrentStep] = useState<"welcome" | "form" | "data-upload" | "knowledge-base">("welcome")
  const [formData, setFormData] = useState({
    dataType: "",
    mobileNumber: "",
    emailAddress: "",
    dateOfBirth: "",
    gender: "",
  })
  const [selectedDataType, setSelectedDataType] = useState("CSV")
  const [apiLink, setApiLink] = useState("")
  const [documentsLink, setDocumentsLink] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [knowledgeFiles, setKnowledgeFiles] = useState<File[]>([])

  const handleNext = () => {
    if (currentStep === "welcome") {
      setCurrentStep("data-upload")
    } else if (currentStep === "data-upload") {
      setCurrentStep("knowledge-base")
    }
  }

  const handleBack = () => {
    if (currentStep === "data-upload") {
      setCurrentStep("welcome")
    } else if (currentStep === "knowledge-base") {
      setCurrentStep("data-upload")
    }
  }

  const handleStart = () => {
    console.log("Setup completed:", {
      formData,
      selectedDataType,
      apiLink,
      documentsLink,
      uploadedFiles,
      knowledgeFiles,
    })
    onClose()
    setCurrentStep("welcome")
  }

  const handleClose = () => {
    onClose()
    setCurrentStep("welcome")
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Update CSS custom properties for background effect
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`)
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`)

    const cursorGlow = e.currentTarget.querySelector(".cursor-glow") as HTMLElement
    if (cursorGlow) {
      cursorGlow.style.left = `${x - 90}px`
      cursorGlow.style.top = `${y - 90}px`
    }
  }

  const handleFileUpload = (files: FileList | null, type: "data" | "knowledge") => {
    if (files) {
      if (type === "data") {
        setUploadedFiles(Array.from(files))
      } else {
        setKnowledgeFiles((prev) => [...prev, ...Array.from(files)])
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, type: "data" | "knowledge") => {
    e.preventDefault()
    const files = e.dataTransfer.files
    handleFileUpload(files, type)
  }

  if (!isOpen) return null

  const getStepProgress = () => {
    switch (currentStep) {
      case "welcome":
        return 0
      case "data-upload":
        return 1
      case "knowledge-base":
        return 2
      default:
        return 0
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: glowStyles }} />

      {/* Backdrop with blur */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-md" onClick={handleClose} />

        {/* Modal Container */}
        <div className="relative z-10">
          <div className="flowing-border">
            <div
              className="modal-content relative bg-white rounded-2xl shadow-2xl overflow-hidden torchlight-cursor"
              onMouseMove={handleMouseMove}
              style={{ minWidth: "600px", minHeight: "500px" }}
            >
              {/* Cursor following glow */}
              <div className="cursor-glow" />

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-20 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>

              {/* Progress indicator for steps 2-4 */}
              {currentStep !== "welcome" && (
                <div className="flex justify-center pt-6 pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                          getStepProgress() >= 1 ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        1
                      </div>
                      <span className="ml-2 text-sm font-medium text-orange-500">About Data</span>
                    </div>
                    <div className={`w-16 h-0.5 ${getStepProgress() >= 2 ? "bg-orange-500" : "bg-gray-200"}`} />
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                          getStepProgress() >= 2 ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        2
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-600">About KB</span>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === "welcome" ? (
                /* Welcome Step */
                <div className="p-8 text-center relative z-10">
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-white">You Are Not Ready For</h2>
                    <h2 className="text-3xl font-bold text-white">
                      InsightPro
                    </h2>
                  </div>
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Start Your Journey With</h2>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                      InsightPro
                    </h2>
                  </div>
                  <p className="text-gray-600 mb-8 text-lg">Click to start customizing AI for your own user</p>

                  <Button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Customize →
                  </Button>
                </div>
              ) : currentStep === "form" ? null : currentStep === "data-upload" ? (
                /* Data Selection Step */
                <div className="p-8 relative z-10">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Please confirm which data set you want us to access
                    </h2>
                    <p className="text-gray-600">Select all data types you need</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {[
                      {
                        id: "anc",
                        text: "Percentage of pregnant women registered for Antenatal care (ANC) within the first trimester",
                        selected: true,
                      },
                      {
                        id: "deliveries",
                        text: "Percentage of institutional deliveries against total reported deliveries",
                        selected: true,
                      },
                      {
                        id: "hypertension",
                        text: "Percentage of persons screened for hypertension against targeted population in the Block",
                        selected: false,
                      },
                      {
                        id: "diabetes",
                        text: "Percentage of persons screened for diabetes against targeted population in the Block",
                        selected: false,
                      },
                      {
                        id: "tuberculosis",
                        text: "Percentage of Tuberculosis (TB) cases treated successfully against TB cases notified a year ago",
                        selected: false,
                      },
                    ].map((item) => (
                      <div
                        key={item.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          item.selected ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => {
                          // Handle selection logic here
                          console.log(`Toggled ${item.id}`)
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <p className={`text-sm ${item.selected ? "text-orange-700" : "text-gray-700"}`}>
                            {item.text}
                          </p>
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              item.selected ? "border-orange-500 bg-orange-500" : "border-gray-300"
                            }`}
                          >
                            {item.selected && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tell us about your data */}
                  <div className="mb-6">
                    <Label htmlFor="data-description" className="text-sm font-medium text-gray-700 mb-2 block font-bold">
                      Tell us about your data
                    </Label>
                    <textarea
                      id="data-description"
                      placeholder="Eg. This data talks about health/education etc"
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none h-20 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      value={apiLink}
                      onChange={(e) => setApiLink(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3 mt-8">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="flex-1 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleNext}
                      className="flex-1 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Next →
                    </Button>
                  </div>
                </div>
              ) : (
                /* Knowledge Base Step */
                <div className="p-8 relative z-10">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your knowledge base!</h2>
                    <p className="text-gray-600">
                      Please upload relevant policy documents, guidelines, SOPs, or rulebooks you want the system to
                      refer.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* File Upload */}
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-3 block">Upload file</Label>
                      <div
                        className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, "knowledge")}
                      >
                        <FileText className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                        <p className="text-orange-600 font-medium mb-2">Drag & Drop</p>
                        <p className="text-orange-500 mb-4">your files here</p>
                        <input
                          id="knowledge-file-input"
                          type="file"
                          multiple
                          className="hidden"
                          onChange={(e) => handleFileUpload(e.target.files, "knowledge")}
                        />
                      </div>
                      {knowledgeFiles.length > 0 && (
                        <div className="mt-2 text-sm text-gray-600">{knowledgeFiles.length} file(s) selected</div>
                      )}
                    </div>

                    {/* Documents Link */}
                    <div>
                      <Label htmlFor="documents-link" className="text-sm font-medium text-gray-700">
                        Add your documents link
                      </Label>
                      <Input
                        id="documents-link"
                        placeholder="Enter your link here"
                        value={documentsLink}
                        onChange={(e) => setDocumentsLink(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    {/* Add Another File Button */}
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById("knowledge-file-input")?.click()}
                      className="w-full border-orange-300 text-orange-600 hover:bg-orange-50 flex items-center justify-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add another file
                    </Button>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="flex-1 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleStart}
                      className="flex-1 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Start Now
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}