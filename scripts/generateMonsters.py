"""
    Script to generate a monsters.json of all the monsters on the OSRS Wiki, and downloads images for each of them.
    The JSON file is placed in ../src/lib/monsters.json

    The images are placed in ../cdn/monsters/. This directory is NOT included in the Next.js app bundle, and should
    be deployed separately to our file storage solution.

    Written for Python 3.9.
"""
import os.path

import requests
import json
import urllib.parse
import re
import csv

FILE_NAME = '../cdn/json/monsters.json'
WIKI_BASE = 'https://oldschool.runescape.wiki'
API_BASE = WIKI_BASE + '/api.php'
IMG_PATH = '../cdn/monsters/'

REQUIRED_PRINTOUTS = [
    'Attack bonus',
    'Attack level',
    'Attack speed',
    'Attack style',
    'Combat level',
    'Crush defence bonus',
    'Defence level',
    'Hitpoints',
    'Image',
    'Immune to poison',
    'Immune to venom',
    'Magic Damage bonus',
    'Magic attack bonus',
    'Magic defence bonus',
    'Magic level',
    'Max hit',
    'Monster attribute',
    'Name',
    'Range attack bonus',
    'Ranged Strength bonus',
    'Range defence bonus',
    'Ranged level',
    'Slash defence bonus',
    'Slayer category',
    'Slayer experience',
    'Stab defence bonus',
    'Strength bonus',
    'Strength level',
    'Size',
    'NPC ID',
    'Category',
    'Elemental weakness',
    'Elemental weakness percent',
    'Light range defence bonus',
    'Standard range defence bonus',
    'Heavy range defence bonus'
]

def get_monster_data():
    monsters = {}
    offset = 0
    while True:
        print('Fetching monster info: ' + str(offset))
        query = {
            'action': 'ask',
            'format': 'json',
            'query': '[[Uses infobox::Monster]]|?' + '|?'.join(REQUIRED_PRINTOUTS) + '|limit=500|offset=' + str(offset)
        }
        r = requests.get(API_BASE + '?' + urllib.parse.urlencode(query), headers={
            'User-Agent': 'osrs-dps-calc (https://github.com/weirdgloop/osrs-dps-calc)'
        })
        data = r.json()

        if 'query' not in data or 'results' not in data['query']:
            # No results?
            break

        monsters = monsters | data['query']['results']

        if 'query-continue-offset' not in data or int(data['query-continue-offset']) < offset:
            # If we are at the end of the results, break out of this loop
            break
        else:
            offset = data['query-continue-offset']
    return monsters


def get_printout_value(prop, all_results=False):
    # SMW printouts are all arrays, so ensure that the array is not empty
    if not prop:
        return None
    else:
        return prop if all_results else prop[0]


def has_category(category_array, category):
    return next((c for c in category_array if c['fulltext'] == "Category:%s" % category), None)


