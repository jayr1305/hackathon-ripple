"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

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
  
  .cursor-glow {
    position: absolute;
    width: 150px;
    height: 150px;
    background: radial-gradient(circle, rgba(255, 140, 0, 0.4) 0%, rgba(255, 165, 0, 0.2) 30%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
    filter: blur(10px);
    z-index: 1;
  }
  
  .modal-content:hover .cursor-glow {
    opacity: 1;
  }
`

export function AIBuddyOverlay({ isOpen, onClose }: AIBuddyOverlayProps) {
  const [currentStep, setCurrentStep] = useState<"welcome" | "form">("welcome")
  const [formData, setFormData] = useState({
    dataType: "",
    mobileNumber: "",
    emailAddress: "",
    dateOfBirth: "",
    gender: "",
  })

  const handleNext = () => {
    setCurrentStep("form")
  }

  const handleStart = () => {
    console.log("Form submitted:", formData)
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

    const cursorGlow = e.currentTarget.querySelector(".cursor-glow") as HTMLElement
    if (cursorGlow) {
      cursorGlow.style.left = `${x - 75}px`
      cursorGlow.style.top = `${y - 75}px`
    }
  }

  if (!isOpen) return null

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
              className="modal-content relative bg-white rounded-2xl shadow-2xl overflow-hidden"
              onMouseMove={handleMouseMove}
              style={{ minWidth: "480px", minHeight: "320px" }}
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

              {currentStep === "welcome" ? (
                /* Welcome Step */
                <div className="p-8 text-center relative z-10">
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Start Your</h2>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                      AI Buddy Today
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
              ) : (
                /* Form Step */
                <div className="p-8 relative z-10">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your data!</h2>
                    <p className="text-gray-600">Fill all the required fields.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="dataType" className="text-sm font-medium text-gray-700">
                        Type of Data*
                      </Label>
                      <Select
                        value={formData.dataType}
                        onValueChange={(value) => setFormData({ ...formData, dataType: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="CSV" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                          <SelectItem value="json">JSON</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="mobile" className="text-sm font-medium text-gray-700">
                        Mobile Number*
                      </Label>
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="+91 9999-99999"
                        value={formData.mobileNumber}
                        onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address*
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@domain.com"
                        value={formData.emailAddress}
                        onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="dob" className="text-sm font-medium text-gray-700">
                        Date of Birth*
                      </Label>
                      <Input
                        id="dob"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                        Gender*
                      </Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => setFormData({ ...formData, gender: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep("welcome")}
                      className="flex-1 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleStart}
                      className="flex-1 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Start
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