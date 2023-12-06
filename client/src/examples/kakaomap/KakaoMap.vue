<template>
  <div>
    <!-- 사이드바 -->
    <div class="sidebar sidebar1 active text-center" style="background-color: white; box-shadow: 5px 0 10px rgba(0, 0, 0, 0.1); transform: translateX(0%);">
      <div class="row g-1 text-center">
        <div class="col text-center ">
          <img src="@/assets/img/travel.png" style="width: 40px; height: 40px;">
          <p style="font-size: 13px;">관광지</p>
        </div>
      </div>
      <div class="menu-separator"></div>
      <div>
        <!-- 사이드바1리스트 -->
        <div style="height: 450px; border-bottom: 1px solid #ccc;">
          <TravelList @button-click="handleButtonClick" @tourist-spot-click="handleTravelSpotClick" />
        </div>
      </div>
    </div>

    <!-- 사이드바2 -->
    <div class="sidebar sidebar2 active text-center" style="background-color: rgb(245, 245, 245); box-shadow: 5px 0 10px rgba(0, 0, 0, 0.1); transform: translateX(0%);" :class="{ active: sidebar2Visible }">
      <div class="row g-1 text-center">
        <div class="col text-center ">
          <img src="@/assets/img/study.png" style="width: 40px; height: 40px;">
          <p style="font-size: 13px;">업무공간</p>
        </div>
      </div>
      <div class="menu-separator"></div>
      <div>
        <!-- 사이드바2리스트 -->
        <div style="height: 450px; border-bottom: 1px solid #ccc;">
          <WorkList @touristSpotClick="handleTouristSpotClick" />
        </div>
        </div>
        <div style="margin-top:5px">
          <Button class="styled-button">업무공간저장</Button>
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
  import axios from "axios";
  
  export default {
    components: {
    TravelList,
    WorkList,
  },

    name: "KakaoMap",
    
    data() {
      return {
        markers: [],
        infowindow: null,
        sidebar2Visible: false,
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
          "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=915cffed372954b7b44804ed422b9cf0";
        document.head.appendChild(script);
      }
    },
    methods: {
      //하위컴포넌트에서 클릭시 사이드바토글관리
      handleButtonClick() {
        // 클릭 시 사이드바2의 상태를 토글
      this.sidebar2Visible = !this.sidebar2Visible;

      //marker

      // 애니메이션 효과를 추가하려면 CSS 클래스를 추가/제거하면 됩니다.
      // 여기서는 간단히 left 값을 변경하여 애니메이션을 효과를 줬습니다.
      if (!this.sidebar2Visible) {
        document.querySelector('.sidebar2').style.left = '250px';
      } 
      },
      initMap() {
        const container = document.getElementById("map");
        const options = {
          center: new kakao.maps.LatLng(35.458081, 126.10936),
          level: 13,
        };
  
        //지도 객체를 등록합니다.
        //지도 객체는 반응형 관리 대상이 아니므로 initMap에서 선언합니다.
        this.map = new kakao.maps.Map(container, options);
      },
      changeSize(size) {
        const container = document.getElementById("map");
        container.style.width = `${size}px`;
        container.style.height = `${size}px`;
        toRaw(this.map).relayout();
      },
      displayMarker(markerPositions) {
        if (this.markers.length > 0) {
          this.markers.forEach((marker) => marker.setMap(null));
        }
  
        const positions = markerPositions.map(
          (position) => new kakao.maps.LatLng(...position)
        );
  
        if (positions.length > 0) {
          this.markers = positions.map(
            (position) =>
              new kakao.maps.Marker({
                map: toRaw(this.map),
                position,
              })
          );
  
          const bounds = positions.reduce(
            (bounds, latlng) => bounds.extend(latlng),
            new kakao.maps.LatLngBounds()
          );
  
          toRaw(this.map).setBounds(bounds);
        }
      },
      displayInfoWindow() {
        if (this.infowindow && this.infowindow.getMap()) {
          //이미 생성한 인포윈도우가 있기 때문에 지도 중심좌표를 인포윈도우 좌표로 이동시킨다.
          toRaw(this.map).setCenter(this.infowindow.getPosition());
          return;
        }
  
        var iwContent = '<div style="padding:5px;">Hello World!</div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
          iwPosition = new kakao.maps.LatLng(33.450701, 126.570667), //인포윈도우 표시 위치입니다
          iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다
  
        this.infowindow = new kakao.maps.InfoWindow({
          map: toRaw(this.map), // 인포윈도우가 표시될 지도
          position: iwPosition,
          content: iwContent,
          removable: iwRemoveable,
        });
  
        toRaw(this.map).setCenter(iwPosition);
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
    font-family: 'Arial', sans-serif;
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
  
  .sidebar p, .sidebar a {
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
