import React, { useEffect } from "react";
import TopBar from "@/components/custom/layouts/standalone/TopBar";
import { Separator } from "@/components/ui/separator";
import ActiveChat from "@/ActiveChat";
import HistoryList from "@/HistoryList";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import useChatStore from "@/stores/chat-store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const StandaloneLayout: React.FC = () => {
  const { hasActiveChat } = useChatStore();

  return (
    <div className="w-full h-[calc(80vh-10rem)]">
      <ResizablePanelGroup direction={"horizontal"}>
        <ResizablePanel maxSize={30} minSize={15} defaultSize={22}>
          <HistoryList />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel className="p-4 flex flex-col">
          {hasActiveChat() && <TopBar />}
          <Separator />
          <ActiveChat />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default StandaloneLayout;
