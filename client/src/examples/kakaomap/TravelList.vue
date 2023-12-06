<template>
  <div>
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
      <MaterialButton
        variant="gradient"
        color="success"
        class="mt-2 mb-2"
        @click="sendSelectedSpotsToUserInfo">
        관광지 저장
      </MaterialButton>
    </div>
  </div>
</template>

<script setup>
  import MaterialButton from "@/components/MaterialButton.vue";
</script>
<script>
import axios from 'axios';
import { useAuthStore } from '../../stores/index.js';

export default {
  data() {
    return {
      selectedSpots: [],  // 선택한 여행지의 상태를 저장할 배열
      touristSpots: [
        { id: 1, name: "서울 탑골공원", lat: 37.578548, lng: 126.981799 },
        { id: 2, name: "부산 해운대", lat: 35.158698, lng: 129.160199 },
        // 추가 관광지 데이터
      ],
    };
  },
  methods: {
    emitButtonClick() {
      // 버튼 클릭 시 부모 컴포넌트에 이벤트를 발송
      this.$emit('button-click');
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
        name: spot.name,
        lat: spot.lat,
        lng: spot.lng,
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
</style>
