import { type PropsWithChildren } from 'react';
import { Global, css } from '@emotion/react';
import '../index.css';

const GlobalStyles = () => {
  return (
    <Global
      styles={css`
        @import '../index.css';
      `}
    />
  );
};

type ThemeProviderProps = PropsWithChildren;

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <>
      <GlobalStyles />
      {children}
    </>
  );
};

export default ThemeProvider;
