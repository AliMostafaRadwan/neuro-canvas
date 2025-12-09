import { useState } from "react";
import { PanelLeftClose, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Canvas from "@/components/canvas/Canvas";
import BlockPalette from "@/components/sidebar/BlockPalette";
import RightPanel from "@/components/RightPanel";
import Toolbar from "@/components/Toolbar";
import { cn } from "@/lib/utils";

export default function Home() {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-background">
      <Toolbar />
      
      <div className="flex flex-1 overflow-hidden">
        {leftCollapsed ? (
          <div className="w-12 border-r border-border bg-sidebar flex flex-col items-center py-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLeftCollapsed(false)}
              data-testid="button-expand-left"
            >
              <PanelLeft className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="relative w-[280px] flex-shrink-0">
            <BlockPalette />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLeftCollapsed(true)}
              className="absolute top-2 right-2 z-10"
              data-testid="button-collapse-left"
            >
              <PanelLeftClose className="w-4 h-4" />
            </Button>
          </div>
        )}

        <main className="flex-1 overflow-hidden relative">
          <Canvas />
        </main>

        <RightPanel
          isCollapsed={rightCollapsed}
          onToggle={() => setRightCollapsed(!rightCollapsed)}
        />
      </div>
    </div>
  );
}
