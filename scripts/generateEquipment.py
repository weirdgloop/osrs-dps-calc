"""
    Script to generate an equipment.json of all the equipment on the OSRS Wiki.
    The JSON file is placed in the current working directory.
    Written for Python 3.9.
"""

import requests
import json
import urllib.parse

FILE_NAME = 'equipment.json'
API_BASE = 'https://oldschool.runescape.wiki/api.php'

REQUIRED_PRINTOUTS = [
    'Crush attack bonus',
    'Crush defence bonus',
    'Equipment slot',
    'Item ID',
    'Image',
    'Magic Damage bonus',
    'Magic attack bonus',
    'Magic defence bonus',
    'Prayer bonus',
    'Range attack bonus',
    'Ranged Strength bonus',
    'Range defence bonus',
    'Slash attack bonus',
    'Slash defence bonus',
    'Stab attack bonus',
    'Stab defence bonus',
    'Strength bonus',
    'Version anchor',
    'Weapon attack range',
    'Weapon attack speed',
    'Combat style'
]

def getEquipmentData():
    equipment = {}
    offset = 0
    while True:
        print('Fetching equipment info: ' + str(offset))
        query = {
            'action': 'ask',
            'format': 'json',
            'query': '[[Equipment slot::+]]|?' + '|?'.join(REQUIRED_PRINTOUTS) + '|limit=500|offset=' + str(offset)
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

    # Convert the data into our own JSON structure
    data = []

    # Loop over the equipment data from the wiki
    for k, v in wiki_data.items():
        print('Processing ' + k)
        # Sanity check: make sure that this equipment has printouts from SMW
        if 'printouts' not in v:
            print(k + ' is missing SMW printouts - skipping.')
            continue

        po = v['printouts']
        equipment = {
            'name': k.rsplit('#', 1)[0],
            'version': getPrintoutValue(po['Version anchor']) or '',
            'slot': getPrintoutValue(po['Equipment slot']) or '',
            'image': '' if not po['Image'] else po['Image'][0]['fulltext'].replace('File:', ''),
            'speed': getPrintoutValue(po['Weapon attack speed']) or 0,
            'style': getPrintoutValue(po['Combat style']) or '',
            'offensive': [
                getPrintoutValue(po['Crush attack bonus']) or 0,
                getPrintoutValue(po['Magic Damage bonus']) or 0,
                getPrintoutValue(po['Magic attack bonus']) or 0,
                getPrintoutValue(po['Range attack bonus']) or 0,
                getPrintoutValue(po['Ranged Strength bonus']) or 0,
                getPrintoutValue(po['Slash attack bonus']) or 0,
                getPrintoutValue(po['Stab attack bonus']) or 0,
                getPrintoutValue(po['Strength bonus']) or 0
            ],
            'defensive': [
                getPrintoutValue(po['Crush defence bonus']) or 0,
                getPrintoutValue(po['Magic defence bonus']) or 0,
                getPrintoutValue(po['Range defence bonus']) or 0,
                getPrintoutValue(po['Slash defence bonus']) or 0,
                getPrintoutValue(po['Stab defence bonus']) or 0,
                getPrintoutValue(po['Prayer bonus']) or 0
            ],
        }
        data.append(equipment)

    print('Total equipment: ' + str(len(data)))

    with open(FILE_NAME, 'w') as f:
        print('Saving to JSON at file: ' + FILE_NAME)
        json.dump(data, f, ensure_ascii=False, indent=2)


main()
