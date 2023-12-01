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
export default {
  data() {
    return {
      category_1: "",
      category_2: "",
      category_3: "",
    };
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
    moveToRecommend() {
      const authStore = useAuthStore();
      authStore.sendCategoriesToBackend({
        category_1: this.category_1,
        category_2: this.category_2,
        category_3: this.category_3,
      });

  // Call the new action to save categories
      authStore.saveCategory(authStore.user_id, this.category_1, this.category_2, this.category_3);

      this.$router.push({ name: 'recommend' });
    }
  }
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
              <label>
                <input type="radio" v-model="category_1" value="A"> 자연
              </label>
            </div>
            <div class="col-md-4">
              <label>
                <input type="radio" v-model="category_1" value="N"> 중립
              </label>
            </div>
            <div class="col-md-4">
              <label>
                <input type="radio" v-model="category_1" value="B"> 도시
              </label>
            </div>
          </div>
          <div class="row mb-4">
            <label class="bold-text">휴양/휴식 vs 체험활동</label>
            <div class="col-md-4">
              <label>
                <input type="radio" v-model="category_2" value="A"> 휴양/휴식
              </label>
            </div>
            <div class="col-md-4">
              <label>
                <input type="radio" v-model="category_2" value="N"> 중립
              </label>
            </div>
            <div class="col-md-4">
              <label>
                <input type="radio" v-model="category_2" value="B"> 체험활동
              </label>
            </div>
          </div>
          <div class="row mb-4">
            <label class="bold-text">잘 알려지지 않은 방문지 vs 알려진 방문지</label>
            <div class="col-md-4">
              <label>
                <input type="radio" v-model="category_3" value="A"> 잘 알려지지 않은 방문지
              </label>
            </div>
            <div class="col-md-4">
              <label>
                <input type="radio" v-model="category_3" value="N"> 중립
              </label>
            </div>
            <div class="col-md-4">
              <label>
                <input type="radio" v-model="category_3" value="B"> 알려진 방문지
              </label>
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
