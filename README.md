# Vancouver Tree Journal

A mobile-first Protogen P303 experience for exploring Vancouver trees, learning to recognize local species, and keeping personal field observations.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with `npm run build`.

## Project notes

- `BRIEF.md` and `PLAN.md` describe the audience, core journey, and MVP.
- `docs/TREE-SPECIES-GUIDE.md` contains introductory species notes.
- `docs/DATA-MODEL.md` describes tree and observation records.
- `docs/DATA-SOURCES.md` records the prototype data approach and future source options.
- Observations are stored in browser local storage on the current device. They are not uploaded or synced.
- Location is optional and only requested after the user taps the location control. Mapped markers are the user's own saved notes, not an official tree inventory.
- Species photographs are individually credited in the Field Guide. Their linked Creative Commons licenses remain with each image credit.

Vancouver Tree Journal is an independent educational prototype and is not affiliated with or endorsed by the City of Vancouver.