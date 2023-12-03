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
      startDate: "",
      endDate: "",
    };
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
    openNextModal() {
      console.log("startDate:", this.startDate);
      console.log("endDate:", this.endDate);
      this.$emit('openNextModal');
    },
  },
};
</script>

<template>
<div>
  <div
    class="card d-flex blur justify-content-center shadow-lg my-sm-0 my-sm-6 mt-8 mb-5"
  >
    <div
      class="card-header p-0 position-relative mt-n4 mx-3 z-index-2 bg-transparent"
    >
      <div
        class="bg-gradient-success shadow-success border-radius-lg p-3"
      >
        <h3 class="text-white text-success mb-0">워케이션 기간 입력</h3>
      </div>
    </div>
    <div class="card-body">
      <p class="pb-3">
        워케이션을 진행할 기간을 입력해주세요!
      </p>
      <form id="contact-form" method="post" autocomplete="off">
        <div class="card-body p-0 my-3">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="startDate" class="form-label">시작 날짜</label>
              <input type="date" class="form-control" id="startDate" v-model="startDate" required>
            </div>
            <div class="col-md-6 mb-3">
              <label for="endDate" class="form-label">종료 날짜</label>
              <input type="date" class="form-control" id="endDate" v-model="endDate" required>
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
                @click="openNextModal"
                >다음</MaterialButton
              >
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>
</template>

<style>
.bold-text{
  font-weight: bold;
}
</style>
