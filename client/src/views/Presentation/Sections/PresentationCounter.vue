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
      // console.log("if");
      this.initMap();
      this.fetchTouristSpots();
    } else {
      // console.log("else");
      const script = document.createElement("script");
      script.onload = () => {
        kakao.maps.load(() => {
          this.initMap();
          this.fetchTouristSpots();
        });
      };
      script.src =
        "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=fdf15a73f0d1ae486766b611bc61f897";
      document.head.appendChild(script);
    }
  },
  methods: {
    async fetchTouristSpots() {
      try {
        const response = await axios.get("http://18.224.246.126:8080/api/tourist");
        // console.log(response.data);
        this.touristSpots = this.extractTouristSpots(response.data);
        // console.log(this.touristSpots);
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
      // console.log(randomSpots);

      randomSpots.forEach((spot) => {
        const position = new kakao.maps.LatLng(spot.Y_COORD, spot.X_COORD); // 위도, 경도 순
        // console.log("Before addMarker, position:", position);
        // console.log("spot.X_COORD:", spot.X_COORD);
        // console.log("spot.Y_COORD:", spot.Y_COORD);
        this.addMarker(position, spot);
      });
    },
    getRandomLocations(count) {
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
        // console.log("addMarker 들어오나요?");
        // console.log("position:", position);
        // console.log("makerInfo:", markerInfo);
        
        const marker = new kakao.maps.Marker({
          map: this.map,
          position: position,
        });

        this.markers.push(marker);
        // console.log("markers:", this.markers);

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
        <img src="${markerInfo.IMG_URL}" alt="${markerInfo.VISIT_AREA_NM}">
        <p style="font-size: smaller">${markerInfo.VISIT_AREA_NM}</p>
      </div>`;
      // console.log("iwContent:", iwContent);
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
        // 이미지 경로를 절대 경로로
        const imgURL = `http://18.224.246.126:8080${tourSpot.ITEM_ID}.jpg`;
        // const imgURL = "@/assets/img/tour-spots/" + tourSpot.ITEM_ID + ".jpg";

        touristSpots.push({
          id: tourSpot.ITEM_ID,
          VISIT_AREA_NM: tourSpot.VISIT_AREA_NM,
          X_COORD: tourSpot.X_COORD,  // 경도
          Y_COORD: tourSpot.Y_COORD,  // 위도
          IMG_URL: imgURL,
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
