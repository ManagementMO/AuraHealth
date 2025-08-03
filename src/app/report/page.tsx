"use client";

import { useState, useEffect } from "react";
import {
  Download,
  FileText,
  Clock,
  User,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ReportData {
  patientId: string;
  patientName: string;
  consultationDate: string;
  duration: string;
  reportUrl?: string;
}

export default function ReportPage() {
  const [isGenerating, setIsGenerating] = useState(true);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  const [reportData] = useState<ReportData>({
    patientId: "P789-01",
    patientName: "John Smith",
    consultationDate: new Date().toLocaleDateString(),
    duration: "00:15:30",
  });

  useEffect(() => {
    generateReport();
  }, []);

  const generateReport = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Simulate API call to generate report
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // For now, we'll use a placeholder URL
      // In a real implementation, this would be the actual PDF URL
      setReportUrl("/api/reports/latest");
      setGenerationProgress(100);
    } catch (error) {
      console.error("Failed to generate report:", error);
    } finally {
      setIsGenerating(false);
      clearInterval(progressInterval);
    }
  };

  const handleDownload = () => {
    if (reportUrl) {
      const link = document.createElement("a");
      link.href = reportUrl;
      link.download = `patient-report-${reportData.patientId}-${reportData.consultationDate}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <a href="/">
              <Button
                variant="ghost"
                className="mb-4 flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
          </a>

          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Consultation Report
              </h1>
              <p className="text-gray-600">
                AI-powered sentiment analysis report
              </p>
            </div>
          </div>
        </div>

        {/* Patient Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-600" />
              <span>Patient Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Patient ID
                </label>
                <p className="text-sm text-gray-900">{reportData.patientId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Patient Name
                </label>
                <p className="text-sm text-gray-900">
                  {reportData.patientName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Consultation Date
                </label>
                <p className="text-sm text-gray-900 flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{reportData.consultationDate}</span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Call Duration
                </label>
                <p className="text-sm text-gray-900 flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{reportData.duration}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Generation Status */}
        {isGenerating && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Generating Report
                    </p>
                    <p className="text-sm text-gray-500">
                      Analyzing conversation sentiment...
                    </p>
                  </div>
                </div>
                <Progress value={generationProgress} className="w-full" />
                <p className="text-xs text-gray-500 text-center">
                  {generationProgress < 30 && "Processing conversation data..."}
                  {generationProgress >= 30 &&
                    generationProgress < 60 &&
                    "Analyzing emotional patterns..."}
                  {generationProgress >= 60 &&
                    generationProgress < 90 &&
                    "Generating insights..."}
                  {generationProgress >= 90 && "Finalizing report..."}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Report Ready */}
        {reportUrl && !isGenerating && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-900">Report Ready</p>
                  <p className="text-sm text-green-700">
                    Your sentiment analysis report has been generated
                  </p>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={() => window.open(reportUrl, "_blank")}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Report
                </Button>
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Report Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              What's Included in Your Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Executive Summary</p>
                  <p className="text-sm text-gray-500">
                    High-level overview of patient's emotional state
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Sentiment Analysis
                  </p>
                  <p className="text-sm text-gray-500">
                    Detailed emotional trajectory throughout the call
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Communication Style
                  </p>
                  <p className="text-sm text-gray-500">
                    Analysis of patient's engagement and communication patterns
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">4</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Actionable Recommendations
                  </p>
                  <p className="text-sm text-gray-500">
                    Specific suggestions for improved patient interaction
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
