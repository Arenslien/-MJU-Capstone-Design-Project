<template>
  <div>
    <div id="map"></div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "RandomMap",
  data() {
    return {
      touristSpots: [],
      markers: [],
      infowindow: null,
    };
  },
  mounted() {
    if (window.kakao && window.kakao.maps) {
      console.log("if");
      this.initMap();
      this.fetchTouristSpots();
    } else {
      console.log("else");
      const script = document.createElement("script");
      script.onload = () => {
        kakao.maps.load(() => {
          this.initMap();
          this.fetchTouristSpots();
        });
      };
      script.src =
        "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=915cffed372954b7b44804ed422b9cf0";
      document.head.appendChild(script);
    }
  },
  methods: {
    async fetchTouristSpots() {
      try {
        const response = await axios.get("http://localhost:8080/api/tourist");
        console.log(response.data);
        this.touristSpots = this.extractTouristSpots(response.data);
        console.log(this.touristSpots);
        this.addMarkers();
      } catch (error) {
          console.error("여행지 데이터를 불러오는 중 오류 발생", error);
        }
    },
    initMap() {
      const container = document.getElementById("map");
      const options = {
        center: new kakao.maps.LatLng(36, 128),
        level: 14,
      };

      this.map = new kakao.maps.Map(container, options);
    },
    addMarkers() {
      // 랜덤으로 5개의 관광지 선택
      const randomSpots = this.getRandomLocations(5);
      console.log(randomSpots);

      randomSpots.forEach((spot) => {
        const position = new kakao.maps.LatLng(spot.X_COORD, spot.Y_COORD);
        console.log("Before addMarker, position:", position);
        this.addMarker(position, spot);
      });
    },
    getRandomLocations(count) {
      // 랜덤으로 5개의 관광지 선택
      const randomLocations = [];
      const availableSpots = [...this.touristSpots];

      for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * availableSpots.length);
        randomLocations.push(availableSpots.splice(randomIndex, 1)[0]);
      }

      return randomLocations;
    },
    addMarker(position, markerInfo) {
      if (window.kakao && window.kakao.maps) {
        console.log("addMarker 들어오나요?");
        console.log("position:", position);
        console.log("makerInfo:", markerInfo);

        if (!position || typeof position.getLat !== 'function' || typeof position.getLng !== 'function') {
          console.error('Invalid position:', position);
          return;
        }

        const markerPosition = position.getPosition();
        console.log("markerPosition:", markerPosition);
        
        const marker = new kakao.maps.Marker({
          map: this.map,
          position: markerPosition,
        });

        console.log("marker.position.getLat():", marker.position.getLat());
        console.log("marker.position.getLng():", marker.position.getLng());

        this.markers.push(marker);
        console.log("markers:", this.markers);

        // 마커에 마우스오버 이벤트를 등록합니다
        kakao.maps.event.addListener(marker, "mouseover", () => {
          this.displayInfoWindow(position, markerInfo);
        });

        // 마커에 마우스아웃 이벤트를 등록합니다
        kakao.maps.event.addListener(marker, "mouseout", () => {
          this.infowindow.close();
        });
      } else {
        console.error('Kakao maps SDK가 로드되지 않았습니다.');
      }
    },
    displayInfoWindow(position, markerInfo) {
      const iwContent = `<div style="padding:5px;">
        <p>${markerInfo.VISIT_AREA_NM}</p>
      </div>`;
      console.log("iwContent:", iwContent);
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
    extractTouristSpots(data) {
      const touristSpots = [];
      for (const idx in data) {
        const tourSpot = data[idx];
        // const imgURL = `@/assets/img/tour-spots/${tourSpot.ITEM_ID}.jpg`;

        touristSpots.push({
          id: tourSpot.ITEM_ID,
          VISIT_AREA_NM: tourSpot.VISIT_AREA_NM,
          X_COORD: tourSpot.X_COORD,
          Y_COORD: tourSpot.Y_COORD,
          // IMG_URL: imgURL,
        });
      }

      return touristSpots;
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