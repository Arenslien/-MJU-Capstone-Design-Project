<script setup>
import { onMounted } from "vue";
import DefaultFooter from "@/examples/footers/FooterDefault.vue";
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialButton from "@/components/MaterialButton.vue";
import setMaterialInput from "@/assets/js/material-input";

onMounted(() => {
  setMaterialInput();
});
</script>

<script>
import { useAuthStore } from "../../../stores/index.js";

export default {
  computed: {
    user() {
      const authStore = useAuthStore();
      return authStore.userInfo;
    },
  },
  data() {
    return {
      emailInput: "",
      genderInput: "",
    };
  },
  methods: {
    saveChanges() {
      const authStore = useAuthStore();

      if (!authStore.userInfo.email) {
        authStore.setUserInfo({
          ...authStore.userInfo,
          email: this.emailInput,
        });
      }

      if (!authStore.userInfo.gender) {
        authStore.setUserInfo({
          ...authStore.userInfo,
          gender: this.genderInput,
        });
      }

      // Reset input fields
      this.emailInput = "";
      this.genderInput = "";

      authStore.sendUserInfoToBackend();

      this.$router.push({ name: "presentation" });
    },
  },
};
</script>

<template>
  <div>
    <section>
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
              <h3 class="text-white text-success mb-0">내 정보</h3>
            </div>
          </div>
          <div class="card-body">
            <p class="pb-3">더 정확한 맞춤 추천을 위해 정보를 입력해주세요!</p>
            <form id="contact-form" method="post" autocomplete="off">
              <div class="card-body p-0 my-3">
                <!-- 이름 조회 모드 -->
                <div class="d-flex justify-content-between align-items-center">
                  <span class="fw-bold">이름:</span> {{ user.nickname }}
                </div>
                <hr />
                <!-- 이메일 조회 모드 -->
                <template v-if="user.email">
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <span class="fw-bold">이메일:</span> {{ user.email }}
                  </div>
                </template>
                <!-- 이메일 수정 모드 -->
                <MaterialInput
                  v-else
                  class="input-group-static mb-4"
                  label="이메일"
                  type="email"
                  v-model="emailInput"
                />
                <hr />
                <!-- 성별 조회 모드 -->
                <template v-if="user.gender">
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <span class="fw-bold">성별:</span> {{ user.gender }}
                  </div>
                </template>
                <!-- 성별 수정 모드 -->
                <div class="pb-3" v-else>
                  성별
                  <div>
                    <label id="radio">
                      <input
                        type="radio"
                        name="gender"
                        value="1"
                        v-model="genderInput"
                      />
                      male
                    </label>
                    <label id="radio">
                      <input
                        type="radio"
                        name="gender"
                        value="2"
                        v-model="genderInput"
                      />
                      female
                    </label>
                  </div>
                </div>
                <div class="col-md-12 text-center">
                  <!-- 저장 모드 버튼 -->
                  <MaterialButton
                    variant="gradient"
                    color="success"
                    class="mt-3 mb-0"
                    @click.prevent="saveChanges"
                  >
                    저장
                  </MaterialButton>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
    <DefaultFooter />
  </div>
</template>

<style scoped>
#radio {
  margin-left: 10px;
  margin-right: 170px;
}
</style>
