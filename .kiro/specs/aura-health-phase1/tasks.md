# Implementation Plan

- [x] 1. Set up project structure and dependencies

  - Initialize Next.js project with TypeScript, ESLint, Tailwind CSS, and App Router
  - Install required dependencies: react-webcam, @humeai/voice, mongodb
  - Configure Shadcn/UI with "New York" style and neutral base color
  - Create .env.local.example with required environment variables
  - _Requirements: 14.1, 14.2, 14.3, 9.4_

- [x] 2. Create root layout and global styling

  - Implement app/layout.tsx with Inter font and Toaster component
  - Set up global styles with Tailwind CSS imports

  - Configure healthcare-appropriate metadata and neutral background
  - _Requirements: 8.5, 13.2_

- [x] 3. Install and configure Shadcn/UI components

  - Install button, card, progress, and toast components from Shadcn/UI
  - Configure components with "New York" s
    tyle variant
  - Set up neutral healthcare theme colors
  - _Requirements: 8.4, 14.4_

- [x] 4. Create landing page

  - Implement app/page.tsx with minimalist design
  - Add clear Aura Health branding and value proposition
  - Create prominent call-to-action button linking to check-in page
  - Ensure responsive design for desktop and mobile
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 5. Create check-in page structure

  - Implement app/check-in/page.tsx
  - Set up page to host PatientCheckin component within Card layout
  - Maintain consistent styling and branding
  - Configure appropriate healthcare metadata
  - _Requirements: 2.1, 2.2, 2.3_

-

- [x] 6. Set up MongoDB connection utility

  - Create lib/mongodb.ts with cached connection for serverless optimization
  - Implement connectToDatabase function using MONGODB_URI environment variable
  - Add proper error handling and connection management
  - _Requirements: 10.2_

- [x] 7. Create Hume AI token endpoint

  - Implement app/api/hume/token/route.ts as GET endpoint
  - Generate short-lived access tokens using HUME_API_KEY and HUME_CLIENT_SECRET
  - Add proper error handling and security measures
  - Never expose API keys to client-side
  - _Requirements: 9.1, 9.2, 9.3_

-

- [x] 8. Create check-in data storage endpoint

  - Implement app/api/checkin/route.ts as POST endpoint
  - Store analysis data in MongoDB with patientId, transcript, emotionTimeline, createdAt
  - Add data validation and error handling
  - Use cached database connection
  - _Requirements: 10.1, 10.3, 10.4_

- [x] 9. Create PatientCheckin component foundation

  - Create components/aura/PatientCheckin.tsx with TypeScript interfaces
  - Set up component state management for idle/recording/finished phases
  - Implement basic Card layout structure
  - Add timer state and webcam ready state
  - _Requirements: 8.1, 8.2_

-

- [x] 10. Implement webcam integration

  - Add react-webcam integration with permission handling
  - Display live camera feed in idle state
  - Handle permission denied and device not found errors

  - Show appropriate error messages with instructions
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 12.2_

- [x] 11. Add check-in instructions and UI

  - Display clear instructions: "To prepare for your appointment, please take 60 seconds to describe how you've been feeling."
  - Use calming, professional design elements
  - Present instructions in healthcare-appropriate language
  - _Requirements: 3.1, 3.2, 3.3_

-

- [x] 12. Implement recording controls and timer

  - Add "Start 60-Second Check-in" button
  - Disable button during recording to prevent multiple sessions
  - Implement 60-second countdown timer with progress bar
  - Automatically stop recording when timer expires
  - _Requirements: 5.1, 5.2, 5.3, 5.4_


- [ ] 13. Set up Hume AI WebSocket connections





  - Initialize Hume TypeScript SDK client
  - Fetch secure access tokens from /api/hume/token endpoint
  - Establish WebSocket connection to Expression Measurement API for facial analysis
  - Establish WebSocket connection to EVI API for vocal analysis and interaction
  - _Requirements: 6.1, 6.2, 6.3, 11.1_

- [ ] 14. Implement real-time emotion analysis








  - Stream video and audio data to both Hume APIs during recording
  - Handle incoming emotion data from WebSocket connections
  - Store timestamped emotional analysis results with source (facial/vocal)
  - Make sure that the Hume's EVI 3 is actually implemented in the app/recording so the user can intelligently chat with it for the "rehearsel"
  - Process both facial expressions and vocal prosody data
  - _Requirements: 6.4, 6.5, 6.6, 11.2, 11.3_

- [ ] 15. Add completion state and data submission

  - Hide webcam view when recording completes
  - Display "Thank You" message in same Card component
  - Confirm check-in process completion
  - Aggregate collected emotion data and submit to /api/checkin endpoint
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 11.4_

- [ ] 16. Implement comprehensive error handling

  - Add toast notifications for API failures using Shadcn/UI
  - Handle WebSocket connection failures with retry logic
  - Manage database operation errors gracefully
  - Provide user-friendly error messages while logging technical details
  - _Requirements: 12.1, 12.3, 12.4_

- [ ] 17. Add navigation functionality

  - Implement navigation from landing page to check-in page
  - Ensure proper routing between pages
  - Test navigation flow and component interaction patterns
  - _Requirements: 2.1_

- [ ] 18. Create comprehensive error UI patterns

  - Use Shadcn/UI Toast components for consistent error presentation
  - Maintain healthcare-appropriate styling in error states
  - Provide clear next steps for error resolution
  - Implement graceful degradation for network issues
  - _Requirements: 12.1, 12.4_

- [ ] 19. Optimize performance and bundle

  - Implement code splitting for Hume AI integration
  - Add lazy loading for heavy components
  - Optimize video stream processing and memory management
  - Ensure efficient component re-rendering during recording
  - _Requirements: Performance considerations from design_

- [ ] 20. Final integration and testing
  - Test complete user flow from landing page to completion
  - Verify WebSocket connections and data persistence
  - Test error scenarios and recovery mechanisms
  - Ensure all requirements are met and system works end-to-end
  - _Requirements: All integration requirements_
