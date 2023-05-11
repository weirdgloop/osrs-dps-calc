# osrs-dps-calc

Web-based DPS calculator for Old School RuneScape, created for the [OSRS Wiki](https://oldschool.runescape.wiki).

This calculator determines how well certain loadouts, consisting of equipment, prayers, and buffs, will perform against monsters in the game. It heavily uses data from the OSRS Wiki, including JSON files containing monster and equipment data.

## Structure
The `scripts` directory contains several Python 3 scripts that are used for parsing the OSRS Wiki's data and outputting it as JSON for this web app to use.

The actual web app is contained inside the `src/app` directory. This project uses [Next.js 13's app routing structure](https://nextjs.org/docs). We opt to use TailwindCSS heavily in this project rather than writing CSS, but there is a `src/styles/global.css` file containing some styling.

The `src/lib` directory contains the "core" code for the calculator itself. This code is heavily based on [some psuedocode](https://oldschool.runescape.wiki/w/RuneScape:Sandbox/combat_pseudocode) written collaboratively by the community.


## Running locally

First, install dependencies with `yarn` (our package manager of choice). Then, run the development Next.js server using `yarn dev`.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