def main():
    # Grab the monster info using SMW, including all the relevant printouts
    wiki_data = get_monster_data()

    # Convert the data into our own JSON structure
    data = []
    required_imgs = []

    # Loop over the monsters data from the wiki
    for k, v in wiki_data.items():
        # print('Processing ' + k)

        # Sanity check: make sure that this monster has printouts from SMW
        if 'printouts' not in v:
            print(k + ' is missing SMW printouts - skipping.')
            continue

        po = v['printouts']

        # We split the key instead of using the Version anchor prop here to account for monsters with custom |smwname=
        try:
            version = k.split('#', 1)[1]
        except IndexError:
            version = ''

        # If this is a CoX monster Challenge Mode variant, remove it. This will be handled by the calculator UI.
        if 'Challenge Mode' in version:
            print(k + ' is a CoX CM variant - skipping.')
            continue

        # Skip monsters that aren't in the main namespace on the wiki
        if re.match("^([A-z]*):", k):
            continue

        # Skip "monsters" that are actually non-interactive scenery, or don't exist
        if (
            has_category(po['Category'], 'Non-interactive scenery')
            or has_category(po['Category'], 'Discontinued content')
        ):
            continue

        monster_style = get_printout_value(po['Attack style'], True)
        if monster_style == 'None' or monster_style == 'N/A':
            monster_style = None

        # Override style specifically for Spinolyps. Both attacks roll ranged vs ranged.
        # This "patch" will have to be revisited if/when we add protection prayers.
        if 'Spinolyp' in k:
            monster_style = ['Ranged']

        monster = {
            'id': get_printout_value(po['NPC ID']),
            'name': k.rsplit('#', 1)[0] or '',
            'version': version,
            'image': '' if not po['Image'] else po['Image'][0]['fulltext'].replace('File:', ''),
            'level': get_printout_value(po['Combat level']) or 0,
            'speed': get_printout_value(po['Attack speed']) or 0,
            'style': monster_style,
            'size': get_printout_value(po['Size']) or 0,
            'max_hit': get_printout_value(po['Max hit']) or 0,
            'skills': {
                'atk': get_printout_value(po['Attack level']) or 0,
                'def': get_printout_value(po['Defence level']) or 0,
                'hp': get_printout_value(po['Hitpoints']) or 0,
                'magic': get_printout_value(po['Magic level']) or 0,
                'ranged': get_printout_value(po['Ranged level']) or 0,
                'str': get_printout_value(po['Strength level']) or 0
            },
            'offensive': {
                'atk': get_printout_value(po['Attack bonus']) or 0,
                'magic': get_printout_value(po['Magic attack bonus']) or 0,
                'magic_str': get_printout_value(po['Magic Damage bonus']) or 0,
                'ranged': get_printout_value(po['Range attack bonus']) or 0,
                'ranged_str': get_printout_value(po['Ranged Strength bonus']) or 0,
                'str': get_printout_value(po['Strength bonus']) or 0
            },
            'defensive': {
                'crush': get_printout_value(po['Crush defence bonus']) or 0,
                'magic': get_printout_value(po['Magic defence bonus']) or 0,
                'heavy': get_printout_value(po['Heavy range defence bonus']) or 0,
                'standard': get_printout_value(po['Standard range defence bonus']) or 0,
                'light': get_printout_value(po['Light range defence bonus']) or 0,
                'slash': get_printout_value(po['Slash defence bonus']) or 0,
                'stab': get_printout_value(po['Stab defence bonus']) or 0
            },
            'attributes': po['Monster attribute'] or [],
        }

        weakness = get_printout_value(po['Elemental weakness']) or None
        if weakness:
            monster['weakness'] = {
                'element': weakness.lower(),
                'severity': int(get_printout_value(po['Elemental weakness percent']) or 0)
            }
        else:
            monster['weakness'] = None

        # Prune...
        if (
                # ...monsters that do not have any hitpoints
                monster['skills']['hp'] == 0
                # ...monsters that don't have an ID
                or monster['id'] is None
                # ...monsters that are historical
                or '(historical)' in str.lower(monster['name'])
                # ...monsters from the PvM arena
                or '(pvm arena)' in str.lower(monster['name'])
                # ...monsters from DMM Apocalypse
                or '(deadman: apocalypse)' in str.lower(monster['name'])
        ):
            continue

        data.append(monster)
        if not monster['image'] == '':
            required_imgs.append(monster['image'])

    print('Total monsters: ' + str(len(data)))

    # Save the JSON
    with open(FILE_NAME, 'w') as f:
        print('Saving to JSON at file: ' + FILE_NAME)
        json.dump(data, f, ensure_ascii=False, indent=2)

    success_img_dls = 0
    failed_img_dls = 0
    skipped_img_dls = 0
    required_imgs = set(required_imgs)

    # Fetch all the images from the wiki and store them for local serving
    saved_image_paths = set()
    for idx, img in enumerate(required_imgs):
        dest_path = IMG_PATH + img
        if dest_path.lower() in saved_image_paths:
            print('[WARN] Case-sensitive image filename clashes: ' + dest_path)
            continue

        saved_image_paths.add(dest_path.lower())
        if os.path.isfile(dest_path):
            skipped_img_dls += 1
            continue

        print(f'({idx}/{len(required_imgs)}) Fetching image: {img}')
        r = requests.get(WIKI_BASE + '/w/Special:Filepath/' + img, headers={
            'User-Agent': 'osrs-dps-calc (https://github.com/weirdgloop/osrs-dps-calc)'
        })
        if r.status_code == 200:
            with open(dest_path, 'wb') as f:
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
