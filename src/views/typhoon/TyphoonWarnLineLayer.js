const warnLineData = { 'type': 'FeatureCollection', 'features': [{ 'type': 'Feature', 'geometry': { 'type': 'LineString', 'coordinates': [[126.993568, 34.005024], [126.993568, 21.971252], [118.995521, 17.96586], [118.995521, 10.97105], [113.018959, 4.48627], [104.998939, -0.035506]] }, 'properties': { 'type': 'guardLine', 'name': '24小时警戒线', 'value': 24 } }, { 'type': 'Feature', 'geometry': { 'type': 'Point', 'coordinates': [126.993568, 30.005024] }, 'properties': { 'type': 'guardLineLabel', 'label': '24\n小\n时\n警\n戒\n线', 'value': 24 } }, { 'type': 'Feature', 'geometry': { 'type': 'LineString', 'coordinates': [[104.998939, -0.035506], [119.962318, -0.035506], [131.981361, 14.96886], [131.981361, 33.959474]] }, 'properties': { 'type': 'guardLine', 'name': '48小时警戒线', 'value': 48 } }, { 'type': 'Feature', 'geometry': { 'type': 'Point', 'coordinates': [131.981361, 27.959474] }, 'properties': { 'type': 'guardLineLabel', 'label': '48\n小\n时\n警\n戒\n线', 'value': 48 } }] }
export default class TyphoonWarnLineLayer {
    constructor(map) {
        this.map = map
        this.remove()
        this.sourceId = 'typhoon-warning-line-source';
        map.addSource(this.sourceId, {
            'type': 'geojson',
            'data': warnLineData
        });
        map.addLayer({
            'id': 'typhoon-warning-line24-layer',
            'type': 'line',
            'source': this.sourceId,
            'paint': {
                'line-color': '#eb8c23',
                'line-opacity': 1,
                'line-width': 2
            },
            'filter': [
                'all',
                ['==', ['get', 'value'], 24],
                ['==', ['get', 'type'], 'guardLine']
            ]
        });
        map.addLayer({
            'id': 'typhoon-warning-line48-layer',
            'type': 'line',
            'source': this.sourceId,
            'paint': {
                'line-color': '#40893a',
                'line-dasharray': [5, 2],
                'line-opacity': 1,
                'line-width': 2
            },
            'filter': [
                'all',
                ['==', ['get', 'value'], 48],
                ['==', ['get', 'type'], 'guardLine']
            ]
        });
        map.addLayer({
            'id': 'typhoon-warning-lineText-layer',
            'type': 'symbol',
            'source': this.sourceId,
            'paint': {
                'text-color': [
                    'case',
                    ['==', ['get', 'value'], 24],
                    '#eb8c23',
                    ['==', ['get', 'value'], 48],
                    '#40893a',
                    '#eb8c23'
                ]
            },
            layout: {
                'symbol-placement': 'point', 'text-anchor': 'top',
                // 'text-field': '{label}', 
                'text-font': ['Microsoft YaHei UI Regular'], 'text-size': 14
            },
            minzoom: 3,
            'filter': ['==', ['get', 'type'], 'guardLineLabel']
        });
    }
    remove() {
        this.map.getLayer('typhoon-warning-line24-layer') && this.map.removeLayer('typhoon-warning-line24-layer')
        this.map.getLayer('typhoon-warning-line48-layer') && this.map.removeLayer('typhoon-warning-line48-layer')
        this.map.getLayer('typhoon-warning-lineText-layer') && this.map.removeLayer('typhoon-warning-lineText-layer')
        this.map.getSource('typhoon-warning-line-source') && this.map.removeSource('typhoon-warning-line-source')
    }
}