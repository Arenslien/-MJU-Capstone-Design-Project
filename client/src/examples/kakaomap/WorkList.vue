<template>
    <div style="height: 450px; overflow-y: auto; border-bottom: 1px solid #ccc;">
      <ul>
        <li v-for="spot in touristSpots" :key="spot.id" @click="handleClick(spot)">
          <div style="display: flex; flex-direction: column; align-items: flex-start; padding: 8px; margin-top: 10px;">
            <span style="color: black;">{{ spot.name }}</span>
            <span style="color: gray; font-size: 0.8em;">{{ spot.lat }}, {{ spot.lng }}</span>
            <!-- 다른 요소 추가 가능 -->
          </div>
        </li>
      </ul>
    </div>
  </template>

<script>
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

li:hover {
  background-color: #dcdcdc;
}
</style>
