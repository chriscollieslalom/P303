# Data Sources

The initial build uses local species content in `src/data/trees.ts`. Species photos are individual tree/species photographs from Wikimedia Commons. See the Field Guide's photo credits for each creator, source page, and Creative Commons license. The Stanley Park aerial is by Tawker via Wikimedia Commons (CC BY-SA 3.0). The Stanley Park Hemlock photo is by abdallahh (CC BY 2.0), and the cherry blossom photo is by Myrabella (CC BY-SA 3.0); their source pages and licenses are listed in the Field Guide credits.

The Sitka Spruce photo is by Richard Webb via Wikimedia Commons (CC BY-SA 2.0). The Windmill Palm photo is by Blake Handley, taken in Vancouver, via Wikimedia Commons (CC BY 2.0). Both are linked from the Field Guide photo credits.

Optional observation coordinates are requested only after a user taps “Add my current location.” Coordinates and notes stay in that browser's local storage and appear only on that user's sightings map. The map uses OpenStreetMap tiles, which require an internet connection. Vancouver Tree Journal does not currently load a City tree inventory; map markers represent the user's own saved field notes, not verified municipal records.

Potential future sources include:

- Vancouver Park Board information
- City of Vancouver urban forest resources
- Public open-data sources

Before integrating a source, confirm its reuse terms, attribution requirements, update schedule, and suitability for public-facing tree identification. Clearly label source and observation dates where relevant. Do not imply official affiliation or treat community observations as professional assessments.

The City open-data route checked for a street-tree inventory was unavailable at the time of implementation. Do not invent individual tree locations or imply that map sample notes are an official inventory. Recheck the current City open-data catalog before integrating verified tree coordinates.