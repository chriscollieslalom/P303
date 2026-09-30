export type Tree = {
  id: string
  name: string
  scientific: string
  origin: 'Native' | 'Introduced'
  detail: string
  clue: string
  habitat: string
  season: string
  image: string
  imageAlt: string
  imageCredit?: string
  imageCreditUrl?: string
  imageLicenseUrl?: string
}

const commons = 'https://commons.wikimedia.org/wiki/File:'
const license = (version: string) => `https://creativecommons.org/licenses/${version}/deed.en`

export const trees: Tree[] = [
  { id: 'douglas-fir', name: 'Douglas Fir', scientific: 'Pseudotsuga menziesii', origin: 'Native', detail: 'A towering evergreen and one of the defining trees of coastal British Columbia. Look for furrowed bark and soft needles arranged around the twig.', clue: 'Pointed buds and cones with three-pronged bracts between the scales.', habitat: 'Forests, parks, and large gardens across the region.', season: 'Evergreen; cones mature in late summer.', image: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Mature_Douglas_Fir_-_geograph.org.uk_-_902266.jpg', imageAlt: 'Mature Douglas Fir in Loch Ard Forest', imageCredit: 'Adam Ward / Wikimedia Commons', imageCreditUrl: `${commons}Mature_Douglas_Fir_-_geograph.org.uk_-_902266.jpg`, imageLicenseUrl: license('by-sa/2.0') },
  { id: 'western-red-cedar', name: 'Western Red Cedar', scientific: 'Thuja plicata', origin: 'Native', detail: 'A long-lived coastal conifer with drooping branches and aromatic, scale-like foliage. It has deep cultural significance to many Indigenous peoples of the Northwest Coast.', clue: 'Flat sprays of overlapping scale leaves and stringy reddish-brown bark.', habitat: 'Moist forests, ravines, and shaded parks.', season: 'Evergreen; small cones appear in spring.', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Thuja_plicata_Vancouver.jpg/500px-Thuja_plicata_Vancouver.jpg', imageAlt: 'Western Red Cedar growing in Vancouver', imageCredit: 'abdallahh / Wikimedia Commons', imageCreditUrl: `${commons}Thuja_plicata_Vancouver.jpg`, imageLicenseUrl: license('by/2.0') },
  { id: 'bigleaf-maple', name: 'Bigleaf Maple', scientific: 'Acer macrophyllum', origin: 'Native', detail: 'A broad-canopied deciduous tree with exceptionally large leaves. In autumn, its leaves turn golden and its branches often carry soft gardens of moss.', clue: 'Five-lobed leaves can grow wider than a dinner plate.', habitat: 'Lowland forests, stream edges, and open parks.', season: 'Leaves emerge in spring and turn gold in autumn.', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Acer_macrophyllum_2.jpg/500px-Acer_macrophyllum_2.jpg', imageAlt: 'Bigleaf Maple in flower in Washington State', imageCredit: 'Thayne Tuason / Wikimedia Commons', imageCreditUrl: `${commons}Acer_macrophyllum_2.jpg`, imageLicenseUrl: license('by-sa/4.0') },
  { id: 'arbutus', name: 'Arbutus', scientific: 'Arbutus menziesii', origin: 'Native', detail: 'Vancouver’s only native broadleaf evergreen. Its smooth, cinnamon-red bark peels away to reveal fresh green wood.', clue: 'Twisting branches, evergreen leaves, and peeling red-orange bark.', habitat: 'Sunny, rocky slopes near the coast.', season: 'White flowers in spring; red berries in autumn.', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Arbutus_menziesii_5822.JPG/500px-Arbutus_menziesii_5822.JPG', imageAlt: 'Pacific Madrone with distinctive branching and evergreen leaves', imageCredit: 'Walter Siegmund / Wikimedia Commons', imageCreditUrl: `${commons}Arbutus_menziesii_5822.JPG`, imageLicenseUrl: license('by-sa/3.0') },
  { id: 'sitka-spruce', name: 'Sitka Spruce', scientific: 'Picea sitchensis', origin: 'Native', detail: 'A large coastal spruce with stiff, sharply pointed needles. Its natural range follows the Pacific shoreline.', clue: 'Sharp needles grow all around the twig.', habitat: 'Coastal forests and exposed, moist sites.', season: 'Evergreen; long cones mature in autumn.', image: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Picea_sitchensis_-_geograph.org.uk_-_1028204.jpg', imageAlt: 'Mature Sitka Spruce tree', imageCredit: 'Richard Webb / Wikimedia Commons', imageCreditUrl: `${commons}Picea_sitchensis_-_geograph.org.uk_-_1028204.jpg`, imageLicenseUrl: license('by-sa/2.0') },
  { id: 'western-hemlock', name: 'Western Hemlock', scientific: 'Tsuga heterophylla', origin: 'Native', detail: 'A graceful forest conifer with a slender, drooping leader and soft needles of different lengths.', clue: 'Look for a drooping top and tiny cones near branch tips.', habitat: 'Cool, shaded, moist forests.', season: 'Evergreen; small cones persist through winter.', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Tsuga_heterophylla_Stanley_Park_Vancouver.jpg/500px-Tsuga_heterophylla_Stanley_Park_Vancouver.jpg', imageAlt: 'Western Hemlock growing in Stanley Park, Vancouver', imageCredit: 'abdallahh / Wikimedia Commons', imageCreditUrl: `${commons}Tsuga_heterophylla_Stanley_Park_Vancouver.jpg`, imageLicenseUrl: license('by/2.0') },
  { id: 'cherry', name: 'Cherry Tree', scientific: 'Prunus serrulata and related species', origin: 'Introduced', detail: 'Flowering cherries bring a brief wash of blossoms to Vancouver streets each spring. Many varieties are planted as ornamentals.', clue: 'Showy spring blossoms and small horizontal lines on the bark.', habitat: 'Residential streets, gardens, and neighbourhood parks.', season: 'Blooms from late winter through spring, depending on variety.', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Cerisier_du_Japon_Prunus_serrulata.jpg/960px-Cerisier_du_Japon_Prunus_serrulata.jpg', imageAlt: 'Japanese Cherry Kanzan in full bloom', imageCredit: 'Myrabella / Wikimedia Commons', imageCreditUrl: `${commons}Cerisier_du_Japon_Prunus_serrulata.jpg`, imageLicenseUrl: license('by-sa/3.0') },
  { id: 'japanese-maple', name: 'Japanese Maple', scientific: 'Acer palmatum', origin: 'Introduced', detail: 'A small ornamental tree valued for delicate, hand-shaped leaves and sculptural branching. Leaf colours range from fresh green to deep red.', clue: 'Small leaves with five to nine pointed lobes.', habitat: 'Gardens, courtyards, and sheltered urban spaces.', season: 'Leaves often turn vivid red or orange in autumn.', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Portland_Japanese_Garden_maple.jpg/960px-Portland_Japanese_Garden_maple.jpg', imageAlt: 'Japanese Maple in the Portland Japanese Garden', imageCredit: 'Jeremy Reding / Wikimedia Commons', imageCreditUrl: `${commons}Portland_Japanese_Garden_maple.jpg`, imageLicenseUrl: license('by-sa/2.0') },
  { id: 'london-plane', name: 'London Plane', scientific: 'Platanus × acerifolia', origin: 'Introduced', detail: 'A resilient shade tree often planted along city streets. Its mottled bark flakes away in patches, revealing cream, olive, and grey beneath.', clue: 'Maple-like leaves and patchwork bark in pale colours.', habitat: 'Urban streets, plazas, and open parks.', season: 'Deciduous; round seed balls often remain through winter.', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/London_planetree_%28Platanus_%C3%97_acerifolia%29%2C_Jardim_do_Campo_Pequeno%2C_Lisbon%2C_Portugal_julesvernex2.jpg/960px-London_planetree_%28Platanus_%C3%97_acerifolia%29%2C_Jardim_do_Campo_Pequeno%2C_Lisbon%2C_Portugal_julesvernex2.jpg', imageAlt: 'London Plane tree in a Lisbon garden', imageCredit: 'Jules Verne Times Two / Wikimedia Commons', imageCreditUrl: `${commons}London_planetree_(Platanus_%C3%97_acerifolia),_Jardim_do_Campo_Pequeno,_Lisbon,_Portugal_julesvernex2.jpg`, imageLicenseUrl: license('by-sa/4.0') },
  { id: 'windmill-palm', name: 'Windmill Palm', scientific: 'Trachycarpus fortunei', origin: 'Introduced', detail: 'A fan-leaved palm that tolerates cooler weather than most palms. It is an unmistakable sight in select Vancouver neighbourhoods.', clue: 'Large fan-shaped leaves and a trunk covered in coarse fibres.', habitat: 'Sheltered gardens and mild urban microclimates.', season: 'Evergreen; flowers in summer on mature trees.', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Fruiting_windmill_palm_tree_with_seeds_in_Vancouver%2C_Canada.jpg/500px-Fruiting_windmill_palm_tree_with_seeds_in_Vancouver%2C_Canada.jpg', imageAlt: 'Fruiting Windmill Palm photographed in Vancouver', imageCredit: 'Blake Handley / Wikimedia Commons', imageCreditUrl: `${commons}Fruiting_windmill_palm_tree_with_seeds_in_Vancouver,_Canada.jpg`, imageLicenseUrl: license('by/2.0') },
]

export const treeGuidance: Record<string, {
  locations: string
  healthy: string
  warning: string
  wildlife: string
  fact: string
}> = {
  'douglas-fir': {
    locations: 'Larger parks, forest edges, and spacious gardens.',
    healthy: 'A full crown of green needles and sturdy branches are common signs of a thriving tree.',
    warning: 'Look for sudden large areas of brown needles, broken limbs, or fresh trunk damage.',
    wildlife: 'Cones and evergreen cover offer food and shelter for birds and small mammals.',
    fact: 'Douglas Fir is not a true fir; its scientific name honours botanist David Douglas.',
  },
  'western-red-cedar': {
    locations: 'Moist, shaded parks, ravines, and established gardens.',
    healthy: 'Look for green, flat sprays of foliage and a crown with a balanced shape.',
    warning: 'Widespread browning, a sudden loss of foliage, or large broken limbs may be worth noting.',
    wildlife: 'Dense branches provide nesting cover, while seeds and foliage support local wildlife.',
    fact: 'Western Red Cedar is culturally important to many Indigenous peoples of the Northwest Coast.',
  },
  'bigleaf-maple': {
    locations: 'Open parks, stream edges, and leafy neighbourhood streets.',
    healthy: 'Leaves usually form a broad, leafy crown in season; moss on bark can be a normal feature.',
    warning: 'Note widespread early leaf loss, many bare branches, or major cracks in the trunk.',
    wildlife: 'Spring flowers feed pollinators, and mossy branches create habitat for small forest life.',
    fact: 'Its leaves are the largest of any maple native to North America.',
  },
  arbutus: {
    locations: 'Sunny, rocky coastal slopes and warm, well-drained sites.',
    healthy: 'Its evergreen leaves and naturally peeling, red-toned bark are distinctive features, not damage.',
    warning: 'Look for sudden widespread leaf browning, broken limbs, or fresh wounds.',
    wildlife: 'Spring flowers attract pollinators; its berries are food for birds.',
    fact: 'Arbutus is Vancouver’s only native broadleaf evergreen tree.',
  },
  'sitka-spruce': {
    locations: 'Coastal parks, open damp ground, and large gardens.',
    healthy: 'A healthy-looking spruce has a full evergreen crown and firm, sharp needles.',
    warning: 'Note large bare patches, extensive needle browning, or hanging broken branches.',
    wildlife: 'The canopy offers shelter, while cones provide seeds for birds and small mammals.',
    fact: 'Sitka Spruce grows naturally along a long stretch of the Pacific coast.',
  },
  'western-hemlock': {
    locations: 'Shaded parks, forested slopes, and cool, moist gardens.',
    healthy: 'A soft green crown and a naturally drooping top are typical features.',
    warning: 'Look for sudden widespread needle loss, dead branch clusters, or trunk damage.',
    wildlife: 'Small cones and dense cover support birds and other forest wildlife.',
    fact: 'Western Hemlock is highly shade-tolerant when young.',
  },
  cherry: {
    locations: 'Residential streets, small parks, and planted boulevards.',
    healthy: 'In season, look for a leafy crown and blossoms typical of the variety and time of year.',
    warning: 'Note large dead branches, extensive bark wounds, or an unusual early loss of leaves.',
    wildlife: 'Blossoms attract pollinators, and fruit can feed birds and small mammals.',
    fact: 'Vancouver’s spring cherry blossoms are celebrated across many neighbourhoods.',
  },
  'japanese-maple': {
    locations: 'Sheltered gardens, courtyards, and quiet neighbourhood corners.',
    healthy: 'A balanced shape and leaves with colour typical of the variety and season are usual signs.',
    warning: 'Look for sudden widespread leaf scorch, broken limbs, or fresh trunk damage.',
    wildlife: 'Small flowers can attract insects, and its branches offer cover for garden birds.',
    fact: 'There are many cultivated varieties with different leaf shapes and colours.',
  },
  'london-plane': {
    locations: 'Broad streets, plazas, and open neighbourhood parks.',
    healthy: 'Patchy, peeling bark is a normal feature; look for a full crown in leaf season.',
    warning: 'Note major broken limbs, large fresh wounds, or widespread early leaf loss.',
    wildlife: 'Mature trees provide shade and nesting cover in busy urban places.',
    fact: 'Its mottled bark helps distinguish it from many other city shade trees.',
  },
  'windmill-palm': {
    locations: 'Sheltered residential gardens and warm urban pockets.',
    healthy: 'A green crown of fan-shaped leaves and a firm trunk are typical features.',
    warning: 'Look for a sudden loss of most leaves, severe trunk damage, or a leaning crown.',
    wildlife: 'Summer flowers can attract pollinators, and dense leaves provide a perch for birds.',
    fact: 'This cold-tolerant palm thrives in Vancouver’s mild coastal climate and reflects local gardeners’ curiosity.',
  },
}