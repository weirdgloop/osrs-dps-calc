import { observer } from 'mobx-react-lite';
import Image from 'next/image';
import { useStore } from '@/state';
import { DisplayEffect, getSpriteTile } from '@/app/components/player/demonicPactsLeague/SkillTreeNode';
import { dbrowDefinitions } from '@/app/components/player/demonicPactsLeague/parse_skill_tree_elements';
import { getBackingIcon } from '@/app/components/player/demonicPactsLeague/icons';

const combineEffectValues = (values: number[]) => values.reduce<number>((acc, value) => acc + value, 0);

const CurrentEffects = observer(() => {
  const store = useStore();

  const numericEffectTotals = new Map<string, number>(
    Array.from(store.currentEffects.values()).map(({ skillTreeNodeId, values }) => [
      dbrowDefinitions[skillTreeNodeId].effect.name,
      combineEffectValues(values) as number,
    ]),
  );

  const magic = numericEffectTotals.get('talent_percentage_magic_damage') ?? 0;
  const ranged = numericEffectTotals.get('talent_percentage_ranged_damage') ?? 0;
  const melee = numericEffectTotals.get('talent_percentage_melee_damage') ?? 0;
  const extraAllStyleAccuracy = 10 * (magic + ranged + melee);

  const currentEffects = Array.from(store.currentEffects.values());

  if (extraAllStyleAccuracy > 0 && !store.currentEffects.has('talent_all_style_accuracy')) {
    currentEffects.push({
      skillTreeNodeId: 'node7',
      values: [],
    });
  }

  return (
    <div className="flex flex-col w-full">
      <h2 className="text-shadow-md font-serif font-bold px-4 py-2 bg-[#28221d] border-[#806f61]">
        Current Effects
      </h2>
      <div className="flex-1 text-xs max-h-72 overflow-y-scroll">
        {currentEffects.length === 0 ? (
          <div className="px-4 p-2">None selected</div>
        ) : (
          <ul>
            {currentEffects.map(
              ({ skillTreeNodeId, values }, ix) => {
                const def = dbrowDefinitions[skillTreeNodeId];
                const effectName = def.effect.name;

                let effectValue = combineEffectValues(values);

                let extraNote = null;

                if (effectName === 'talent_all_style_accuracy') {
                  effectValue = (effectValue as number) + extraAllStyleAccuracy;
                  extraNote = `This includes +${extraAllStyleAccuracy}% from additional damage nodes.`;
                }

                return (
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
                          def.node_size,
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
                      name={def.name}
                      effectValue={effectValue}
                      extraNote={extraNote}
                    />
                  </li>
                );
              },
            )}
          </ul>
        )}
      </div>
    </div>
  );
});

export default CurrentEffects;
