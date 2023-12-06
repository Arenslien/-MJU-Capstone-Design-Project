<template>
  <div style="height: 450px; overflow-y: auto; border-bottom: 1px solid #ccc;">
    <ul>
      <li v-for="spot in touristSpots" :key="spot.id" @click="handleClick(spot)" :class="{ 'selected': isSelected(spot) }">
        <div style="display: flex; align-items: flex-start; padding: 8px; margin-top: 10px;">
          <img :src="spot.IMG_URL" alt="Spot Image" style="width: 50px; height: 50px; margin-right: 10px; border-radius: 5px;">
          <div>
            <span style="color: black;">{{ spot.VISIT_AREA_NM }}</span>
            <span style="color: gray; font-size: 0.8em;">{{ spot.ADDRESS }}</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
  <div style="margin-top:5px">
    <Button class="styled-button" @click="sendSelectedSpotsToUserInfo">업무공간 저장</Button>
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
  mounted() {
    // 컴포넌트가 마운트될 때 데이터를 가져오는 함수 호출
    this.fetchTouristSpots();
  },
  methods: {
    fetchTouristSpots() {
      axios.get("/travellist.json")
        .then(response => {
          this.touristSpots = this.extractTouristSpots(response.data);
        })
        .catch(error => {
          console.error("여행지 데이터를 불러오는 중 오류 발생", error);
        });
    },
    extractTouristSpots(data) {
  const touristSpots = [];
  for (const city in data) {
    if (data.hasOwnProperty(city)) {
      const citySpots = data[city];
      for (const spot of citySpots) {
        if (spot.hasOwnProperty("VISIT_AREA_NM")) {
          touristSpots.push({
            id: spot.ITEM_ID,
            VISIT_AREA_NM: spot.VISIT_AREA_NM,
            ADDRESS: spot.ADDRESS,
            X_COORD: spot.X_COORD,
            Y_COORD: spot.Y_COORD,
          });
        }
      }
    }
  }
  return touristSpots;
},


    emitButtonClick() {
      // 버튼 클릭 시 부모 컴포넌트에 이벤트를 발송
      this.$emit('work-handle');
    },
    handleClick(spot) {
      // Emit a custom event with the selected spot's information
  
      // 클릭한 여행지를 선택 상태에 따라 추가 또는 제거
      const index = this.selectedSpots.findIndex(selectedSpot => selectedSpot.id === spot.id);
      
      if (index === -1) {
        // 선택되지 않았으면 추가
        this.selectedSpots.push(spot);
        
      } else {
        // 이미 선택된 상태이면 제거
        this.selectedSpots.splice(index, 1);
      }
      this.$emit('tourist-spot-click', {
    x: spot.X_COORD,
    y: spot.Y_COORD,
    selectedSpots: this.selectedSpots,
  });


      
    },
    isSelected(spot) {
      // 해당 여행지가 선택되었는지 여부를 확인
      return this.selectedSpots.some(selectedSpot => selectedSpot.id === spot.id);
    },
    sendSelectedSpotsToUserInfo() {
      //토글이옹위해
      this.$emit('button-click');
      // 선택된 여행지를 userInfo 상태로 업데이트하는 스토어 메서드 호출
      useAuthStore.setUserInfo({
        selectedSpots: this.selectedSpots,
      });

      // 선택된 여행지 정보를 백엔드로 보내는 경우 선택적으로 사용
      this.sendSelectedSpotsToBackend();
    },

    sendSelectedSpotsToBackend() {
      // 선택된 여행지에서 관련 정보를 추출하고 이를 백엔드로 전송
      const selectedSpotsInfo = this.selectedSpots.map(spot => ({
        id: spot.id,
        name: spot.장소명,
        lat: spot.X,
        lng: spot.Y,
      }));

      // 선택된 여행지를 처리하는 API 엔드포인트가 있다고 가정
      axios.post("http://localhost:8080/api/auth/save-selected-spots", {
        selectedSpots: selectedSpotsInfo,
      })
      .then((response) => {
        console.log("선택된 여행지가 성공적으로 백엔드로 전송되었습니다", response.data);
        // 필요한 추가 처리가 있으면 수행
      })
      .catch((error) => {
        console.error("선택된 여행지를 백엔드로 전송 중 오류 발생", error.response);
      });
    },
  },
};
</script>



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