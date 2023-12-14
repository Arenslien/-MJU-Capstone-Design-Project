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
      location: [
        [37.5666, 126.9774], [37, 128], [37.24, 131.865], [35.1, 129], [36, 126.8]
      ],
      touristSpots: [],
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

    // 랜덤 데이터로 수정해야 돼!!!
    // axios.get("/travellist.json")
    //   .then(response => {
    //     this.touristSpots = this.extractTouristSpots(response.data);
    //   })
    //   .catch(error => {
    //     console.error("여행지 데이터를 불러오는 중 오류 발생", error);
    //   });
  },
  methods: {
    initMap() {
      const container = document.getElementById("map");
      const options = {
        center: new kakao.maps.LatLng(36, 128),
        level: 14,
      };

      this.map = new kakao.maps.Map(container, options);

      this.addInitialMarker();
    },
    addMarker(position, markerInfo) {
      const marker = new kakao.maps.Marker({
        map: this.map,
        position: position,
      });

      this.markers.push(marker);

      // 마커에 마우스오버 이벤트를 등록합니다
      kakao.maps.event.addListener(marker, "mouseover", () => {
        this.displayInfoWindow(position, markerInfo);
      });

      // 마커에 마우스아웃 이벤트를 등록합니다
      kakao.maps.event.addListener(marker, "mouseout", () => {
        this.infowindow.close();
      });
    },
    displayInfoWindow(position, markerInfo) {
      const iwContent = `<div style="padding:5px;">(${markerInfo[0]}, ${markerInfo[1]})</div>`;
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
      this.location.forEach((loc) => {
        const initialPosition = new kakao.maps.LatLng(loc[0], loc[1]);
        this.addMarker(initialPosition, loc);
      });
    },
    // extractTouristSpots(data) {
    //   const touristSpots = [];
    //   for (const city in data) {
    //     if (data.hasOwnProperty(city)) {
    //       const citySpots = data[city];
    //       for (const spot of citySpots) {
    //         if (spot.hasOwnProperty("VISIT_AREA_NM")) {
    //           touristSpots.push({
    //             id: spot.ITEM_ID,
    //             VISIT_AREA_NM: spot.VISIT_AREA_NM,
    //             ADDRESS: spot.ADDRESS,
    //             X_COORD: spot.X_COORD,
    //             Y_COORD: spot.Y_COORD,
    //             IMG_URL: spot.IMG_URL,
    //           });
    //         }
    //       }
    //     }
    //   }
    //   return touristSpots;
    // },
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