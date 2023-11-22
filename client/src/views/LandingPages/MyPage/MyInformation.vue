<script setup>
import { onMounted } from "vue";

//example components
import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import DefaultFooter from "@/examples/footers/FooterDefault.vue";

//image
import image from "@/assets/img/mypage-bg.jpg";

//material components
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialCheckbox from "@/components/MaterialCheckbox.vue";
import MaterialButton from "@/components/MaterialButton.vue";

// material-input
import setMaterialInput from "@/assets/js/material-input";
onMounted(() => {
  setMaterialInput();
});
</script>
<script>
import { useAuthStore } from "../../../stores/index.js"; // 실제 경로로 대체

export default {
  computed: {
    user() {
      const authStore = useAuthStore();
      return authStore.userInfo;
    },
  },
  data() {
    return {
      editMode: false,
      nicknameInput: "",
      emailInput: "",
      genderInput: "",
      ageRangeInput: "",
    };
  },
  methods: {
    changeEditMode() {
      this.editMode = true;
    },
    saveChanges() {
      const authStore = useAuthStore();

      // Check each input field and update the user info if input is not empty
      if (this.nicknameInput) {
        authStore.setUserInfo({ ...authStore.userInfo, nickname: this.nicknameInput });
      }
      if (this.emailInput) {
        authStore.setUserInfo({ ...authStore.userInfo, email: this.emailInput });
      }
      if (this.genderInput) {
        authStore.setUserInfo({ ...authStore.userInfo, gender: this.genderInput });
      }
      if (this.ageRangeInput) {
        authStore.setUserInfo({ ...authStore.userInfo, age_range: this.ageRangeInput });
      }

      // Reset input fields
      this.nicknameInput = "";
      this.emailInput = "";
      this.genderInput = "";
      this.ageRangeInput = "";

      this.$router.push({ name: 'presentation' });
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
                  <p class="pb-3">
                    더 정확한 맞춤 추천을 위해 정보를 입력해주세요!
                  </p>
                  <form id="contact-form" method="post" autocomplete="off">
                    <div class="card-body p-0 my-3">
                      <!--이름 조회 모드-->
                      <template v-if="!editMode">
                        <div class="d-flex justify-content-between align-items-center">
                          <span class="fw-bold">이름:</span> {{ user.nickname }}
                        </div>
                      </template>
                      <!--이름 수정 모드-->
                      <MaterialInput v-else
                        class="input-group-static mb-4"
                        label="이름"
                        type="text"
                        v-model="nicknameInput"
                      />
                      <hr>
                      <!--이메일 조회 모드-->
                      <template v-if="!editMode">
                        <div class="d-flex justify-content-between align-items-center">
                          <span class="fw-bold">이메일:</span> {{ user.email }}
                        </div>
                      </template>
                      <!--이메일 수정 모드-->
                      <MaterialInput v-else
                        class="input-group-static mb-4"
                        label="이메일"
                        type="email"
                        v-model="emailInput"
                      />
                      <hr>
                      <!--나이 조회 모드-->
                      <template v-if="!editMode">
                        <div class="d-flex justify-content-between align-items-center">
                          <span class="fw-bold">나이:</span> {{ user.age_range }}
                        </div>
                      </template>
                      <!--나이 수정 모드-->
                      <MaterialInput v-else
                        class="input-group-static mb-4"
                        label="나이"
                        type="number"
                        v-model="ageRangeInput"
                      />
                      <hr>
                      <!--성별 조회 모드-->
                      <template v-if="!editMode">
                        <div class="d-flex justify-content-between align-items-center">
                          <span class="fw-bold">성별:</span> {{ user.gender }}
                        </div>
                      </template>
                      <!--성별 수정 모드-->
                      <div class="pb-3" v-else>
                        성별
                        <div>
                          <label id="radio">
                            <input type="radio" name="gender" value="1">
                            남자
                          </label>
                          <label id="radio">
                            <input type="radio" name="gender" value="2">
                            여자
                          </label>
                        </div>
                      </div>
                      <div class="col-md-12 text-center">
                        <!--수정 모드 버튼-->
                        <MaterialButton v-if="!editMode"
                          variant="gradient"
                          color="success"
                          class="mt-3 mb-0"
                          @click.prevent="changeEditMode">
                          수정
                        </MaterialButton>
                        <!--저장 모드 버튼-->
                        <MaterialButton v-else
                          variant="gradient"
                          color="success"
                          class="mt-3 mb-0"
                          @click.prevent="saveChanges">
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
