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

FILE_NAME = '../cdn/json/equipment.json'
WIKI_BASE = 'https://oldschool.runescape.wiki'
API_BASE = WIKI_BASE + '/api.php'
IMG_PATH = '../cdn/equipment/'

BUCKET_API_FIELDS = [
    'page_name',
    'page_name_sub',
    'item_name',
    'image',
    'item_id',
    'weight',
    'version_anchor',
    'infobox_bonuses.crush_attack_bonus',
    'infobox_bonuses.crush_defence_bonus',
    'infobox_bonuses.equipment_slot',
    'infobox_bonuses.magic_damage_bonus',
    'infobox_bonuses.magic_attack_bonus',
    'infobox_bonuses.magic_defence_bonus',
    'infobox_bonuses.prayer_bonus',
    'infobox_bonuses.range_attack_bonus',
    'infobox_bonuses.ranged_strength_bonus',
    'infobox_bonuses.range_defence_bonus',
    'infobox_bonuses.slash_attack_bonus',
    'infobox_bonuses.slash_defence_bonus',
    'infobox_bonuses.stab_attack_bonus',
    'infobox_bonuses.stab_defence_bonus',
    'infobox_bonuses.strength_bonus',
    'infobox_bonuses.weapon_attack_range',
    'infobox_bonuses.weapon_attack_speed',
    'infobox_bonuses.combat_style',
    'infobox_bonuses.equipment_slot',
]

ITEMS_TO_SKIP = [
    'The dogsword',
    'Amulet of the monarchs',
    'Emperor ring',
    'Nature\'s reprisal',
    'Gloves of the damned',
    'Sunlight spear',
    'Sunlit bracers',
    'Thunder khopesh',
    'Thousand-dragon ward',
    'Arcane grimoire',
    'Wristbands of the arena',
    'Wristbands of the arena (i)',
    'Armadyl chainskirt (or)',
    'Armadyl chestplate (or)',
    'Armadyl helmet (or)',
    'Dagon\'hai hat (or)',
    'Dagon\'hai robe bottom (or)',
    'Dagon\'hai robe top (or)',
    'Dragon warhammer (or)',
    'Centurion cuirass',
    'Ruinous powers (item)',
    'Battlehat',
    'Zaryte bow',
    'Corrupted armadyl godsword',
    'Corrupted dark bow',
    'Corrupted dragon claws',
    'Corrupted scythe of vitur',
    'Corrupted tumeken\'s shadow',
    'Corrupted twisted bow',
    'Corrupted voidwaker',
    'Corrupted Volatile Nightmare staff',
    'The dogsword (Deadman Mode)',
    'Thunder khopesh (Deadman Mode)'
]

def getEquipmentData():
    equipment = []
    offset = 0
    fields_csv = ",".join(map(repr, BUCKET_API_FIELDS))

    headers = {
        'User-Agent': 'osrs-dps-calc (https://github.com/weirdgloop/osrs-dps-calc)'
    }

    while True:
        print(f'Fetching equipment info: {offset}')

        query = {
            'action': 'bucket',
            'format': 'json',
            'query': (
                f"bucket('infobox_item')"
                f".select({fields_csv})"
                f".limit(500).offset({offset})"
                f".where('infobox_bonuses.equipment_slot', '!=', bucket.Null())"
                f".where('item_id', '!=', bucket.Null())"
                f".join('infobox_bonuses', 'infobox_bonuses.page_name_sub', 'infobox_item.page_name_sub')"
                f".orderBy('page_name_sub', 'asc').run()"
            )
        }

        try:
            r = requests.get(
                API_BASE,
                params=query,
                headers=headers,
                timeout=60
            )
        except requests.RequestException as e:
            print(f'Bucket API request itself failed at offset {offset}')
            print(f'Exception: {type(e).__name__}: {e}')
            raise

        print(f'Bucket API status: HTTP {r.status_code}')
        print(f'Content-Type: {r.headers.get("Content-Type")}')
        print(f'Content-Length header: {r.headers.get("Content-Length")}')
        print(f'Response body length: {len(r.content)} bytes')
        print(f'Final URL: {r.url}')

        if not r.ok:
            print('Bucket API returned an unsuccessful HTTP status.')
            print(f'Response headers: {dict(r.headers)}')
            print(f'Response body: {repr(r.text[:2000])}')
            r.raise_for_status()

        try:
            data = r.json()
        except requests.exceptions.JSONDecodeError as e:
            print('Bucket API returned a response that could not be parsed as JSON.')
            print(f'Offset: {offset}')
            print(f'HTTP status: {r.status_code}')
            print(f'Content-Type: {r.headers.get("Content-Type")}')
            print(f'Response body length: {len(r.content)} bytes')
            print(f'Response headers: {dict(r.headers)}')
            print(f'Final URL: {r.url}')
            print(f'JSON error: {e}')
            print(f'Response body: {repr(r.text[:2000])}')
            raise

        if 'bucket' not in data:
            print("Bucket API response did not contain a 'bucket' key.")
            print(f'Response keys: {list(data.keys())}')
            print(f'Response: {repr(data)[:2000]}')
            break

        rows = data['bucket']

        print(f'Received {len(rows)} equipment rows')

        equipment.extend(rows)

        # Bucket's API doesn't tell you when there are more results, so we'll just have to guess
        if len(rows) == 500:
            offset += 500
        else:
            # If we are at the end of the results, break out of this loop
            break

    print(f'Finished fetching equipment. Total rows: {len(equipment)}')
    return equipment


