<script setup>
import { onMounted } from "vue";

//material components
import MaterialCheckbox from "@/components/MaterialCheckbox.vue";
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
    }
  },
  methods: {
    moveToRecommend() {
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
          <div class="row">
            <label>여행 스타일1</label>
            <div class="col-md-6">
              <MaterialCheckbox>A</MaterialCheckbox>
            </div>
            <div class="col-md-6">
              <MaterialCheckbox>B</MaterialCheckbox>
            </div>
          </div>
          <div class="row">
            <label>여행 스타일5</label>
            <div class="col-md-6">
              <MaterialCheckbox>A</MaterialCheckbox>
            </div>
            <div class="col-md-6">
              <MaterialCheckbox>B</MaterialCheckbox>
            </div>
          </div>
          <div class="row">
            <label>여행 스타일6</label>
            <div class="col-md-6">
              <MaterialCheckbox>A</MaterialCheckbox>
            </div>
            <div class="col-md-6">
              <MaterialCheckbox>B</MaterialCheckbox>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 text-center">
              <MaterialButton
                variant="gradient"
                color="success"
                class="mt-3 mb-0"
                @click="moveToRecommend"
                >저장</MaterialButton
              >
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
