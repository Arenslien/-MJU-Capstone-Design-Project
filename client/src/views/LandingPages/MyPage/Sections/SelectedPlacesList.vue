<template>
  <div>
    <div class="dropdown">
      <button
        class="btn btn-secondary dropdown-toggle"
        type="button"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        {{ selectedFilter }}
      </button>
      <ul class="dropdown-menu" style="justify-content: center;" aria-labelledby="dropdownMenuButton">
        <li><a class="dropdown-item" @click="filterall('전체')">전체</a></li>
        <li><a class="dropdown-item" @click="filtertour('관광지')">관광지</a></li>
        <li><a class="dropdown-item" @click="filterwork('업무공간')">업무공간</a></li>
      </ul>
    </div>
    <div style="height: 450px; overflow-y: auto;">
      <ul>
        <li v-for="spot in filterData" :key="spot.id" @click="handleClick(spot)" :class="{ 'selected': isSelected(spot) }">
          <div style="display: flex; flex-direction: column; align-items: flex-start; padding: 8px; margin-top: 10px;">
            <span style="color: black;">{{ spot.NAME }}</span>
            <span style="color: gray; font-size: 0.8em;">{{ spot.ADDRESS}}</span>
          </div>
        </li>
      </ul>
    </div>
    <div style="margin-top:5px">
      <MaterialButton
        variant="gradient"
        color="success"
        class="mt-2 mb-2"
        @click.prevent="editMode"
        v-if="!visible"
      >
        수정
      </MaterialButton>
      <MaterialButton
        variant="gradient"
        color="secondary"
        class="mt-2 mb-2"
        @click.prevent="deleteSelectedSpots"
        v-if="visible"
      >
        삭제
      </MaterialButton>
      <MaterialButton
        variant="gradient"
        color="success"
        class="mt-2 mb-2 ms-2"
        @click.prevent="saveUnselectedSpots"
        v-if="visible"
      >
        저장
      </MaterialButton>
    </div>
  </div>
</template>
<script setup>
import MaterialButton from "@/components/MaterialButton.vue";
</script>
<script>
import axios from 'axios';
import { useAuthStore } from '../../../../stores/index.js';

export default {
  data() {
    return {
      visible: false,
      selectedFilter: '전체',
      touristSpots: [],
      selectedSpots: [],
      workSpaces: [],
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const authStore = useAuthStore();
      const apiUrl = `/api/bookmark?user_id=${authStore.userInfo.user_id}`;

      try {
        axios.get(apiUrl).then((response) => {
          console.log(response);
          console.log("zz");
          console.log(response.data);
          this.touristSpots = this.extractTouristSpots(response.data);
          console.log(this.touristSpots);
          console.log("2상");
          this.workSpaces = this.extractWorkSpaces(response.data);
          console.log(this.workSpaces);
          console.log("1상");
        });
      } catch (error) {
        console.error('데이터 가져오기 오류:', error);
      }
    },
    extractWorkSpaces(data) {
  const workSpaces = [];
  for (const city in data) {
    if (data.hasOwnProperty(city)) {
      const cityWorkSpaces = data[city];
      if (Array.isArray(cityWorkSpaces)) {
        for (const space of cityWorkSpaces) {
          // 'space'가 객체이며 필요한 속성을 가지고 있는지 확인
          if (space && space.hasOwnProperty("ROAD_ADDRESS")) {
            workSpaces.push({
              id: space.WORKSPACE_ID,
              NAME: space.NAME,
              ADDRESS: space.ROAD_ADDRESS, // 적절한 주소 속성으로 변경
              X_COORD: space.X,
              Y_COORD: space.Y,
            });
          } else {
            console.error("워크스페이스 데이터의 구조가 잘못되었습니다:", space);
          }
        }
      } else {
        console.error("도시 워크스페이스 데이터의 구조가 잘못되었습니다:", cityWorkSpaces);
      }
    }
  }
  return workSpaces;
},


extractTouristSpots(data) {
  const touristSpots = [];
  for (const city in data) {
    console.log(city);
    if (data.hasOwnProperty(city)) {
      const cityData = data[city];
      // 데이터 구조에 따라서 cityData가 객체이며, tourists 배열을 가지고 있는지 확인
      if (cityData && Array.isArray(cityData.tourists)) {
        console.log(cityData.tourists);
        const citySpots = cityData.tourists;
        console.log(citySpots);
        for (const spot of citySpots) {
          // 'spot'이 객체이며 필요한 속성을 가지고 있는지 확인
          console.log(spot);
          if (spot && spot.hasOwnProperty("ROAD_ADDRESS")) {
            touristSpots.push({
              id: spot.TOURIST_ID,
              VISIT_AREA_NM: spot.VISIT_AREA_NM,
              ADDRESS: spot.ROAD_ADDRESS, // 적절한 주소 속성으로 변경
              X_COORD: spot.X,
              Y_COORD: spot.Y,
              IMG_URL: spot.IMG_URL,
            });
            console.log(touristSpots);
          } else {
            console.error("관광지 데이터의 구조가 잘못되었습니다:", spot);
          }
        }
      } else {
        console.error("도시 관광지 데이터의 구조가 잘못되었습니다:", cityData);
      }
    }
  }
  return touristSpots;
},
filterall(a){
  this.selectedFilter = a;
  console.log(this.touristSpots);
  console.log(this.workSpaces);
},
filtertour(b){
  this.selectedFilter = b;
},
filterwork(c){
  this.selectedFilter = c;
},
filterData() {
  if (this.selectedFilter === '전체') {
    console.log("흠냐뀽0");
    return this.touristSpots.concat(this.workSpaces);
  } else if (this.selectedFilter === '관광지') {
    console.log("흠냐뀽1");
    return this.touristSpots;
  } else if (this.selectedFilter === '업무공간') {
    console.log("흠냐뀽2");
    return this.workSpaces;
  }
},

    handleClick(spot) {
      const index = this.selectedSpots.findIndex(selectedSpot => selectedSpot.id === spot.id);

      if (index === -1) {
        this.selectedSpots.push(spot);
      } else {
        this.selectedSpots.splice(index, 1);
      }
    },
    isSelected(spot) {
      return this.selectedSpots.some(selectedSpot => selectedSpot.id === spot.id);
    },
    editMode() {
      this.visible = true;
    },
    deleteSelectedSpots() {
      this.touristSpots = this.touristSpots.filter(spot => !this.isSelected(spot));
      this.workSpaces = this.workSpaces.filter(space => !this.isSelected(space));
      this.selectedSpots = [];
    },
    saveUnselectedSpots() {
      this.touristSpots = this.touristSpots.filter((_, index) => !this.selectedSpots.includes(index));
      this.workSpaces = this.workSpaces.filter(space => !this.isSelected(space));
      this.selectedSpots = [];
      this.visible = false;
    },
  },
};
</script>

<style scoped>
div {
  border-radius: 10px;
}
li {
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.selected {
  background-color: #dcdcdc;
  color: white;
}
li:hover {
  background-color: #dcdcdc;
}
.styled-button {
  width: 100px;
  height: 35px;
  padding: 5px 0;
  background-color: rgba(12, 222, 187, 0.873);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  text-align: center;
}
</style>