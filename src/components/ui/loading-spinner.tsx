"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { medicalLoadingVariants } from "@/lib/animations";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
  variant?: "default" | "medical" | "pulse";
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className,
  text,
  variant = "default",
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const renderSpinner = () => {
    switch (variant) {
      case "medical":
        return (
          <motion.div
            className={cn("relative", sizeClasses[size], className)}
            variants={medicalLoadingVariants}
            animate="animate"
          >
            {/* Medical cross spinner */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-full h-full border-2 border-blue-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-1/3 h-1/3 bg-blue-500 rounded-full" />
            </motion.div>
          </motion.div>
        );

      case "pulse":
        return (
          <motion.div
            className={cn(
              "bg-blue-500 rounded-full",
              sizeClasses[size],
              className
            )}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );

      default:
        return (
          <motion.div
            className={cn(
              "border-2 border-gray-300 border-t-blue-500 rounded-full",
              sizeClasses[size],
              className
            )}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      {renderSpinner()}
      {text && (
        <motion.p
          className="text-sm text-gray-600 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export { LoadingSpinner };
