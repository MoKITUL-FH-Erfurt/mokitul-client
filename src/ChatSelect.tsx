import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import useHistoryStore from "@/stores/history-store";
import useChatStore from "./stores/chat-store";
import { useTracking } from "react-tracking";

const ChatSelect: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const { chats } = useHistoryStore();
  const { markChatAsActive, activeChat } = useChatStore();

  const { trackEvent } = useTracking();

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            <p className="overflow-hidden">
              {/*activeChat?.summary ? activeChat?.summary : "Select chat..."*/}
              Chat
            </p>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0 z-2000">
          <Command>
            <CommandInput placeholder="Search chat..." />
            <CommandList>
              <CommandEmpty>No chat found.</CommandEmpty>
              <CommandGroup>
                {Object.values(chats).map((chat) => (
                  console.log(chat),
                  <CommandItem
                    key={chat.id}
                    className="z-2000"
                    value={chat.summary ?? "Untitled"}
                    onSelect={() => {
                      console.log("Hello");
                      setValue(chat.summary ?? "Untitled");
                      setOpen(false);
                      markChatAsActive(chat.id);

                      trackEvent({
                        eventType: "chat_selected",
                        eventProperties: {
                          chatId: chat.id,
                        },
                      });

                    }}
                  >
                    {chat.summary ?? "Untitled"}
                    <Check
                      className={cn(
                        "absolute right-0 mr-2",
                        value === chat.id ? "block" : "hidden"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};

export { ChatSelect };