def main():
    # Grab the equipment info using Bucket
    wiki_data = getEquipmentData()

    # Use an object rather than an array, so that we can't have duplicate items with the same page_name_sub
    data = {}
    required_imgs = []

    # Loop over the equipment data from the wiki
    for v in wiki_data:

        try:
            item_id = int(v.get('item_id')[0]) if v.get('item_id') else None
        except ValueError:
            # Item has an invalid ID, do not show it here as it's probably historical or something.
            print("Skipping - invalid item ID (not an int)")
            continue

        if (page_name_sub := v['page_name_sub']) in data:
            # Handle cases where page_name_sub is identical across multiple item versions
            # i.e. the different imbuings of Black Mask (NMZ vs SW vs Emirs)
            page_name_sub = f'{page_name_sub}_{item_id}'

        print(f"Processing {page_name_sub}")

        equipment = {
            'name': v['page_name'],
            'id': item_id,
            'weight': v.get('weight', 0),
            'version': v.get('version_anchor', ''),
            'slot': v.get('infobox_bonuses.equipment_slot', ''),
            'image': '' if not v.get('image') else v.get('image')[-1].replace('File:', ''),
            'speed': v.get('infobox_bonuses.weapon_attack_speed', 0),
            'category': v.get('infobox_bonuses.combat_style', ''),
            'bonuses': {
                'str': v.get('infobox_bonuses.strength_bonus'),
                'ranged_str': v.get('infobox_bonuses.ranged_strength_bonus'),
                'magic_str': int(v.get('infobox_bonuses.magic_damage_bonus', 0) * 10),
                'prayer': v.get('infobox_bonuses.prayer_bonus'),
            },
            'offensive': {
                'stab': v.get('infobox_bonuses.stab_attack_bonus'),
                'slash': v.get('infobox_bonuses.slash_attack_bonus'),
                'crush': v.get('infobox_bonuses.crush_attack_bonus'),
                'magic': v.get('infobox_bonuses.magic_attack_bonus'),
                'ranged': v.get('infobox_bonuses.range_attack_bonus'),
            },
            'defensive': {
                'stab': v.get('infobox_bonuses.stab_defence_bonus'),
                'slash': v.get('infobox_bonuses.slash_defence_bonus'),
                'crush': v.get('infobox_bonuses.crush_defence_bonus'),
                'magic': v.get('infobox_bonuses.magic_defence_bonus'),
                'ranged': v.get('infobox_bonuses.range_defence_bonus'),
            },
            'isTwoHanded': False
        }

        # Handle 2H weapons
        if equipment['slot'] == '2h':
            equipment['slot'] = 'weapon'
            equipment['isTwoHanded'] = True

        # If this is an item from Nightmare Zone, it will become the main variant for all NMZ/SW/Emir's variants
        if equipment['version'] == 'Nightmare Zone':
            equipment['version'] = ''

        # Skip last man standing items
        if "(Last Man Standing)" in equipment['name']:
            continue

        if equipment['name'] in ITEMS_TO_SKIP:
            continue

        if "Keris partisan of amascut" in equipment['name'] and "Outside ToA" in page_name_sub:
            continue

        # Set the current equipment item to the calc's equipment list
        data[page_name_sub] = equipment

        if not equipment['image'] == '':
            required_imgs.append(equipment['image'])

    new_data = list(data.values())

    # add manual equipment that isn't pulled from the wiki
    # this should ONLY be used for upcoming items that are not yet released
    with open('manual_equipment.json', 'r') as f:
        manual_data = json.load(f)
        new_data = new_data + manual_data

    print('Total equipment: ' + str(len(new_data)))
    new_data.sort(key=lambda d: d.get('name'))

    with open(FILE_NAME, 'w') as f:
        print('Saving to JSON at file: ' + FILE_NAME)
        json.dump(new_data, f, ensure_ascii=False, indent=2)

    success_img_dls = 0
    failed_img_dls = 0
    skipped_img_dls = 0
    required_imgs = set(required_imgs)

    removed_count = 0

    if os.path.isdir(IMG_PATH):
        for root, _, files in os.walk(IMG_PATH):
            for file in files:
                rel_path = os.path.relpath(os.path.join(root, file), IMG_PATH).replace(os.sep, '/')

                if rel_path not in required_imgs:
                    to_remove = os.path.join(root, file)
                    try:
                        os.remove(to_remove)
                        removed_count += 1
                        print(f'Removed unused image: {rel_path}')
                    except OSError as e:
                        print(f'Error removing unused image {rel_path}: {e}')

    # Fetch all the images from the wiki and store them for local serving
    for idx, img in enumerate(required_imgs):
        if os.path.isfile(IMG_PATH + img):
            skipped_img_dls += 1
            continue

        print(f'({idx}/{len(required_imgs)}) Fetching image: {img}')
        r = requests.get(WIKI_BASE + '/w/Special:Filepath/' + img, headers={
            'User-Agent': 'osrs-dps-calc (https://github.com/weirdgloop/osrs-dps-calc)'
        })
        if r.ok:
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
    print('Total unused images removed: ' + str(removed_count))


main()
