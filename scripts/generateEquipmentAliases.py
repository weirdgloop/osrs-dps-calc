"""
    Script to generate item ID aliases for common equipment variants, such as broken or degraded states of equipment.
    This script shouldn't be used to overwrite src/lib/EquipmentAliases.ts entirely, but can instead be used as
    a way of bootstrapping that file.

    Written for Python 3.9.
"""
import requests
import urllib.parse

FILE_NAME = './EquipmentAliases.ts'
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


def main():
    # Grab the equipment info using SMW, including all the relevant printouts
    wiki_data = getEquipmentData()

    data = """/**
 * A map of item ID -> item ID for items that are identical in function, but different in appearance. This includes
 * "locked" variants of items, broken/degraded variants of armour and weapons, and cosmetic recolours of equipment.
 * @see https://oldschool.runescape.wiki/w/Trouver_parchment
 */
export const equipmentAliases = {"""

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
        # Locked variants
        if item['version'] == 'Locked':
            base_variant = next((x for x in all_items if x['name'] == item['name'] and x['version'] == 'Normal'), None)
            if base_variant:
                data += '\n    %s: %s, // %s' % (item['id'], base_variant['id'], item['name'] + '#' + item['version'])
        # Degraded variants
        elif (
            item['version'] == '25' or
            item['version'] == '50' or
            item['version'] == '75'
        ):
            base_variant = next((x for x in all_items if x['name'] == item['name'] and x['version'] == '100'), None)
            if base_variant:
                data += '\n    %s: %s, // %s' % (item['id'], base_variant['id'], item['name'] + '#' + item['version'])


    data += '\n}'

    print('Total equipment: ' + str(len(data)))
    with open(FILE_NAME, 'w') as f:
        print('Saving to JSON at file: ' + FILE_NAME)
        f.write(data)

main()
