import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { PatientCheckin } from "@/components/aura/PatientCheckin";
import { Shield, Lock, Heart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Patient Check-in - AuraHealth",
  description:
    "Complete your secure pre-consultation check-in with AI-powered emotional analysis for personalized healthcare.",
  keywords: [
    "patient check-in",
    "healthcare",
    "pre-consultation",
    "emotional analysis",
    "telemedicine",
    "HIPAA compliant",
  ],
  authors: [{ name: "AuraHealth" }],
  robots: "noindex, nofollow", // Privacy-focused for healthcare
};

export default async function CheckInPage() {
  const accessToken = await getHumeAccessToken();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Medical Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-blue-600"
              >
                <Link href="/" className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Home</span>
                </Link>
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">
                AuraHealth
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-4 text-sm text-slate-500">
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>HIPAA Secure</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <span>Encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="w-full max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8 lg:mb-12">
            {/* Progress Indicator */}
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>Step 1 of 3</span>
              <span>•</span>
              <span>Pre-Consultation Assessment</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
              Pre-Consultation
              <span className="block text-blue-600">Check-in</span>
            </h1>

            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Help us prepare for your appointment by sharing how you've been
              feeling. This secure assessment enables your healthcare provider
              to deliver more personalized care.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-slate-500">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-blue-600" />
                <span>End-to-End Encrypted</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-rose-600" />
                <span>AI-Powered Analysis</span>
              </div>
            </div>
          </div>

          {/* Main Check-in Card */}
          <div className="relative">
            {/* Background Design Elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl transform rotate-1"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl transform -rotate-1"></div>

            {/* Main Card */}
            <Card className="relative bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
              <PatientCheckin />
            </Card>
          </div>

          {/* Privacy & Security Notice */}
          <div className="mt-8 lg:mt-12">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 max-w-3xl mx-auto">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Your Privacy & Security
                  </h3>
                  <div className="text-slate-600 space-y-2 text-sm leading-relaxed">
                    <p>
                      <strong>🔒 Encrypted:</strong> All data is protected with
                      military-grade encryption during transmission and storage.
                    </p>
                    <p>
                      <strong>🏥 HIPAA Compliant:</strong> We follow strict
                      healthcare privacy regulations to protect your personal
                      health information.
                    </p>
                    <p>
                      <strong>👨‍⚕️ Medical Use Only:</strong> Your assessment is
                      used exclusively for healthcare purposes and shared only
                      with your healthcare provider.
                    </p>
                    <p>
                      <strong>🗑️ No Permanent Storage:</strong> Sensitive
                      recordings are processed immediately and not stored
                      permanently on our servers.
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <Link
                        href="/privacy"
                        className="hover:text-blue-600 transition-colors underline"
                      >
                        Privacy Policy
                      </Link>
                      <Link
                        href="/security"
                        className="hover:text-blue-600 transition-colors underline"
                      >
                        Security Details
                      </Link>
                      <span className="flex items-center space-x-1">
                        <span>•</span>
                        <span>SOC 2 Certified</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span>•</span>
                        <span>256-bit Encryption</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <div className="flex items-center space-x-2 text-red-700">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Medical Emergency?</span>
              </div>
              <div className="text-red-800 font-semibold">
                Call 911 or visit your nearest emergency room
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-slate-500 space-y-2">
            <p>
              © 2025 AuraHealth. All rights reserved.
              <span className="mx-2">•</span>
              <Link
                href="/terms"
                className="hover:text-blue-600 transition-colors"
              >
                Terms of Service
              </Link>
              <span className="mx-2">•</span>
              <Link
                href="/privacy"
                className="hover:text-blue-600 transition-colors"
              >
                Privacy Policy
              </Link>
            </p>
            <p className="text-xs text-slate-400">
              AuraHealth is a HIPAA-compliant telemedicine platform designed for
              secure healthcare consultations.
            </p>
          </div>
        </div>
      </footer>
    </div>
    // <>
    //   {status.value === "connected" && (
    //     <div className={"grow flex flex-col"}>
    //       <Chat />
    //     </div>
    //   )}

    //   <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
    //     <div className="w-full max-w-2xl mx-auto">
    //       {/* Page Header */}
    //       <div className="text-center mb-8">
    //         <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 mb-2">
    //           AI Doctor Practice Session
    //         </h1>
    //         <p className="text-neutral-600">
    //           Practice your consultation with our AI doctor
    //         </p>
    //       </div>

    //       {/* Main Practice Session Card */}
    //       <Card className="w-full">
    //         <VoiceProvider>
    //           <PatientCheckinView accessToken={accessToken} />
    //         </VoiceProvider>
    //       </Card>

    //       {/* Privacy Notice */}
    //       <div className="text-center mt-6">
    //         <p className="text-xs text-neutral-500">
    //           Your conversation is processed securely and used only for practice and feedback purposes
    //         </p>
    //       </div>
    //     </div>
    //   </div>
    // </>

  );
}
