<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { trees, treeGuidance, type Tree } from './data/trees'
import TreeSightingsMap, { type SightingPoint } from './TreeSightingsMap.vue'
import stanleyParkFallImage from '../Stanley Park in Fall.jpeg'

type View = 'explore' | 'guide' | 'profile' | 'observe' | 'history' | 'news' | 'map'
type Health = 'Healthy' | 'Monitor' | 'Concern'
type Wildlife = 'Bird activity' | 'Nest present' | 'Pollinators observed' | 'Small mammals observed' | 'No activity observed'
type Observation = {
  id: string
  treeId: string
  treeName: string
  date: string
  health: Health
  leaves: string
  bark: string
  branches: string
  wildlife: Wildlife[]
  notes: string
  location?: { lat: number; lng: number } | null
}
type StoredObservation = Omit<Observation, 'wildlife'> & { wildlife?: Wildlife[] | boolean }
type ObservationForm = Omit<Observation, 'id' | 'treeId' | 'treeName' | 'health'> & { health: Health | '' }

const storageKey = 'vancouver-tree-watch-observations'
const menuItems: { id: View; label: string; icon: string }[] = [
  { id: 'guide', label: 'Explore the Field Guide', icon: 'mdi-book-open-page-variant-outline' },
  { id: 'observe', label: 'Record an Observation', icon: 'mdi-plus-circle-outline' },
  { id: 'map', label: 'Map My Sightings', icon: 'mdi-map-outline' },
  { id: 'history', label: 'My Field Notes', icon: 'mdi-notebook-outline' },
  { id: 'news', label: 'Notes from Under the Canopy', icon: 'mdi-leaf' },
]
const healthChoices: { value: Health; hint: string }[] = [
  { value: 'Healthy', hint: 'Looks as expected' },
  { value: 'Monitor', hint: 'Something has changed' },
  { value: 'Concern', hint: 'A visible issue stood out' },
]
const wildlifeChoices: Wildlife[] = ['Bird activity', 'Nest present', 'Pollinators observed', 'Small mammals observed', 'No activity observed']
const view = ref<View>('explore')
const menuOpen = ref(false)
const query = ref('')
const filter = ref('All trees')
const treeId = ref('')
const observations = ref<Observation[]>([])
const saved = ref(false)
const savedObservation = ref<Observation | null>(null)
const locationError = ref('')
const mapSpeciesId = ref('all')
const tree = computed(() => trees.find((item) => item.id === treeId.value) ?? trees[0])
const guidance = computed(() => treeGuidance[tree.value.id])
const mapSightings = computed(() => observations.value.filter((entry) => entry.location && (mapSpeciesId.value === 'all' || entry.treeId === mapSpeciesId.value)) as (Observation & SightingPoint)[])
const filteredTrees = computed(() => trees.filter((item) => {
  const matchesQuery = `${item.name} ${item.scientific}`.toLowerCase().includes(query.value.toLowerCase())
  return matchesQuery && (filter.value === 'All trees' || item.origin === filter.value)
}))
const sortedObservations = computed(() => [...observations.value].sort((a, b) => b.date.localeCompare(a.date)))
const form = ref<ObservationForm>({
  date: new Date().toISOString().slice(0, 10),
  health: '',
  leaves: '',
  bark: '',
  branches: '',
  wildlife: [] as Wildlife[],
  notes: '',
})

type AppHistoryState = { treeWatch: true; view: View; treeId: string }

function stateFor(nextView: View): AppHistoryState {
  return { treeWatch: true, view: nextView, treeId: treeId.value }
}

function handlePopState(event: PopStateEvent) {
  const state = event.state as AppHistoryState | null
  if (state?.treeWatch) {
    view.value = state.view
    treeId.value = state.treeId
  } else {
    view.value = 'explore'
    treeId.value = trees[0].id
  }
  menuOpen.value = false
  saved.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  const currentState = history.state as AppHistoryState | null
  if (currentState?.treeWatch) {
    view.value = currentState.view
    treeId.value = currentState.treeId
  } else {
    const route = window.location.hash.slice(1) as View
    const initialView: View = ['explore', 'guide', 'profile', 'observe', 'history', 'news', 'map'].includes(route) ? route : 'explore'
    view.value = initialView
    history.replaceState(stateFor(initialView), '', `${window.location.pathname}${window.location.search}#${initialView}`)
  }
  window.addEventListener('popstate', handlePopState)

  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) ?? '[]') as StoredObservation[]
    observations.value = stored.map((entry) => ({
      ...entry,
      wildlife: Array.isArray(entry.wildlife) ? entry.wildlife : entry.wildlife ? ['Bird activity'] : [],
    }))
  } catch {
    observations.value = []
  }
})

