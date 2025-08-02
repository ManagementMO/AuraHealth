import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { PatientCheckin } from "@/components/aura/PatientCheckin";

export const metadata: Metadata = {
  title: "Check-in - Aura Health",
  description: "Complete your pre-consultation check-in by recording a 60-second video describing how you've been feeling.",
  keywords: ["patient check-in", "healthcare", "pre-consultation", "emotional analysis", "video recording"],
  authors: [{ name: "Aura Health" }],
  robots: "noindex, nofollow", // Privacy-focused for healthcare
};

export default function CheckInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full max-w-2xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 mb-2">
            Pre-Consultation Check-in
          </h1>
          <p className="text-neutral-600">
            Help us prepare for your appointment
          </p>
        </div>

        {/* Main Check-in Card */}
        <Card className="w-full">
          <PatientCheckin />
        </Card>

        {/* Privacy Notice */}
        <div className="text-center mt-6">
          <p className="text-xs text-neutral-500">
            Your recording is processed securely and used only for healthcare purposes
          </p>
        </div>
      </div>
    </div>
  );
}