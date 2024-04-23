import { useEffect, useState } from 'react';
import { iLikeTurtles } from 'utilities';
import { FatAuthProvider, useUser, useAuth } from 'fat-auth/react';
import './App.css';

export const AppContent = () => {
  const [data, setData] = useState({});
  useEffect(() => {
    void fetch('/api/legacy')
      .then((res) => res.json())
      .then((res) => {
        // TODO: we need a stronger contract with the backend
        setData(res as Record<string, unknown>);
      });
  }, []);

  const { isLoading, isLoggedIn, user } = useUser();
  const { login, logout } = useAuth();

  return (
    <header className="header">
      <div className="icon-wrap">
        <img className="icon-firebase" src="/firebase.svg" alt="firebase" />
        <div className="icon-divider">+</div>
        <img className="icon-turbo" src="/turborepo.svg" alt="turborepo" />
      </div>
      <div>
        <div style={{ textAlign: 'left' }}>
          <p style={{ fontWeight: 'bold' }}>From apps/api (api)</p>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
        <div style={{ textAlign: 'left' }}>
          <p style={{ fontWeight: 'bold' }}>
            From packages/utilities (utilities)
          </p>
          <pre>{JSON.stringify(iLikeTurtles())}</pre>
        </div>
        <div style={{ textAlign: 'left' }}>
          <p style={{ fontWeight: 'bold' }}>GitHub</p>
          <a
            style={{ color: 'lightblue' }}
            href="https://github.com/yamcodes/turborepo-firebase-starter"
          >
            https://github.com/yamcodes/turborepo-firebase-starter
          </a>
        </div>
        {isLoading ? <p>Loading...</p> : null}
        {isLoggedIn ? (
          <>
            Hello {user.displayName}
            <button
              type="button"
              onClick={() => {
                void logout();
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => {
              void login();
            }}
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export const App = () => {
  return (
    <div className="App">
      <FatAuthProvider>
        <AppContent />
      </FatAuthProvider>
    </div>
  );
};
