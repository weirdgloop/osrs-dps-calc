import { observer } from 'mobx-react-lite';
import {
  Handle,
  Node,
  NodeProps,
  NodeToolbar,
  Position,
} from '@xyflow/react';
import clsx from 'clsx';
import Image from 'next/image';
import { useStore } from '@/state';
import { NodeSize, SkillTreeNodeInfo } from '@/app/components/player/demonicPactsLeague/parse_skill_tree_elements';
import { JSONify } from '@/app/components/player/demonicPactsLeague/JSONify';
import useKeyPressed from '@/app/components/player/demonicPactsLeague/useKeyPressed';
import { getBackingIcon, rowIdToTileInfo } from '@/app/components/player/demonicPactsLeague/icons';
import spriteTiles from '@/app/components/player/demonicPactsLeague/spriteTiles';

export type SkillTreeNodeDisplay = Node<{ id: string; skillTreeNodeInfo: SkillTreeNodeInfo, isPreview: boolean }, 'skillTreeNode'>;

export const nodeBgColorClass = 'bg-[oklch(0.3141_0.0074_31.1)]';
export const nodeBgColor = 'oklch(0.3141 0.0074 31.1)';

export const nodeUnreachableBgColorClass = 'bg-[oklch(0.37_0.0074_31.1)]';
export const nodeUnreachableBgColor = 'oklch(0.37 0.0074 31.1)';

const nodeSizeToPx: { [key in NodeSize]: number } = {
  node_minor: 30,
  node_major: 45,
  node_capstone: 60,
};

interface DisplayEffectProps {
  name: string;
  effectValue: number;
}

export const DisplayEffect = (props: DisplayEffectProps) => {
  const {
    name,
    effectValue,
  } = props;
  const text = name.replaceAll('#', String(effectValue));

  const parts = text.split(/(<col=[^>]+>.*?<\/col>)/g);

  return (
    <div className="whitespace-pre-wrap">
      {parts.map((part, i) => {
        const match = part.match(/<col=[^>]+>(.*?)<\/col>/);
        if (match) {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <div key={i} className="inline font-bold">
              {match[1]}
            </div>
          );
        }
        return part;
      })}
    </div>
  );
};

export const getSpriteTile = (rowId: string, selected: boolean) => {
  const activeInactive = selected ? 'active' : 'inactive';
  if (rowId in rowIdToTileInfo) {
    const {
      tileset,
      index,
    } = rowIdToTileInfo[rowId];
    return spriteTiles[`league_6_combat_mastery_${tileset}_${activeInactive}_large,${index}`];
  }
  return spriteTiles[`league_6_combat_mastery_generic_${activeInactive}_large,9`];
};

export const SkillTreeNode = observer(
  (props: NodeProps<SkillTreeNodeDisplay>) => {
    const {
      id,
      data,
    } = props;
    const store = useStore();
    const isShiftPressed = useKeyPressed('Shift');
    const isHovered = store.leagues.six.hoveredNodeId === id;

    const size = nodeSizeToPx[data.skillTreeNodeInfo.node_size];
    const isMatchingSearch = store.nodesMatchingSearch.has(
      data.skillTreeNodeInfo.row_id,
    );

    return (
      <div>
        <NodeToolbar
          isVisible={isHovered && !data.isPreview}
          position={Position.Top}
          align="center"
          className="bg-[#28221d] border border-[#736559] shadow text-white text-center p-2 rounded flex flex-col gap-1 max-w-96 text-sm"
        >
          <DisplayEffect
            name={data.skillTreeNodeInfo.name}
            effectValue={data.skillTreeNodeInfo.effect.value}
          />

          {store.debug && (
            <div className="">{data.skillTreeNodeInfo.row_id}</div>
          )}

          {store.debug && isShiftPressed && (
            <JSONify className="text-sm" value={data.skillTreeNodeInfo} />
          )}
        </NodeToolbar>
        <div
          className={clsx(
            'relative cursor-pointer flex items-center justify-center bg-cover',
          )}
          style={{
            width: size,
            height: size,
            backgroundImage: `url(${getBackingIcon(
              store.isNodeSelected(id),
              store.reachableNodeIds.has(id),
              data.skillTreeNodeInfo.node_size,
            ).src})`,
          }}
        >
          {!data.isPreview && isMatchingSearch && (
            <div
              className="absolute inset-0 bg-[oklch(72.3%_0.219_149.579)] opacity-50 -z-10 scale-90 rotate-45"
              aria-hidden="true"
            />
          )}
          <Image
            src={getSpriteTile(data.skillTreeNodeInfo.row_id, store.isNodeSelected(id))}
            alt="Pact icon"
            width={size * 4 / 6}
            height={size * 4 / 6}
            className="object-center object-contain"
          />
          <Handle
            className="invisible"
            type="source"
            position={Position.Top}
            style={{
              inset: '50%', width: 0, height: 0, minWidth: 0, minHeight: 0, border: 'none',
            }}
          />
        </div>
      </div>
    );
  },
);
