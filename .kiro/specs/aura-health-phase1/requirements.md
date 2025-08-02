# Requirements Document

## Introduction

Aura Health Phase 1 is a comprehensive, production-ready pre-consultation patient check-in system that allows patients to record a 60-second video describing their health concerns. The system captures audio and video for real-time AI-powered emotional analysis using Hume AI's Expression Measurement API & Speech-to-Speech EVI API, with secure backend processing and MongoDB data persistence. This phase establishes the foundation for a comprehensive telehealth platform while focusing on understanding patient emotional states through verbal and non-verbal cues. The system must be secure, extensible, and ready for future phases including doctor dashboards and live call interfaces.

## Requirements

### Requirement 1

**User Story:** As a patient, I want to access a clear landing page that explains Aura Health's purpose, so that I understand what the platform does before starting my check-in.

#### Acceptance Criteria

1. WHEN a patient visits the root URL THEN the system SHALL display a minimalist landing page with Aura Health branding
2. WHEN the landing page loads THEN the system SHALL show a clear explanation of what Aura Health is
3. WHEN a patient views the landing page THEN the system SHALL display a prominent call-to-action button linking to the check-in page
4. WHEN the landing page renders THEN the system SHALL use a clean, professional design with Tailwind CSS and appropriate healthcare-focused styling

### Requirement 2

**User Story:** As a patient, I want to navigate to a dedicated check-in page, so that I can complete my pre-consultation video recording in a focused environment.

#### Acceptance Criteria

1. WHEN a patient clicks the call-to-action button THEN the system SHALL navigate to the /check-in route
2. WHEN the check-in page loads THEN the system SHALL display the PatientCheckin component within a centered Card layout
3. WHEN the check-in page renders THEN the system SHALL maintain consistent styling and branding with the landing page

### Requirement 3

**User Story:** As a patient, I want to see clear instructions for the check-in process, so that I know exactly what to do and feel comfortable proceeding.

#### Acceptance Criteria

1. WHEN the check-in page loads THEN the system SHALL display instructions stating "To prepare for your appointment, please take 60 seconds to describe how you've been feeling."
2. WHEN instructions are shown THEN the system SHALL use calming, professional, and secure visual design elements
3. WHEN the patient views the instructions THEN the system SHALL present them in clear, simple language appropriate for healthcare contexts

### Requirement 4

**User Story:** As a patient, I want to see my webcam feed before starting the recording, so that I can ensure I'm properly positioned and comfortable with the video quality.

#### Acceptance Criteria

1. WHEN the check-in page loads THEN the system SHALL request webcam permissions from the browser
2. WHEN webcam permissions are granted THEN the system SHALL display the live camera feed using react-webcam library
3. WHEN the webcam view is active THEN the system SHALL show the feed within the Card component frame
4. IF webcam permissions are denied THEN the system SHALL display an appropriate error message with instructions to enable camera access

### Requirement 5

**User Story:** As a patient, I want to start a timed 60-second recording session, so that I can provide my health concerns within the structured timeframe.

#### Acceptance Criteria

1. WHEN the webcam is active THEN the system SHALL display a "Start 60-Second Check-in" button
2. WHEN the patient clicks the start button THEN the system SHALL disable the button to prevent multiple recordings
3. WHEN recording starts THEN the system SHALL display a visible 60-second progress bar or timer
4. WHEN the 60-second timer expires THEN the system SHALL automatically stop the recording session

### Requirement 6

**User Story:** As a patient, I want the system to be prepared for AI analysis integration, so that my emotional state can be analyzed from my video and audio in future iterations.

#### Acceptance Criteria

1. WHEN the recording starts THEN the system SHALL include code for Hume AI streaming client initialization
2. WHEN video frames are captured THEN the system SHALL include code for WebSocket connection to Hume's Expression Measurement API (this one is for video emotion/sentiment analysis/etc) and also the Speech-to-speech (EVI) API for the audio input in the recording (note the different APIs/Tools both from Hume)
3. Use the Hume TypeScript SDK for Hume AI streaming client initialization
4. Make sure that appropriate functionality is there for BOTH the Expression Measurement API (and the data we want to analyze from it regarding facial emotional/sentiment analysis) AND the Speech-to-speech (EVI) API that allows the user to speak with an intelligent AI voice and also get similair sentiment analysis based off what they say. Hume’s Empathic Voice Interface (EVI) is an advanced, real-time emotionally intelligent voice AI. EVI measures users’ nuanced vocal modulations and responds to them using a speech-language model, which guides language and speech generation.

By processing the tune, rhythm, and timbre of speech, EVI unlocks a variety of new capabilities, like knowing when to speak and generating more empathic language with the right tone of voice.

These features enable smoother and more satisfying voice-based interactions between humans and AI, opening new possibilities for personal AI, customer service, accessibility, robotics, immersive gaming, VR experiences, and much more.
5. WHEN audio and video data is available THEN the system SHALL include code for streaming frames to Hume AI
6. WHEN the system receives data THEN the system SHALL include code for handling incoming emotion data from WebSocket connections

### Requirement 7

