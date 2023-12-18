<template>
  <div style="height: 450px; overflow-y: auto; border-bottom: 1px solid #ccc">
    <ul>
      <li
        v-for="spot in workSpaces"
        :key="spot.id"
        @click="handleClick(spot)"
        :class="{ selected: isSelected(spot) }"
      >
        <div
          style="
            display: flex;
            align-items: flex-start;
            padding: 8px;
            margin-top: 10px;
          "
        >
          <div>
            <span style="color: black">{{ spot.NAME }}</span>
            <span style="color: gray; font-size: 0.8em">{{
              spot.ADDRESS
            }}</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
  <div style="margin-top: 5px">
    <MaterialButton
      variant="gradient"
      color="success"
      class="mt-2 mb-2"
      @click="sendSelectedSpotsToUserInfo"
    >
      업무공간 저장
    </MaterialButton>
  </div>
</template>

<script setup>
import MaterialButton from "@/components/MaterialButton.vue";
</script>
<script>
import axios from "axios";
import { useAuthStore } from "../../stores/index.js";

export default {
  data() {
    return {
      selectedSpots: [],
      workSpaces: [], // 변경된 부분: 여행지 정보를 나타내는 변수명을 workSpaces로 변경
    };
  },
  mounted() {
    this.fetchWorkSpaces(); // 변경된 부분: 여행지 정보를 가져오는 함수명을 fetchWorkSpaces로 변경
  },
  methods: {
    async fetchWorkSpaces() {
      // 변경된 부분: 여행지 정보를 가져오는 함수명을 fetchWorkSpaces로 변경
      await axios
        .get("http://localhost:8080/api/workspace")
        .then((response) => {
          this.workSpaces = this.extractWorkSpaces(response.data); // 변경된 부분: 여행지 정보를 처리하는 함수명을 extractWorkSpaces로 변경
        })
        .catch((error) => {
          console.error("업무공간 데이터를 불러오는 중 오류 발생", error);
        });
    },
    extractWorkSpaces(data) {
      // 변경된 부분: 여행지 정보를 처리하는 함수명을 extractWorkSpaces로 변경
      const workSpaces = [];
      for (const areaGroup in data) {
        for (const idx in data[areaGroup]) {
          const workspace = data[areaGroup][idx];
          workSpaces.push({
            id: workspace.WORK_SPACE_ID,
            NAME: workspace.NAME,
            ADDRESS: workspace.ADDRESS,
            X_COORD: workspace.X_COORD,
            Y_COORD: workspace.Y_COORD,
            AREA_GROUP: workspace.AREA_GROUP,
          });
        }
      }

      return workSpaces;
    },
    handleClick(space) {
      const index = this.selectedSpots.findIndex(
        (selectedSpace) => selectedSpace.id === space.id
      );

      if (index === -1) {
        this.selectedSpots.push(space);
      } else {
        this.selectedSpots.splice(index, 1);
      }

      this.$emit("work-click", {
        x: space.X_COORD,
        y: space.Y_COORD,
        selectedSpots: this.selectedSpots,
      });
    },
    isSelected(space) {
      return this.selectedSpots.some(
        (selectedSpace) => selectedSpace.id === space.id
      );
    },
    sendSelectedSpotsToUserInfo() {
      const authStore = useAuthStore();
      const numberOfDays = authStore.numberOfDays;

      let minSelectedSpots;
      if (numberOfDays >= 3 && numberOfDays <= 7) {
        minSelectedSpots = 3;
      } else if (numberOfDays >= 8 && numberOfDays <= 14) {
        minSelectedSpots = 5;
      } else if (numberOfDays >= 15 && numberOfDays <= 21) {
        minSelectedSpots = 7;
      } else if (numberOfDays >= 22 && numberOfDays <= 30) {
        minSelectedSpots = 9;
      } else {
        // Handle other cases if needed
        console.error("Invalid numberOfDays:", numberOfDays);
        return;
      }

      if (this.selectedSpots.length !== minSelectedSpots) {
        alert(`${minSelectedSpots}개의 업무공간을 선택해주세요.`);
        return;
      }

      this.sendSelectedSpotsToBackend();
    },
    sendSelectedSpotsToBackend() {
      const selectedSpotsInfo = this.selectedSpots.map((space) => ({
        id: space.id,
        name: space.NAME,
        lat: space.X_COORD,
        lng: space.Y_COORD,
      }));

      // 사용자 ID가 auth store에 있다고 가정합니다
      const authStore = useAuthStore();
      const userId = authStore.userInfo.user_id;
      const travelIds = authStore.travelids;

      // createBookmark API 호출
      axios
        .post("http://localhost:8080/api/bookmark", {
          user_id: userId,
          workspace_ids: selectedSpotsInfo.map((space) => space.id),
          tourist_ids: travelIds,
        })
        .then((response) => {
          const { res, message } = response.data;
          if (res) {
            console.log(message);
            alert("저장이완료되었습니다!");
            this.$router.push({ name: "presentation" });
          } else {
            console.error(message);
            alert("저장실패했습니다! 다시 시도해주세요");
          }
        })
        .catch((error) => {
          console.error(
            "선택된 업무공간을 백엔드로 전송 중 오류 발생",
            error.response
          );
        });
    },
  },
};
</script>

<style scoped>
div {
  border-radius: 10px;
}

li {
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.selected {
  background-color: #dcdcdc;
  color: white;
}

li:hover {
  background-color: #dcdcdc;
}

.styled-button {
  width: 100px;
  height: 35px;
  padding: 5px 0;
  background-color: rgba(12, 222, 187, 0.873);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  text-align: center;
}
</style>

<style scoped>
/* scoped를 사용하여 컴포넌트 내에서만 스타일이 적용되도록 설정 */
div {
  border-radius: 10px;
}

li {
  cursor: pointer;
  transition: background-color 0.3s ease;
}

li:hover {
  background-color: #dcdcdc;
}
</style>
