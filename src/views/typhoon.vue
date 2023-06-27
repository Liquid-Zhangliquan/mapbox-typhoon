<template>
  <div class="typhoon-container">
    <div id="map"></div>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {};
  },
  watch: {},
  created() {},
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';
      window.map = new mapboxgl.Map({
        container: 'map',
        style: {
          version: 8,
          sources: {
            carto: {
              type: 'raster',
              tiles: [
                '//a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
                '//b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
                '//c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
                '//d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
              ],
              tileSize: 256,
              // minzoom: 1,
              // maxzoom: 18,
            },
          },
          layers: [
            {
              id: 'carto',
              type: 'raster',
              source: 'carto',
              // minzoom: 1,
              // maxzoom: 22,
              paint: {
                'raster-resampling': 'nearest',
                'raster-fade-duration': 0,
              },
            },
            {
              id: 'background',
              type: 'background',
              layout: {
                visibility: 'none',
              },
            },
          ],
        },
        center: [108.64716061315448, 34.32869020758345],
        zoom: 3.5,
        antialias: true,
      });
    },
  },
  destroyed() {},
};
</script>

<style lang="less">
.typhoon-container {
  width: 100%;
  height: 100%;
  #map {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    background: #202020;
  }
}
</style>
