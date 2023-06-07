# osrs-dps-calc

Web-based DPS calculator for Old School RuneScape, created for the [OSRS Wiki](https://oldschool.runescape.wiki).

This calculator determines how well certain loadouts, consisting of equipment, prayers, and buffs, will perform against monsters in the game. It heavily uses data from the OSRS Wiki.

## Project structure
The web app is contained inside the `src/app` directory. This project uses [Next.js 13's app routing structure](https://nextjs.org/docs). We opt to use TailwindCSS heavily in this project rather than writing CSS, but there is a `src/styles/global.css` file containing some styling.

The `src/lib` directory contains the "core" code for the calculator itself. This code is heavily based on [some psuedocode](https://oldschool.runescape.wiki/w/RuneScape:Sandbox/combat_pseudocode) written collaboratively by the community.

## Scripts
The `scripts` directory contains several Python 3 scripts that are used for generating the dataset required by this appliocation.

* `generateEquipment.py` fetches applicable equipment from the OSRS Wiki and saves the output as JSON. It also downloads each equipment image to the local directory.
* `generateMonsters.py` fetches monsters from the OSRS Wiki and saves the output as JSON. It also downloads each NPC image to the local directory.

Where possible, we prefer serving images direct from the web app instead of the wiki for a few reasons. The main reason is that because the wiki can be edited by users, it is very easy for a user editing the wiki to break the functionality of this app by renaming or changing a file.

## Running locally
First, install dependencies with `yarn` (our package manager of choice). Then, run the development Next.js server running `yarn dev`.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment
This web app is written with the intention of being statically exported as HTML, and served from Google Cloud Storage. As a result, the use of some Next.js functionality such as `next/image` is avoided.

1. To build the app, run `yarn build`. It will export static HTML to the `out` directory.
2. If new monster/equipment images were added, upload the `cdn` directory to our GCS bucket. You can do this using `gsutil -m rsync -r cdn gs://dps.osrs.wiki/cdn`.
3. If you have permissions to do so, you can deploy this to our GCS bucket manually using `gsutil -m rsync -r out gs://dps.osrs.wiki/`.