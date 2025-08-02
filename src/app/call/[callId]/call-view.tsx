'use client';

// All the hooks and client-side logic live here.
import { LiveCallView } from '@/components/aura/LiveCallView';

// This component receives simple string props, which is much cleaner.
export function CallView({ roomName, userType }: { roomName: string, userType: 'doctor' | 'patient' }) {

  if (!userType) {
    return (
      <div className="p-4">
        Error: User type ('doctor' or 'patient') must be specified in the URL. 
        <br />
        Example: /call/123?user=doctor
      </div>
    );
  }

  return (
    <main>
      <LiveCallView
        roomName={roomName}
        userIdentity={userType}
      />
    </main>
  );
}