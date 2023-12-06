<template>
  <div style="height: 450px; overflow-y: auto; border-bottom: 1px solid #ccc;">
    <ul>
      <li v-for="spot in workSpaces" :key="spot.WORKSPACE_ID" @click="handleClick(spot)" :class="{ 'selected': isSelected(spot) }">
        <div style="display: flex; align-items: flex-start; padding: 8px; margin-top: 10px;">
          <div>
            <span style="color: black;">{{ spot.NAME }}</span>
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
      workSpaces: [], // 변경된 부분: 여행지 정보를 나타내는 변수명을 workSpaces로 변경
    };
  },
  mounted() {
    this.fetchWorkSpaces(); // 변경된 부분: 여행지 정보를 가져오는 함수명을 fetchWorkSpaces로 변경
  },
  methods: {
    fetchWorkSpaces() { // 변경된 부분: 여행지 정보를 가져오는 함수명을 fetchWorkSpaces로 변경
      axios.get("/worklist.json")
        .then(response => {
          this.workSpaces = this.extractWorkSpaces(response.data); // 변경된 부분: 여행지 정보를 처리하는 함수명을 extractWorkSpaces로 변경
        })
        .catch(error => {
          console.error("업무공간 데이터를 불러오는 중 오류 발생", error);
        });
    },
    extractWorkSpaces(data) { // 변경된 부분: 여행지 정보를 처리하는 함수명을 extractWorkSpaces로 변경
      const workSpaces = [];
      for (const city in data) {
        if (data.hasOwnProperty(city)) {
          const cityWorkSpaces = data[city];
          for (const space of cityWorkSpaces) {
            if (space.hasOwnProperty("NAME")) {
              workSpaces.push({
                id: space.WORKSPACE_ID,
                NAME: space.NAME,
                ADDRESS: space.ADDRESS,
                X_COORD: space.X_COORD,
                Y_COORD: space.Y_COORD,
              });
            }
          }
        }
      }
      return workSpaces;
    },
    handleClick(space) {
      const index = this.selectedSpots.findIndex(selectedSpace => selectedSpace.id === space.id);
      
      if (index === -1) {
        this.selectedSpots.push(space);
      } else {
        this.selectedSpots.splice(index, 1);
      }

      this.$emit('work-click', {
        x: space.X_COORD,
        y: space.Y_COORD,
        selectedSpots: this.selectedSpots,
      });
    },
    isSelected(space) {
      return this.selectedSpots.some(selectedSpace => selectedSpace.id === space.id);
    },
    sendSelectedSpotsToUserInfo() {
      this.$emit('button-click');
      useAuthStore.setUserInfo({
        selectedSpots: this.selectedSpots,
      });
      this.sendSelectedSpotsToBackend();
    },
    sendSelectedSpotsToBackend() {
      const selectedSpotsInfo = this.selectedSpots.map(space => ({
        id: space.id,
        name: space.NAME,
        lat: space.X_COORD,
        lng: space.Y_COORD,
      }));

      axios.post("http://localhost:8080/api/auth/save-selected-spots", {
        selectedSpots: selectedSpotsInfo,
      })
      .then((response) => {
        console.log("선택된 업무공간이 성공적으로 백엔드로 전송되었습니다", response.data);
      })
      .catch((error) => {
        console.error("선택된 업무공간을 백엔드로 전송 중 오류 발생", error.response);
      });
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
