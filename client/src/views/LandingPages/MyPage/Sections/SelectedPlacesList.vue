<script setup>
// example components
import MaterialButton from "@/components/MaterialButton.vue";
</script>
<script>
import axios from 'axios';
import { useAuthStore } from '../../../../stores/index.js';

export default {
  data() {
    return {
      visible: false, // 버튼 가시 여부
      selectedFilter: '전체',
      touristSpots: [
        { id: 1, name: "서울 탑골공원", lat: 37.578548, lng: 126.981799, type: "관광지" },
        { id: 2, name: "부산 해운대", lat: 35.158698, lng: 129.160199, type: "관광지" },
        { id: 3, name: "인천 월미도", lat: 35.158698, lng: 129.160199, type: "관광지" },
        { id: 4, name: "대전 성심당", lat: 35.158698, lng: 129.160199, type: "관광지" },
        { id: 5, name: "대구 독서실", lat: 35.158698, lng: 129.160199, type: "업무공간" },
        { id: 6, name: "울산 카페", lat: 35.158698, lng: 129.160199, type: "업무공간" },
        { id: 7, name: "광주 오피스", lat: 35.158698, lng: 129.160199, type: "업무공간" },
        { id: 8, name: "제주 한라산", lat: 35.158698, lng: 129.160199, type: "관광지" },
        { id: 9, name: "독도 등대", lat: 35.158698, lng: 129.160199, type: "관광지" },
      ],
      selectedSpots: [],
    };
  },
  computed: {
    filteredSpots() {
      if (this.selectedFilter === '전체') {
        return this.touristSpots;
      } else {
        return this.touristSpots.filter(spot => spot.type === this.selectedFilter);
      }
    },
  },
  // mounted() {
  //   const apiUrl = '/api/getBookmarks';
  //   console.log("test code: 들어옵니까")
    
  //   try {
  //     axios.get(apiUrl).then((res) => {
  //       console.log('API response:', res.data);
  //     });
  //   } catch (error) {
  //     console.error('Invalid API URL:', apiUrl);
  //     console.error(error);
  //   }
  // },
  methods: {
    editMode() {
      this.visible = true;
    },
    filterData(filterType) {
      this.selectedFilter = filterType;
    },
    handleClick(spot) {
      // 클릭한 여행지를 선택 상태에 따라 추가 또는 제거
      const index = this.selectedSpots.findIndex(selectedSpot => selectedSpot.id === spot.id);
      if (index === -1) {
        // 선택되지 않았으면 추가
        this.selectedSpots.push(spot);
      } else {
        // 이미 선택된 상태이면 제거
        this.selectedSpots.splice(index, 1);
      }
    },
    isSelected(spot) {
      // 해당 여행지가 선택되었는지 여부를 확인
      return this.selectedSpots.some(selectedSpot => selectedSpot.id === spot.id);
    },
    deleteSelectedSpots() {
      this.touristSpots = this.touristSpots.filter(spot => !this.isSelected(spot));
      this.selectedSpots = [];
    },
    saveUnselectedSpots() {
      this.touristSpots = this.touristSpots.filter((_, index) => !this.selectedSpots.includes(index));
      this.selectedSpots = [];
      this.visible = false;
      this.editing = false;
      console.log("남은 장소:", this.touristSpots);
    },
    // checked(target) {
    //   const index = this.prodArr.indexOf(target);
    //   return index >= 0 ? { checked: true } : { checked: false }
    // },
    // deleteSelectedSpots() {
    //   // 선택된 체크박스만 삭제
    //   const selectedSpots = this.prodArr.map(index => this.spots[index]);

    //   // 선택된 요소 삭제
    //   selectedSpots.forEach(spot => {
    //     const index = this.spots.indexOf(spot);
    //     this.spots.splice(index, 1);
    //   });

    //   // prodArr 비우기
    //   this.prodArr = [];
    // },
    // saveUnselectedSpots() {
    //   this.visible = false;

    //   // 남은 목록 저장
    //   this.spots = this.spots.filter((_, index) => !this.prodArr.includes(index));

    //   // prodArr 비우기
    //   this.prodArr = [];

    //   // spots를 콘솔에 출력 (테스트용)
    //   console.log("Remaining Spots:", this.spots);
    // },
  },
};
</script>

<template>
  <div>
    <div class="dropdown">
      <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        {{ selectedFilter }}
      </button>
      <ul class="dropdown-menu" style="justify-content: center;" aria-labelledby="dropdownMenuButton">
        <li><a class="dropdown-item" @click="filterData('전체')">전체</a></li>
        <li><a class="dropdown-item" @click="filterData('관광지')">관광지</a></li>
        <li><a class="dropdown-item" @click="filterData('업무공간')">업무공간</a></li>
      </ul>
    </div>
    <div style="height: 450px; overflow-y: auto;">
      <ul>
        <li v-for="spot in filteredSpots" :key="spot.id" @click="handleClick(spot)" :class="{ 'selected': isSelected(spot) }">
          <div style="display: flex; flex-direction: column; align-items: flex-start; padding: 8px; margin-top: 10px;">
            <span style="color: black;">{{ spot.name }}</span>
            <span style="color: gray; font-size: 0.8em;">{{ spot.lat }}, {{ spot.lng }}</span>
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
        v-if="!visible">
        수정
      </MaterialButton>
      <MaterialButton
        variant="gradient"
        color="secondary"
        class="mt-2 mb-2"
        @click.prevent="deleteSelectedSpots"
        v-if="visible">
        삭제
      </MaterialButton>
      <MaterialButton
        variant="gradient"
        color="success"
        class="mt-2 mb-2 ms-2"
        @click.prevent="saveUnselectedSpots"
        v-if="visible">
        저장
      </MaterialButton>
    </div>
  </div>
  <!-- <section class="py-3">
    <div class="container">
      <div class="row">
        <div class="col-lg-6">
          <h3 class="mb-2">내가 선택한 장소</h3>
        </div>
      </div>
      <div class="row">
        <div style="text-align: right;">
          <MaterialButton
            variant="gradient"
            color="success"
            class="mt-2 mb-2"
            @click.prevent="editMode"
            v-if="!visible">
            수정
          </MaterialButton>
          <MaterialButton
            variant="gradient"
            color="secondary"
            class="mt-2 mb-2"
            @click.prevent="deleteSelectedSpots"
            v-if="visible">
            삭제
          </MaterialButton>
          <MaterialButton
            variant="gradient"
            color="success"
            class="mt-2 mb-2 ms-2"
            @click.prevent="saveUnselectedSpots"
            v-if="visible">
            저장
          </MaterialButton>
        </div>
      </div>
      <div class="row">
        <div v-for="(spot, index) in spots" :key="`spots-${index}`" class="col-lg-3 col-sm-6">
          <input type="checkbox"
            :id="`checkbox-${index}`"
            v-model="prodArr"
            :value="index"
            :class="checked(index)"
            v-if="visible"
          />
          <TransparentBlogCard
            :image="spot.image"
            :title="spot.title"
            :description="spot.description"
          />
        </div>
      </div>
    </div>
  </section> -->
</template>

<style scoped>
/* scoped를 사용하여 컴포넌트 내에서만 스타일이 적용되도록 설정 */
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
</style>
