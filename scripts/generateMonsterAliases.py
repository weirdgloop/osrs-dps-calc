"""
    Script to generate NPC ID aliases for common cosmetic variants.
    This script shouldn't be used to overwrite src/lib/MonsterAliases.ts entirely, but can instead be used as
    a way of bootstrapping that file.

    Written for Python 3.9.
"""
from collections import namedtuple
import re
import json
import unittest

INPUT_FILE_NAME = './cdn/json/monsters.json'
OUTPUT_FILE_NAME = './src/lib/MonsterAliases.ts'

data = {}

dataJs = """/**
 * A map of base NPC ID -> variant NPC IDs for NPCs that are identical in function.
 */

const monsterAliases = {"""

MonsterAliases = namedtuple('MonsterAliases', ['base_name', 'base_version', 'alias_ids'])

monsters = []
with open(INPUT_FILE_NAME, 'r') as f:
    monsters = json.load(f)

def handle_base_variant(variant_monster, base_name, base_version):
    global data
    global monsters
    base_variant = next((x for x in monsters if x['name'] == base_name and x['version'] == base_version), None)
    if base_variant and base_variant['id'] != variant_monster['id']:
        data.setdefault(base_variant['id'], MonsterAliases(base_name, base_variant['version'], [])).alias_ids.append(variant_monster['id'])

def get_monster_id(name, version):
    global monsters
    return next((x for x in monsters if x['name'] == name and x['version'] == version), None)['id']

def test_baby_blue_dragon(data):
    assert get_monster_id('Baby blue dragon', '2') in data[get_monster_id('Baby blue dragon', '1')].alias_ids, "Baby blue dragon variant missing"

def test_blue_dragon(data):
    assert get_monster_id('Blue dragon', 'Task only, 1') in data[get_monster_id('Blue dragon', '1')].alias_ids, "Blue dragon task only variants missing"

def test_blue_dragon_tapoyauik(data):
    assert get_monster_id('Blue dragon', 'Ruins of Tapoyauik, 1') not in data[get_monster_id('Blue dragon', '1')].alias_ids, "Ruins of Tapoyauik blue dragons merged"

def test_zemouregal_armoured_zombie_melee(data):
    assert get_monster_id('Armoured zombie (Zemouregal\'s Fort)', 'Melee, 5') in data[get_monster_id('Armoured zombie (Zemouregal\'s Fort)', 'Melee, 1')].alias_ids, "Armoured zombie (Zemouregal's Fort) melee variants missing"

def test_zemouregal_armoured_zombie_ranged(data):
    assert get_monster_id('Armoured zombie (Zemouregal\'s Fort)', 'Ranged, 5') in data[get_monster_id('Armoured zombie (Zemouregal\'s Fort)', 'Ranged, 1')].alias_ids, "Armoured zombie (Zemouregal's Fort) ranged variants missing"

def test_zemouregal_armoured_zombie_merged(data):
    assert get_monster_id('Armoured zombie (Zemouregal\'s Fort)', 'Ranged, 5') not in data[get_monster_id('Armoured zombie (Zemouregal\'s Fort)', 'Melee, 1')].alias_ids, "Armoured zombie (Zemouregal's Fort) melee variants merged with ranged"

def run_tests(data):
    test_suite = unittest.TestSuite()
    test_suite.addTest(unittest.FunctionTestCase(lambda: test_baby_blue_dragon(data)))
    test_suite.addTest(unittest.FunctionTestCase(lambda: test_blue_dragon(data)))
    test_suite.addTest(unittest.FunctionTestCase(lambda: test_blue_dragon_tapoyauik(data)))
    test_suite.addTest(unittest.FunctionTestCase(lambda: test_zemouregal_armoured_zombie_melee(data)))
    test_suite.addTest(unittest.FunctionTestCase(lambda: test_zemouregal_armoured_zombie_ranged(data)))
    test_suite.addTest(unittest.FunctionTestCase(lambda: test_zemouregal_armoured_zombie_merged(data)))
    test_runner = unittest.TextTestRunner()
    test_runner.run(test_suite)

