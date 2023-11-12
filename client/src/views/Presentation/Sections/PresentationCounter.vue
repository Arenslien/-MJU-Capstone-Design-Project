<template>
  <div>
    <div id="map"></div>
  </div>
</template>

<script>
import { toRaw } from "vue";

export default {
  name: "KakaoMap",
  data() {
    return {
      markers: [],
      infowindow: null,
    };
  },
  mounted() {
    if (window.kakao && window.kakao.maps) {
      this.initMap();
      
      // Always add initial marker on page load
    } else {
      
      const script = document.createElement("script");
      script.onload = () => kakao.maps.load(this.initMap);
      script.src =
        "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=915cffed372954b7b44804ed422b9cf0";
      document.head.appendChild(script);
    }
  },
  methods: {
    initMap() {
      const container = document.getElementById("map");
      const options = {
        center: new kakao.maps.LatLng(35.758081, 127.40936),
        level: 13,
      };

      this.map = new kakao.maps.Map(container, options);

      this.addInitialMarker();
    },
    addMarker(position) {
      const marker = new kakao.maps.Marker({
        map: this.map,
        position: position,
      });

      this.markers.push(marker);

      // 마커에 마우스오버 이벤트를 등록합니다
      kakao.maps.event.addListener(marker, "mouseover", () => {
        this.displayInfoWindow(position);
      });

      // 마커에 마우스아웃 이벤트를 등록합니다
      kakao.maps.event.addListener(marker, "mouseout", () => {
        this.infowindow.close();
      });
    },
    displayInfoWindow(position) {
      const iwContent = '<div style="padding:5px;">마커가 표시된 위치입니다.</div>';
      const iwRemoveable = true;

      if (this.infowindow) {
        this.infowindow.close();
      }

      this.infowindow = new kakao.maps.InfoWindow({
        map: this.map,
        position,
        content: iwContent,
        removable: iwRemoveable,
      });
    },
    addInitialMarker() {
      const initialPosition = new kakao.maps.LatLng(37, 127);
      this.addMarker(initialPosition);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#map {
  width: 570px;
  height: 570px;
}

.button-group {
  display: flex;
	justify-content : center;
}

button {
  width: 50px;
  margin: 4px;
}
</style>