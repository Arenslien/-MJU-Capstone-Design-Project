<script setup>
import { onMounted } from "vue";
//Vue Material Kit 2 components
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialButton from "@/components/MaterialButton.vue";

// material-input
import setMaterialInput from "@/assets/js/material-input";
onMounted(() => {
  setMaterialInput();
});
</script>
<script>
  import { useAuthStore } from "../../../../stores/index.js"; // 실제 경로로 대체

  export default {
    computed: {
      // 상태 관리 라이브러리에서 userInfo를 가져옵니다.
      user() {
        const authStore = useAuthStore();
        return authStore.userInfo;
      },
    },
    mounted() {
      // 페이지 로드 시에도 userInfo를 가져와서 화면에 표시합니다.
      this.user = this.getStoredUserInfo();
    },
    methods: {
      // 로컬 상태에서 userInfo를 가져오는 메소드
      getStoredUserInfo() {
        const authStore = useAuthStore();
        return authStore.userInfo;
      },
    },
  };
</script>


<template>
  <section class="my-5 pt-5">
    <div class="container">
      <div class="row">
        <div class="col-md-6 m-auto">
          <h4>내 정보 수정</h4>
          <hr>
          <hr>
          <div class="row">
            <div class="col-8">
              <p><strong>닉네임:</strong> {{user}}</p>
            </div>
          </div>
          <hr>
          <!-- 이메일, 성별, 연령대 부분은 이전과 동일하게 수정하면 됩니다. -->
        </div>
      </div>
    </div>
  </section>
</template>
