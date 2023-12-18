<script setup>
import { onMounted } from "vue";

//example components
import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import DefaultFooter from "@/examples/footers/FooterDefault.vue";

//image
import image from "@/assets/img/mypage-bg.jpg";

//material components

import MaterialButton from "@/components/MaterialButton.vue";

// material-input
import setMaterialInput from "@/assets/js/material-input";
onMounted(() => {
  setMaterialInput();
});
</script>
<script>
import { useAuthStore } from "../../../stores/index.js"; // 실제 경로로 대체
import MaterialInput from "@/components/MaterialInput.vue";
export default {
  components: {
    mate: MaterialInput,
  },
  data: function () {
    const authStore = useAuthStore();
    return {
      nicknameInput: "",
      emailInput: "",
      genderInput: "",
    };
  },
  beforeRouteEnter(to, from, next) {
    const authStore = useAuthStore();

    // 로그인 여부 확인
    if (!authStore.isLoggedIn) {
      // 로그아웃 상태일 진입 불가
      alert("로그인 후 이용해주세요.");
    } else {
      // 로그인 상태일 때 계속 페이지 진입
      next();
    }
  },
  computed: {
    user() {
      const authStore = useAuthStore();
      return authStore.userInfo;
    },
  },

  methods: {
    updateNickname(value) {
      this.nicknameInput = value;
    },
    changeEditMode() {
      this.editMode = true;
    },
    saveChanges() {
      const authStore = useAuthStore();

      if (!this.user.nickname) {
        alert("닉네임을 입력해주세요.");
        return; // 함수 종료
      }

      if (!this.user.email) {
        alert("이메일을 입력해주세요.");
        return; // 함수 종료
      }

      if (!this.user.gender) {
        alert("성별을 선택해주세요.");
        return; // 함수 종료
      }

      // 스토어에서 사용자 정보 업데이트
      authStore.updateUserInformation({
        nickname: this.user.nickname,
        email: this.user.email,
        gender: this.user.gender,
      });
      // 백엔드에서 사용자 정보 업데이트
      authStore.updateUser();
      this.$router.push({ name: "presentation" });
    },
  },
};
</script>

<template>
  <div>
    <div>
      <div class="container position-sticky z-index-sticky top-0">
        <div class="row">
          <div class="col-12">
            <DefaultNavbar :sticky="true" />
          </div>
        </div>
      </div>
    </div>
    <section>
      <div
        class="page-header min-vh-100"
        :style="{ backgroundImage: `url(${image})` }"
      >
        <div class="container">
          <div class="row">
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
                      <div class="mb-4">
                        <label for="nicknameInput" class="form-label"
                          >닉네임</label
                        >
                        <input
                          id="nicknameInput"
                          class="input-group-static"
                          type="text"
                          v-model="user.nickname"
                        />
                      </div>
                      <hr />
                      <!-- 이메일 수정 모드 -->
                      <div class="mb-4">
                        <label for="emailInput" class="form-label"
                          >이메일</label
                        >
                        : {{ user.email }}
                      </div>
                      <hr />
                      <!-- 성별 수정 모드 -->
                      <div class="pb-3">
                        성별
                        <div>
                          <label id="radio">
                            <input
                              type="radio"
                              name="gender"
                              value="male"
                              v-model="user.gender"
                            />
                            남성
                          </label>
                          <label id="radio">
                            <input
                              type="radio"
                              name="gender"
                              value="female"
                              v-model="user.gender"
                            />
                            여성
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

.form-label {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.input-group-static {
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.input-group-static:focus {
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
</style>
