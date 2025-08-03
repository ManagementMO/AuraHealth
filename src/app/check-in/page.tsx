import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { PatientCheckinView } from "@/components/aura/PatientCheckinView";
import { getHumeAccessToken } from "@/utils/getHumeAccessToken";
import { useVoice, VoiceProvider } from "@humeai/voice-react";
import dynamic from "next/dynamic";
import Chat from "@/components/aura/Chat";
export const metadata: Metadata = {
  title: "AI Doctor Practice - Aura Health",
  description: "Practice your doctor consultation with our AI doctor. Have a natural conversation to prepare for your real appointment and get personalized feedback.",
  keywords: ["AI doctor", "practice session", "doctor consultation", "conversational AI", "healthcare preparation", "EVI"],
  authors: [{ name: "Aura Health" }],
  robots: "noindex, nofollow", // Privacy-focused for healthcare
};

export default async function CheckInPage() {
  const accessToken = await getHumeAccessToken();
  
  return (
    <div className={"grow flex flex-col"}>
      <Chat accessToken={accessToken}/>
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