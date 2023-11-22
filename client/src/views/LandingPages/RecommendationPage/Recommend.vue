<script setup>
import { onMounted } from "vue";

//example components
import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import kakao from "@/examples/kakaomap/KakaoMap.vue";

// material-input
import setMaterialInput from "@/assets/js/material-input";
onMounted(() => {
  setMaterialInput();
});
</script>
<template>
  
    <div class="row">
      <div class="col-12">
        <DefaultNavbar
        />
      </div>
    </div>
    
    <div>
      <kakao/>
    </div>
    
</template>
