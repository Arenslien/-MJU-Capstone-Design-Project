import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
const pinia = createPinia();
// Nucleo Icons
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";

import materialKit from "./material-kit";

const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(materialKit);
app.mount("#app");

// 카카오
window.Kakao.init("fdf15a73f0d1ae486766b611bc61f897");
