<script setup>
import { onMounted } from "vue";
import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import KakaoMap from "@/examples/kakaomap/KakaoMap.vue"; // 변경된 부분

// material-input
import setMaterialInput from "@/assets/js/material-input";
onMounted(() => {
  setMaterialInput();
});
</script>

<template>
  <div class="row">
    <div class="col-12">
      <DefaultNavbar />
    </div>
  </div>

  <div>
    <!-- 변경된 부분 -->
    <KakaoMap />
  </div>
</template>
