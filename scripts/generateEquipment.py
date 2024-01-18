"""
    Script to generate an equipment.json of all the equipment on the OSRS Wiki, and downloads images for each item.
    The JSON file is placed in ../src/lib/equipment.json.

    The images are placed in ../cdn/equipment/. This directory is NOT included in the Next.js app bundle, and should
    be deployed separately to our file storage solution.

    Written for Python 3.9.
"""
import os
import requests
import json
import urllib.parse
import re

FILE_NAME = '../cdn/json/equipment.json'
WIKI_BASE = 'https://oldschool.runescape.wiki'
API_BASE = WIKI_BASE + '/api.php'
IMG_PATH = '../cdn/equipment/'

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

    # Convert the data into our own JSON structure
    data = []
    required_imgs = []

    # Loop over the equipment data from the wiki
    for k, v in wiki_data.items():
        print('Processing ' + k)
        # Sanity check: make sure that this equipment has printouts from SMW
        if 'printouts' not in v:
            print(k + ' is missing SMW printouts - skipping.')
            continue

        po = v['printouts']
        item_id = getPrintoutValue(po['Item ID'])
        equipment = {
            'name': k.rsplit('#', 1)[0],
            'id': item_id,
            'version': getPrintoutValue(po['Version anchor']) or '',
            'slot': getPrintoutValue(po['Equipment slot']) or '',
            'image': '' if not po['Image'] else po['Image'][0]['fulltext'].replace('File:', ''),
            'speed': getPrintoutValue(po['Weapon attack speed']) or 0,
            'category': getPrintoutValue(po['Combat style']) or '',
            'bonuses': {
                'str': getPrintoutValue(po['Strength bonus']),
                'ranged_str': getPrintoutValue(po['Ranged Strength bonus']),
                'magic_str': getPrintoutValue(po['Magic Damage bonus']),
                'prayer': getPrintoutValue(po['Prayer bonus']),
            },
            'offensive': {
                'stab': getPrintoutValue(po['Stab attack bonus']),
                'slash': getPrintoutValue(po['Slash attack bonus']),
                'crush': getPrintoutValue(po['Crush attack bonus']),
                'magic': getPrintoutValue(po['Magic attack bonus']),
                'ranged': getPrintoutValue(po['Range attack bonus']),
            },
            'defensive': {
                'stab': getPrintoutValue(po['Stab defence bonus']),
                'slash': getPrintoutValue(po['Slash defence bonus']),
                'crush': getPrintoutValue(po['Crush defence bonus']),
                'magic': getPrintoutValue(po['Magic defence bonus']),
                'ranged': getPrintoutValue(po['Range defence bonus']),
            },
            'isTwoHanded': False
        }

        # Trim out 0 values in stats
        for section in ['bonuses', 'offensive', 'defensive']:
            equipment[section] = {k:v for (k,v) in equipment[section].items() if v != 0}

        # Handle 2H weapons
        if equipment['slot'] == '2h':
            equipment['slot'] = 'weapon'
            equipment['isTwoHanded'] = True

        # Prune...
        if (
            # ...items with all 0 stat bonuses
            (len(equipment['bonuses']) == 0 and len(equipment['offensive']) == 0 and len(equipment['defensive']) == 0
             and (equipment['speed'] == 4 or equipment['speed'] <= 0))
            # ...items that are broken, inactive, locked, SW/Emir variants
            or re.match(r"^(Broken|Inactive|Locked|Soul Wars|Emir's Arena)$", equipment['version'])
            # ...items that are degraded variants
            or re.match(r"^(0|25|50|75|100)$", equipment['version'])
            # ...items from LMS (PvP only mode), or historical
            or re.search(r"\((Last Man Standing|historical)\)$", equipment['name'])
        ):
            continue

        # If this is an item from Nightmare Zone, it will become the main variant for all NMZ/SW/Emir's variants
        if equipment['version'] == 'Nightmare Zone':
            equipment['version'] = ''

        # Append the current equipment item to the calc's equipment list
        data.append(equipment)

        if not equipment['image'] == '':
            required_imgs.append(equipment['image'])

    print('Total equipment: ' + str(len(data)))
    data.sort(key=lambda d: d.get('name'))

    with open(FILE_NAME, 'w') as f:
        print('Saving to JSON at file: ' + FILE_NAME)
        json.dump(data, f, ensure_ascii=False, indent=2)

    success_img_dls = 0
    failed_img_dls = 0
    skipped_img_dls = 0
    required_imgs = set(required_imgs)

    # Fetch all the images from the wiki and store them for local serving
    for idx, img in enumerate(required_imgs):
        if os.path.isfile(IMG_PATH + img):
            skipped_img_dls += 1
            continue

        print(f'({idx}/{len(required_imgs)}) Fetching image: {img}')
        r = requests.get(WIKI_BASE + '/w/Special:Filepath/' + img, headers={
            'User-Agent': 'osrs-dps-calc (https://github.com/weirdgloop/osrs-dps-calc)'
        })
        if r.status_code == 200:
            with open(IMG_PATH + img, 'wb') as f:
                f.write(r.content)
                print('Saved image: ' + img)
                success_img_dls += 1
        else:
            print('Unable to save image: ' + img)
            failed_img_dls += 1

    print('Total images saved: ' + str(success_img_dls))
    print('Total images skipped (already exists): ' + str(skipped_img_dls))
    print('Total images failed to save: ' + str(failed_img_dls))


main()
