import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        {/* Aura Health Branding */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 tracking-tight">
            Aura Health
          </h1>
          <div className="w-24 h-1 bg-teal-500 mx-auto rounded-full"></div>
        </div>

        {/* Value Proposition */}
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium text-neutral-700 leading-relaxed">
            Prepare for your appointment with our secure pre-consultation
            check-in
          </h2>

          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            Take a moment to share how you&apos;ve been feeling. Our AI-powered
            system helps your healthcare provider better understand your
            emotional state before your appointment, leading to more
            personalized care.
          </p>
        </div>

        {/* Call-to-Action */}
        <div className="pt-4">
          <Button
            asChild
            size="lg"
            className="text-base px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white shadow-lg"
          >
            <Link href="/check-in">Start Your Check-in</Link>
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="pt-8 space-y-2">
          <p className="text-sm text-neutral-500">
            Secure • Private • HIPAA-Ready
          </p>
          <p className="text-xs text-neutral-400">
            Your privacy and data security are our top priorities
          </p>
        </div>
      </div>
    </div>
  );
}
