"""
    Script that accepts a RuneScript file and outputs the result as JSON that we can work with.
    Example: `python3 convertConfigToEquipment.py runescript.txt`

    Written for Python 3.9.
"""
import json
import sys
import re

def find(pattern, input_str, fallback):
    r = re.search(pattern, input_str)
    if r is None:
        return fallback
    return r.group(1)

with open(sys.argv[1], 'r') as f:
    text = f.read()
    items = text.split(']')

data = []

for i in items:
    name = find("name=(.*)\n", i, "")
    if name == '':
        continue

    slot = ''
    cat = find("category=(.*)\n", i, "")
    is2h = False

    # Determine the slot
    if cat.startswith('weapon_'):
        slot = 'weapon'

        # Determine the weapon category
        if cat == 'weapon_thrown':
            cat = 'Thrown'
        elif cat == 'weapon_hacksword':
            cat = 'Spiked' # TODO: ?
        elif cat == 'weapon_tribrid':
            cat = 'Multi-Style' # TODO: ?
        elif cat == 'weapon_heavysword':
            cat = '2h Sword'
        elif cat == 'weapon_stabsword':
            cat = 'Spear'
    else:
        if cat == 'armour_hands':
            slot = 'hands'
        elif cat == 'armour_shield':
            slot = 'shield'
        else:
            # Use the wearpos value to interpret the slot
            wearpos = find("wearpos=(.*)\n", i, "")
            if wearpos == 'ring':
                slot = 'ring'
            elif wearpos == 'hands':
                slot = 'hands'
            elif wearpos == 'quiver':
                slot = 'ammo'
            elif wearpos == 'front':
                slot = 'neck'
            elif wearpos == 'lefthand':
                slot = 'weapon'

        # Non-weapons don't use a category, so we can blank it now
        cat = ''

    # Is it a two-handed weapon?
    if re.search(r"param=loadout_iteminfo,.*(\^wearpos_rhand)", i):
        is2h = True

    equipment = {
        'name': name,
        'id': 0,
        'version': '',
        'slot': slot,
        'image': '',
        'speed': int(find(r"param=attackrate,(\d*)", i, 0)),
        'category': cat,
        'bonuses': {
            'str': int(find(r"param=strengthbonus,(\d*)", i, 0)),
            'ranged_str': int(find(r"param=rangestrength,(\d*)", i, 0)),
            'magic_str': 0, # TODO: ?
            'prayer': int(find(r"param=prayerbonus,(\d*)", i, 0)),
        },
        'offensive': {
            'stab': int(find(r"param=stabattack,(\d*)", i, 0)),
            'slash': int(find(r"param=slashattack,(\d*)", i, 0)),
            'crush': int(find(r"param=crushattack,(\d*)", i, 0)),
            'magic': int(find(r"param=magicattack,(\d*)", i, 0)),
            'ranged': int(find(r"param=rangeattack,(\d*)", i, 0)),
        },
        'defensive': {
            'stab': int(find(r"param=stabdefence,(\d*)", i, 0)),
            'slash': int(find(r"param=slashdefence,(\d*)", i, 0)),
            'crush': int(find(r"param=crushdefence,(\d*)", i, 0)),
            'magic': int(find(r"param=magicdefence,(\d*)", i, 0)),
            'ranged': int(find(r"param=rangedefence,(\d*)", i, 0)),
        },
        'isTwoHanded': is2h
    }

    data.append(equipment)

print(json.dumps(data, ensure_ascii=False, indent=2))
