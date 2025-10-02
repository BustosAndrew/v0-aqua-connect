"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

type SubmitStatus = "idle" | "loading" | "success" | "error"

export function ReportIssueForm() {
  const [status, setStatus] = useState<SubmitStatus>("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
    reporterName: "",
    reporterEmail: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setErrorMessage("")

    try {
      const response = await fetch("/api/issues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to submit issue")
      }

      setStatus("success")
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        priority: "medium",
        reporterName: "",
        reporterEmail: "",
      })

      // Reset success message after 5 seconds
      setTimeout(() => setStatus("idle"), 5000)
    } catch (error) {
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "An error occurred")
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Report an Issue</CardTitle>
        <CardDescription className="text-slate-400">
          Help us improve AquaConnect by reporting any problems you encounter
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {status === "success" && (
            <Alert className="bg-green-900/20 border-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-400">
                Issue reported successfully! We'll look into it.
              </AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <Alert className="bg-red-900/20 border-red-800">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-400">{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">
              Issue Title *
            </Label>
            <Input
              id="title"
              placeholder="Brief description of the issue"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-white">
              Category *
            </Label>
            <Select value={formData.category} onValueChange={(value) => handleChange("category", value)} required>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="weather-data">Weather Data</SelectItem>
                <SelectItem value="fishing-hotspots">Fishing Hotspots</SelectItem>
                <SelectItem value="market-prices">Market Prices</SelectItem>
                <SelectItem value="trip-planning">Trip Planning</SelectItem>
                <SelectItem value="predictions">AI Predictions</SelectItem>
                <SelectItem value="ui-ux">UI/UX</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority" className="text-white">
              Priority
            </Label>
            <Select value={formData.priority} onValueChange={(value) => handleChange("priority", value)}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">
              Description *
            </Label>
            <Textarea
              id="description"
              placeholder="Provide detailed information about the issue..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              required
              rows={5}
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reporterName" className="text-white">
                Your Name (Optional)
              </Label>
              <Input
                id="reporterName"
                placeholder="John Doe"
                value={formData.reporterName}
                onChange={(e) => handleChange("reporterName", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reporterEmail" className="text-white">
                Your Email (Optional)
              </Label>
              <Input
                id="reporterEmail"
                type="email"
                placeholder="john@example.com"
                value={formData.reporterEmail}
                onChange={(e) => handleChange("reporterEmail", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          <Button type="submit" disabled={status === "loading"} className="w-full bg-blue-600 hover:bg-blue-700">
            {status === "loading" ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Issue"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
