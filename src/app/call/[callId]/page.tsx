import { CallView } from './call-view'; // Import the new client component

// This is a Server Component. It receives props directly from the framework.
// It does not use any hooks like `useState`, `useEffect`, or `useSearchParams`.
export default function CallPage({ params, searchParams }: {
  params: { callId: string };
  searchParams: { user?: 'doctor' | 'patient' };
}) {
  
  // We access the params and searchParams directly here on the server.
  const roomName = params.callId;
  const userType = searchParams.user;

  // Then we pass them as simple props to the client component.
  return (
    <CallView
      roomName={roomName}
      userType={userType}
    />
  );
}