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
              <div style="display: flex; align-items: center;">
                <p><strong>닉네임 :</strong></p>
                <div v-if="user.nickname">
                  {{ user.nickname }}
                </div>
                <div v-else>
                  <input v-model="nicknameInput" type="text" />
                </div>
              </div>
            </div>
          </div>
          <hr>
          <div class="row">
            <div class="col-8">
              <div style="display: flex; align-items: center;">
                <p><strong>e-mail :</strong></p>
                <div v-if="user.email">
                  {{ user.email }}
                </div>
                <div v-else>
                  <input v-model="emailInput" type="text" />
                </div>
              </div>
            </div>
          </div>
          <hr>
          <div class="row">
            <div class="col-8">
              <div style="display: flex; align-items: center;">
                <p><strong>성별 :</strong></p>
                <div v-if="user.gender">
                  {{ user.gender }}
                </div>
                <div v-else>
                  <input v-model="genderInput" type="text" />
                </div>
              </div>
            </div>
          </div>
          <hr>
          <div class="row">
            <div class="col-8">
              <div style="display: flex; align-items: center;">
                <p><strong>연령대 :</strong></p>
                <div v-if="user.age_range">
                  {{ user.age_range }}
                </div>
                <div v-else>
                  <input v-model="ageRangeInput" type="text" />
                </div>
              </div>
            </div>
          </div>
          <hr>
          <div class="row">
            <div class="col-4">
              <button @click="saveChanges">저장</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useAuthStore } from "../../../../stores/index.js"; // 실제 경로로 대체

export default {
  computed: {
    user() {
      const authStore = useAuthStore();
      return authStore.userInfo;
    },
  },
  data() {
    return {
      nicknameInput: "",
      emailInput: "",
      genderInput: "",
      ageRangeInput: "",
    };
  },
  methods: {
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