"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Users,
  Heart,
  Clock,
  CheckCircle,
  Star,
  Lock,
  Globe,
  Award,
  ArrowRight,
  Play,
  UserCheck,
  Stethoscope,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const howItWorksRef = useRef<HTMLElement>(null);
  const securityRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const trustBadgeRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaButtonsRef = useRef<HTMLDivElement>(null);
  const trustIndicatorsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero section parallax and fade effects
    gsap.fromTo(
      heroRef.current,
      {
        y: 0,
        opacity: 1,
      },
      {
        y: -100,
        opacity: 0.3,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      }
    );

    // Hero elements staggered animation
    gsap.fromTo(
      [
        trustBadgeRef.current,
        heroTitleRef.current,
        heroSubtitleRef.current,
        ctaButtonsRef.current,
        trustIndicatorsRef.current,
      ],
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top 80%",
          end: "top 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Features section parallax
    gsap.fromTo(
      featuresRef.current,
      {
        y: 100,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%",
          end: "top 20%",
          scrub: 1,
        },
      }
    );

    // Feature cards staggered animation
    const featureCards = featuresRef.current?.querySelectorAll(".feature-card");
    if (featureCards) {
      gsap.fromTo(
        featureCards,
        {
          y: 60,
          opacity: 0,
          scale: 0.9,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 70%",
            end: "top 30%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // How It Works section parallax
    gsap.fromTo(
      howItWorksRef.current,
      {
        y: 80,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: howItWorksRef.current,
          start: "top 80%",
          end: "top 20%",
          scrub: 1,
        },
      }
    );

    // How It Works steps animation
    const steps = howItWorksRef.current?.querySelectorAll(".step-item");
    if (steps) {
      gsap.fromTo(
        steps,
        {
          y: 40,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: howItWorksRef.current,
            start: "top 70%",
            end: "top 30%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Security section parallax
    gsap.fromTo(
      securityRef.current,
      {
        y: 60,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: securityRef.current,
          start: "top 80%",
          end: "top 20%",
          scrub: 1,
        },
      }
    );

    // Security features animation
    const securityFeatures =
      securityRef.current?.querySelectorAll(".security-feature");
    if (securityFeatures) {
      gsap.fromTo(
        securityFeatures,
        {
          x: -50,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: securityRef.current,
            start: "top 70%",
            end: "top 30%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Security stats animation
    const securityStats =
      securityRef.current?.querySelectorAll(".security-stat");
    if (securityStats) {
      gsap.fromTo(
        securityStats,
        {
          y: 30,
          opacity: 0,
          scale: 0.8,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: securityRef.current,
            start: "top 60%",
            end: "top 40%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // CTA section parallax
    gsap.fromTo(
      ctaRef.current,
      {
        y: 40,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 80%",
          end: "top 20%",
          scrub: 1,
        },
      }
    );

    // CTA content animation
    const ctaContent = ctaRef.current?.querySelectorAll(".cta-content");
    if (ctaContent) {
      gsap.fromTo(
        ctaContent,
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 70%",
            end: "top 30%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white overflow-x-hidden">
      {/* Navigation Header */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">
                AuraHealth
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#features"
                className="text-slate-600 hover:text-blue-600 transition-colors"
              >
                Features
              </Link>
              <Link
                href="#security"
                className="text-slate-600 hover:text-blue-600 transition-colors"
              >
                Security
              </Link>
              <Link
                href="#providers"
                className="text-slate-600 hover:text-blue-600 transition-colors"
              >
                For Providers
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                Provider Login
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Trust Badge */}
            <div
              ref={trustBadgeRef}
              className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8"
            >
              <Shield className="w-4 h-4" />
              <span>
                HIPAA Compliant • Secure • Trusted by 10,000+ Patients
              </span>
            </div>

            <h1
              ref={heroTitleRef}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight"
            >
              Healthcare Consultations
              <span className="block text-blue-600">Made Simple & Secure</span>
            </h1>

            <p
              ref={heroSubtitleRef}
              className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Connect with qualified healthcare providers from home. Our
              AI-powered platform ensures personalized care while maintaining
              the highest standards of medical privacy and security.
            </p>

            {/* Main CTAs */}
            <div
              ref={ctaButtonsRef}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg h-auto shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Link href="/check-in" className="flex items-center space-x-2">
                  <UserCheck className="w-5 h-5" />
                  <span>Start Your Check-in</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg h-auto"
              >
                <Link
                  href="/video-call"
                  className="flex items-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Join Video Call</span>
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div
              ref={trustIndicatorsRef}
              className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500"
            >
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>End-to-End Encrypted</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Medical Grade Security</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Comprehensive Healthcare Solutions
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Experience healthcare that adapts to your needs with our advanced
              telemedicine platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <Card className="feature-card border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 group">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                  <Stethoscope className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  AI-Powered Pre-Screening
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Our intelligent assessment helps providers understand your
                  condition before the consultation, ensuring more personalized
                  and efficient care.
                </p>
              </CardContent>
            </Card>

            <Card className="feature-card border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 group">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors duration-300">
                  <Shield className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Medical-Grade Security
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  HIPAA-compliant platform with end-to-end encryption ensures
                  your health information remains private and secure at all
                  times.
                </p>
              </CardContent>
            </Card>

            <Card className="feature-card border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 group">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-600 transition-colors duration-300">
                  <Clock className="w-6 h-6 text-teal-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  24/7 Access
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Connect with healthcare providers anytime, anywhere. Emergency
                  consultations and urgent care available around the clock.
                </p>
              </CardContent>
            </Card>

            <Card className="feature-card border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 group">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-600 transition-colors duration-300">
                  <Users className="w-6 h-6 text-amber-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Qualified Providers
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Access board-certified physicians, specialists, and mental
                  health professionals with verified credentials and expertise.
                </p>
              </CardContent>
            </Card>

            <Card className="feature-card border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 group">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors duration-300">
                  <Heart className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Emotional Wellness
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Advanced emotion analysis helps providers understand your
                  mental health, enabling more compassionate and effective
                  treatment.
                </p>
              </CardContent>
            </Card>

            <Card className="feature-card border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 group">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-rose-600 transition-colors duration-300">
                  <Globe className="w-6 h-6 text-rose-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Global Accessibility
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Designed for all patients regardless of age or technical
                  ability. Multiple languages, accessibility features, and
                  intuitive interface.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={howItWorksRef} className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Simple Steps to Better Health
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Getting started with AuraHealth is easy and secure
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="step-item text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Complete Check-in
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Share your symptoms and medical history through our secure,
                AI-powered assessment. Takes just 3-5 minutes.
              </p>
            </div>

            <div className="step-item text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Connect with Provider
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Get matched with a qualified healthcare provider based on your
                needs. Video consultation starts immediately.
              </p>
            </div>

            <div className="step-item text-center">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Receive Care
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Get personalized treatment recommendations, prescriptions, and
                follow-up care all from home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section id="security" ref={securityRef} className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                Your Privacy & Security
                <span className="block text-blue-600">Come First</span>
              </h2>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
<<<<<<< HEAD
                We understand that healthcare is personal. That`&apos;`s why we`&apos;`ve
                built our platform with medical-grade security standards that
                exceed industry requirements.
=======
                We understand that healthcare is personal. That&apos;s why
                we&apos;ve built our platform with medical-grade security
                standards that exceed industry requirements.
>>>>>>> hume-stan
              </p>

              <div className="space-y-6">
                <div className="security-feature flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">
                      HIPAA Compliant
                    </h3>
                    <p className="text-slate-600">
                      Full compliance with healthcare privacy regulations
                    </p>
                  </div>
                </div>

                <div className="security-feature flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">
                      End-to-End Encryption
                    </h3>
                    <p className="text-slate-600">
                      Military-grade encryption for all communications
                    </p>
                  </div>
                </div>

                <div className="security-feature flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">
                      SOC 2 Certified
                    </h3>
                    <p className="text-slate-600">
                      Independently audited security controls
                    </p>
                  </div>
                </div>

                <div className="security-feature flex items-start space-x-4">
                  <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">
                      Zero Data Retention
                    </h3>
                    <p className="text-slate-600">
                      Your personal data is never stored permanently
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-8 border border-blue-100">
                <div className="grid grid-cols-2 gap-6">
                  <div className="security-stat text-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      256-bit
                    </div>
                    <div className="text-sm text-slate-600">Encryption</div>
                  </div>
                  <div className="security-stat text-center">
                    <div className="w-12 h-12 bg-emerald-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      99.9%
                    </div>
                    <div className="text-sm text-slate-600">Uptime</div>
                  </div>
                  <div className="security-stat text-center">
                    <div className="w-12 h-12 bg-purple-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      10K+
                    </div>
                    <div className="text-sm text-slate-600">Patients</div>
                  </div>
                  <div className="security-stat text-center">
                    <div className="w-12 h-12 bg-amber-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">4.9</div>
                    <div className="text-sm text-slate-600">Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={ctaRef}
        className="py-16 bg-gradient-to-r from-blue-600 to-teal-600"
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="cta-content text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Experience Better Healthcare?
          </h2>
          <p className="cta-content text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of patients who trust AuraHealth for their healthcare
            needs
          </p>
          <Button
            asChild
            size="lg"
            className="cta-content bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg h-auto shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Link href="/check-in" className="flex items-center space-x-2">
              <UserCheck className="w-5 h-5" />
              <span>Start Your Check-in Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">AuraHealth</span>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                Revolutionizing healthcare through secure, accessible, and
                personalized telemedicine solutions.
              </p>
              <div className="flex items-center space-x-4 text-sm text-slate-400">
                <span>© 2025 AuraHealth</span>
                <span>•</span>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
                <span>•</span>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <div className="space-y-2 text-slate-400">
                <Link
                  href="/check-in"
                  className="block hover:text-white transition-colors"
                >
                  Patient Check-in
                </Link>
                <Link
                  href="/video-call"
                  className="block hover:text-white transition-colors"
                >
                  Video Consultations
                </Link>
                <Link
                  href="/providers"
                  className="block hover:text-white transition-colors"
                >
                  For Providers
                </Link>
                <Link
                  href="/emergency"
                  className="block hover:text-white transition-colors"
                >
                  Emergency Care
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2 text-slate-400">
                <Link
                  href="/help"
                  className="block hover:text-white transition-colors"
                >
                  Help Center
                </Link>
                <Link
                  href="/contact"
                  className="block hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
                <Link
                  href="/technical"
                  className="block hover:text-white transition-colors"
                >
                  Technical Support
                </Link>
                <div className="pt-2">
                  <span className="text-emerald-400 font-medium">
                    24/7 Emergency: (555) 123-4567
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
