"""
    Script to generate item ID aliases for common equipment variants, such as broken or degraded states of equipment.
    This script shouldn't be used to overwrite src/lib/EquipmentAliases.ts entirely, but can instead be used as
    a way of bootstrapping that file.

    Written for Python 3.9.
"""
from collections import namedtuple
import requests
import urllib.parse
import re
import json

FILE_NAME = '../src/lib/EquipmentAliases.ts'
MAPPING_DICT_FILE_NAME = '../cdn/json/equipment_aliases.json'
WIKI_BASE = 'https://oldschool.runescape.wiki'
API_BASE = WIKI_BASE + '/api.php'

REQUIRED_PRINTOUTS = [
    'Equipment slot',
    'Item ID',
    'Version anchor'
]


def getEquipmentData():
    equipment = {}
    offset = 0
    while True:
        print('Fetching equipment info: ' + str(offset))
        query = {
            'action': 'ask',
            'format': 'json',
            'query': '[[Equipment slot::+]][[Item ID::+]]|?' + '|?'.join(REQUIRED_PRINTOUTS) + '|limit=500|offset=' + str(offset)
        }
        r = requests.get(API_BASE + '?' + urllib.parse.urlencode(query), headers={
            'User-Agent': 'osrs-dps-calc (https://github.com/weirdgloop/osrs-dps-calc)'
        })
        data = r.json()

        if 'query' not in data or 'results' not in data['query']:
            # No results?
            break

        equipment = equipment | data['query']['results']

        if 'query-continue-offset' not in data or int(data['query-continue-offset']) < offset:
            # If we are at the end of the results, break out of this loop
            break
        else:
            offset = data['query-continue-offset']
    return equipment


def getPrintoutValue(prop):
    # SMW printouts are all arrays, so ensure that the array is not empty
    if not prop:
        return None
    else:
        return prop[0]


data = {}

dataJs = """/**
 * A map of base item ID -> variant item IDs for items that are identical in function. This includes
 * "locked" variants of items, broken/degraded variants of armour and weapons, and cosmetic recolours of equipment.
 * @see https://oldschool.runescape.wiki/w/Trouver_parchment
 */
const equipmentAliases = {"""

EquipmentAliases = namedtuple('EquipmentAliases', ['base_name', 'base_version', 'alias_ids'])

def handle_base_variant(all_items, variant_item, base_name, base_versions):
    global data
    base_variant = next((x for x in all_items if x['name'] == base_name and x['version'] in base_versions), None)
    if base_variant:
        data.setdefault(base_variant['id'], EquipmentAliases(base_name, base_variant['version'], [])).alias_ids.append(variant_item['id'])

one_off_renames = {
    "Dinh's blazing bulwark": "Dinh's bulwark",
    "Blazing blowpipe": "Toxic blowpipe",
    "Volcanic abyssal whip": "Abyssal whip",
    "Frozen abyssal whip": "Abyssal whip",
    "Holy ghrazi rapier": "Ghrazi rapier",
    "Holy sanguinesti staff": "Sanguinesti staff",
    "Holy scythe of vitur": "Scythe of vitur",
    "Sanguine scythe of vitur": "Scythe of vitur",
    "Dragon hunter crossbow (b)": "Dragon hunter crossbow",
    "Obsidian cape (r)": "Obsidian cape",
    "Elidinis' ward (or)": "Elidinis' ward (f)",
    "Armadyl godsword (deadman)": "Armadyl godsword",
    "Voidwaker (deadman)": "Voidwaker",
    "Volatile nightmare staff (deadman)": "Volatile nightmare staff",
    "Amulet of rancour (s)": "Amulet of rancour"
}