def main():
    global dataJs
    global monsters
    for monster in monsters:
        name_match = re.match(r"^(Armoured zombie \(Zemouregal's Fort\)|(Baby (blue|green|red) dragon)|Cave goblin miner|(Red|Blue) dragon|Cultist|Emissary (Acolyte|Ascended|Chosen|Conjurer)|Farmer|Guard\((Burthorpe|Desert Mining Camp|Port Sarim Jail|Prifddinas|Varlamore)\)|Jelly|Jungle horror|Kalphite (Guardian|Soldier)|Knight of (Ardougne|Varlamore)|Man|Paladin|Penance Runner|Tormented Demon|Skeleton \((Barrows|Forthos Ruin|Lucien's camp|Melzar's Maze|Stronghold of Security|Wilderness Agility Course)\)|Werewolf|Woman|Zombie \(Entrana Dungeon\)|Zombie pirate \((Braindeath|Harmony) Island\)|Zombie swab)$", monster['name'])
        
        plain_variant_match = re.match(r"^\d+$", monster['version'])
        pennance_runner_match = re.match(r"^Wave ([1-6]|7/10|[8-9])$", monster['version'])
        werewolf_match = re.match(r"^(Alexis|Boris|Eduard|Galina|Georgy|Imre|Irina|Joseph|Ksenia|Lev|Liliya|Milla|Nikita|Nikolai|Sofiya|Svetlana|Vera|Yadviga|Yuri|Zoja)$", monster['version'])
        melee_match = re.match(r"^Melee, \d$", monster['version'])
        ranged_match = re.match(r"^Ranged, \d$", monster['version'])
        task_only_match = re.match(r"^Task only, \d+$", monster['version'])
        eye_color_match = re.match(r"^(Blue|Green|Pink|Red|Yellow) eyes$", monster['version'])
        jelly_match = re.match(r"^(Regular|Grey|Tan|Olive|Dark|Green)( \(w\))?$", monster['version'])
        farmer_match = re.match(r"^(Green shirt, (long|short) sleeves|Khaki shirt, (bracers|no bracers)|Straw hat, (black|blonde|brown) hair)$", monster['version'])
        ruins_of_tapoyauik_match = re.match(r"^Ruins of Tapoyauik, \d$", monster['version'])
        barrows_skeleton_match = re.match(r"^(Unarmed( round shield)?|Armed round shield|Square shield)$", monster['version'])
        woman_match = re.match(r"^(Purple|Brown|Red|Varrock|Shayzien)$", monster['version'])
        kalphite_guardian_match = re.match(r"^(Upper|Lower) level", monster['version'])

        if not name_match:
            continue
        if plain_variant_match:
            handle_base_variant(monster, monster['name'], '1')
        elif pennance_runner_match:
            handle_base_variant(monster, monster['name'], 'Wave 1')
        elif werewolf_match:
            handle_base_variant(monster, monster['name'], 'Alexis')
        elif melee_match:
            handle_base_variant(monster, monster['name'], 'Melee, 1')
        elif ranged_match:
            handle_base_variant(monster, monster['name'], 'Ranged, 1')
        elif task_only_match:
            handle_base_variant(monster, monster['name'], '1')
        elif eye_color_match:
            handle_base_variant(monster, monster['name'], 'Blue eyes')
        elif jelly_match:
            handle_base_variant(monster, monster['name'], 'Regular')
        elif farmer_match:
            handle_base_variant(monster, monster['name'], 'Green shirt, long sleeves')
        elif ruins_of_tapoyauik_match:
            handle_base_variant(monster, monster['name'], 'Ruins of Tapoyauik, 1')
        elif barrows_skeleton_match:
            handle_base_variant(monster, monster['name'], 'Unarmed')
        elif woman_match:
            handle_base_variant(monster, monster['name'], 'Purple')
        elif kalphite_guardian_match:
            handle_base_variant(monster, monster['name'], '')

    for k, v in sorted(data.items(), key=lambda item: item[1].base_name):
        dataJs += '\n  %s: %s, // %s' % (k, v.alias_ids, v.base_name)

    dataJs += '\n};\nexport default monsterAliases;\n'

    run_tests(data)

    with open(OUTPUT_FILE_NAME, 'w') as f:
        print('Saving to Typescript at file: ' + OUTPUT_FILE_NAME)
        f.write(dataJs)
main()