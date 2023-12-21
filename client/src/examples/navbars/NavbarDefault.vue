<script setup>
import { RouterLink } from "vue-router";
import { ref, watch } from "vue";
import { useWindowsWidth } from "../../assets/js/useWindowsWidth";

import ArrDark from "@/assets/img/down-arrow-dark.svg";

import DownArrWhite from "@/assets/img/down-arrow-white.svg";

const props = defineProps({
  action: {
    type: Object,
    route: String,
    color: String,
    label: String,
    default: () => ({
      route: "/pages/landing-pages/basic",
      color: "bg-gradient-success",
      label: "Sign In",
    }),
  },
  transparent: {
    type: Boolean,
    default: false,
  },
  light: {
    type: Boolean,
    default: false,
  },
  dark: {
    type: Boolean,
    default: false,
  },
  sticky: {
    type: Boolean,
    default: false,
  },
  darkText: {
    type: Boolean,
    default: false,
  },
});

// set arrow  color
function getArrowColor() {
  if (props.transparent && textDark.value) {
    return ArrDark;
  } else if (props.transparent) {
    return DownArrWhite;
  } else {
    return ArrDark;
  }
}

const getTextColor = () => {
  let color;
  if (props.transparent && textDark.value) {
    color = "text-dark";
  } else if (props.transparent) {
    color = "text-white";
  } else {
    color = "text-dark";
  }

  return color;
};

let textDark = ref(props.darkText);
const { type } = useWindowsWidth();

if (type.value === "mobile") {
  textDark.value = true;
} else if (type.value === "desktop" && textDark.value == false) {
  textDark.value = false;
}

