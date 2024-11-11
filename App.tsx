import "./i18n";
import React, { useEffect, useState } from "react";
import "./global.css";
import AppProviders from "./components/providers";
import { useApi } from "./components/hooks/useApi";
import useTelegramPlatform from "./components/hooks/useTelegramPlatform";
import { i18nPromise } from "./i18n";

const App: React.FC = () => {
  const { api, isReady } = useApi();
  const platformReady = useTelegramPlatform();
  const [i18nReady, setI18nReady] = useState(false);
  useEffect(() => {
    i18nPromise.then(() => setI18nReady(true));
  }, []);

  if (api === null) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        You need to run this app in Telegram.
      </div>
    );
  }

  if ((!isReady || !platformReady || !i18nReady) && api) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading...
      </div>
    );
  }

  return <AppProviders />;
};

export default App;
