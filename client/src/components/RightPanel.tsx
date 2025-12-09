import { useState } from "react";
import { Settings, Code2, PanelRightClose, PanelRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PropertiesPanel from "@/components/sidebar/PropertiesPanel";
import CodePreview from "@/components/sidebar/CodePreview";
import { useCanvasStore } from "@/lib/store";

interface RightPanelProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function RightPanel({ isCollapsed, onToggle }: RightPanelProps) {
  const [activeTab, setActiveTab] = useState<"properties" | "code">("properties");
  const { selectedNodeId } = useCanvasStore();

  if (isCollapsed) {
    return (
      <div className="w-12 border-l border-border bg-card flex flex-col items-center py-2 gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          data-testid="button-expand-panel"
        >
          <PanelRight className="w-4 h-4" />
        </Button>
        <div className="flex-1" />
        <Button
          variant={activeTab === "properties" ? "secondary" : "ghost"}
          size="icon"
          onClick={() => {
            setActiveTab("properties");
            onToggle();
          }}
          data-testid="button-tab-properties-collapsed"
        >
          <Settings className="w-4 h-4" />
        </Button>
        <Button
          variant={activeTab === "code" ? "secondary" : "ghost"}
          size="icon"
          onClick={() => {
            setActiveTab("code");
            onToggle();
          }}
          data-testid="button-tab-code-collapsed"
        >
          <Code2 className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-80 border-l border-border bg-card flex flex-col">
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "properties" | "code")}
        className="flex flex-col h-full"
      >
        <div className="flex items-center justify-between border-b border-border">
          <TabsList className="h-10 w-full justify-start rounded-none border-0 bg-transparent p-0">
            <TabsTrigger
              value="properties"
              className={cn(
                "h-10 rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-primary",
                "data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              )}
              data-testid="tab-properties"
            >
              <Settings className="w-4 h-4 mr-2" />
              Properties
            </TabsTrigger>
            <TabsTrigger
              value="code"
              className={cn(
                "h-10 rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-primary",
                "data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              )}
              data-testid="tab-code"
            >
              <Code2 className="w-4 h-4 mr-2" />
              Code
            </TabsTrigger>
          </TabsList>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="mr-1"
            data-testid="button-collapse-panel"
          >
            <PanelRightClose className="w-4 h-4" />
          </Button>
        </div>

        <TabsContent value="properties" className="flex-1 mt-0 overflow-hidden">
          <PropertiesPanel />
        </TabsContent>

        <TabsContent value="code" className="flex-1 mt-0 overflow-hidden">
          <CodePreview />
        </TabsContent>
      </Tabs>
    </div>
  );
}