watch(
  () => type.value,
  (newValue) => {
    if (newValue === "mobile") {
      textDark.value = true;
    } else {
      textDark.value = false;
    }
  }
);
</script>
<template>
  <nav
    class="navbar navbar-expand-lg top-0"
    :class="{
      'z-index-3 w-100 shadow-none navbar-transparent position-absolute my-3':
        props.transparent,
      'my-3 blur border-radius-lg z-index-3 py-2 shadow py-2 start-0 end-0 mx-4 position-absolute mt-4':
        props.sticky,
      'navbar-light bg-white py-3': props.light,
      ' navbar-dark bg-gradient-dark z-index-3 py-3': props.dark,
    }"
  >
    <div
      :class="
        props.transparent || props.light || props.dark
          ? 'container'
          : 'container-fluid px-0'
      "
    >
      <RouterLink
        class="navbar-brand d-none d-md-block"
        :class="[
          (props.transparent && textDark.value) || !props.transparent
            ? 'text-dark font-weight-bolder ms-sm-3'
            : 'text-white font-weight-bolder ms-sm-3',
        ]"
        :to="{ name: 'presentation' }"
        rel="tooltip"
        title="일멍쉬멍 - 워케이션 장소 추천"
        data-placement="bottom"
      >
        일멍쉬멍
      </RouterLink>
      <RouterLink
        class="navbar-brand d-block d-md-none"
        :class="
          props.transparent || props.dark
            ? 'text-white'
            : 'font-weight-bolder ms-sm-3'
        "
        to="/"
        rel="tooltip"
        title="일멍쉬멍 - 워케이션 장소 추천"
        data-placement="bottom"
      >
        일멍쉬멍
      </RouterLink>
      <a class="navbar-brand d-block d-md-none" id="custom-login-btn">
        <Button
          v-if="!isLoggedIn"
          style="
            background-color: rgba(254, 229, 0);
            border: none;
            border-radius: 3px;
            font-weight: bold;
            margin-left: 180px;
            width: 80px;
            height: 30px;
            font-size: 10px;
          "
          @click="kakaoLogin()"
          >카카오 로그인</Button
        >
      </a>
      <a class="navbar-brand d-block d-md-none" id="custom-login-btn">
        <Button
          v-if="isLoggedIn"
          style="
            background-color: rgba(254, 229, 0);
            border: none;
            border-radius: 3px;
            font-weight: bold;
            margin-left: 180px;
            width: 80px;
            height: 30px;
            font-size: 10px;
          "
          @click="kakaoLogout()"
          >로그아웃</Button
        >
      </a>
      <button
        class="navbar-toggler shadow-none ms-2"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navigation"
        aria-controls="navigation"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon mt-2">
          <span class="navbar-toggler-bar bar1"></span>
          <span class="navbar-toggler-bar bar2"></span>
          <span class="navbar-toggler-bar bar3"></span>
        </span>
      </button>
      <div
        class="collapse navbar-collapse w-100 pt-3 pb-2 py-lg-0"
        id="navigation"
      >
        <ul class="navbar-nav navbar-nav-hover ms-auto">
          <li class="nav-item dropdown dropdown-hover mx-2"></li>
          <li class="nav-item dropdown dropdown-hover mx-2">
            <a
              role="button"
              class="nav-link ps-2 d-flex cursor-pointer align-items-center"
              :class="getTextColor()"
              id="dropdownMenuPages"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i
                class="material-icons opacity-6 me-2 text-md"
                :class="getTextColor()"
                >dashboard</i
              >
              마이페이지
              <img
                :src="getArrowColor()"
                alt="down-arrow"
                class="arrow ms-2 d-lg-block d-none"
              />
              <img
                :src="getArrowColor()"
                alt="down-arrow"
                class="arrow ms-1 d-lg-none d-block ms-auto"
              />
            </a>
            <div
              class="dropdown-menu dropdown-menu-animation ms-n3 dropdown-md p-3 border-radius-xl mt-0 mt-lg-3"
              aria-labelledby="dropdownMenuPages"
            >
              <div class="row d-none d-lg-block">
                <div class="col-12 px-4 py-2">
                  <div class="row">
                    <div class="position-relative">
                      <RouterLink
                        :to="{ name: 'my-information' }"
                        class="dropdown-item border-radius-md"
                      >
                        <span>내 정보</span>
                      </RouterLink>
                      <RouterLink
                        :to="{ name: 'selected-places' }"
                        class="dropdown-item border-radius-md"
                      >
                        <span>내가 선택한 장소</span>
                      </RouterLink>
                    </div>
                  </div>
                </div>
              </div>
              <div class="d-lg-none">
                <RouterLink
                  :to="{ name: 'my-information' }"
                  class="dropdown-item border-radius-md"
                  @click="logincheck"
                >
                  <span>내 정보</span>
                </RouterLink>
                <RouterLink
                  :to="{ name: 'selected-places' }"
                  class="dropdown-item border-radius-md"
                  @click="logincheck"
                >
                  <span>내가 선택한 장소</span>
                </RouterLink>
              </div>
            </div>
          </li>
        </ul>

        <!-- 카카오 버튼 -->
        <ul class="navbar-nav d-lg-block d-none">
          <li class="nav-item">
            <a id="custom-login-btn">
              <Button
                v-if="!isLoggedIn"
                style="
                  background-color: rgba(254, 229, 0);
                  border: none;
                  border-radius: 3px;
                  font-weight: bold;
                  margin-left: 10px;
                  width: 80px;
                  height: 30px;
                  font-size: 10px;
                "
                @click="kakaoLogin()"
                >카카오 로그인</Button
              >
            </a>
            <a id="custom-login-btn">
              <Button
                v-if="isLoggedIn"
                style="
                  background-color: rgba(254, 229, 0);
                  border: none;
                  border-radius: 3px;
                  font-weight: bold;
                  margin-left: 10px;
                  width: 80px;
                  height: 30px;
                  font-size: 10px;
                "
                @click="kakaoLogout()"
                >로그아웃</Button
              >
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<!-- 카카오 스크립트 -->
<script>
import { useAuthStore } from "../../stores/index.js";
export default {
  data() {
    return {
      showModal: false,
      userInfo: null,
    };
  },
  mounted() {
    // 페이지 로드 시 토큰 확인 및 isLoggedin 반영
    this.checkTokenOnLoad();
  },
  computed: {
    isLoggedIn() {
      const authStore = useAuthStore();
      return authStore.isLoggedIn;
    },
  },
  methods: {
    logincheck() {
      const authStore = useAuthStore();
      if (!authStore.isLoggedIn) {
        alert("로그인 해주세요!");
        return false;
      } else {
        return true;
      }
    },
    kakaoLogin() {
      const authStore = useAuthStore();
      const isKakaoAuthorized = window.Kakao.Auth.getAccessToken() !== null;

      window.Kakao.Auth.login({
        scope: "profile_nickname, account_email, gender",
        success: this.getKakaoAccount,
      });
    },

    getKakaoAccount() {
      const authStore = useAuthStore();

      window.Kakao.API.request({
        url: "/v2/user/me",
        success: async (res) => {
          const properties = res.properties;
          const nickname = properties.nickname;
          const kakao_account = res.kakao_account;
          const gender = kakao_account.gender;
          const email = kakao_account.email;

          // authStore.loginWithKakao가 Promise를 반환하므로, 해당 Promise가 완료될 때까지 기다림
          await authStore
            .loginWithKakao(email)
            .then(() => {
              // post 요청이 완료된 후에 실행되는 로직
              if (!authStore.isLoggedIn) {
                // 처음 로그인하는 경우
                alert("첫 로그인 입니다! 환영해요");
                authStore.setUserInfo({ email, nickname, gender });
                this.$router.push({ name: "getinformation" });
              } else {
                // 이미 로그인한 경우
                alert("로그인 완료");
              }

              authStore.setLoggedIn(true);
            })
            .catch((error) => {
              console.error("Error during login", error);
            });
        },
        fail: (error) => {
          console.log(error);
        },
      });
    },

    kakaoLogout() {
      const authStore = useAuthStore();
      authStore.logout();
      alert("로그아웃 완료");
    },
    checkTokenOnLoad() {
      const authStore = useAuthStore();
      const isKakaoAuthorized = window.Kakao.Auth.getAccessToken() !== null;

      if (isKakaoAuthorized) {
        // 토큰이 있는 경우
        // 백엔드에서 정보 받기
        authStore.setLoggedIn(true);
      } else {
        // 토큰이 없는 경우
        authStore.setLoggedIn(false);
      }
    },
  },
};
</script>
