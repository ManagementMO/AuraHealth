"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedButton } from "@/components/ui/animated-button";
import { AnimatedCard } from "@/components/ui/animated-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  pageVariants,
  listVariants,
  listItemVariants,
  connectionPulseVariants,
  createFadeInUp,
  createSlideIn,
  medicalLoadingVariants,
} from "@/lib/animations";
import { Heart, Shield, Users, Video, Phone, Settings } from "lucide-react";

const AnimationDemo = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }, 2000);
  };

  const handleErrorDemo = () => {
    setError(true);
    setTimeout(() => setError(false), 1000);
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-8"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          variants={createFadeInUp(0.2)}
        >
          <motion.div
            className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.3 }}
          >
            <Heart className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AuraHealth Animation System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Clean, purposeful animations that enhance the healthcare user
            experience
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={listVariants}
          initial="initial"
          animate="animate"
        >
          {/* Page Transitions */}
          <motion.div variants={listItemVariants}>
            <AnimatedCard className="p-6 h-full">
              <div className="text-center">
                <motion.div
                  className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4"
                  whileHover={{ scale: 1.1 }}
                >
                  <Video className="w-6 h-6 text-blue-600" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">Page Transitions</h3>
                <p className="text-gray-600 mb-4">
                  Smooth fade and slide transitions between pages
                </p>
                <AnimatedButton
                  onClick={() => setShowModal(true)}
                  variant="outline"
                  className="w-full"
                >
                  Open Modal
                </AnimatedButton>
              </div>
            </AnimatedCard>
          </motion.div>

          {/* Button Interactions */}
          <motion.div variants={listItemVariants}>
            <AnimatedCard className="p-6 h-full">
              <div className="text-center">
                <motion.div
                  className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4"
                  whileHover={{ scale: 1.1 }}
                >
                  <Phone className="w-6 h-6 text-green-600" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">
                  Button Interactions
                </h3>
                <p className="text-gray-600 mb-4">
                  Micro-animations for hover and tap states
                </p>
                <div className="space-y-2">
                  <AnimatedButton
                    onClick={handleLoadingDemo}
                    loading={loading}
                    success={success}
                    className="w-full"
                  >
                    {loading
                      ? "Loading..."
                      : success
                      ? "Success!"
                      : "Loading Demo"}
                  </AnimatedButton>
                  <AnimatedButton
                    onClick={handleErrorDemo}
                    error={error}
                    variant="destructive"
                    className="w-full"
                  >
                    Error Demo
                  </AnimatedButton>
                </div>
              </div>
            </AnimatedCard>
          </motion.div>

          {/* Loading States */}
          <motion.div variants={listItemVariants}>
            <AnimatedCard className="p-6 h-full">
              <div className="text-center">
                <motion.div
                  className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4"
                  whileHover={{ scale: 1.1 }}
                >
                  <Settings className="w-6 h-6 text-purple-600" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">Loading States</h3>
                <p className="text-gray-600 mb-4">
                  Medical-themed loading spinners and indicators
                </p>
                <div className="space-y-4">
                  <LoadingSpinner size="sm" variant="medical" />
                  <LoadingSpinner size="md" variant="pulse" />
                  <LoadingSpinner size="lg" text="Connecting..." />
                </div>
              </div>
            </AnimatedCard>
          </motion.div>

          {/* Connection Status */}
          <motion.div variants={listItemVariants}>
            <AnimatedCard className="p-6 h-full">
              <div className="text-center">
                <motion.div
                  className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4"
                  whileHover={{ scale: 1.1 }}
                >
                  <Users className="w-6 h-6 text-orange-600" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">
                  Connection Status
                </h3>
                <p className="text-gray-600 mb-4">
                  Pulsing indicators for live connections
                </p>
                <motion.div
                  className="w-4 h-4 bg-green-500 rounded-full mx-auto"
                  variants={connectionPulseVariants}
                  animate="animate"
                />
              </div>
            </AnimatedCard>
          </motion.div>

          {/* Form Interactions */}
          <motion.div variants={listItemVariants}>
            <AnimatedCard className="p-6 h-full">
              <div className="text-center">
                <motion.div
                  className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4"
                  whileHover={{ scale: 1.1 }}
                >
                  <Shield className="w-6 h-6 text-teal-600" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">
                  Form Interactions
                </h3>
                <p className="text-gray-600 mb-4">
                  Smooth focus states and validation feedback
                </p>
                <input
                  type="text"
                  placeholder="Try focusing me..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 focus:scale-[1.02]"
                />
              </div>
            </AnimatedCard>
          </motion.div>

          {/* Medical Loading */}
          <motion.div variants={listItemVariants}>
            <AnimatedCard className="p-6 h-full">
              <div className="text-center">
                <motion.div
                  className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4"
                  whileHover={{ scale: 1.1 }}
                >
                  <Heart className="w-6 h-6 text-red-600" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">Medical Loading</h3>
                <p className="text-gray-600 mb-4">
                  Specialized animations for healthcare contexts
                </p>
                <motion.div
                  className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"
                  variants={medicalLoadingVariants}
                  animate="animate"
                />
              </div>
            </AnimatedCard>
          </motion.div>
        </motion.div>

        {/* Animation Principles */}
        <motion.div
          className="mt-16 bg-white rounded-lg p-8 shadow-lg"
          variants={createFadeInUp(0.4)}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Animation Principles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold mb-2">Purposeful</h3>
              <p className="text-gray-600 text-sm">
                Every animation serves a clear functional purpose
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏥</span>
              </div>
              <h3 className="font-semibold mb-2">Medical-Grade</h3>
              <p className="text-gray-600 text-sm">
                Calming, professional transitions that reduce anxiety
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">♿</span>
              </div>
              <h3 className="font-semibold mb-2">Accessible</h3>
              <p className="text-gray-600 text-sm">
                Respects user motion preferences and provides alternatives
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold mb-2">Performance</h3>
              <p className="text-gray-600 text-sm">
                60fps animations that don't impact app performance
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal Demo */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-white rounded-lg p-8 max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Modal Animation</h3>
              <p className="text-gray-600 mb-6">
                This modal demonstrates smooth scale and fade animations with
                proper exit transitions.
              </p>
              <AnimatedButton
                onClick={() => setShowModal(false)}
                className="w-full"
              >
                Close Modal
              </AnimatedButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AnimationDemo;
