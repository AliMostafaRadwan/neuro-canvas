import { useState } from "react";
import { PanelLeftClose, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
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
        <PanelGroup direction="horizontal">
          {/* Left Sidebar - Block Palette */}
          {leftCollapsed ? (
            <div className="w-12 border-r border-border bg-sidebar flex flex-col items-center py-2 flex-shrink-0">
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
            <>
              <Panel
                defaultSize={20}
                minSize={15}
                maxSize={40}
                className="relative"
              >
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
              </Panel>

              <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 transition-colors cursor-col-resize" />
            </>
          )}

          {/* Main Canvas */}
          <Panel defaultSize={55} minSize={30}>
            <main className="h-full overflow-hidden relative">
              <Canvas />
            </main>
          </Panel>

          {/* Right Sidebar - Code/Properties */}
          {!rightCollapsed && (
            <>
              <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 transition-colors cursor-col-resize" />

              <Panel defaultSize={25} minSize={20} maxSize={50}>
                <RightPanel
                  isCollapsed={rightCollapsed}
                  onToggle={() => setRightCollapsed(!rightCollapsed)}
                />
              </Panel>
            </>
          )}

          {rightCollapsed && (
            <div className="w-12 border-l border-border bg-sidebar flex-shrink-0">
              <RightPanel
                isCollapsed={rightCollapsed}
                onToggle={() => setRightCollapsed(!rightCollapsed)}
              />
            </div>
          )}
        </PanelGroup>
      </div>
    </div>
  );
}
