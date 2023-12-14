<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "../../../stores/index.js"; // 실제 경로로 대체

//example components
import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import Map from "./Sections/SelectedMap.vue";

// material-input
import setMaterialInput from "@/assets/js/material-input";
onMounted(() => {
  setMaterialInput();
});
</script>
<script>
export default {
  beforeRouteEnter(to, from, next) {
    const authStore = useAuthStore();

    // 로그인 여부 확인
    if (!authStore.isLoggedIn) {
      // 로그아웃 상태일 때 진입 불가
      alert("로그인 후 이용해주세요.");
    } else {
      // 로그인 상태일 때 계속 페이지 진입
      next();
    }
  },
};
</script>
<template>
  <div>
    <div class="row">
      <div class="col-12">
        <DefaultNavbar />
      </div>
    </div>
    <div>
      <Map />
    </div>
  </div>
</template>
