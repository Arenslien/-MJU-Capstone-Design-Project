<template>
  <div>
    <!-- 사이드바 -->
    <div class="sidebar sidebar1 active text-center" style="background-color: white; box-shadow: 5px 0 10px rgba(0, 0, 0, 0.1); transform: translateX(0%);">
      <div class="row g-1 text-center">
        <div class="col text-center">
          <h3 class="text-success">내가 선택한 장소</h3>
        </div>
      </div>
      <div class="menu-separator"></div>
      <div>
        <!-- 사이드바 리스트 -->
        <div>
          <SelectedPlacesList @spot-click="handleTravelSpotClick" @button-click="handleButtonClick" />
        </div>
      </div>
    </div>
    <!-- 지도 -->
    <div id="map"></div>
  </div>
</template>

<script>
import { toRaw } from "vue";
import SelectedPlacesList from "./SelectedPlacesList.vue";
import axios from "axios";

export default {
  components: {
    SelectedPlacesList,
  },
  name: "SelectedMap",
  data() {
    return {
      markers: [],
      infowindow: null,
      sidebar2Visible: false,
      travelMarkers: [],
      
    };
  },
  mounted() {
    if (window.kakao && window.kakao.maps) {
      this.initMap();
    } else {
      const script = document.createElement("script");
      /* global kakao */
      script.onload = () => kakao.maps.load(this.initMap);
      script.src =
        "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=fdf15a73f0d1ae486766b611bc61f897";
      document.head.appendChild(script);
    }
  },
  methods: {
    handleTravelSpotClick(coordinates) {
      const { x, y, name } = coordinates;
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
        console.log('Creating new marker at:', x, y);

        const imageSrc =
          'http://t1.daumcdn.net/localimg/localimages/07/2018/pc/img/marker_spot.png';
        const imageSize = new kakao.maps.Size(20, 30);
        const imageOption = { offset: new kakao.maps.Point(10, 30) };

        const marker = new kakao.maps.Marker({
          position: markerPosition,
          image: new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
          map: toRaw(this.map),
        });

        // Attach the infowindow to the marker
        marker.infowindow = new kakao.maps.InfoWindow({
          content: name,
          removable: true,
        });

        // Mouseover event
        kakao.maps.event.addListener(marker, 'mouseover', function () {
          marker.infowindow.open(toRaw(this.map), marker);
        });

        // Mouseout event
        kakao.maps.event.addListener(marker, 'mouseout', function () {
          marker.infowindow.close();
        });

        this.travelMarkers.push(marker);
      }
    },
    // 하위컴포넌트에서 클릭시 사이드바 토글 관리
    handleButtonClick() {
      // 클릭 시 사이드바2의 상태를 토글
      this.sidebar2Visible = !this.sidebar2Visible;

      // 애니메이션 효과를 추가하려면 CSS 클래스를 추가/제거하면 됩니다.
      // 여기서는 간단히 left 값을 변경하여 애니메이션을 효과를 줬습니다.
      if (!this.sidebar2Visible) {
        document.querySelector('.sidebar2').style.left = '250px';
      } 
    },
    initMap() {
      const container = document.getElementById("map");
      const options = {
        center: new kakao.maps.LatLng(36, 125),
        level: 13,
      };

      // 지도 객체를 등록합니다.
      // 지도 객체는 반응형 관리 대상이 아니므로 initMap에서 선언합니다.
      this.map = new kakao.maps.Map(container, options);
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
  height: 650px;
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
  font-family: 'Arial', sans-serif;
  display: flex;
}
.sidebar {
  width: 33%;
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
.sidebar p, .sidebar a {
color: black; /* 또는 검정색 코드를 사용합니다. */
font-size: 13px;
text-align: center;
}
.menu-separator {
  margin-top: 10px; /* 원하는 여백 설정 */
  margin-bottom: 10px;
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
