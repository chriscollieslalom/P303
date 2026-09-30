<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export type SightingPoint = {
  id: string
  treeName: string
  date: string
  location?: { lat: number; lng: number } | null
}

const props = defineProps<{ sightings: SightingPoint[] }>()
const mapElement = ref<HTMLElement | null>(null)
let map: L.Map | undefined
let markerLayer: L.LayerGroup | undefined
let resizeFrame = 0

function drawMarkers() {
  if (!map || !markerLayer) return

  markerLayer.clearLayers()
  const points: L.LatLng[] = []
  for (const sighting of props.sightings) {
    if (!sighting.location) continue

    points.push(L.latLng(sighting.location.lat, sighting.location.lng))
    const icon = L.divIcon({
      className: 'tree-map-marker-wrap',
      html: '<span class="tree-map-marker"><span class="mdi mdi-leaf"></span></span>',
      iconSize: [34, 42],
      iconAnchor: [17, 40],
      popupAnchor: [0, -37],
    })
    const popup = document.createElement('div')
    const title = document.createElement('strong')
    const date = document.createElement('span')
    title.textContent = sighting.treeName
    date.textContent = new Intl.DateTimeFormat('en-CA', { dateStyle: 'medium' }).format(new Date(`${sighting.date}T12:00:00`))
    popup.append(title, date)
    L.marker([sighting.location.lat, sighting.location.lng], { icon }).addTo(markerLayer).bindPopup(popup)
  }

  if (points.length) map.fitBounds(L.latLngBounds(points).pad(0.15), { maxZoom: 15 })
}

onMounted(() => {
  if (!mapElement.value) return

  map = L.map(mapElement.value, { zoomControl: false, scrollWheelZoom: false }).setView([49.26, -123.12], 11)
  L.control.zoom({ position: 'bottomright' }).addTo(map)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map)
  markerLayer = L.layerGroup().addTo(map)
  drawMarkers()
  resizeFrame = requestAnimationFrame(() => {
    if (map && mapElement.value?.isConnected) map.invalidateSize()
  })
})

watch(() => props.sightings, drawMarkers, { deep: true })

onBeforeUnmount(() => {
  cancelAnimationFrame(resizeFrame)
  map?.remove()
  map = undefined
})
</script>

<template>
  <div ref="mapElement" class="sightings-map" role="application" aria-label="Zoomable map of your saved tree observations"></div>
</template>
