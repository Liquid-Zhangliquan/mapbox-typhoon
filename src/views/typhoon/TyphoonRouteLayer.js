import Utils from './Utils'
export default class TyphoonRouteLayer {
    constructor(map, typhoonPoints) {
        this.map = map;
        this.remove()
        this.sourceId = 'typhoon-route-source';
        const data = turf.featureCollection(Utils.generateRouteFeatures(typhoonPoints))
        // const bbox = turf.bbox(data)
        // map.fitBounds([
        //     [bbox[0], bbox[1]],
        //     [bbox[2], bbox[3]],
        // ])
        map.addSource(this.sourceId, {
            'type': 'geojson',
            'data': data
        });
        // 台风路径线
        map.addLayer({
            'id': 'track-route-line-layer',
            'type': 'line',
            'source': this.sourceId,
            'paint': {
                'line-width': [
                    'interpolate', ['linear'],
                    ['zoom'],
                    5,
                    1,
                    10,
                    3
                ],
                'line-color': '#fb5614'
            },
            'filter': ['==', '$type', 'LineString']
        });
        let paintOpts = {
            'paint': {
                'circle-radius': [
                    'interpolate', [
                        'cubic-bezier',
                        0.85,
                        0.45,
                        0,
                        0.65
                    ],
                    ['zoom'],
                    5, ['*', ['to-number', ['get', 'power']], 0.4],
                    10, ['*', ['to-number', ['get', 'power']], 1]
                ],
                'circle-color': [
                    'match', ['get', 'strong'],
                    '热带低压', '#00FEDF',
                    '热带风暴', '#FEF300',
                    '强热带风暴', '#FE902C',
                    '台风', '#FE0404',
                    '强台风', '#FE3AA3',
                    '超强台风', '#AE00D9',
                    '#ff0000'
                ],
                'circle-opacity': 0.8,
                'circle-stroke-width': 3,
                'circle-stroke-color': 'rgba(110, 110, 110, .3)'
            },
            'filter': ['==', '$type', 'Point']
        };
        // 台风路径点
        map.addLayer({
            'id': 'track-route-point-layer',
            'type': 'circle',
            'source': this.sourceId,
            ...paintOpts
        });
    }

    update(typhoonPoints) {
        //typhoonPoints.pop();
        this.map.getSource(this.sourceId).setData(turf.featureCollection(Utils.generateRouteFeatures(typhoonPoints)));
    }
    remove() {
        this.map.getLayer('track-route-line-layer') && this.map.removeLayer('track-route-line-layer')
        this.map.getLayer('track-route-point-layer') && this.map.removeLayer('track-route-point-layer')
        this.map.getSource('typhoon-route-source') && this.map.removeSource('typhoon-route-source')

    }
}