import React, { useEffect, useState } from "react";
import useHistoryStore from "@/stores/history-store";
import CreateChatDialog from "@/CreateChatDialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import useSettingsStore, { Layout } from "@/stores/settings-store";
import BlockLayout from "@/components/custom/block-layout";
import StandaloneLayout from "@/components/custom/standalone-layout";
import { useTracking } from "react-tracking";
import useMediaQuery from "./hooks/use-media-query";

import { hashValue } from "@/utils/hash";

type ChatWrapperProps = {
  id: string | undefined;
  course: string | undefined;
  file: string | undefined;
  preferredLayout: Layout;
};

/*
 * ChatWrapper
 *
 * This component is the main entry point for the chat application.
 * It is responsible for initializing the settings and loading the chat history.
 */
const ChatWrapper: React.FC<ChatWrapperProps> = ({
  course,
  file,
  preferredLayout,
}) => {
  const { loadChatsFromRemote, chats } = useHistoryStore();
  const { loadSettings, setFile, setCourse, setLayout } = useSettingsStore();

  const { trackEvent } = useTracking();

  const [loading, setLoading] = useState(true);

  /* initial media query
   *
   * determines if the layout should be block or standalone
   */
  const isWideEnough = useMediaQuery("(min-width: 1200px)");

  useEffect(() => {
    loadSettings();

    file && setFile(file);
    course && setCourse(course);

    loadChatsFromRemote(course, file);

    setLoading(false);

    setLayout(preferredLayout);

    let hashedCourse = hashValue(course);
    let hashedFile = hashValue(file);

    console.log(hashedCourse);
    console.log(hashedFile);

    trackEvent({
      eventType: "app_initialized",
      eventProperties: {
        courseId: hashedCourse,
        fileId: hashedFile,
        app: "moodle_chat",
      },
    });
  }, [course, file]);

  if (loading) return <div>Loading...</div>;

  if (Object.values(chats).length === 0)
    return (
      <div className="flex flex-row w-full h-full items-center justify-center mokitul">
        <CreateChatDialog>
          <p>Create Chat &nbsp;</p>
          <FontAwesomeIcon icon={faAdd} />
        </CreateChatDialog>
      </div>
    );

  if (isWideEnough && preferredLayout === Layout.standalone)
    return <StandaloneLayout />;

  return <BlockLayout />;
};

export default ChatWrapper;
