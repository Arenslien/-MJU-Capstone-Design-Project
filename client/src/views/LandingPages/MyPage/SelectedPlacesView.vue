<script setup>
// example components
import DefaultNavbar from "../../../examples/navbars/NavbarDefault.vue";

// sections
import Footer from "./Sections/SelectedPlacesFooter.vue";
import Posts from "./Sections/SelectedPlacesList.vue";

// image
import image from "@/assets/img/selectpage-bg.jpg";
</script>
<script>
import { useAuthStore } from "../../../stores/index.js"; // 실제 경로로 대체

export default {
  beforeRouteEnter(to, from, next) {
    const authStore = useAuthStore();

    // 로그인 여부 확인
    if (!authStore.isLoggedIn) {
      // 로그아웃 상태일 때 이전 페이지로 리디렉션
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
    <DefaultNavbar transparent />
    <section>
      <div
        class="page-header min-vh-100"
        :style="{ backgroundImage: `url(${image})` }"
        loading="lazy"
      >
        <span class="mask bg-gradient-dark opacity-8"></span>
        <div class="container">
          <div class="row">
            <div class="mt-8">
              <div class="card-body">
                <div class="card card-body blur shadow-blur mx-3 mx-md-4 mt-n6 mb-4">
                  <Posts />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <Footer />
  </div>
</template>