def main():
    global dataJs

    # Grab the equipment info using SMW, including all the relevant printouts
    wiki_data = getEquipmentData()

    all_items = []

    # Loop over the equipment data from the wiki
    for k, v in wiki_data.items():
        print('Processing ' + k)
        # Sanity check: make sure that this equipment has printouts from SMW
        if 'printouts' not in v:
            print(k + ' is missing SMW printouts - skipping.')
            continue

        po = v['printouts']

        all_items.append({
            'name': k.rsplit('#', 1)[0],
            'id': getPrintoutValue(po['Item ID']),
            'version': getPrintoutValue(po['Version anchor']) or ''
        })

    all_items.sort(key=lambda d: d.get('name'))

    for item in all_items:
        slayer_helm_match = re.match(r"^(?:Black|Green|Red|Purple|Turquoise|Hydra|Twisted|Tztok|Vampyric|Tzkal|Araxyte) slayer helmet( \(i\))?$", item['name'])
        sanguine_torva_match = re.match(r"^Sanguine t(orva (full helm|platebody|platelegs))$", item['name'])
        decoration_kit_match = re.match(r"(.*)\((?:g|t|(h)\d|Arrav|Asgarnia|Dorgeshuun|Dragon|Fairy|Guthix|HAM|Horse|Jogre|Kandarin|Misthalin|Money|Saradomin|Skull|Varrock|Zamorak|or|cr|Hallowed|Trailblazer|Ithell|Iorwerth|Trahaearn|Cadarn|Crwys|Meilyr|Hefin|Amlodd|upgraded|light|dark|dusk|lit)\)$", item['name'], re.IGNORECASE)
        magic_robe_kit_match = re.match(r"^(?:Dark|Light|Twisted) ((?:infinity|ancestral) .*)$", item['name'])

        # One off items:
        if item['name'] in one_off_renames:
            assert item['version'] in ['', 'Empty', 'Charged', 'Uncharged'], "Only certain versions are expected: %s" % item
            handle_base_variant(all_items, item, one_off_renames[item['name']], [item['version']])
        # Ava's assembler variants (Must be before locked due to the base name change)
        elif re.match(r"^Masori assembler(|\(l\))$", item['name']):
            handle_base_variant(all_items, item, "Ava's assembler", ['Normal'])
        # Locked variants
        elif item['version'] == 'Locked':
            # Locked and decorated
            if decoration_kit_match:
                handle_base_variant(all_items, item, decoration_kit_match.group(1).strip(), ['Normal'])
            # Only locked
            else:
                handle_base_variant(all_items, item, item['name'], ['Normal'])
        # Cosmetic Slayer helmets
        elif slayer_helm_match:
            handle_base_variant(all_items, item, 'Slayer helmet%s' % (slayer_helm_match.group(1) or ''), ['', 'Nightmare Zone'])
        # Sanguine Torva
        elif sanguine_torva_match:
            handle_base_variant(all_items, item, 'T%s' % (sanguine_torva_match.group(1) or ''), ['Restored'])
        # Amulet of glory variants
        elif (item['name'] == 'Amulet of glory' and item['version'] != 'Uncharged') or item['name'] == 'Amulet of glory (t)' or item['name'] == 'Amulet of eternal glory':
            handle_base_variant(all_items, item, 'Amulet of glory', ['Uncharged'])
        # Decoration kit variants
        elif decoration_kit_match:
            base_item_name = decoration_kit_match.group(1).strip()
            # Crystal armor should not be aliases across Active and Inactive
            # Nor should items with weapon poison
            if item['version'] in ['Active', 'Inactive', 'Unpoisoned', 'Poison', 'Poison+', 'Poison++']:
                handle_base_variant(all_items, item, base_item_name, [item['version']])
            elif base_item_name.endswith(" helm") and decoration_kit_match.group(2) == "h":
                handle_base_variant(all_items, item, base_item_name.replace(" helm", " full helm"), [item['version']])
            elif base_item_name.endswith(" shield") and decoration_kit_match.group(2) == "h":
                handle_base_variant(all_items, item, base_item_name.replace(" shield", " kiteshield"), [item['version']])
            else:
                handle_base_variant(all_items, item, base_item_name, ['', 'Normal'])
        # Magic robe variants
        elif magic_robe_kit_match:
            handle_base_variant(all_items, item, magic_robe_kit_match.group(1).capitalize(), [''])
        # Merge Soul Wars/Emir's Arena versions -> Nightmare Zone
        elif re.match(r"^(Soul Wars|Emir's Arena)$", item['version']):
            handle_base_variant(all_items, item, item['name'], ['Nightmare Zone'])
        # Raging Echo League variants
        elif re.match(r"^Echo (ahrim|venator|virtus)", item['name']):
            name = item['name'].removeprefix("Echo ")
            name = name[0].upper() + name[1:]
            if ("Ahrim's" in name):
                handle_base_variant(all_items, item, name, "Undamaged")
            else:
                handle_base_variant(all_items, item, name, item['version'])
        # Degraded variants
        elif re.match(r"^(Broken|0|25|50|75|100)$", item['version']):
            handle_base_variant(all_items, item, item['name'], ['Undamaged'])
        # Moons armours
        elif re.match(r"^(Used|New)", item['version']) and "Crystal" not in item['name']:
            handle_base_variant(all_items, item, item['name'], ['New'])
        # Dark Bow variants
        elif (item['name'] == "Dark bow" and item['version'] != "Regular") or item['name'] == "Dark bow (deadman)":
            handle_base_variant(all_items, item, "Dark bow", ['Regular'])
        # Granite maul variants
        elif (item['name'] == "Granite maul" and item['version'] != "Normal") or item['name'] == "Granite maul (or)":
            handle_base_variant(all_items, item, 'Granite maul', ['Normal'])

    mapping_dict = {}
    for k, v in sorted(data.items(), key=lambda item: item[1].base_name):
        dataJs += '\n  %s: %s, // %s%s' % (k, v.alias_ids, v.base_name, f"#{v.base_version}" if v.base_version else "")
        for id in v.alias_ids:
            mapping_dict[id] = k

    dataJs += '\n};\n\nexport default equipmentAliases;\n'

    with open(FILE_NAME, 'w') as f:
        print('Saving to Typescript at file: ' + FILE_NAME)
        f.write(dataJs)

    with open(MAPPING_DICT_FILE_NAME, 'w') as f:
        print('Saving direct mapping at file: ' + MAPPING_DICT_FILE_NAME)
        json.dump(mapping_dict, f, ensure_ascii=False, indent=2)

main()
