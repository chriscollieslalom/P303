# Data Model

## Tree

- `species`: scientific species name
- `commonName`: familiar name used in the interface
- `location`: typical Vancouver habitat or optional observed place
- `photo`: image associated with the tree or species
- `estimatedAge`: optional estimate, when known
- `height`: optional estimate, when known
- `description`: concise introductory species notes
- `characteristics`: visible identification clues
- `healthyAppearance`: general visible signs, not a diagnosis
- `warningSigns`: changes that may be worth monitoring
- `wildlifeConnections`: examples of habitat or seasonal relationships
- `interestingFact`: a short memorable detail

The prototype species records are stored in `src/data/trees.ts`. Unknown measurements should remain absent rather than being guessed.

## Observation

- `date`: date of the field visit
- `health`: observer's visual impression: Healthy, Monitor, or Concern
- `leafCondition`: visible leaf or needle condition
- `barkCondition`: visible bark condition
- `branchCondition`: visible branch condition
- `stressLevel`: optional observer impression
- `wildlifeActivity`: optional selections for birds, nests, pollinators, small mammals, or no activity observed
- `notes`: optional free-text field note

Observations are stored in browser local storage on the current device. They are personal notes, not verified records or professional tree-health assessments. Wildlife options are mutually exclusive with “No activity observed.”