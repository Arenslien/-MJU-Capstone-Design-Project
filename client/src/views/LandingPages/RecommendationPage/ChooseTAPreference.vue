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
      travel_style5: 0,
      travel_style6: 0,
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
      console.log("travel_style1: ", event.target.value);
      this.travel_style1 = event.target.value;
    },
    updateCategory2(event) {
      console.log("travel_style5: ", event.target.value);
      this.travel_style5 = event.target.value;
    },
    updateCategory3(event) {
      console.log("travel_style6: ", event.target.value);
      this.travel_style6 = event.target.value;
    },
    closeModal() {
      this.$emit("closeModal");
    },
    async openNextModel() {
      // openNextModal 이벤트 발생
      const authStore = useAuthStore();
      authStore.travelStyle1 = this.travel_style1;
      authStore.travelStyle5 = this.travel_style5;
      authStore.travelStyle6 = this.travel_style6;
      authStore.updateUserInformation({
        category_1: this.travel_style1,
	category_2: this.travel_style5,
	category_3: this.travel_style6
      });

      await authStore.saveCategory();

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
        <h3 class="text-white text-success mb-0">관광지 취향 선택</h3>
      </div>
    </div>
    <div class="card-body">
      <p class="pb-3">
        좋아하는 관광지 유형을 선택해보세요!<br />
        더 정확하게 맞춤 추천해드려요!
      </p>
      <form
        id="contact-form"
        method="post"
        autocomplete="off"
        onsubmit="return false"
      >
        <div class="card-body p-0 my-3">
          <div class="row mb-4">
            <label class="bold-text">자연 vs 도시</label>
            <div class="col-md-3">
              <label
                ><input type="radio" @change="updateCategory1" value="1" />자연
                매우 선호</label
              >
            </div>
            <div class="col-md-3">
              <label
                ><input type="radio" @change="updateCategory1" value="2" />자연
                선호</label
              >
            </div>
            <div class="col-md-3">
              <label
                ><input type="radio" @change="updateCategory1" value="3" />자연
                조금 선호</label
              >
            </div>
            <div class="col-md-3">
              <label
                ><input
                  type="radio"
                  @change="updateCategory1"
                  value="4"
                />중립</label
              >
            </div>
            <div class="col-md-3">
              <label
                ><input type="radio" @change="updateCategory1" value="5" />도시
                조금 선호</label
              >
            </div>
            <div class="col-md-3">
              <label
                ><input type="radio" @change="updateCategory1" value="6" />도시
                선호</label
              >
            </div>
            <div class="col-md-3">
              <label
                ><input type="radio" @change="updateCategory1" value="7" />도시
                매우 선호</label
              >
            </div>
          </div>
          <div class="row mb-4">
            <label class="bold-text">휴양/휴식 vs 체험활동</label>
            <div class="col-md-3">
              <label
                ><input
                  type="radio"
                  @change="updateCategory2"
                  value="1"
                />휴양/휴식 매우 선호</label
              >
            </div>
            <div class="col-md-3">
              <label
                ><input
                  type="radio"
                  @change="updateCategory2"
                  value="2"
                />휴양/휴식 선호</label
              >
            </div>
            <div class="col-md-3">
              <label
                ><input
                  type="radio"
                  @change="updateCategory2"
                  value="3"
                />휴양/휴식 조금 선호</label
              >
            </div>
            <div class="col-md-3">
              <label
                ><input
                  type="radio"
                  @change="updateCategory2"
                  value="4"
                />중립</label
              >
            </div>
            <div class="col-md-3">
              <label
                ><input
                  type="radio"
                  @change="updateCategory2"
                  value="5"
                />체험활동 조금 선호</label
              >
            </div>
            <div class="col-md-3">
              <label
                ><input
                  type="radio"
                  @change="updateCategory2"
                  value="6"
                />체험활동 선호</label
              >
            </div>
            <div class="col-md-3">
              <label
                ><input
                  type="radio"
                  @change="updateCategory2"
                  value="7"
                />체험활동 매우 선호</label
              >
            </div>
          </div>
          <div class="row mb-4">
            <label class="bold-text"
              >잘 알려지지 않은 방문지 vs 알려진 방문지</label
            >
            <div class="col-md-3">
              <label
                ><input type="radio" @change="updateCategory3" value="1" />잘
                알려지지 않은 방문지 매우 선호</label
              >
            </div>
            <div class="col-md-3">
              <label
                ><input type="radio" @change="updateCategory3" value="2" />잘
                알려지지 않은 방문지 선호</label
              >
            </div>
            <div class="col-md-3">
              <label
                ><input type="radio" @change="updateCategory3" value="3" />잘
                알려지지 않은 방문지 조금 선호</label
              >
            </div>
            <div class="col-md-3">
              <label
                ><input
                  type="radio"
                  @change="updateCategory3"
                  value="4"
                />중립</label
              >
            </div>
            <div class="col-md-3">
              <label
                ><input
                  type="radio"
                  @change="updateCategory3"
                  value="5"
                />알려진 방문지 조금 선호</label
              >
            </div>
            <div class="col-md-3">
              <label
                ><input
                  type="radio"
                  @change="updateCategory3"
                  value="6"
                />알려진 방문지 선호</label
              >
            </div>
            <div class="col-md-3">
              <label
                ><input
                  type="radio"
                  @change="updateCategory3"
                  value="7"
                />알려진 방문지 매우 선호</label
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
.bold-text {
  font-weight: bold;
}
</style>