onBeforeUnmount(() => window.removeEventListener('popstate', handlePopState))

function go(next: View) {
  if (next !== view.value) history.pushState(stateFor(next), '', `#${next}`)
  view.value = next
  saved.value = false
  menuOpen.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function openProfile(item: Tree) {
  treeId.value = item.id
  go('profile')
}

function startObservation(item?: Tree) {
  treeId.value = item?.id ?? ''
  form.value = {
    date: new Date().toISOString().slice(0, 10),
    health: '',
    leaves: '',
    bark: '',
    branches: '',
    wildlife: [],
    notes: '',
    location: null,
  }
  locationError.value = ''
  go('observe')
}

function useCurrentLocation() {
  locationError.value = ''
  if (!navigator.geolocation) {
    locationError.value = 'Location is not available in this browser.'
    return
  }

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      form.value.location = { lat: coords.latitude, lng: coords.longitude }
    },
    () => {
      locationError.value = 'We could not get your location. You can still save this note without it.'
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
  )
}

function clearLocation() {
  form.value.location = null
  locationError.value = ''
}

function toggleWildlife(option: Wildlife, checked: boolean) {
  const selected = form.value.wildlife.filter((item) => item !== 'No activity observed')
  if (option === 'No activity observed') {
    form.value.wildlife = checked ? [option] : []
    return
  }
  form.value.wildlife = checked ? [...selected, option] : selected.filter((item) => item !== option)
}

function saveObservation() {
  if (!treeId.value || !form.value.health || !form.value.leaves || !form.value.bark || !form.value.branches) return

  const entry: Observation = {
    id: String(Date.now()),
    treeId: tree.value.id,
    treeName: tree.value.name,
    ...form.value,
    health: form.value.health as Health,
  }
  observations.value = [entry, ...observations.value]
  localStorage.setItem(storageKey, JSON.stringify(observations.value))
  savedObservation.value = entry
  go('history')
  saved.value = true
}

function removeObservation(id: string) {
  observations.value = observations.value.filter((entry) => entry.id !== id)
  localStorage.setItem(storageKey, JSON.stringify(observations.value))
}

function dateLabel(date: string) {
  return new Intl.DateTimeFormat('en-CA', { dateStyle: 'long' }).format(new Date(`${date}T12:00:00`))
}
</script>

