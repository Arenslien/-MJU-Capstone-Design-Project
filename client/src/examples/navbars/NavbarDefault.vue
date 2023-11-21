<script setup>
import { RouterLink } from "vue-router";
import { ref, watch } from "vue";
import { useWindowsWidth } from "../../assets/js/useWindowsWidth";
import Info from "../Info.vue";
// images
import ArrDark from "@/assets/img/down-arrow-dark.svg";
import downArrow from "@/assets/img/down-arrow.svg";
import DownArrWhite from "@/assets/img/down-arrow-white.svg";

const props = defineProps({
  action: {
    type: Object,
    route: String,
    color: String,
    label: String,
    default: () => ({
      route: "/pages/landing-pages/basic",  // 풀 라우터 주소를 써야하나? ex)www.어쩌구
      color: "bg-gradient-success",
      label: "Sign In"
    })
  },
  transparent: {
    type: Boolean,
    default: false
  },
  light: {
    type: Boolean,
    default: false
  },
  dark: {
    type: Boolean,
    default: false
  },
  sticky: {
    type: Boolean,
    default: false
  },
  darkText: {
    type: Boolean,
    default: false
  }
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

// set text color
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

// set nav color on mobile && desktop

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
      ' navbar-dark bg-gradient-dark z-index-3 py-3': props.dark
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
            : 'text-white font-weight-bolder ms-sm-3'
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
      <a
        href="https://www.creative-tim.com/product/vue-material-kit-pro"
        class="btn btn-sm bg-gradient-success mb-0 ms-auto d-lg-none d-block"
        >카카오 로그인</a
      >
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
                >view_day</i
              >
              추천페이지
              <!-- <img
                :src="getArrowColor()"
                alt="down-arrow"
                class="arrow ms-2 d-lg-block d-none"
              />
              <img
                :src="getArrowColor()"
                alt="down-arrow"
                class="arrow ms-1 d-lg-none d-block ms-auto"
              /> -->
            </a>
            <!-- <div
              class="dropdown-menu dropdown-menu-animation ms-n3 dropdown-md p-3 border-radius-xl mt-0 mt-lg-3"
              aria-labelledby="dropdownMenuPages"
            >
              <div class="row d-none d-lg-block">
                <div class="col-12 px-4 py-2">
                  <div class="row">
                    <div class="position-relative">
                      <div
                        class="dropdown-header text-dark font-weight-bolder d-flex align-items-center px-1"
                      >
                        Landing Pages
                      </div>
                      <RouterLink
                        :to="{ name: 'about' }"
                        class="dropdown-item border-radius-md"
                      >
                        <span>About Us</span>
                      </RouterLink>
                      <RouterLink
                        :to="{ name: 'contactus' }"
                        class="dropdown-item border-radius-md"
                      >
                        <span>Contact Us</span>
                      </RouterLink>
                      <RouterLink
                        :to="{ name: 'author' }"
                        class="dropdown-item border-radius-md"
                      >
                        <span>Author</span>
                      </RouterLink>
                    </div>
                  </div>
                </div>
              </div>
              <div class="d-lg-none">
                <div
                  class="dropdown-header text-dark font-weight-bolder d-flex align-items-center px-0"
                >
                  Landing Pages
                </div>
                <RouterLink
                  :to="{ name: 'about' }"
                  class="dropdown-item border-radius-md"
                >
                  <span>About Us</span>
                </RouterLink>
                <RouterLink
                  :to="{ name: 'contactus' }"
                  class="dropdown-item border-radius-md"
                >
                  <span>Contact Us</span>
                </RouterLink>
                <RouterLink
                  :to="{ name: 'author' }"
                  class="dropdown-item border-radius-md"
                >
                  <span>Author</span>
                </RouterLink>
                <div
                  class="dropdown-header text-dark font-weight-bolder d-flex align-items-center px-0 mt-3"
                >
                  Account
                </div>
                <RouterLink
                  :to="{ name: 'signin-basic' }"
                  class="dropdown-item border-radius-md"
                >
                  <span>Sign In</span>
                </RouterLink>
              </div>
            </div> -->
          </li>
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
                      <div
                        class="dropdown-header text-dark font-weight-bolder d-flex align-items-center px-1"
                      >
                        내 정보
                      </div>
                      <RouterLink
                        :to="{ name: 'my-information' }"
                        class="dropdown-item border-radius-md"
                      >
                        <span>내 정보 수정</span>
                      </RouterLink>
                      <RouterLink
                        :to="{ name: 'modify-TA-preference' }"
                        class="dropdown-item border-radius-md"
                      >
                        <span>관광지 취향 수정</span>
                      </RouterLink>
                      <RouterLink
                        :to="{ name: 'author' }"
                        class="dropdown-item border-radius-md"
                      >
                        <span>내가 선택한 장소</span>
                      </RouterLink>
                      <!-- <div
                        class="dropdown-header text-dark font-weight-bolder d-flex align-items-center px-0 mt-3"
                      >
                        Account
                      </div>
                      <RouterLink
                        :to="{ name: 'signin-basic' }"
                        class="dropdown-item border-radius-md"
                      >
                        <span>Sign In</span>
                      </RouterLink> -->
                    </div>
                  </div>
                </div>
              </div>
              <div class="d-lg-none">
                <div
                  class="dropdown-header text-dark font-weight-bolder d-flex align-items-center px-0"
                >
                  내 정보
                </div>
                <RouterLink
                  :to="{ name: 'my-information' }"
                  class="dropdown-item border-radius-md"
                >
                  <span>내 정보 수정</span>
                </RouterLink>
                <RouterLink
                  :to="{ name: 'modify-TA-preference' }"
                  class="dropdown-item border-radius-md"
                >
                  <span>관광지 취향 수정</span>
                </RouterLink>
                <RouterLink
                  :to="{ name: 'author' }"
                  class="dropdown-item border-radius-md"
                >
                  <span>내가 선택한 장소</span>
                </RouterLink>
              </div>
            </div>
          </li>
          <!-- <li class="nav-item dropdown dropdown-hover mx-2">
            <a
              href="https://www.github.com/creativetimofficial/vue-material-kit"
              class="nav-link d-flex cursor-pointer align-items-center"
            >
              <svg
                width="20px"
                height="20px"
                class="material-icons me-2 opacity-6"
                viewBox="0 0 24 24"
                aria-hidden="true"
                data-testid="GitHubIcon"
                :fill="props.transparent && '#fff'"
              >
                <path
                  d="M12 1.27a11 11 0 00-3.48 21.46c.55.09.73-.28.73-.55v-1.84c-3.03.64-3.67-1.46-3.67-1.46-.55-1.29-1.28-1.65-1.28-1.65-.92-.65.1-.65.1-.65 1.1 0 1.73 1.1 1.73 1.1.92 1.65 2.57 1.2 3.21.92a2 2 0 01.64-1.47c-2.47-.27-5.04-1.19-5.04-5.5 0-1.1.46-2.1 1.2-2.84a3.76 3.76 0 010-2.93s.91-.28 3.11 1.1c1.8-.49 3.7-.49 5.5 0 2.1-1.38 3.02-1.1 3.02-1.1a3.76 3.76 0 010 2.93c.83.74 1.2 1.74 1.2 2.94 0 4.21-2.57 5.13-5.04 5.4.45.37.82.92.82 2.02v3.03c0 .27.1.64.73.55A11 11 0 0012 1.27"
                ></path>
              </svg>
              Github
            </a>
          </li> -->
        </ul>
        
        <!-- 카카오 버튼 -->
        <ul class="navbar-nav d-lg-block d-none">
          <li class="nav-item">
            <a id="custom-login-btn">
              <Button v-if="!isLoggedIn" style="background-color: rgba(254, 229, 0); border: none; border-radius: 3px; font-weight: bold; margin-left: 10px; width:80px; height:30px; font-size: 10px;" @click="kakaoLogin()">카카오 로그인</Button>
            </a>
            <a id="custom-login-btn">
              <Button v-if="isLoggedIn" style="background-color: rgba(254, 229, 0); border: none; border-radius: 3px; font-weight: bold; margin-left: 10px; width:80px; height:30px; font-size: 10px;" @click="kakaoLogout()">로그아웃</Button>
            </a>
          </li>
          
        </ul>
      </div>
    </div>
  </nav>
  
  <!-- End Navbar -->
</template>
<!-- 카카오 스크립트 -->
<script>
import { useAuthStore } from '../../stores/index.js';
export default {
   components: {
  },
  data() {
    return {
      showModal: false,
      userInfo: null,
      showInfo: false,
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
    isFirstLogin() {
      const authStore = useAuthStore();
      return authStore.isFirstLogin;
    },
  },
  methods: {
    openModal() {
      this.showInfo = true;
    },
    closeModal() {
      this.showInfo = false;
    },
    kakaoLogin() {
      const authStore = useAuthStore();
      const isKakaoAuthorized = window.Kakao.Auth.getAccessToken() !== null;

      if (isKakaoAuthorized) {
  // 이미 로그인된 상태라면 처리
  alert("로그인 이미 된거심");
  authStore.setLoggedIn(true);

  if (authStore.isFirstLogin) {
    authStore.updateFirstLoginStatus(false);
    // 첫 로그인 시에만 mypage.vue로 이동
    this.$router.push({ name: 'editmyinformation' });
  } else {
    // 이미 로그인된 상태이지만 첫 로그인이 아닌 경우의 로직
    alert("로그인 완료");
    this.openModal();
  }
} else {
  // 로그인을 요청
  window.Kakao.Auth.login({
    scope: 'profile_nickname,account_email, gender, age_range',
    success: this.getKakaoAccount,
  });
}
},
    getKakaoAccount() {
      const authStore = useAuthStore();

      window.Kakao.API.request({
        url: '/v2/user/me',
        success: (res) => {
          const kakao_account = res.kakao_account;
          const nickname = kakao_account.profile_nickname;
          const gender = kakao_account.gender; // Corrected
          const age_range = kakao_account.age_range; // Corrected
          const email = kakao_account.account_email; // Added

          // Set the login status and user info in the store
          authStore.setLoggedIn(true);
          authStore.setUserInfo({nickname ,email, gender, age_range });

          if (authStore.isFirstLogin) {
            alert("첫 로그인 입니다! 환영해요");
            authStore.setIsFirstLogin(false); // 첫 로그인 후에는 상태 업데이트

            // 첫 로그인 시에만 mypage.vue로 이동
            this.$router.push({ name: 'editmyinformation' });
          }else{
            alert("로그인 완료")
            this.openModal();
          }
          this.$forceUpdate();
        },
        fail: (error) => {
          console.log(error);
        },
      });
    },
    kakaoLogout() {
      const authStore = useAuthStore();
      authStore.logout();
      alert("로그아웃 된거심")
    },
    checkTokenOnLoad() {
      const authStore = useAuthStore();
      const isKakaoAuthorized = window.Kakao.Auth.getAccessToken() !== null;
      
      if (isKakaoAuthorized) {
        // 토큰이 있는 경우
        authStore.setLoggedIn(true);
      } else {
        // 토큰이 없는 경우
        authStore.setLoggedIn(false);
      }
    },
  },
};
</script>