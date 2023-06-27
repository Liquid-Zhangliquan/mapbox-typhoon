<template>
  <div class="typhoon-container">
    <div id="map"></div>
  </div>
</template>

<script>
import TyphoonCurrentLayer from './TyphoonCurrentLayer';
import TyphoonForecastLayer from './TyphoonForecastLayer';
import TyphoonRouteLayer from './TyphoonRouteLayer';
import TyphoonWarnLineLayer from './TyphoonWarnLineLayer';
import { typhoonData } from './data';
export default {
  name: '',
  data() {
    return {
      intervalTimer: null,
      typhoonIndex: 0,
      typhoonRoutePoints: [],
    };
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
      map.on('load', () => {
        this.onEvent();
        this.initTyphoon();
      });
    },
    onEvent() {
      map.on('click', this.mapIdentify);
      map.on('mouseover', this.mouseoverEvent);
    },
    offEvent() {
      map.off('click', this.mapIdentify);
      map.off('mouseover', this.mouseoverEvent);
    },
    mouseoverEvent() {},
    mapIdentify(e) {
      const bbox = [
        [e.point.x - 2, e.point.y - 2],
        [e.point.x + 2, e.point.y + 2],
      ];
      let typhoonPoint = map.queryRenderedFeatures(bbox, {
        layers: ['track-route-point-layer'],
      });
      if (typhoonPoint.length > 0) {
        // 显示该点风圈及其弹窗
        let properties = typhoonPoint[0].properties;
        // 为啥变成了字符串？
        typeof properties.radius7 === 'string' && (properties.radius7 = JSON.parse(properties.radius7));
        typeof properties.radius10 === 'string' && (properties.radius10 = JSON.parse(properties.radius10));
        typeof properties.radius12 === 'string' && (properties.radius12 = JSON.parse(properties.radius12));

        window.typhoonCurrentLayer.update(properties);

        // this.popupDOM && this.popupDOM.remove();
        // const properties = typhoonPoint[0].properties;
        // const lng = parseFloat(properties.lng).toFixed(2);
        // const lat = parseFloat(properties.lat).toFixed(2);
        // const html = `<div class='station-info-box'><div>气象站点名称:${properties.name}</div><div><span>经度:</span><span>${lng}</span>    <span>纬度:</span><span>${lat}</span></div></div>`;
        // this.popupDOM.setLngLat([properties.lng, properties.lat]).setHTML(html).addTo(map);
      }
    },
    initTyphoon() {
      console.log(typhoonData);
      const { forecasts, tracks } = typhoonData.data;
      this.typhoonPointsData = tracks;
      const current = tracks[0];
      window.typhoonWarnLineLayer = new TyphoonWarnLineLayer(map);
      window.typhoonRouteLayer = new TyphoonRouteLayer(map, []);

      let cndata = [];
      let twdata = [];
      let jpdata = [];
      let usdata = [];
      forecasts[''].map((item) => {
        const { forecast_agency } = item;
        switch (forecast_agency) {
          case 'cn':
            item['tm'] = '中国';
            cndata.push(item);
            break;
          case 'tw':
            item['tm'] = '中国台湾';
            twdata.push(item);
            break;
          case 'jp':
            item['tm'] = '日本';
            jpdata.push(item);
            break;
          case 'us':
            item['tm'] = '美国';
            usdata.push(item);
            break;
        }
      });
      this.forecastsData = [cndata, twdata, jpdata, usdata];
      // window.typhoonForecastLayer = new TyphoonForecastLayer(map, current);
      setTimeout(() => {
        this.start();
      }, 2000);
    },
    start() {
      this.reset();
      this.animate();
    },
    reset() {
      this.typhoonIndex = 0;
      this.typhoonRoutePoints = [];
    },
    animate() {
      //使用requestAnimationFrame
      // if (this.typhoonIndex < this.typhoonPointsData.length) {
      //     let typhoonCurrent = this.typhoonPointsData[this.typhoonIndex];
      //     this.typhoonRoutePoints.push(typhoonCurrent);
      //     this.typhoonRouteLayer.update(this.typhoonRoutePoints);
      //     this.typhoonCurrentLayer.update(typhoonCurrent);
      //     this.typhoonForecastLayer.update(typhoonCurrent);
      //     requestAnimationFrame(this.animate);
      // }
      // this.typhoonIndex++;

      //使用setInterval
      this.intervalTimer && clearInterval(this.intervalTimer);
      this.intervalTimer = setInterval(() => {
        console.log(this.typhoonIndex);
        let typhoonCurrent = this.typhoonPointsData[this.typhoonIndex];
        this.typhoonRoutePoints.push(typhoonCurrent);
        if (this.typhoonIndex === this.typhoonPointsData.length) {
          // 关闭定时器动画
          clearInterval(this.intervalTimer);
          this.intervalTimer = null;
          // 最后一个点绘制预报路径
          window.typhoonForecastLayer = new TyphoonForecastLayer(map, this.forecastsData);
          return;
        }
        if (this.typhoonIndex === 0) {
          // 第一个点 绘制对应风圈
          window.typhoonCurrentLayer = new TyphoonCurrentLayer(map, typhoonCurrent);
          this.typhoonIndex++;
          return;
        }
        // 两个点以上绘制轨迹和风圈
        window.typhoonRouteLayer.update(this.typhoonRoutePoints);
        window.typhoonCurrentLayer.update(typhoonCurrent);
        this.typhoonIndex++;
      }, 100);
    },
  },
  destroyed() {
    this.offEvent();
    window.typhoonWarnLineLayer && typhoonWarnLineLayer.remove();
  },
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
