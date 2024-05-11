import { useEffect, useState } from 'react';
import { iLikeTurtles } from 'utilities';
import { FatAuthProvider, useUser, useAuth, LoginButton } from 'fat-auth/react';
import { Button } from 'fat-ui';

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

  // this is a comment.
  const { isLoading, isLoggedIn, user } = useUser();
  const { logout } = useAuth();

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
        {isLoading ? <p>Loading...</p> : null}
        {isLoggedIn ? (
          <>
            <img alt="user" src={user.photoURL ?? undefined} height={32} />
            Hello {user.displayName}, your email is {user.email}
            <Button
              type="button"
              onClick={() => {
                void logout();
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <LoginButton>
            <Button size="sm">Login now!</Button>
          </LoginButton>
        )}
        <Button variant="default">default</Button>
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
