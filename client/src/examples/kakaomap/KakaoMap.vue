<template>
    <div>
      <!-- 사이드바 -->
      <div class=" sidebar active text-center" style="background-color: white; box-shadow: 5px 0 10px rgba(0, 0, 0, 0.1); transform: translateX(0%);">
        
        <div class="row g-1 text-center">

        <div class="col text-center " >
          <img src="@/assets/img/travel.png" style="width: 40px; height: 40px;">
          <p style="font-size: 13px;">관광지</p>
        </div>
        <div class="col text-center " >
            <img src="@/assets/img/study.png" style="width: 40px; height: 40px;">
          <p  style="font-size: 13px;">업무공간</p>
        </div>
        <div class="col text-center " >
            <img src="@/assets/img/house.png" style="width: 40px; height: 40px;">
          <p style="font-size: 13px;">숙소</p>
        </div>

        </div>
        
        <div class="menu-separator"></div>

        <div >
        <nav class="">
          <ul>
            <li><a href="#">메뉴 1</a></li>
            <li><a href="#">메뉴 2</a></li>
            <li><a href="#">메뉴 3</a></li>
          </ul>
        </nav>
        </div>
        
      </div>
  
      <!-- 지도 -->
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
    height: 717px;
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
  </style>