<template>
  <div class="app-shell" :class="{ 'menu-is-open': menuOpen }">
    <header class="topbar">
      <button class="menu-toggle" type="button" :aria-expanded="menuOpen" aria-controls="main-menu" :aria-label="menuOpen ? 'Close navigation menu' : 'Open navigation menu'" @click="menuOpen = !menuOpen"><span class="mdi" :class="menuOpen ? 'mdi-close' : 'mdi-menu'" aria-hidden="true"></span></button>
      <button class="brand" type="button" @click="go('explore')"><span class="brand-mark mdi mdi-leaf" aria-hidden="true"></span><span>Vancouver <strong>Tree Journal</strong></span></button>
      <button class="new-note" type="button" aria-label="Record an Observation" @click="startObservation()"><span class="mdi mdi-plus" aria-hidden="true"></span><span>Record an Observation</span></button>
      <button v-if="menuOpen" class="menu-backdrop" type="button" aria-label="Close navigation menu" @click="menuOpen = false"></button>
      <nav v-if="menuOpen" id="main-menu" class="site-menu" aria-label="Main navigation">
        <div class="menu-drawer-head"><p class="menu-label">Vancouver Tree Journal</p><button class="menu-close" type="button" aria-label="Close navigation menu" @click="menuOpen = false"><span class="close-mark" aria-hidden="true">×</span></button></div>
        <button v-for="item in menuItems" :key="item.id" type="button" :class="{ current: view === item.id || (view === 'profile' && item.id === 'guide') }" @click="item.id === 'observe' ? startObservation() : go(item.id)"><span class="mdi" :class="item.icon" aria-hidden="true"></span>{{ item.label }}<span class="mdi mdi-arrow-right menu-arrow" aria-hidden="true"></span></button>
      </nav>
    </header>

    <main>
      <section v-if="view === 'explore'" class="page">
        <div class="hero">
          <img :src="stanleyParkFallImage" alt="Autumn foliage along the Stanley Park waterfront, with boats and the Vancouver skyline" class="hero-image">
          <div class="hero-shade"></div>
          <div class="hero-copy">
            <p class="eyebrow light"><i></i>A Field Guide To The City’s Canopy</p>
            <h1>Look Closer,<br><em>Know Your Trees.</em></h1>
            <p>Meet The Remarkable Trees Growing Around Vancouver.<br>Leave A Field Note About What You Notice.</p>
            <div class="hero-actions"><button class="button light-button" type="button" @click="go('guide')">Explore the Field Guide <span class="mdi mdi-arrow-right" aria-hidden="true"></span></button><button class="button outline-button" type="button" @click="startObservation()">Record an Observation <span class="mdi mdi-plus" aria-hidden="true"></span></button></div>
          </div>
        </div>
        <div class="home content-width">
          <div class="intro-row"><div><p class="eyebrow"><i></i>Your Local Field Notes</p><h2>A City Full Of Stories<br>In Its Branches.</h2></div><p>From old-growth evergreens to spring-blooming cherries, Vancouver’s urban forest is worth getting to know. Start with a species, or record a tree you’ve just met.</p></div>
          <section class="featured"><div class="section-head"><div><p class="eyebrow">Start Exploring</p><h2>Meet A Few Neighbours</h2></div><button class="text-link" type="button" @click="go('guide')">Open Field Guide <span class="mdi mdi-arrow-right" aria-hidden="true"></span></button></div><div class="featured-grid"><button v-for="item in trees.slice(0, 3)" :key="item.id" class="featured-card" type="button" @click="openProfile(item)"><span class="photo"><img :src="item.image" :alt="item.imageAlt" loading="lazy"><span>{{ item.origin }}</span></span><span class="featured-caption"><strong>{{ item.name }}</strong><em>{{ item.scientific }}</em><small>{{ `${item.detail.split('. ')[0]}.` }}</small><i class="mdi mdi-arrow-right" aria-hidden="true"></i></span></button></div></section>
          <section class="canopy-section"><div class="canopy-art"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Tsuga_heterophylla_Stanley_Park_Vancouver.jpg/500px-Tsuga_heterophylla_Stanley_Park_Vancouver.jpg" alt="Western Hemlock in Stanley Park, Vancouver" loading="lazy"></div><div class="canopy-copy"><p class="eyebrow">A Living Neighbourhood</p><h2>A Canopy We Share</h2><p>Street and park trees cool our walks, give wildlife a place to feed and nest, and help neighbourhoods face hotter, wetter seasons. Learning each tree is one small way to care for a shared urban forest.</p><button class="text-link" type="button" @click="go('news')">Explore Why Trees Matter <span class="mdi mdi-arrow-right" aria-hidden="true"></span></button></div></section>
          <section class="news-widget"><div class="news-widget-image"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Cerisier_du_Japon_Prunus_serrulata.jpg/960px-Cerisier_du_Japon_Prunus_serrulata.jpg" alt="Japanese cherry blossoms in the Jardin des Plantes, Paris" loading="lazy"><small>VANCOUVER / CITY RESOURCE</small></div><div class="news-widget-copy"><p class="eyebrow">Vancouver / Local Tree Resource</p><h2>How The City’s Trees Are Cared For</h2><p>Learn about Vancouver’s urban forest and the programs that support it. Vancouver Tree Journal is an independent educational prototype, not a City service.</p><a class="text-link" href="https://vancouver.ca/home-property-development/urban-forestry.aspx" target="_blank" rel="noreferrer">Read Vancouver’s Urban Forestry Overview <span class="mdi mdi-arrow-right" aria-hidden="true"></span></a></div></section>
        </div>
      </section>

      <section v-else-if="view === 'guide'" class="content-width inner-page">
        <div class="page-title"><p class="eyebrow"><i></i>Vancouver Field Guide</p><h1>Get To Know<br><em>Who’s Growing Here.</em></h1><p>Ten Familiar Trees To Look For On Your Next Walk. Start With A Name, Then Follow The Details Outdoors.</p></div>
        <div class="guide-tools"><label class="search"><span class="mdi mdi-magnify" aria-hidden="true"></span><span class="sr-only">Search species</span><input v-model="query" type="search" placeholder="Search tree species"></label><div class="filters"><button v-for="option in ['All trees', 'Native', 'Introduced']" :key="option" type="button" :class="{ active: filter === option }" @click="filter = option">{{ option }}</button></div></div>
        <p class="count">{{ filteredTrees.length }} species <span>·</span> Explore at your own pace</p>
        <div v-if="filteredTrees.length" class="tree-grid"><button v-for="(item, index) in filteredTrees" :key="item.id" class="tree-card" type="button" @click="openProfile(item)"><span class="tree-photo"><img :src="item.image" :alt="item.imageAlt" loading="lazy"><i>{{ String(index + 1).padStart(2, '0') }}</i></span><span class="tree-info"><small>{{ item.id === 'windmill-palm' ? 'Discovery species' : `${item.origin} · Species profile` }}</small><strong>{{ item.name }}</strong><em>{{ item.scientific }}</em><span>{{ item.clue }}</span><b>Open profile <i class="mdi mdi-arrow-right" aria-hidden="true"></i></b></span></button></div>
        <div v-else class="empty"><span class="mdi mdi-leaf-off" aria-hidden="true"></span><h2>No trees found</h2><button class="text-link" type="button" @click="query = ''; filter = 'All trees'">Reset search</button></div>
        <details class="image-credits"><summary>Photo credits and licenses</summary><ul><li><span>Stanley Park aerial photo: Tawker / Wikimedia Commons.</span> <a href="https://commons.wikimedia.org/wiki/File:Vancouver_from_Air_Stanley_Park.jpg" target="_blank" rel="noreferrer">Source</a> · <a href="https://creativecommons.org/licenses/by-sa/3.0/deed.en" target="_blank" rel="noreferrer">CC BY-SA 3.0</a></li><li><span>Stanley Park Hemlock photo: abdallahh / Wikimedia Commons.</span> <a href="https://commons.wikimedia.org/wiki/File:Tsuga_heterophylla_Stanley_Park_Vancouver.jpg" target="_blank" rel="noreferrer">Source</a> · <a href="https://creativecommons.org/licenses/by/2.0/deed.en" target="_blank" rel="noreferrer">CC BY 2.0</a></li><li><span>Cherry blossom photo: Myrabella / Wikimedia Commons.</span> <a href="https://commons.wikimedia.org/wiki/File:Cerisier_du_Japon_Prunus_serrulata.jpg" target="_blank" rel="noreferrer">Source</a> · <a href="https://creativecommons.org/licenses/by-sa/3.0/deed.en" target="_blank" rel="noreferrer">CC BY-SA 3.0</a></li><li v-for="item in trees" :key="item.id"><span>{{ item.name }} photo: {{ item.imageCredit }}.</span> <a :href="item.imageCreditUrl" target="_blank" rel="noreferrer">Source</a> · <a :href="item.imageLicenseUrl" target="_blank" rel="noreferrer">License</a></li></ul></details>
        <p class="disclaimer">Species notes are introductory and intended for learning. They are not a formal identification service.</p>
      </section>

      <section v-else-if="view === 'profile'" class="page">
        <div class="profile-hero"><img :src="tree.image" :alt="tree.imageAlt"><div></div><button class="back" type="button" @click="go('guide')"><span class="mdi mdi-arrow-left" aria-hidden="true"></span> Field Guide</button><div class="profile-heading"><small>{{ tree.id === 'windmill-palm' ? 'Vancouver Discovery' : `${tree.origin} Species` }}</small><h1>{{ tree.name }}</h1><em>{{ tree.scientific }}</em></div></div>
        <div class="profile-layout content-width"><div><p class="eyebrow"><i></i>Get To Know This Tree</p><h2>A Familiar Part<br>Of The Neighbourhood.</h2><p class="description">{{ tree.detail }}</p><button class="button green-button" type="button" @click="startObservation(tree)"><span class="mdi mdi-plus" aria-hidden="true"></span> Record an Observation</button></div><aside class="facts"><div><span class="mdi mdi-map-outline" aria-hidden="true"></span><small>Typical Vancouver Locations</small><p>{{ guidance.locations }}</p></div><div><span class="mdi mdi-calendar-blank-outline" aria-hidden="true"></span><small>Seasonal Clues</small><p>{{ tree.season }}</p></div><div><span class="mdi mdi-leaf-maple" aria-hidden="true"></span><small>Origin</small><p>{{ tree.origin }} To The Vancouver Region</p></div></aside></div>
        <div class="profile-guide-grid content-width"><article><span class="mdi mdi-eye-outline" aria-hidden="true"></span><h2>Characteristics</h2><p>{{ tree.clue }}</p></article><article><span class="mdi mdi-leaf-circle-outline" aria-hidden="true"></span><h2>What Healthy Looks Like</h2><p>{{ guidance.healthy }}</p></article><article><span class="mdi mdi-alert-circle-outline" aria-hidden="true"></span><h2>When To Take A Closer Look</h2><p>{{ guidance.warning }}</p></article><article><span class="mdi mdi-bird" aria-hidden="true"></span><h2>Wildlife Connections</h2><p>{{ guidance.wildlife }}</p></article></div>
        <aside class="fact-note content-width"><span class="mdi mdi-lightbulb-on-outline" aria-hidden="true"></span><div><small>{{ tree.id === 'windmill-palm' ? 'A Vancouver discovery' : 'A detail to remember' }}</small><p>{{ guidance.fact }}</p></div></aside>
        <p class="profile-note content-width"><span class="mdi mdi-information-outline" aria-hidden="true"></span><span>Field observations are not a professional diagnosis. Compare several features and observe from a safe distance. Photo: <a :href="tree.imageCreditUrl" target="_blank" rel="noreferrer">{{ tree.imageCredit }}</a>, under <a :href="tree.imageLicenseUrl" target="_blank" rel="noreferrer">its listed license</a>.</span></p>
      </section>

      <section v-else-if="view === 'observe'" class="content-width observe-layout">
        <div class="form-intro"><button class="back-text" type="button" @click="go(treeId ? 'profile' : 'explore')"><span class="mdi mdi-arrow-left" aria-hidden="true"></span> Back to {{ treeId ? tree.name : 'Explore' }}</button><p class="eyebrow"><i></i>Field note</p><h1>Take a moment<br><em>to notice.</em></h1><p>A quick snapshot of what you see. No special expertise needed; your notes stay on this device.</p></div>
        <form class="observation-form" @submit.prevent="saveObservation">
          <div class="form-step"><b>01</b><span><strong>What did you visit?</strong><small>Choose the closest match</small></span></div>
          <label for="species">Tree species</label>
          <select id="species" v-model="treeId" class="control" required>
            <option value="" disabled>Choose a species</option>
            <option v-for="item in trees" :key="item.id" :value="item.id">{{ item.name }}</option>
          </select>
          <hr>
          <div class="form-step"><b>02</b><span><strong>What do you notice?</strong><small>Choose what seems closest</small></span></div>
          <label for="visit-date">Date of visit</label>
          <input id="visit-date" v-model="form.date" class="control" type="date" required>
          <fieldset>
            <legend>Overall, this tree looks…</legend>
            <div class="radio-row">
              <label v-for="choice in healthChoices" :key="choice.value">
                <input v-model="form.health" type="radio" name="health" :value="choice.value" required>
                <span><strong>{{ choice.value }}</strong><small>{{ choice.hint }}</small></span>
              </label>
            </div>
          </fieldset>
          <div class="condition-grid">
            <label for="leaves">Leaves or needles
              <select id="leaves" v-model="form.leaves" class="control" required>
                <option value="" disabled>Choose a condition</option>
                <option>Typical for the season</option><option>Some discoloration</option><option>Wilting or sparse</option><option>Not visible / not applicable</option>
              </select>
            </label>
            <label for="bark">Bark
              <select id="bark" v-model="form.bark" class="control" required>
                <option value="" disabled>Choose a condition</option>
                <option>Looks typical</option><option>Some damage</option><option>Cracks or peeling</option><option>Not visible</option>
              </select>
            </label>
            <label for="branches">Branches
              <select id="branches" v-model="form.branches" class="control" required>
                <option value="" disabled>Choose a condition</option>
                <option>No concerns noticed</option><option>Dead branches visible</option><option>Broken or hanging branch</option><option>Not visible</option>
              </select>
            </label>
          </div>
          <fieldset class="wildlife-fieldset"><legend>Any wildlife nearby? <small>Optional</small></legend><div class="wildlife-grid"><label v-for="option in wildlifeChoices" :key="option"><input type="checkbox" :checked="form.wildlife.includes(option)" @change="toggleWildlife(option, ($event.target as HTMLInputElement).checked)"><span>{{ option }}</span></label></div></fieldset>
          <fieldset class="location-fieldset"><legend>Save where you saw it? <small>Optional</small></legend><p>Your coordinates stay in this browser and help place your note on your private sightings map.</p><button v-if="!form.location" class="location-button" type="button" @click="useCurrentLocation"><span class="mdi mdi-crosshairs-gps" aria-hidden="true"></span> Add my current location</button><div v-else class="location-confirm"><span class="mdi mdi-map-marker-check-outline" aria-hidden="true"></span><span>Location added to this field note</span><button type="button" @click="clearLocation">Remove</button></div><small v-if="locationError" class="location-error" role="status">{{ locationError }}</small></fieldset>
          <label for="notes">Anything else you noticed? <small class="optional">Optional</small><textarea id="notes" v-model="form.notes" class="control notes" maxlength="400" placeholder="A detail worth remembering…"></textarea><small class="char-count">{{ form.notes.length }} / 400</small></label>
          <p class="reminder"><span class="mdi mdi-hand-heart-outline" aria-hidden="true"></span>Just notice what you can see. This is a personal field note, not a professional health assessment.</p>
          <button class="button green-button submit" type="submit">Save field note <span class="mdi mdi-arrow-right" aria-hidden="true"></span></button>
        </form>
      </section>

      <section v-else-if="view === 'history'" class="content-width inner-page"><div class="page-title"><p class="eyebrow"><i></i>Your field notes</p><h1>Small things<br><em>worth remembering.</em></h1><p>Your observations are saved in this browser on this device.</p></div><div v-if="saved" class="saved" role="status"><span class="mdi mdi-check-circle-outline" aria-hidden="true"></span><div><strong>Your field note is saved on this device.</strong><span>{{ savedObservation?.location ? 'Your sighting is ready to view on your map.' : 'You can explore its species profile or record another tree.' }}</span></div><div class="saved-actions"><button v-if="savedObservation?.location" class="text-link" type="button" @click="mapSpeciesId = savedObservation?.treeId ?? 'all'; go('map')">View this sighting on the map <span class="mdi mdi-arrow-right" aria-hidden="true"></span></button><button class="text-link" type="button" @click="openProfile(trees.find(item => item.id === savedObservation?.treeId) ?? trees[0])">Continue to {{ savedObservation?.treeName }} <span class="mdi mdi-arrow-right" aria-hidden="true"></span></button><button class="text-link" type="button" @click="startObservation()">Record another observation <span class="mdi mdi-plus" aria-hidden="true"></span></button></div></div><div v-if="sortedObservations.length" class="history-list"><article v-for="entry in sortedObservations" :key="entry.id" class="observation"><div class="obs-date"><span class="mdi mdi-calendar-month-outline" aria-hidden="true"></span>{{ dateLabel(entry.date) }}</div><div class="obs-content"><div class="obs-head"><div><small>{{ entry.health }}</small><h2>{{ entry.treeName }}</h2></div><button class="delete" type="button" :aria-label="`Delete observation for ${entry.treeName}`" @click="removeObservation(entry.id)"><span class="mdi mdi-trash-can-outline" aria-hidden="true"></span></button></div><div class="obs-details"><span><small>Leaves / needles</small>{{ entry.leaves }}</span><span><small>Bark</small>{{ entry.bark }}</span><span><small>Branches</small>{{ entry.branches }}</span></div><p v-if="entry.location" class="sighting-location"><span class="mdi mdi-map-marker-outline" aria-hidden="true"></span> Location saved to your private map</p><p v-if="entry.notes" class="obs-note">“{{ entry.notes }}”</p><ul v-if="entry.wildlife.length" class="wildlife-tags"><li v-for="activity in entry.wildlife" :key="activity">{{ activity }}</li></ul></div></article></div><div v-else class="empty-history"><span class="mdi mdi-notebook-outline" aria-hidden="true"></span><p class="eyebrow">A page ready for you</p><h2>Your first field note<br>starts with a walk.</h2><p>Choose a tree you know, or learn about a new one before you visit.</p><button class="button green-button" type="button" @click="go('guide')">Explore the Field Guide <span class="mdi mdi-arrow-right" aria-hidden="true"></span></button></div><p class="disclaimer">Observations are saved only in this browser. They are not submitted to the City of Vancouver or any other service.</p></section>

      <section v-else-if="view === 'map'" class="content-width inner-page map-page"><div class="page-title"><p class="eyebrow"><i></i>Your private sightings</p><h1>Trees you’ve<br><em>stopped to notice.</em></h1><p>Explore the places you added to your own field notes. Only location-tagged observations from this browser appear here.</p></div><div class="map-tools"><label for="map-species">Show species</label><select id="map-species" v-model="mapSpeciesId" class="control"><option value="all">All trees</option><option v-for="item in trees" :key="item.id" :value="item.id">{{ item.name }}</option></select><span>{{ mapSightings.length }} saved {{ mapSightings.length === 1 ? 'sighting' : 'sightings' }}</span></div><div class="map-frame"><TreeSightingsMap :sightings="mapSightings" /><div v-if="!mapSightings.length" class="map-empty"><span class="mdi mdi-map-marker-plus-outline" aria-hidden="true"></span><strong>No mapped notes yet</strong><span>Add your location when you record an observation to see that sighting here.</span><button class="button green-button" type="button" @click="startObservation()">Record an Observation <span class="mdi mdi-arrow-right" aria-hidden="true"></span></button></div></div><p class="map-disclaimer"><span class="mdi mdi-lock-outline" aria-hidden="true"></span>These are your own saved sightings, not a public tree inventory. Your coordinates stay on this device. Map tiles require an internet connection and are provided by OpenStreetMap.</p></section>

      <section v-else class="content-width inner-page"><div class="page-title"><p class="eyebrow"><i></i>Around the urban forest</p><h1>Notes from<br><em>under the canopy.</em></h1><p>Vancouver's urban forest is a shared living system. A little attention helps us notice what it gives back.</p></div><article class="field-note"><img src="https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1000&q=80" alt="Sunlight catching leaves in a green canopy" loading="lazy"><div><p class="eyebrow">A practice of noticing</p><h2>Small trees make a big difference.</h2><p>Canopy shade can make a summer walk gentler. Trees offer food and shelter for wildlife, link green spaces, and help neighbourhoods adapt to heat and heavy rain. That living network is looked after one place and one season at a time.</p><button class="button green-button" type="button" @click="go('guide')">Meet the trees <span class="mdi mdi-arrow-right" aria-hidden="true"></span></button></div></article><div class="stewardship-grid"><article><span class="mdi mdi-weather-sunny" aria-hidden="true"></span><h2>Comfort</h2><p>Shade makes streets and gathering places more welcoming on warm days.</p></article><article><span class="mdi mdi-paw" aria-hidden="true"></span><h2>Habitat</h2><p>Branches, flowers, and bark support birds, pollinators, and other urban wildlife.</p></article><article><span class="mdi mdi-weather-windy" aria-hidden="true"></span><h2>Resilience</h2><p>A diverse canopy helps communities live with a changing climate.</p></article><article><span class="mdi mdi-hand-heart-outline" aria-hidden="true"></span><h2>Stewardship</h2><p>Noticing seasonal changes is one way to feel part of a shared urban forest.</p></article></div><details class="image-credits"><summary>Photo credits and licenses</summary><ul><li v-for="item in trees" :key="item.id"><span>{{ item.name }} photo: {{ item.imageCredit }}.</span> <a :href="item.imageCreditUrl" target="_blank" rel="noreferrer">Source</a> · <a :href="item.imageLicenseUrl" target="_blank" rel="noreferrer">License</a></li></ul></details><p class="disclaimer">Vancouver Tree Journal is an independent educational prototype, not a City of Vancouver or Parks Board service.</p></section>
    </main>

    <footer class="footer"><strong><span class="mdi mdi-leaf" aria-hidden="true"></span> Vancouver Tree Journal</strong><span>An Independent Learning Prototype</span><button type="button" @click="go('news')">About This Project <span class="mdi mdi-arrow-right" aria-hidden="true"></span></button><span class="place footer-place"><span class="mdi mdi-map-marker-outline" aria-hidden="true"></span> Vancouver, BC</span></footer>
  </div>
</template>