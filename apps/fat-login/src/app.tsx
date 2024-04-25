import { GoogleOAuthProvider } from '@react-oauth/google';
import { env } from './config';
import './App.css';

export const AppContent = () => {
  return (
    <>
      <code>fat-login</code>
      <br />
      <p>Hello to you!</p>
    </>
  );
};

export const App = () => {
  return (
    <GoogleOAuthProvider clientId={env.VITE_GOOGLE_CLIENT_ID}>
      <AppContent />
    </GoogleOAuthProvider>
  );
};
