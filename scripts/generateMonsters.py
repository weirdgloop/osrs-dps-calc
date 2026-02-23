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

FILE_NAME = '../cdn/json/monsters.json'
WIKI_BASE = 'https://oldschool.runescape.wiki'
API_BASE = WIKI_BASE + '/api.php'
IMG_PATH = '../cdn/monsters/'

BUCKET_API_FIELDS = [
    'page_name',
    'page_name_sub',
    'attack_bonus',
    'attack_level',
    'attack_speed',
    'attack_style',
    'combat_level',
    'crush_defence_bonus',
    'defence_level',
    'flat_armour',
    'hitpoints',
    'image',
    'poison_immune',
    'venom_immune',
    'magic_damage_bonus',
    'magic_attack_bonus',
    'magic_defence_bonus',
    'magic_level',
    'max_hit',
    'attribute',
    'name',
    'range_attack_bonus',
    'range_strength_bonus',
    'range_defence_bonus',
    'ranged_level',
    'slash_defence_bonus',
    'slayer_category',
    'slayer_experience',
    'stab_defence_bonus',
    'strength_bonus',
    'strength_level',
    'size',
    'id',
    'elemental_weakness',
    'elemental_weakness_percent',
    'light_range_defence_bonus',
    'standard_range_defence_bonus',
    'heavy_range_defence_bonus',
    'burn_immune'
]

def get_monster_data():
    monsters = []
    offset = 0
    fields_csv = ",".join(map(repr, BUCKET_API_FIELDS))
    while True:
        print('Fetching monster info: ' + str(offset))
        query = {
            'action': 'bucket',
            'format': 'json',
            'query': 
            (
                f"bucket('infobox_monster')"
                f".select({fields_csv})"
                f".limit(500).offset({offset})"
                f".where(bucket.Not('Category:Discontinued content'))"
                f".orderBy('page_name_sub', 'asc').run()"
            )
        }

        r = requests.get(API_BASE + '?' + urllib.parse.urlencode(query), headers={
            'User-Agent': 'osrs-dps-calc (https://github.com/weirdgloop/osrs-dps-calc)'
        })
        data = r.json()

        if 'bucket' not in data:
            # No results?
            break

        monsters = monsters + data['bucket']

        # Bucket's API doesn't tell you when there are more results, so we'll just have to guess
        if len(data['bucket']) == 500:
            offset += 500
        else:
            # If we are at the end of the results, break out of this loop
            break

    return monsters


strip_marker_regex = re.compile(r'[\'"`]*UNIQ--[a-zA-Z0-9]+-[0-9A-F]{8}-QINU[\'"`]*')

def strip_parser_tags(value):
    if isinstance(value, dict):
        return {k: strip_parser_tags(v) for k, v in value.items()}
    elif isinstance(value, list):
        return [strip_parser_tags(item) for item in value]
    elif isinstance(value, str):
        return strip_marker_regex.sub('', value).strip()
    else:
        return value

def main():
    # Grab the monster info using Bucket
    wiki_data = get_monster_data()

    # Convert the data into our own JSON structure
    data = []
    required_imgs = []

    monsters_to_skip = ["Albatross", "Armoured kraken", "Bull shark", "Butterfly ray", "Eagle ray", 
    "Frigatebird", "Great white shark", "Hammerhead shark", "Manta ray (Sailing)", "Mogre (Sailing)", "Narwhal", 
    "Orca", "Osprey", "Pygmy kraken", "Spined kraken", "Stingray", "Tern", "Tiger shark", "Vampyre kraken"]

    # Loop over the monsters data from the wiki
    for v in wiki_data:
        k = v['page_name_sub']

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

        if v.get('page_name') in monsters_to_skip:
            continue

        # Skip Fight Caves spawn point monsters
        if 'Spawn point' in version:
            continue

        # Skip Duke Sucellus non-attackable monsters and Hueycoatyl defeated
        if 'Asleep' in version or 'Defeated' in version:
            continue

        # Skip Guardians of the Rift barriers which are not attackable
        if re.match("^(Strong|Weak|Medium|Overcharged) Barrier$", k):
            continue

        monster_style = v.get('attack_style')
        if monster_style == 'None' or monster_style == 'N/A':
            monster_style = None

        burn_immunity = v.get('burn_immune')
        if burn_immunity:
            if 'weak' in burn_immunity.lower():
                burn_immunity = 'Weak'
            elif 'normal' in burn_immunity.lower():
                burn_immunity = 'Normal'
            elif 'strong' in burn_immunity.lower():
                burn_immunity = 'Strong'
            else:
                burn_immunity = None

        # Override style specifically for Spinolyps. Both attacks roll ranged vs ranged.
        # This "patch" will have to be revisited if/when we add protection prayers.
        if 'Spinolyp' in k:
            monster_style = ['Ranged']

        print(f"Processing {v['page_name_sub']}")

        try:
            monster_id = int(v.get('id')[0]) if v.get('id') else None
        except ValueError:
            # Monster has an invalid ID, do not show it here as it's probably historical or something.
            print("Skipping - invalid monster ID (not an int)")
            continue

        monster = {
            'id': monster_id,
            'name': v.get('page_name'),
            'version': version,
            'image': '' if not v.get('image') else v.get('image')[-1].replace('File:', ''),
            'level': v.get('combat_level', 0),
            'speed': v.get('attack_speed', 0),
            'style': monster_style,
            'size': v.get('size', 0),
            'max_hit': v.get('max_hit')[0] if v.get('max_hit') else 0,
            'skills': {
                'atk': v.get('attack_level', 0),
                'def': v.get('defence_level', 0),
                'hp': v.get('hitpoints', 0),
                'magic': v.get('magic_level', 0),
                'ranged': v.get('ranged_level', 0),
                'str': v.get('strength_level', 0)
            },
            'offensive': {
                'atk': v.get('attack_bonus', 0),
                'magic': v.get('magic_attack_bonus', 0),
                'magic_str': v.get('magic_damage_bonus', 0),
                'ranged': v.get('range_attack_bonus', 0),
                'ranged_str': v.get('range_strength_bonus', 0),
                'str': v.get('strength_bonus', 0)
            },
            'defensive': {
                'flat_armour': v.get('flat_armour', 0),
                'crush': v.get('crush_defence_bonus', 0),
                'magic': v.get('magic_defence_bonus', 0),
                'heavy': v.get('heavy_range_defence_bonus', 0),
                'standard': v.get('standard_range_defence_bonus', 0),
                'light': v.get('light_range_defence_bonus', 0),
                'slash': v.get('slash_defence_bonus', 0),
                'stab': v.get('stab_defence_bonus', 0)
            },
            'attributes': v.get('attribute', []),
            'immunities': {
                'burn': burn_immunity,
            }
        }

        weakness = v.get('elemental_weakness')
        if weakness:
            try:
                monster['weakness'] = {
                    'element': weakness.lower(),
                    'severity': int(v.get('elemental_weakness_percent', 0))
                }
            except:
                monster['weakness'] = None
        else:
            monster['weakness'] = None

        if monster['id'] == 14779: # Gemstone crab has infinite hp which the wiki returns as 0
            monster['skills']['hp'] = 50000

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

        if monster['name'] == "Doom of Mokhaiotl" and ("Shielded" in v.get('name') or "Burrowed" in v.get('name')):
            continue

        if monster['name'] == "Araxxor":
            if "In combat" in version:
                monster['version'] = ""
            else:
                continue

        monster = strip_parser_tags(monster)

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
