<script setup>
// example components
import DefaultNavbar from "../../../examples/navbars/NavbarDefault.vue";

// sections
import Footer from "./Sections/SelectedPlacesFooter.vue";
import Posts from "./Sections/SelectedPlacesList.vue";

// image
import image from "@/assets/img/selectpage-bg.jpg";
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
