import { observer } from 'mobx-react-lite';
import { useStore } from '@/state';
import { DisplayEffect, getSpriteTile } from '@/app/components/player/demonicPactsLeague/SkillTreeNode';
import { dbrowDefinitions } from '@/app/components/player/demonicPactsLeague/parse_skill_tree_elements';
import Image from 'next/image';
import { getBackingIcon } from '@/app/components/player/demonicPactsLeague/icons';

const combineEffectValues = (values: (number | '[Constant: true]')[]) => values.reduce((acc, value) => {
  if (value === '[Constant: true]' || acc === '[Constant: true]') {
    return '[Constant: true]';
  }
  return acc + value;
}, 0);

const CurrentEffects = observer(() => {
  const store = useStore();
  return (
    <div className="flex flex-col w-full">
      <h2 className="text-shadow-md font-serif font-bold px-4 py-2 bg-[#28221d] border-[#806f61]">
        Current Effects
      </h2>
      <div className="flex-1 text-xs max-h-72 overflow-y-scroll">
        {store.currentEffects.size === 0 ? (
          <div className="px-4 p-2">None selected</div>
        ) : (
          <ul>
            {Array.from(store.currentEffects.values()).map(
              ({ skillTreeNodeId, values }, ix) => (
                <li
                    // eslint-disable-next-line react/no-array-index-key
                  key={ix}
                  className="effect-container p-2 bg-dark-300 border-b border-[#806f61] flex gap-2 items-center"
                >
                  <div
                    className="bg-cover size-8 square min-size-12 aspect-square flex items-center justify-center"
                    style={{
                      backgroundImage: `url(${getBackingIcon(
                        true,
                        true,
                        dbrowDefinitions[skillTreeNodeId].node_size,
                      ).src})`,
                    }}
                  >
                    <Image
                      className="size-4/6 object-center object-contain aspect-square"
                      src={getSpriteTile(skillTreeNodeId, true)}
                      alt="Pact icon"
                    />
                  </div>
                  <DisplayEffect
                    name={dbrowDefinitions[skillTreeNodeId].name}
                    effectValue={combineEffectValues(values)}
                  />
                </li>
              ),
            )}
          </ul>
        )}
      </div>
    </div>
  );
});

export default CurrentEffects;
