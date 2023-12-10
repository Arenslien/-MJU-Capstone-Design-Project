<script setup>
import { onMounted } from "vue";

//material components
import MaterialButton from "@/components/MaterialButton.vue";

// material-input
import setMaterialInput from "@/assets/js/material-input";

onMounted(() => {
  setMaterialInput();
});
</script>

<script>
import { useAuthStore } from "../../../stores/index.js";
export default {
  computed: {
    user() {
      const authStore = useAuthStore();
      return authStore.userInfo;
    },
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
    async moveToRecommend() {
  const authStore = useAuthStore();
  if (!this.user.category_1 || !this.user.category_2 || !this.user.category_3) {
    alert("카테고리를 모두 선택해주세요.");
    this.closeModal();
    return;
  }

  // // 카테고리 값 변환 함수
  // let category1Value;
  // let category2Value;
  // let category3Value;

  // switch (this.user.category_1) {
  //   case "A": // 자연
  //     category1Value = 0;
  //     break;
  //   case "N": // 중립
  //     category1Value = 1;
  //     break;
  //   case "B": // 도시
  //     category1Value = 2;
  //     break;
  //   default:
  //     location.reload();
  // }

  // switch (this.user.category_2) {
  //   case "A":
  //     category2Value = 0;
  //     break;
  //   case "N": // 중립
  //     category2Value = 1;
  //     break;
  //   case "B":
  //     category2Value = 2;
  //     break;
  //   default:
  //     location.reload();
  // }

  // switch (this.user.category_3) {
  //   case "A":
  //     category3Value = 0;
  //     break;
  //   case "N": // 중립
  //     category3Value = 1;
  //     break;
  //   case "B":
  //     category3Value = 2;
  //     break;
  //   default:
  //     location.reload();
  // }

  // // 변환된 값 출력
  // console.log("변환된 값 - 카테고리 1:", category1Value);
  // console.log("변환된 값 - 카테고리 2:", category2Value);
  // console.log("변환된 값 - 카테고리 3:", category3Value);

  // // Call the new action to save categories
  // authStore.updateUserInformation({
  //   category_1: category1Value,
  //   category_2: category2Value,
  //   category_3: category3Value,
  // });
  authStore.updateUserInformation({
    category_1: this.user.category_1,
    category_2: this.user.category_2,
    category_3: this.user.category_3,
  });

  authStore.saveCategory();

  // Wait for the router to complete the navigation
  this.$router.push({ name: 'recommend' });
},
  },
};
</script>

<template>
  <div
    class="card d-flex blur justify-content-center shadow-lg my-sm-0 my-sm-6 mt-8 mb-5"
  >
    <div
      class="card-header p-0 position-relative mt-n4 mx-3 z-index-2 bg-transparent"
    >
      <div
        class="bg-gradient-success shadow-success border-radius-lg p-3"
      >
        <h3 class="text-white text-success mb-0">관광지 취향 선택</h3>
      </div>
    </div>
    <div class="card-body">
      <p class="pb-3">
        좋아하는 관광지 유형을 선택해보세요!<br>
        더 정확하게 맞춤 추천해드려요!
      </p>
      <form id="contact-form" method="post" autocomplete="off">
        <div class="card-body p-0 my-3">
          <div class="row mb-4">
            <label class="bold-text">자연 vs 도시</label>
            <div class="col-md-4">
              <label><input type="radio" v-model="user.category_1" value="-3">자연이 너무 좋아요</label>
            </div>
            <div class="col-md-4">
              <label><input type="radio" v-model="user.category_1" value="-2">자연이 좋아요</label>
            </div>
            <div class="col-md-4">
              <label><input type="radio" v-model="user.category_1" value="-1">자연이 조금 더 좋아요</label>
            </div>
            <div class="col-md-4">
              <label><input type="radio" v-model="user.category_1" value="0">둘 다 괜찮아요</label>
            </div>
            <div class="col-md-4">
              <label><input type="radio" v-model="user.category_1" value="1">도시가 조금 더 좋아요</label>
            </div>
            <div class="col-md-4">
              <label><input type="radio" v-model="user.category_1" value="2">도시가 좋아요</label>
            </div>
            <div class="col-md-4">
              <label><input type="radio" v-model="user.category_1" value="3">도시가 너무 좋아요</label>
            </div>
          </div>
          <div class="row mb-4">
            <label class="bold-text">휴양/휴식 vs 체험활동</label>
            <div class="col-md-4">
              <label><input type="radio" v-model="user.category_2" value="-3">휴양/휴식이 너무 좋아요</label>
            </div>
            <div class="col-md-4">
              <label><input type="radio" v-model="user.category_2" value="-2">휴양/휴식이 좋아요</label>
            </div>
            <div class="col-md-4">
              <label><input type="radio" v-model="user.category_2" value="-1">휴양/휴식이 조금 더 좋아요</label>
            </div>
            <div class="col-md-4">
              <label><input type="radio" v-model="user.category_2" value="0">둘 다 괜찮아요</label>
            </div>
            <div class="col-md-4">
              <label><input type="radio" v-model="user.category_2" value="1">체험활동이 조금 더 좋아요</label>
            </div>
            <div class="col-md-4">
              <label><input type="radio" v-model="user.category_2" value="2">체험활동이 좋아요</label>
            </div>
            <div class="col-md-4">
              <label><input type="radio" v-model="user.category_2" value="3">체험활동이 너무 좋아요</label>
            </div>
          </div>
          <div class="row mb-4">
            <label class="bold-text">잘 알려지지 않은 방문지 vs 알려진 방문지</label>
            <div class="col-md-4">
              <label><input type="radio" v-model="user.category_3" value="-3">잘 알려지지 않은 방문지가 너무 좋아요</label>
            </div>
            <div class="col-md-4">
              <label><input type="radio" v-model="user.category_3" value="-2">잘 알려지지 않은 방문지가 좋아요</label>
            </div>
            <div class="col-md-4">
              <label><input type="radio" v-model="user.category_3" value="-1">잘 알려지지 않은 방문지가 조금 더 좋아요</label>
            </div>
            <div class="col-md-4">
              <label><input type="radio" v-model="user.category_3" value="0">둘 다 괜찮아요</label>
            </div>
            <div class="col-md-4">
              <label><input type="radio" v-model="user.category_3" value="1">알려진 방문지가 조금 더 좋아요</label>
            </div>
            <div class="col-md-4">
              <label><input type="radio" v-model="user.category_3" value="2">알려진 방문지가 좋아요</label>
            </div>
            <div class="col-md-4">
              <label><input type="radio" v-model="user.category_3" value="3">알려진 방문지가 너무 좋아요</label>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 text-center">
              <MaterialButton
                variant="gradient"
                color="secondary"
                class="mt-3 mb-0"
                @click="closeModal"
                >닫기</MaterialButton
              >
              <MaterialButton
                variant="gradient"
                color="success"
                class="mt-3 mb-0 ms-2"
                @click="moveToRecommend"
                >추천</MaterialButton
              >
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style>
.bold-text{
  font-weight: bold;
}
</style>
