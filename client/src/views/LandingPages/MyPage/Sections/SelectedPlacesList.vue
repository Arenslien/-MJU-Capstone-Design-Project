<script setup>
// example components
import TransparentBlogCard from "../../../../examples/cards/blogCards/TransparentBlogCard.vue";
import MaterialButton from "@/components/MaterialButton.vue";

import post1 from "@/assets/img/examples/testimonial-6-2.jpg";
import post2 from "@/assets/img/examples/testimonial-6-3.jpg";
import post3 from "@/assets/img/examples/blog-9-4.jpg";
import post4 from "@/assets/img/examples/blog2.jpg";
</script>
<script>
export default {
  data() {
    return {
      visible: false,
      spots: [
        { image: post3, title: "관광지1", description: "~에 위치한 관광지" },
        { image: post4, title: "관광지2", description: "~~산 ~~절벽" },
        { image: post1, title: "업무공간1", description: "~에 위치한 업무공간 어쩌구" },
        { image: post2, title: "업무공간2", description: "~정원이 있는 업무공간 어쩌구" },
      ],
      prodArr: []
    };
  },
  methods: {
    editMode() {
      this.visible = true;
    },
    checked(target) {
      const index = this.prodArr.indexOf(target);
      return index >= 0 ? { checked: true } : { checked: false }
    },
    deleteSelectedSpots() {
      // 선택된 체크박스만 삭제
      const selectedSpots = this.prodArr.map(index => this.spots[index]);

      // 선택된 요소 삭제
      selectedSpots.forEach(spot => {
        const index = this.spots.indexOf(spot);
        this.spots.splice(index, 1);
      });

      // prodArr 비우기
      this.prodArr = [];
    },
    saveUnselectedSpots() {
      this.visible = false;

      // 남은 목록 저장
      this.spots = this.spots.filter((_, index) => !this.prodArr.includes(index));

      // prodArr 비우기
      this.prodArr = [];

      // spots를 콘솔에 출력 (테스트용)
      console.log("Remaining Spots:", this.spots);
    },
  },
};
</script>
<template>
  <section class="py-3">
    <div class="container">
      <div class="row">
        <div class="col-lg-6">
          <h3 class="mb-2">내가 선택한 장소</h3>
        </div>
      </div>
      <div class="row">
        <div style="text-align: right;">
          <MaterialButton
            variant="gradient"
            color="success"
            class="mt-2 mb-2"
            @click.prevent="editMode"
            v-if="!visible">
            수정
          </MaterialButton>
          <MaterialButton
            variant="gradient"
            color="secondary"
            class="mt-2 mb-2"
            @click.prevent="deleteSelectedSpots"
            v-if="visible">
            삭제
          </MaterialButton>
          <MaterialButton
            variant="gradient"
            color="success"
            class="mt-2 mb-2 ms-2"
            @click.prevent="saveUnselectedSpots"
            v-if="visible">
            저장
          </MaterialButton>
        </div>
      </div>
      <div class="row">
        <div v-for="(spot, index) in spots" :key="`spots-${index}`" class="col-lg-3 col-sm-6">
          <input type="checkbox"
            :id="`checkbox-${index}`"
            v-model="prodArr"
            :value="index"
            :class="checked(index)"
            v-if="visible"
          />
          <TransparentBlogCard
            :image="spot.image"
            :title="spot.title"
            :description="spot.description"
          />
        </div>
      </div>
    </div>
  </section>
</template>
