<script setup>
import { onMounted } from "vue";

//material components
import MaterialButton from "@/components/MaterialButton.vue";
import { useAuthStore } from "@/stores/index.js";
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
    handleStartDateChange(event) {
      const startDateValue = event.target.value;
      // 처리할 로직 추가
      console.log("시작 날짜:", startDateValue);
      this.startDate = startDateValue;
    },
    handleEndDateChange(event) {
      const endDateValue = event.target.value;
      // 처리할 로직 추가
      console.log("종료 날짜:", endDateValue);
      this.endDate = endDateValue;
    },
    closeModal() {
      this.$emit("closeModal");
    },
    openNextModal() {
      console.log("startDate: ", this.startDate);
      console.log("endDate", this.endDate);

      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      const period = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

      // 스토어에서 numberOfperiod 업데이트
      const authStore = useAuthStore();

      if (period < 3 || period > 30) {
        // 선택한 일수가 조건에 맞지 않으면 모달 내에 에러 메시지를 표시
        alert("다시 선택해주세요. (3일 이상, 30일 이하)");
        this.closeModal();
        return;
        //Retrun; 시 깨짐현상
      }

      console.log("period: ", period);

      if (isNaN(start)) {
        alert("시작 날짜를 정해주세요");
        return;
      }

      if (isNaN(end)) {
        alert("끝나는 날짜를 정해주세요");
        return;
      }

      authStore.period = period;

      // openNextModal 이벤트 발생
      this.$emit("openNextModal");
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
        <div class="bg-gradient-success shadow-success border-radius-lg p-3">
          <h3 class="text-white text-success mb-0">워케이션 기간 입력</h3>
        </div>
      </div>
      <div class="card-body">
        <p class="pb-3">워케이션을 진행할 기간을 입력해주세요!</p>
        <form
          id="contact-form"
          method="post"
          autocomplete="off"
          onsubmit="return false"
        >
          <div class="card-body p-0 my-3">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="startDate" class="form-label">시작 날짜</label>
                <input
                  type="date"
                  class="form-control"
                  id="startDate"
                  @change="handleStartDateChange"
                  required
                />
              </div>
              <div class="col-md-6 mb-3">
                <label for="endDate" class="form-label">종료 날짜</label>
                <input
                  type="date"
                  class="form-control"
                  id="endDate"
                  @change="handleEndDateChange"
                  required
                />
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
.bold-text {
  font-weight: bold;
}
</style>