**User Story:** As a patient, I want to see a completion confirmation after my 60-second recording, so that I know my check-in was successful and can proceed with confidence.

#### Acceptance Criteria

1. WHEN the 60-second recording completes THEN the system SHALL hide the webcam view
2. WHEN recording is complete THEN the system SHALL display a "Thank You" message within the same Card component
3. WHEN the completion state is shown THEN the system SHALL confirm that the check-in process is complete
4. WHEN the thank you message displays THEN the system SHALL maintain the calming, professional visual design

### Requirement 8

**User Story:** As a developer, I want a well-structured codebase using modern technologies, so that the application is maintainable and can be extended for future phases.

#### Acceptance Criteria

1. WHEN the project is set up THEN the system SHALL use Next.js with App Router architecture
2. WHEN components are created THEN the system SHALL use TypeScript for type safety
3. WHEN styling is applied THEN the system SHALL use Tailwind CSS for consistent design
4. WHEN UI components are needed THEN the system SHALL use Shadcn/UI with "New York" style and neutral healthcare-appropriate color theme
5. WHEN the file structure is created THEN the system SHALL organize components into /components/ui/ for Shadcn components and /components/aura/ for custom components
6. WHEN AI integration is prepared THEN the system SHALL create lib/hume.ts for Hume AI SDK client setup with placeholder for API key

### Requirement 9

**User Story:** As a system administrator, I want secure backend API endpoints for Hume AI integration, so that sensitive API keys are never exposed to the client and all AI communication is properly authenticated.

#### Acceptance Criteria

1. WHEN the system needs Hume AI access THEN the system SHALL create a secure /api/hume/token endpoint that generates short-lived access tokens
2. WHEN generating tokens THEN the system SHALL read HUME_API_KEY and HUME_CLIENT_SECRET from environment variables only
3. WHEN the frontend needs Hume access THEN the system SHALL fetch tokens from the secure endpoint rather than storing API keys client-side
4. WHEN API keys are configured THEN the system SHALL provide a .env.local.example file with required environment variable templates

### Requirement 10

**User Story:** As a healthcare provider, I want patient check-in data to be securely stored in a database, so that emotional analysis results can be reviewed and used for patient care.

#### Acceptance Criteria

1. WHEN a check-in session completes THEN the system SHALL store the analysis data in MongoDB via a secure /api/checkin endpoint
2. WHEN connecting to the database THEN the system SHALL use a cached connection utility to prevent connection overhead in serverless environments
3. WHEN storing session data THEN the system SHALL include patientId, transcript, emotionTimeline, and createdAt fields
4. WHEN database operations occur THEN the system SHALL use the MONGODB_URI environment variable for connection configuration

### Requirement 11

**User Story:** As a patient, I want real-time emotional analysis during my recording, so that the system can capture comprehensive data about my emotional state throughout the session.

#### Acceptance Criteria

1. WHEN recording starts THEN the system SHALL establish a WebSocket connection to Hume's Expression Measurement API using a secure access token
2. WHEN video and audio streams are active THEN the system SHALL stream both audio and video data to the Hume API for real-time analysis
3. WHEN emotion data is received THEN the system SHALL store timestamped emotional analysis results in component state
4. WHEN the recording ends THEN the system SHALL aggregate all collected emotion data and submit it to the backend for persistence

### Requirement 12

**User Story:** As a developer, I want comprehensive error handling and user feedback, so that patients receive clear guidance when issues occur and the system remains stable.

#### Acceptance Criteria

1. WHEN API calls fail THEN the system SHALL display user-friendly error messages using Shadcn/UI toast notifications
2. WHEN webcam access is denied THEN the system SHALL provide clear instructions for enabling camera permissions
3. WHEN network issues occur THEN the system SHALL handle connection failures gracefully without crashing the application
4. WHEN database operations fail THEN the system SHALL log errors appropriately while showing generic error messages to users

### Requirement 13

**User Story:** As a developer, I want the project structure to support future expansion, so that additional pages like doctor dashboard and live call interface can be easily added.

#### Acceptance Criteria

1. WHEN the project structure is created THEN the system SHALL organize routes to anticipate /dashboard and /call pages
2. WHEN the root layout is configured THEN the system SHALL support consistent styling across future pages with Inter font and Toaster component
3. WHEN components are structured THEN the system SHALL separate reusable UI components from page-specific components
4. WHEN the codebase is organized THEN the system SHALL follow patterns that support scalable multi-page application development

### Requirement 14

**User Story:** As a developer, I want proper dependency management and project initialization, so that the application can be easily set up and maintained.

#### Acceptance Criteria

1. WHEN initializing the project THEN the system SHALL use create-next-app with TypeScript, ESLint, Tailwind CSS, and App Router enabled
2. WHEN setting up UI components THEN the system SHALL configure Shadcn/UI with "New York" style, neutral base color, and CSS variables
3. WHEN installing dependencies THEN the system SHALL include react-webcam, @humeai/voice, and mongodb packages
4. WHEN UI components are needed THEN the system SHALL pre-install button, card, progress, and toast components from Shadcn/UI