<template>
  <div style="width: 100%; height: 100%" id="mapLocate"></div>
</template>

<script>
  export default {
    props: ['lon', 'lat', 'zoom'],
    data() {
      return {
        appId: 'w6lwMHd90NVJOcYCFYtN',
        appCode: 'p-2oW8Cz6ALcHXMC6fYdxw',
        platform: null,
        maptypes: null,
        map: null
      }
    },
    methods: {
      init() {
        // eslint-disable-next-line
        this.map = new H.Map(
          document.getElementById('mapLocate'),
          this.maptypes.normal.map,
          {
            zoom: this.zoom,
            center: { lat: this.lat, lng: this.lon }
          }
        );
        // eslint-disable-next-line
        let locMarker = new H.map.Marker({
          lat:this.lat,
          lng:this.lon
        });
        this.map.addObject(locMarker);
      }
    },
    mounted() {
      // eslint-disable-next-line
      this.platform = new H.service.Platform({
        app_id: this.appId,
        app_code: this.appCode,
        useCIT: true
      });
      this.maptypes = this.platform.createDefaultLayers();
    }
  }
</script>
