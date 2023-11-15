<script setup>
import { onMounted } from "vue";

//example components
import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import DefaultFooter from "@/examples/footers/FooterDefault.vue";

//image
import image from "@/assets/img/mypage-bg.jpg";

//material components
import MaterialCheckbox from "@/components/MaterialCheckbox.vue";
import MaterialButton from "@/components/MaterialButton.vue";

// material-input
import setMaterialInput from "@/assets/js/material-input";
onMounted(() => {
  setMaterialInput();
});
</script>
<template>
  <div class="container position-sticky z-index-sticky top-0">
    <div class="row">
      <div class="col-12">
        <DefaultNavbar
          :sticky="true"
          :action="{
            route: 'https://www.creative-tim.com/product/vue-material-kit-pro',
            color: 'bg-gradient-success',
            label: 'Buy Now',
          }"
        />
      </div>
    </div>
  </div>
  <section>
    <div
      class="page-header min-vh-75"
      :style="{ backgroundImage: `url(${image})` }">
      <div class="container">
        <div class="row">
          <!-- <div
            class="col-6 d-lg-flex d-none h-100 my-auto pe-0 position-absolute top-0 start-0 text-center justify-content-center flex-column"
          >
            <div
              class="position-relative h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center"
              :style="{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
              }"
              loading="lazy"
            ></div>
          </div> -->
          <div
            class="mt-8 col-xl-5 col-lg-6 col-md-7 d-flex flex-column ms-auto me-auto ms-lg-auto me-lg-auto"
          >
            <div
              class="card d-flex blur justify-content-center shadow-lg my-sm-0 my-sm-6 mt-8 mb-5"
            >
              <div
                class="card-header p-0 position-relative mt-n4 mx-3 z-index-2 bg-transparent"
              >
                <div
                  class="bg-gradient-success shadow-success border-radius-lg p-3"
                >
                  <h3 class="text-white text-success mb-0">관광지 취향 수정</h3>
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
                          >수정</MaterialButton
                        >
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <DefaultFooter />
</template>
