import {
  Background,
  ConnectionMode,
  Controls,
  type CoordinateExtent,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import { SkillTreeNode } from '@/app/components/player/demonicPactsLeague/SkillTreeNode';
import { observer } from 'mobx-react-lite';
import SkillTreeEdge from '@/app/components/player/demonicPactsLeague/SkillTreeEdge';
import { useStore } from '@/state';
import {
  dbrowDefinitions,
  initialEdges,
  initialEdgesPreview,
  initialNodes,
  initialNodesPreview,
} from '@/app/components/player/demonicPactsLeague/parse_skill_tree_elements';
import useKeyPressed from '@/app/components/player/demonicPactsLeague/useKeyPressed';
import { useCallback } from 'react';

const nodeTypes = { skillTreeNode: SkillTreeNode };
const edgeTypes = { skillTreeEdge: SkillTreeEdge };

const translateExtent: CoordinateExtent = (() => {
  const maxX = Math.max(...Object.values(dbrowDefinitions).map((node) => node.draw_coord.x));
  const maxY = Math.max(...Object.values(dbrowDefinitions).map((node) => node.draw_coord.y));
  const minX = Math.min(...Object.values(dbrowDefinitions).map((node) => node.draw_coord.x));
  const minY = Math.min(...Object.values(dbrowDefinitions).map((node) => node.draw_coord.y));
  const padding = 1000;
  return [
    [minX - padding, minY - padding],
    [maxX + padding, maxY + padding],
  ];
})();

const SkillTreeDisplay = observer(({ interactive }: { interactive: boolean }) => {
  const store = useStore();
  const isShiftPressed = useKeyPressed('Shift');

  const [nodes, , onNodesChange] = useNodesState(interactive ? initialNodes : initialNodesPreview);
  const [edges, , onEdgesChange] = useEdgesState(interactive ? initialEdges : initialEdgesPreview);

  const onNodeClick = useCallback((_event: unknown, node: { id: string; }) => {
    if (node) {
      store.toggleNodeSelection(node.id, isShiftPressed && store.debug);
    }
  }, [isShiftPressed, store]);
  const onNodeMouseEnter = useCallback(
    (_event: unknown, node: { id: string | null; }) => store.setHoveredNode(node.id),
    [store],
  );
  const onNodeMouseLeave = useCallback(() => store.setHoveredNode(null), [store]);
  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: { id: string }) => {
      event.preventDefault();
      store.setHoveredNode(node.id);
    },
    [store],
  );
  const onPaneClick = useCallback(() => store.setHoveredNode(null), [store]);

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        minZoom={interactive ? undefined : 0.01}
        translateExtent={interactive ? translateExtent : undefined}
        nodesDraggable={false}
        nodesConnectable={false}
        nodeOrigin={[0.5, 0.5]}
        edgesFocusable={false}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        elementsSelectable={false}
        connectionMode={ConnectionMode.Loose}
        onNodeClick={interactive ? onNodeClick : undefined}
        onNodeMouseEnter={interactive ? onNodeMouseEnter : undefined}
        onNodeMouseLeave={interactive ? onNodeMouseLeave : undefined}
        onNodeContextMenu={interactive ? onNodeContextMenu : undefined}
        onPaneClick={interactive ? onPaneClick : undefined}
        proOptions={{ hideAttribution: true }}
      >
        {interactive && <Background bgColor={interactive ? '#4A4034' : 'none'} />}
        {interactive && <Controls showInteractive={false} showFitView={false} />}
      </ReactFlow>
    </div>
  );
});

export default SkillTreeDisplay;
