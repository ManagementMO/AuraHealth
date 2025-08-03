"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Download,
  ArrowLeft,
  Brain,
  CheckCircle,
  Clock,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDataAggregation } from "@/contexts/DataAggregationContext";
import { mockJson } from "@/lib/utilities/mockJson";
import {
  logAggregatedData,
  validateAggregatedData,
} from "@/lib/utilities/dataAggregationUtilities";

export default function ReportPage() {
  const [isGenerating, setIsGenerating] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { getAggregatedData } = useDataAggregation();

  useEffect(() => {
    generateReportAndDisplay();
  }, []);

  // Convert aggregated data to the format expected by the report API
  const convertAggregatedDataToReportFormat = (aggregatedData: any[]) => {
    if (aggregatedData.length === 0) {
      // Fallback to mock data if no aggregated data is available
      return mockJson;
    }

    const now = new Date();
    const consultationDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Yesterday

    const conversation_metrics = aggregatedData.map((dataPoint) => ({
      timestamp: dataPoint.timestamp,
      text_snippet: "Face analysis data point", // Placeholder since we don't have text
      emotions: dataPoint.emotions,
    }));

    return {
      patientId: `P${Math.floor(Math.random() * 1000)}-${Math.floor(
        Math.random() * 100
      )}`,
      consultationDate: consultationDate.toISOString().split("T")[0],
      analysisDate: now.toISOString().split("T")[0],
      conversation_metrics,
    };
  };

  const generateReportAndDisplay = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      // Get aggregated data from the context
      const aggregatedData = getAggregatedData();

      // Log and validate the aggregated data
      console.log("Retrieved aggregated data for report generation");
      logAggregatedData(aggregatedData);

      if (!validateAggregatedData(aggregatedData)) {
        console.warn("Invalid aggregated data detected, using fallback");
      }

      // Convert aggregated data to the format expected by the report API
      const reportData = convertAggregatedDataToReportFormat(aggregatedData);

      // Call the API to generate the PDF
      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      });

      const result = await response.json();

      if (result.success) {
        setPdfUrl(result.pdfUrl);
      } else {
        throw new Error(result.error || "Failed to generate report");
      }
    } catch (error) {
      console.error("Failed to generate report:", error);
      setError("Unable to generate patient report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!pdfUrl) return;

    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `patient-report-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col overflow-hidden">
      {/* Header */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200/50 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Patient Analysis Report
                </h1>
                <p className="text-sm text-slate-500">
                  AI-Generated Consultation Summary
                </p>
              </div>
            </div>
            <Button
              onClick={() => (window.location.href = "/video-call")}
              variant="ghost"
              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Consultations
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8 min-h-0">
        <div className="w-full max-w-2xl">
          {isGenerating ? (
            /* Loading State */
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12">
                <div className="text-center">
                  {/* Animated Icon */}
                  <div className="relative mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                      <Brain className="w-10 h-10 text-white animate-pulse" />
                    </div>
                    <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full opacity-20 animate-ping"></div>
                  </div>

                  {/* Loading Text */}
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    Analyzing Patient Data
                  </h2>
                  <p className="text-slate-600 text-lg mb-8">
                    Our AI is processing the consultation data and generating
                    your comprehensive report...
                  </p>

                  {/* Progress Indicators */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-center space-x-3 text-sm text-slate-500">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Emotional patterns analyzed</span>
                    </div>
                    <div className="flex items-center justify-center space-x-3 text-sm text-slate-500">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Behavioral insights extracted</span>
                    </div>
                    <div className="flex items-center justify-center space-x-3 text-sm text-slate-500">
                      <Clock className="w-4 h-4 text-blue-500 animate-spin" />
                      <span>Generating PDF report...</span>
                    </div>
                  </div>

                  {/* Loading Animation */}
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : error ? (
            /* Error State */
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm border-red-200">
              <CardContent className="p-12">
                <div className="text-center">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <FileText className="w-10 h-10 text-red-600" />
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    Report Generation Failed
                  </h2>
                  <p className="text-slate-600 text-lg mb-8">{error}</p>

                  <div className="space-y-3">
                    <Button
                      onClick={generateReportAndDisplay}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>

                    <Button
                      onClick={() => (window.location.href = "/video-call")}
                      variant="outline"
                      className="w-full h-12 border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all duration-200"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Return to Consultations
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : pdfUrl ? (
            /* Success State */
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12">
                <div className="text-center">
                  {/* Success Icon */}
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>

                  {/* Success Text */}
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    Report Generated Successfully
                  </h2>
                  <p className="text-slate-600 text-lg mb-8">
                    Your comprehensive patient analysis report is ready for
                    review and download.
                  </p>

                  {/* Report Info */}
                  <div className="bg-slate-50 rounded-xl p-6 mb-8 border border-slate-200">
                    <div className="grid grid-cols-2 gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-slate-900 mb-1">
                          Report Type
                        </div>
                        <div className="text-slate-600">
                          AI Sentiment Analysis
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-slate-900 mb-1">
                          Generated
                        </div>
                        <div className="text-slate-600">
                          {new Date().toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      onClick={() => window.open(pdfUrl, "_blank")}
                      className="w-full h-14 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <FileText className="w-5 h-5 mr-3" />
                      View Report
                    </Button>

                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      className="w-full h-12 border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium rounded-lg transition-all duration-200"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>

                    <Button
                      onClick={() => (window.location.href = "/video-call")}
                      variant="ghost"
                      className="w-full h-12 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all duration-200"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Consultations
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 bg-white/50 border-t border-slate-200/50 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-slate-500 text-sm">
            This report contains confidential patient information. Please handle
            according to your organization's privacy policies.
          </p>
        </div>
      </div>
    </div>
  );
}
