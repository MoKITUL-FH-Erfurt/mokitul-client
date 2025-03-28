import { FunctionComponent, StrictMode, useEffect } from "react";
import "./App.css";
import ChatWrapper from "./ChatWrapper";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Toaster } from "@/components/ui/sonner";
import { Layout } from "./stores/settings-store";
import { useTracking } from "react-tracking";
import { isAnalyticsEvent, sendEvent } from "./utils/analytics";

import "./variables.css";

import { useContext } from "react";

interface AppProps {
  children: React.ReactNode;
}

const App: FunctionComponent<AppProps> = ({ children }) => {
  const { Track } = useTracking(
    {},
    {
      dispatch: async (data) => {
        console.log("Sending event", data);

        if (!isAnalyticsEvent(data)) {
          return;
        }

        // @ts-ignore
        sendEvent(data);
      },
    },
  );

  return <Track>{children}</Track>;
};

const renderApp = (
  element: string | undefined,
  course: string | undefined,
  file: string | undefined,
  preferredLayout: string | undefined = "block",
) => {
  console.log(`Injecting app into dome element ${element}`);

  if (!element) return;

  console.log(`Rendering app with course: ${course} and file: ${file}`);

  createRoot(document.getElementById(element)!).render(
    <StrictMode>
      <App>
        <ChatWrapper
          id={element}
          file={file}
          course={course}
          preferredLayout={
            preferredLayout === "standalone" ? Layout.standalone : Layout.block
          }
        />
        <Toaster />
      </App>
    </StrictMode>,
  );
};

renderApp(undefined, undefined, undefined);

// export default renderApp;

export { renderApp };
