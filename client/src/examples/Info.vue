<template>
    <div>
      <h1>사용자 정보</h1>
      <div>
        <p><strong>닉네임:</strong> {{ userInfo.nickname }}</p>
        <p v-if="userInfo.email"><strong>이메일:</strong> {{ userInfo.email }}</p>
        <p v-if="userInfo.gender"><strong>성별:</strong> {{ userInfo.gender }}</p>
        <p v-if="userInfo.age_range"><strong>연령대:</strong> {{ userInfo.age_range }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import { useAuthStore } from "../stores/index.js"; // 실제 경로로 대체
  
  export default {
    data() {
      return {
        userInfo: null,
      };
    },
    computed: {
      // 상태 관리 라이브러리에서 userInfo를 가져옵니다.
      userInfo() {
        const authStore = useAuthStore();
        return authStore.userInfo;
      },
    },
    mounted() {
      // 페이지 로드 시에도 userInfo를 가져와서 화면에 표시합니다.
      this.userInfo = this.getStoredUserInfo();
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
  