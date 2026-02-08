/*
      __  ______    ____
     /  |/  /   |  / __ \
    / /|_/ / /| | / /_/ /
   / /  / / ___ |/ ____/
  /_/  /_/_/  |_/_/

      __  ______    ____  __ __ __________
     /  |/  /   |  / __ \/ //_// ____/ __ \
    / /|_/ / /| | / /_/ / ,<  / __/ / /_/ /
   / /  / / ___ |/ _, _/ /| |/ /___/ _, _/
  /_/  /_/_/  |_/_/ |_/_/ |_/_____/_/ |_|

  MAP MARKER

  This is what appears on the mapbox map. To not 
  have a marker, create an empty map-marker element.

*/

export class GeoMapMarker extends HTMLElement {

  connectedCallback() {
    const type = this.getAttribute('type') || 'default'
    if (!this.marker) {
      this.innerHTML = this.getIconForType(type)
    }
  }

  initialize(map, lng_lat, parent_location){
    this.map = map
    this.parent_location = parent_location
    const marker = document.createElement('span')
    
    const type = this.getAttribute('type') || 'default'
    marker.innerHTML = this.getIconForType(type)
    marker.style.cursor = 'pointer'

    marker.addEventListener('click', (e) => {
      const slideshow = map._controls.find(c => c.selectLocation)
      if (slideshow) slideshow.selectLocation(this.parent_location)
    })

    let rotation_alignment = this.getAttribute('alignment')
    if(rotation_alignment === null || rotation_alignment === ""){
      rotation_alignment = 'viewport'
    }

    this.marker = new mapboxgl.Marker({
      draggable: false,
      scale: 0,
      rotationAlignment: rotation_alignment,
      pitchAlignment: rotation_alignment,
      element:marker
    }).setLngLat(lng_lat)
    .addTo(this.map)  
  }

  getIconForType(type) {
    const icons = {
      'concept': `<svg width="3em" height="3em" viewBox="0 0 100 100"><path d="M50 10 L90 90 L10 90 Z M50 30 L50 35 M45 40 L55 40 M40 50 L60 50 M35 60 L65 60 M30 70 L70 70" stroke="#00ff00" fill="none" stroke-width="2"/><circle cx="50" cy="75" r="3" fill="#00ff00"/></svg>`,
      'person': `<svg width="3em" height="3em" viewBox="0 0 100 100"><circle cx="50" cy="30" r="15" fill="none" stroke="#00ff00" stroke-width="2"/><path d="M50 45 L50 70 M35 55 L65 55 M50 70 L40 90 M50 70 L60 90" stroke="#00ff00" fill="none" stroke-width="2"/><line x1="45" y1="25" x2="55" y2="25" stroke="#00ff00" stroke-width="2"/></svg>`,
      'location': `<svg width="3em" height="3em" viewBox="0 0 100 100"><path d="M50 20 L50 80 M20 50 L80 50" stroke="#00ff00" stroke-width="2"/><circle cx="50" cy="50" r="8" fill="none" stroke="#00ff00" stroke-width="2"/><path d="M30 30 L30 35 L25 35 M70 30 L70 35 L75 35 M30 70 L30 65 L25 65 M70 70 L70 65 L75 65" stroke="#00ff00" stroke-width="2"/></svg>`,
      'book': `<svg width="3em" height="3em" viewBox="0 0 100 100"><rect x="25" y="20" width="50" height="60" fill="none" stroke="#00ff00" stroke-width="2"/><path d="M50 20 L50 80 M30 35 L70 35 M30 50 L70 50 M30 65 L70 65" stroke="#00ff00" stroke-width="1"/><path d="M25 20 L20 25 L20 75 L25 80" stroke="#00ff00" stroke-width="2" fill="none"/></svg>`,
      'section': `<svg width="3em" height="3em" viewBox="0 0 100 100"><rect x="20" y="20" width="60" height="60" fill="none" stroke="#00ff00" stroke-width="2"/><path d="M35 35 L65 65 M65 35 L35 65" stroke="#00ff00" stroke-width="2"/><circle cx="50" cy="50" r="15" fill="none" stroke="#00ff00" stroke-width="1"/></svg>`,
      'event': `<svg width="3em" height="3em" viewBox="0 0 100 100"><circle cx="50" cy="50" r="30" fill="none" stroke="#00ff00" stroke-width="2"/><path d="M50 20 L50 50 L70 60" stroke="#00ff00" stroke-width="2"/><circle cx="50" cy="50" r="3" fill="#00ff00"/></svg>`,
      'default': `<svg width="3em" height="3em" viewBox="0 0 100 100"><polygon points="50,15 85,85 15,85" fill="none" stroke="#00ff00" stroke-width="2"/><path d="M50 35 L50 55 M50 65 L50 70" stroke="#00ff00" stroke-width="3"/></svg>`
    }
    return icons[type] || icons['default']
  }

  setLngLat(new_lng_lat){
    this.marker.setLngLat(new_lng_lat)
  }
 
  disconnectedCallback() {
    this.marker.remove()
  }

  remove(){
    this.marker.remove()
  }
}

customElements.define('map-marker', GeoMapMarker)


export const default_marker_markup =  `
<svg width="4em" height="4em" version="1.1" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
 <path d="m600.09 171.43c-177.77 0-322.46 144.52-322.46 321.95 0 173.14 296.91 514.8 309.43 529.2 3.2539 3.7695 8.0547 5.9961 13.027 5.9961 4.9727 0 9.6016-2.2266 12.855-6 12.684-14.402 309.43-356.06 309.43-529.2 0-177.43-144.52-321.94-322.29-321.94zm0 490.63c-92.914 0-168.52-75.773-168.52-168.69 0-92.742 75.602-168.34 168.52-168.34 92.742 0 168.34 75.602 168.34 168.34 0 92.914-75.602 168.69-168.34 168.69z" fill="#ff814a"/>
</svg>`

