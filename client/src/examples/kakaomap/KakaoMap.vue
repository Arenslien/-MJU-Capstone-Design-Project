<template>
  <div>
    <!-- 사이드바 -->
    <div
      class="sidebar sidebar1 active text-center"
      style="
        background-color: white;
        box-shadow: 5px 0 10px rgba(0, 0, 0, 0.1);
        transform: translateX(0%);
      "
    >
      <div class="row g-1 text-center">
        <div class="col text-center">
          <img
            src="@/assets/img/travel.png"
            style="width: 40px; height: 40px"
          />
          <p style="font-size: 13px">관광지</p>
        </div>
      </div>
      <div class="menu-separator"></div>
      <div>
        <!-- 사이드바1리스트 -->
        <div style="height: 450px; border-bottom: 1px solid #ccc">
          <TravelList
            @button-click="handleButtonClick"
            @tourist-spot-click="handleTravelSpotClick"
          />
        </div>
      </div>
    </div>

    <!-- 사이드바2 -->
    <div
      class="sidebar sidebar2 active text-center"
      style="
        background-color: rgb(245, 245, 245);
        box-shadow: 5px 0 10px rgba(0, 0, 0, 0.1);
        transform: translateX(0%);
      "
      :class="{ active: sidebar2Visible }"
    >
      <div class="row g-1 text-center">
        <div class="col text-center">
          <img src="@/assets/img/study.png" style="width: 40px; height: 40px" />
          <p style="font-size: 13px">업무공간</p>
        </div>
      </div>
      <div class="menu-separator"></div>
      <div>
        <!-- 사이드바2리스트 -->
        <div style="height: 450px; border-bottom: 1px solid #ccc">
          <WorkList @work-click="handleWorkSpotClick" />
        </div>
      </div>
    </div>

    <!-- 지도 -->
    <div id="map"></div>
  </div>
</template>

<script>
import { toRaw } from "vue";
import TravelList from "./TravelList.vue";
import WorkList from "./WorkList.vue";
// import axios from "axios";

export default {
  components: {
    TravelList,
    WorkList,
  },

  name: "KakaoMap",

  data() {
    return {
      clickedMarker: null,
      workMarkers: [],
      travelMarkers: [],
      infowindow: null,
      sidebar2Visible: false,
    };
  },

  mounted() {
    if (window.kakao && window.kakao.maps) {
      this.initMap();
    } else {
      const script = document.createElement("script");
      script.onload = () => window.kakao.maps.load(this.initMap);
      script.src =
        "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=fdf15a73f0d1ae486766b611bc61f897";
      document.head.appendChild(script);
    }
  },

  methods: {
    handleButtonClick() {
      // 클릭 시 사이드바2의 상태를 토글
      this.sidebar2Visible = !this.sidebar2Visible;

      //marker

      // 애니메이션 효과를 추가하려면 CSS 클래스를 추가/제거하면 됩니다.
      // 여기서는 간단히 left 값을 변경하여 애니메이션을 효과를 줬습니다.
      if (!this.sidebar2Visible) {
        document.querySelector(".sidebar2").style.left = "250px";
      }
    },

    handleWorkSpotClick(coordinates) {
      const { x, y } = coordinates;
      const markerPosition = new kakao.maps.LatLng(y, x);

      const marginOfError = 0.00001;

      const existingMarkerIndex = this.workMarkers.findIndex((marker) => {
        const markerPosition = marker.getPosition();
        const markerY = markerPosition.getLat();
        const markerX = markerPosition.getLng();

        return (
          Math.abs(markerX - x) < marginOfError &&
          Math.abs(markerY - y) < marginOfError
        );
      });

      if (existingMarkerIndex !== -1) {
        const existingMarker = this.workMarkers[existingMarkerIndex];
        existingMarker.setMap(null);
        this.workMarkers.splice(existingMarkerIndex, 1);
      } else {
        console.log("Creating new marker at:", x, y);

        const imageSrc =
          "http://t1.daumcdn.net/localimg/localimages/07/2018/pc/img/marker_spot.png";
        const imageSize = new kakao.maps.Size(20, 30);
        const imageOption = { offset: new kakao.maps.Point(10, 30) };

        const marker = new kakao.maps.Marker({
          position: markerPosition,
          image: new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
          map: toRaw(this.map),
        });

        this.workMarkers.push(marker);
      }
    },

    handleTravelSpotClick(coordinates) {
      const { x, y } = coordinates;
      const markerPosition = new kakao.maps.LatLng(y, x);

      const marginOfError = 0.00001;

      const existingMarkerIndex = this.travelMarkers.findIndex((marker) => {
        const markerPosition = marker.getPosition();
        const markerY = markerPosition.getLat();
        const markerX = markerPosition.getLng();

        return (
          Math.abs(markerX - x) < marginOfError &&
          Math.abs(markerY - y) < marginOfError
        );
      });

      if (existingMarkerIndex !== -1) {
        const existingMarker = this.travelMarkers[existingMarkerIndex];
        existingMarker.setMap(null);
        this.travelMarkers.splice(existingMarkerIndex, 1);
      } else {
        console.log("Creating new marker at:", x, y);

        const imageSrc =
          "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
        const imageSize = new kakao.maps.Size(20, 30);
        const imageOption = { offset: new kakao.maps.Point(10, 30) };

        const marker = new kakao.maps.Marker({
          position: markerPosition,
          image: new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
          map: toRaw(this.map),
        });

        this.travelMarkers.push(marker);
      }
    },

    initMap() {
      const container = document.getElementById("map");
      const options = {
        center: new window.kakao.maps.LatLng(35.458081, 126.10936),
        level: 13,
      };

      this.map = new window.kakao.maps.Map(container, options);
    },

    changeSize(size) {
      const container = document.getElementById("map");
      container.style.width = `${size}px`;
      container.style.height = `${size}px`;
      toRaw(this.map).relayout();
    },
  },
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 647px;
  z-index: 1;
}

.button-group {
  display: flex;
  justify-content: center;
}

button {
  width: 50px;
  margin: 4px;
}

body {
  margin: 0;
  padding: 0;
  font-family: "Arial", sans-serif;
  display: flex;
}

.sidebar {
  width: 250px;
  height: 100vh;
  background-color: #333;
  color: white;
  padding-top: 60px;
  position: fixed;
  left: -250px;
  transition: left 0.3s ease;
  z-index: 2;
}

.sidebar.active {
  left: 0;
}

.content {
  flex: 1;
  padding: 20px;
}

nav ul {
  list-style: none;
  padding: 0;
}

nav ul li {
  padding: 10px;
  border-bottom: 1px solid #555;
}

.sidebar p,
.sidebar a {
  color: black; /* 또는 검정색 코드를 사용합니다. */
  font-size: 13px;
  text-align: center;
}

.menu-separator {
  border-top: 1px solid #555; /* 원하는 선의 스타일 및 색상으로 설정 */
  margin-top: 10px; /* 원하는 여백 설정 */
}

.sidebar1 {
  z-index: 3; /* 첫 번째 사이드바의 z-index를 더 높게 설정 */
}

.sidebar2 {
  transition: left 0.3s ease; /* 애니메이션 효과를 줄 수 있도록 설정 */
  z-index: 2;
}

.styled-button {
  width: 100px; /* 가로 크기 */
  height: 35px; /* 세로 크기 */
  padding: 5px 0;
  background-color: rgba(12, 222, 187, 0.873);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  text-align: center;
}

.parent-container {
  position: relative;
  /* 다른 스타일 설정 */
}
</style>
