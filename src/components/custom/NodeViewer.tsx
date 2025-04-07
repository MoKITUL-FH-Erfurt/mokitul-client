import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FunctionComponent, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Node } from "@/models/message";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

interface NodeViewProps {
  node: Node;
}

const NodeView: React.FC<NodeViewProps> = ({ node }) => {
  return (
    <>
      <AccordionTrigger className="flex p-2">
        <div className="flex gap-5 grow justify-between">
          <p>{node.metadata.filename}</p>
          <p className="text-muted-foreground mx-2">
            S. {node.metadata.start_page}
          </p>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <p className="p-4">{node.content}</p>
      </AccordionContent>
    </>
  );
};

interface NodeViewerProps {
  nodes: Node[] | undefined;
}

const NodeViewer: React.FC<NodeViewerProps> = ({ nodes }) => {
  const [open, setOpen] = useState(false);
  if (nodes == undefined || nodes.length == 0) return <></>;
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size={"icon"}
            variant={"ghost"}
            className="absolute -right-[2.75rem]"
          >
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="text-muted-foreground "
            />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[30rem] w-full z-[1015]">
          <DialogHeader>
            <DialogTitle>Dokumentreferenzen</DialogTitle>
            <DialogDescription>
              automatisiert gefundende Dokumentabschnitte
            </DialogDescription>
          </DialogHeader>
          <Accordion
            type="single"
            collapsible
            className="max-h-96 overflow-y-scroll"
          >
            {nodes.map((node) => (
              <AccordionItem value={node.id}>
                <NodeView node={node} />
              </AccordionItem>
            ))}
          </Accordion>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NodeViewer;
