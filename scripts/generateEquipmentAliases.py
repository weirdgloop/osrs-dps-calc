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

FILE_NAME = '../src/lib/EquipmentAliases.ts'
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

EquipmentAliases = namedtuple('EquipmentAliases', ['base_name', 'alias_ids'])

def handle_base_variant(all_items, variant_item, base_name, base_versions):
    global data
    base_variant = next((x for x in all_items if x['name'] == base_name and x['version'] in base_versions), None)
    if base_variant:
        data.setdefault(base_variant['id'], EquipmentAliases(base_name, [])).alias_ids.append(variant_item['id'])

one_off_renames = {
    "Dinh's blazing bulwark": "Dinh's bulwark",
    "Blazing blowpipe": "Toxic blowpipe",
    "Volcanic abyssal whip": "Abyssal whip",
    "Frozen abyssal whip": "Abyssal whip",
    "Holy ghrazi rapier": "Ghrazi rapier",
    "Holy sanguinesti staff": "Sanguinesti staff",
    "Holy scythe of vitur": "Scythe of vitur",
    "Sanguine scythe of vitur": "Scythe of vitur",
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
        slayer_helm_match = re.match(r"^(?:Black|Green|Red|Purple|Turquoise|Hydra|Twisted|Tztok|Vampyric|Tzkal) slayer helmet( \(i\))?$", item['name'])
        decoration_kit_match = re.match(r"(.*)\((?:g|t|h\d|guthix|saradomin|zamorak|or|cr|b|Hallowed|Trailblazer|Ithell|Iorwerth|Trahaearn|Cadarn|Crwys|Meilyr|Hefin|Amlodd|upgraded)\)$", item['name'])
        magic_robe_kit_match = re.match(r"^(?:Dark|Light|Twisted) ((?:infinity|ancestral) .*)$", item['name'])

        # Ava's assembler variants (Must be before locked due to the base name change)
        if re.match(r"^Masori assembler(|\(l\))$", item['name']):
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
            handle_base_variant(all_items, item, 'Slayer helmet%s' % (slayer_helm_match.group(1) or ''), [''])
        # Decoration kit variants
        elif decoration_kit_match:
            handle_base_variant(all_items, item, decoration_kit_match.group(1).strip(), ['', 'Normal', 'Active', 'Inactive'])
        # Magic robe variants
        elif magic_robe_kit_match:
            handle_base_variant(all_items, item, magic_robe_kit_match.group(1).capitalize(), [''])
        # Merge Soul Wars/Emir's Arena versions -> Nightmare Zone
        elif re.match(r"^(Soul Wars|Emir's Arena)$", item['version']):
            handle_base_variant(all_items, item, item['name'], ['Nightmare Zone'])
        # Degraded variants
        elif re.match(r"^(Broken|0|25|50|75|100)$", item['version']):
            handle_base_variant(all_items, item, item['name'], ['Undamaged'])
        # Dark Bow variants
        elif item['name'] == "Dark bow" and item['version'] != "Regular":
            handle_base_variant(all_items, item, item['name'], ['Regular'])
        # Granite maul variants
        elif (item['name'] == "Granite maul" and item['version'] != "Normal") or item['name'] == "Granite maul (or)":
            handle_base_variant(all_items, item, 'Granite maul', ['Normal'])
        # One off items:
        elif item['name'] in one_off_renames:
            assert item['version'] in ['', 'Empty', 'Charged', 'Uncharged'], "Only certain versions are expected: %s" % item
            handle_base_variant(all_items, item, one_off_renames[item['name']], [item['version']])


    for k, v in sorted(data.items(), key=lambda item: item[1].base_name):
        dataJs += '\n  %s: %s, // %s' % (k, v.alias_ids, v.base_name)

    dataJs += '\n};\n\nexport default equipmentAliases;\n'

    with open(FILE_NAME, 'w') as f:
        print('Saving to Typescript at file: ' + FILE_NAME)
        f.write(dataJs)

main()
