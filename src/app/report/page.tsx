"use client";

import { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mockJson } from "@/lib/utilities/mockJson";

export default function ReportPage() {
  const [isGenerating, setIsGenerating] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    generateReportAndDisplay();
  }, []);

  const generateReportAndDisplay = async () => {
    try {
      setIsGenerating(true);

      // Call the API to generate the PDF
      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        setPdfUrl(result.pdfUrl);
      } else {
        throw new Error(result.error || "Failed to generate report");
      }
    } catch (error) {
      console.error("Failed to generate report:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Patient Sentiment Report
        </h1>

        {isGenerating ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Generating PDF report...</p>
            </CardContent>
          </Card>
        ) : pdfUrl ? (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-center">
                  <Button
                    onClick={() => window.open(pdfUrl, "_blank")}
                    className="px-8"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Report
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-red-600">Failed to generate report</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
