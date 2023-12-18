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
      travel_style1: 0,
    };
  },
  computed: {
    user() {
      const authStore = useAuthStore();
      return authStore.userInfo;
    },
  },
  methods: {
    updateCategory1(event) {
      console.log("agerange: ", event.target.value);
      this.travel_style1 = event.target.value;
    },
    closeModal() {
      this.$emit("closeModal");
    },
    async openNextModel() {
      // openNextModal 이벤트 발생
      const authStore = useAuthStore();
      authStore.agerange = this.travel_style1;
      console.log(authStore.agerange);

      this.$emit("openNextModal");
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
      <div class="bg-gradient-success shadow-success border-radius-lg p-3">
        <h3 class="text-white text-success mb-0">워케이션 연령 선택</h3>
      </div>
    </div>
    <div class="card-body">
      <form
        id="contact-form"
        method="post"
        autocomplete="off"
        onsubmit="return false"
      >
        <div class="card-body p-0 my-3">
          <div class="row mb-4">
            <label class="bold-text">연령대 선택</label>
            <div class="col-md-3">
              <label
                ><input type="radio" @change="updateCategory1" value="10" /> 10대</label
              >
            </div>
            <div class="col-md-3">
              <label
                ><input type="radio" @change="updateCategory1" value="20" /> 20대</label
              >
            </div>
            <div class="col-md-3">
              <label
                ><input type="radio" @change="updateCategory1" value="30" />
                30대</label
              >
            </div>
            <div class="col-md-3">
              <label
                ><input
                  type="radio"
                  @change="updateCategory1"
                  value="40"
                /> 40대</label
              >
            </div>
            <div class="col-md-3">
              <label
                ><input type="radio" @change="updateCategory1" value="50" /> 50대</label
              >
            </div>
            <div class="col-md-3">
              <label
                ><input type="radio" @change="updateCategory1" value="60" /> 60대</label
              >
            </div>
            <div class="col-md-3">
              <label
                ><input type="radio" @change="updateCategory1" value="70" /> 70대</label
              >
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
                @click="openNextModel"
                >다음</MaterialButton
              >
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style>
.bold-text {
  font-weight: bold;
}
</style>
