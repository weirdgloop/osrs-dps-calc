"""
    Script to generate an spells.json of all combat spells on the OSRS Wiki.
    The JSON file is placed in the current working directory.
    Written for Python 3.9.
"""

import requests
import json
import urllib.parse

FILE_NAME = 'spells.json'
API_BASE = 'https://oldschool.runescape.wiki/api.php'

REQUIRED_PRINTOUTS = [
    'Max hit',
    'Spellbook',
    'Image'
]

def getSpellsData():
    spells = {}
    offset = 0
    while True:
        print('Fetching spells info: ' + str(offset))
        query = {
            'action': 'ask',
            'format': 'json',
            'query': '[[Spell type::Combat spells]]|?' + '|?'.join(REQUIRED_PRINTOUTS) + '|limit=500|offset=' + str(offset)
        }
        r = requests.get(API_BASE + '?' + urllib.parse.urlencode(query))
        data = r.json()

        if 'query' not in data or 'results' not in data['query']:
            # No results?
            break

        spells = spells | data['query']['results']

        if 'query-continue-offset' not in data or int(data['query-continue-offset']) < offset:
            # If we are at the end of the results, break out of this loop
            break
        else:
            offset = data['query-continue-offset']
    return spells

def getPrintoutValue(prop):
    # SMW printouts are all arrays, so ensure that the array is not empty
    if not prop:
        return None
    else:
        return prop[0]

def convertSpellbook(name):
    if name == 'Standard spellbook':
        return 'standard'
    elif name == 'Ancient Magicks':
        return 'ancient'
    elif name == 'Lunar spellbook':
        return 'lunar'
    elif name == 'Arceuus spellbook':
        return 'arceuus'

def main():
    # Grab the spells info using SMW, including all the relevant printouts
    wiki_data = getSpellsData()

    # Convert the data into our own JSON structure
    data = []

    # Loop over the spells data from the wiki
    for k, v in wiki_data.items():
        print('Processing ' + k)
        # Sanity check: make sure that this spell has printouts from SMW
        if 'printouts' not in v:
            print(k + ' is missing SMW printouts - skipping.')
            continue

        po = v['printouts']
        max_hit = getPrintoutValue(po['Max hit']) or 0

        # If the max_hit value is not a valid int, set it to 0
        try:
            max_hit = int(max_hit)
        except ValueError:
            max_hit = 0

        spells = {
            'name': k,
            'image': '' if not po['Image'] else po['Image'][0]['fulltext'].replace('File:', ''),
            'max_hit': max_hit,
            'spellbook': convertSpellbook(getPrintoutValue(po['Spellbook'])['fulltext'] or ''),
        }
        data.append(spells)

    print('Total spells: ' + str(len(data)))

    with open(FILE_NAME, 'w') as f:
        print('Saving to JSON at file: ' + FILE_NAME)
        json.dump(data, f, ensure_ascii=False, indent=2)


main()
