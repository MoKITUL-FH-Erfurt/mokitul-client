import React from "react";
import TopBar from "@/components/custom/top-bar";
import { Separator } from "@/components/ui/separator";
import ActiveChat from "@/ActiveChat";

const BlockLayout: React.FC = () => {
  return (
    <div className="h-full max-h-[50rem] flex flex-col  gap-2">
      <TopBar />
      <Separator />
      <ActiveChat />
    </div>
  );
};

export default BlockLayout;
