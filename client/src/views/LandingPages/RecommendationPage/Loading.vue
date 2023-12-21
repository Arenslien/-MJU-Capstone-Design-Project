<template>
  <div>
    <!-- 로딩 표시를 위한 영역 -->
    <div v-if="isLoading" class="loading-spinner">
      <!-- 여기에 로딩 아이콘, 애니메이션 또는 텍스트 등을 넣어서 로딩을 나타낼 수 있습니다. -->
      사용자 맞춤형 추천 결과를 수집하고 있습니다!
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/index.js";
</script>

<script>
import axios from "axios";

export default {
  data() {
    return {
      isLoading: true, // 로딩 상태를 저장하는 변수
      items: [], // 받아온 데이터를 저장할 배열
    };
  },
  mounted() {
    this.fetchData(); // 컴포넌트가 마운트되면 데이터를 가져오는 함수 호출
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
    async moveToRecommend() {
      // const authStore = useAuthStore();
      if (
        this.travel_style1 == 0 ||
        this.travel_style5 == 0 ||
        this.travel_style6 == 0
      ) {
        alert("카테고리를 모두 선택해주세요.");
        this.closeModal();
        return;
      }

      // authStore.updateUserInformation({
      //   category_1: this.travel_style1,
      //   category_2: this.travel_style5,
      //   category_3: this.travel_style6,
      // });

      // authStore.saveCategory();

      // Wait for the router to complete the navigation
      this.$router.push({ name: "recommend" });
    },
     async fetchData() {
      const authStore = useAuthStore();
      const gender = authStore.userInfo.gender === "male" ? 0 : 1;
      const age_group = authStore.agerange;
      const travel_style1 = authStore.travelStyle1;
      const travel_style5 = authStore.travelStyle5;
      const travel_style6 = authStore.travelStyle6;
      const period = authStore.period;
      console.log(gender);
      console.log(age_group);
      console.log(travel_style1);
      console.log(travel_style5);
      console.log(travel_style6);
      console.log(period);

      await axios
        .get(
          `http://18.224.246.126:8080/api/recommend-request?gender=${gender}&age_group=${age_group}&travel_style1=${travel_style1}&travel_style5=${travel_style5}&travel_style6=${travel_style6}&period=${period}`
        )
        .then((response) => {
          // 응답을 받았을 때 isLoading을 false로 변경하여 로딩 표시를 종료
          this.isLoading = false;
          this.items = response.data; // 데이터를 저장
          this.moveToRecommend();
        })
        .catch((error) => {
          console.error("데이터를 가져오는 중 오류 발생:", error);
          // 오류가 발생한 경우에도 로딩을 종료하도록 처리할 수 있습니다.
          this.isLoading = false;
        });
    },
  },
};
</script>
