import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FunctionComponent, useState } from "react";
import useHistoryStore from "@/stores/history-store";
import { Chat } from "./models/chat";
import useChatStore from "./stores/chat-store";
import { toast } from "sonner";
import { getMoodleUrl } from "./utils/moodle";
import useSettingsStore, { Layout } from "./stores/settings-store";
import { v4 as uuidv4 } from "uuid";
import { useTracking } from "react-tracking";
import { timeStamp } from "console";
import { hashValue } from "@/utils/hash";

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const CreateChatDialog: FunctionComponent<Props> = ({ children }) => {
  const { addChat } = useHistoryStore();
  const { markChatAsActive } = useChatStore();
  const { file, course, getScope } = useSettingsStore();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const { trackEvent } = useTracking();

  const scope = getScope();

  const handleSubmit = async () => {
    const chat: Chat = {
      summary: name,
      messages: [],
      id: uuidv4(),
      timestamp: Date.now() / 1000,
    };

    // actually submit to the api
    const url = getMoodleUrl();
    const body = {
      courseId: course,
      fileId: file,
      summary: name,
      scope: scope,
    };

    if (!(import.meta.env.MODE === "development")) {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to create chat");
      }

      const data = await response.json();

      const { id } = data;

      chat.id = id;
    }

    addChat(chat);

    markChatAsActive(chat.id);

    setOpen(false);

    toast.success("Chat created successfully.");

    trackEvent({
      eventType: "chat_created",
      eventProperties: {
        chatId: hashValue(chat.id),
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] z-[1015]">
        <DialogHeader>
          <DialogTitle>Erstelle einen Chat</DialogTitle>
          <DialogDescription>
            Gib dem Chat einen Namen und fang an zu schreiben.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Chat"
              className="col-span-3"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChatDialog;
