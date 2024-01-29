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

def handle_base_variant(all_items, variant_item, base_name, base_version):
    global data
    base_variant = next((x for x in all_items if x['name'] == base_name and x['version'] == base_version), None)
    if base_variant:
        data.setdefault(base_variant['id'], EquipmentAliases(base_name, [])).alias_ids.append(variant_item['id'])


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
        decoration_kit_match = re.match(r"(.*)\((?:g|t|h\d)\)$", item['name'])

        # Locked variants
        if item['version'] == 'Locked':
            handle_base_variant(all_items, item, item['name'], 'Normal')
        # Cosmetic Slayer helmets
        elif slayer_helm_match:
            handle_base_variant(all_items, item, 'Slayer helmet%s' % (slayer_helm_match.group(1) or ''), '')
        # Decoration kit variants
        elif decoration_kit_match:
            handle_base_variant(all_items, item, decoration_kit_match.group(1).strip(), '')
        # Merge Soul Wars/Emir's Arena versions -> Nightmare Zone
        elif re.match(r"^(Soul Wars|Emir's Arena)$", item['version']):
            handle_base_variant(all_items, item, item['name'], 'Nightmare Zone')
        # Degraded variants
        elif re.match(r"^(Broken|0|25|50|75|100)$", item['version']):
            handle_base_variant(all_items, item, item['name'], 'Undamaged')

    for k, v in data.items():
        dataJs += '\n  %s: %s, // %s' % (k, v[1], v[0])

    dataJs += '\n};\n\nexport default equipmentAliases;\n'

    with open(FILE_NAME, 'w') as f:
        print('Saving to Typescript at file: ' + FILE_NAME)
        f.write(dataJs)

main()
