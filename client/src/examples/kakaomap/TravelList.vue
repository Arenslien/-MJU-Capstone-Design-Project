<template>
  <div style="height: 450px; overflow-y: auto; border-bottom: 1px solid #ccc;">
    <ul>
      <li v-for="spot in touristSpots" :key="spot.id" @click="handleClick(spot)" :class="{ 'selected': isSelected(spot) }">
        <div style="display: flex; flex-direction: column; align-items: flex-start; padding: 8px; margin-top: 10px;">
          <span style="color: black;">{{ spot.name }}</span>
          <span style="color: gray; font-size: 0.8em;">{{ spot.lat }}, {{ spot.lng }}</span>
        </div>
      </li>
    </ul>
  </div>
  <div style="margin-top:5px">
    <Button class="styled-button" @click="sendSelectedSpotsToUserInfo">관광지 저장</Button>
  </div>
</template>


<script>
import axios from 'axios';
import { useAuthStore } from '../../stores/index.js';

export default {
  data() {
    return {
      selectedSpots: [], 
      touristSpots: [],
    };
  },
  methods: {
    handleClick(spot) {
      // 클릭한 여행지를 선택 상태에 따라 추가 또는 제거
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
    sendSelectedSpotsToUserInfo() {
      this.$emit('button-click');
      useAuthStore.setUserInfo({
        selectedSpots: this.selectedSpots,
      });
      this.sendSelectedSpotsToBackend();
    },

    sendSelectedSpotsToBackend() {
      const selectedSpotsInfo = this.selectedSpots.map(spot => ({
        id: spot.id,
        name: spot.name,
        lat: spot.lat,
        lng: spot.lng,
      }));

      axios.post("http://localhost:8080/api/auth/save-selected-spots", {
        selectedSpots: selectedSpotsInfo,
      })
      .then((response) => {
        console.log("선택된 여행지가 성공적으로 백엔드로 전송되었습니다", response.data);
      })
      .catch((error) => {
        console.error("선택된 여행지를 백엔드로 전송 중 오류 ", error.response);
      });
    },
  },
};
</script>

<!--<script>
  export default {
    data() {
      return {
        touristSpots: [
          { id: 1, name: "서울 탑골공원", lat: 37.578548, lng: 126.981799 },
          { id: 2, name: "부산 해운대", lat: 35.158698, lng: 129.160199 },
          // 추가 관광지 데이터
        ],
      };
    },
    methods: {
      handleClick(spot) {
        // 관광지 클릭 이벤트 발생
        this.$emit("touristSpotClick", spot);
      },
    },
  };
  </script>-->

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
