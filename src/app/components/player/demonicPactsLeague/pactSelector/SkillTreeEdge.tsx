import {
  BaseEdge,
  type Edge,
  type EdgeProps,
  getStraightPath,
} from '@xyflow/react';
import { observer } from 'mobx-react-lite';
import { usePlayer } from '@/state/LoadoutStore';

type SkillTreeEdgeProps = Edge<{ isPreview: boolean }, 'skillTreeEdge'>;

const SkillTreeEdge = observer((props: EdgeProps<SkillTreeEdgeProps>) => {
  const {
    id,
    source,
    sourceX,
    sourceY,
    target,
    targetX,
    targetY,
    data,
  } = props;
  const isPreview = data?.isPreview ?? false;
  const { isNodeSelected, nodesToSelectIfHoveredSelected } = usePlayer();

  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const sourceSelected = isNodeSelected(source);
  const targetSelected = isNodeSelected(target);
  const isSelected = Number(sourceSelected) + Number(targetSelected);

  const isPathHighlighted = (nodesToSelectIfHoveredSelected.has(source) || sourceSelected)
    && (nodesToSelectIfHoveredSelected.has(target) || targetSelected)
    && (nodesToSelectIfHoveredSelected.has(source) || nodesToSelectIfHoveredSelected.has(target));

  let strokeWidth: number;
  if (isSelected === 0) {
    strokeWidth = 1;
  } else if (isSelected === 1) {
    strokeWidth = 2;
  } else {
    strokeWidth = 3;
  }

  let stroke: string;
  if (isPathHighlighted && !isPreview) {
    stroke = '#22c55e';
  } else if (isSelected === 0) {
    stroke = '#000000';
  } else if (isSelected === 1) {
    stroke = '#bd000b';
  } else {
    stroke = '#fae17d';
  }

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      style={{
        strokeWidth,
        stroke,
      }}
    />
  );
});

export default SkillTreeEdge;
