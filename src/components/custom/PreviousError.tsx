import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHistoryCardProps {
    onClick: () => void | Promise<void> | undefined;
}

const PreviousError: React.FC<ChatHistoryCardProps> = ({ onClick }) => {
    return (
        <Alert>
            <div className="flex justify-between items-center w-full">
                <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <div>
                        <AlertTitle>Heads up!</AlertTitle>
                        <AlertDescription>
                            A previous message did not get processed properly. Please resubmit the message.
                        </AlertDescription>
                    </div>
                </div>
                <Button className="bg-amber-500" onClick={onClick}>
                    Resubmit!
                </Button>
            </div>
        </Alert>
    );
};

export default PreviousError;
