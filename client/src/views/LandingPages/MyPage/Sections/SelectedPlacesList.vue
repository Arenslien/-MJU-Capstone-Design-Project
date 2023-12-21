<template>
  <div>
    <div class="dropdown">
      <button
        class="btn btn-secondary dropdown-toggle"
        type="button"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        {{ selectedFilter }}
      </button>
      <div v-for="book in book_id" key="book">
        <span>북마크 {{ book.value }}</span>
      </div>
      <ul
        class="dropdown-menu"
        style="justify-content: center"
        aria-labelledby="dropdownMenuButton"
      >
        <li><a class="dropdown-item" @click="filterall('전체')">전체</a></li>
        <li>
          <a class="dropdown-item" @click="filtertour('관광지')">관광지</a>
        </li>
        <li>
          <a class="dropdown-item" @click="filterwork('업무공간')">업무공간</a>
        </li>
      </ul>
    </div>
    <div style="height: 450px; overflow-y: auto">
      <ul>
        <!--tourist-->
        <div v-if="selectedFilter === '관광지'">
          <li
            v-for="spot in touristSpots"
            :key="spot.id"
            @click="handleClick(spot)"
            :class="{ selected: isSelected(spot) }"
          >
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                padding: 8px;
                margin-top: 10px;
              "
            >
              <span style="color: black">{{ spot.NAME }}</span>
              <span style="color: gray; font-size: 0.8em">{{
                spot.ADDRESS
              }}</span>
            </div>
          </li>
        </div>
        <!--worklist-->
        <div v-if="selectedFilter === '업무공간'">
          <li
            v-for="space in workSpaces"
            :key="space.id"
            @click="handleClick(space)"
            :class="{ selected: isSelected(space) }"
          >
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                padding: 8px;
                margin-top: 10px;
              "
            >
              <span style="color: black">{{ space.NAME }}</span>
              <span style="color: gray; font-size: 0.8em">{{
                space.ADDRESS
              }}</span>
            </div>
          </li>
        </div>
        <!--합쳐서-->
        <div v-if="selectedFilter === '전체'">
          <li
            v-for="space in workSpaces"
            :key="space.id"
            @click="handleClick(space)"
            :class="{ selected: isSelected(space) }"
          >
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                padding: 8px;
                margin-top: 10px;
              "
            >
              <span style="color: black">{{ space.NAME }}</span>
              <span style="color: gray; font-size: 0.8em">{{
                space.ADDRESS
              }}</span>
            </div>
          </li>
          <li
            v-for="spot in touristSpots"
            :key="spot.id"
            @click="handleClick(spot)"
            :class="{ selected: isSelected(spot) }"
          >
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                padding: 8px;
                margin-top: 10px;
              "
            >
              <span style="color: black">{{ spot.NAME }}</span>
              <span style="color: gray; font-size: 0.8em">{{
                spot.ADDRESS
              }}</span>
            </div>
          </li>
        </div>
      </ul>
    </div>
    <div style="margin-top: 5px">
      <MaterialButton
        variant="gradient"
        color="success"
        class="mt-2 mb-2"
        @click.prevent="editMode"
        v-if="!visible"
      >
        수정
      </MaterialButton>
      <MaterialButton
        variant="gradient"
        color="secondary"
        class="mt-2 mb-2"
        @click.prevent="deleteSelectedSpots"
        v-if="visible"
      >
        삭제
      </MaterialButton>
      <MaterialButton
        variant="gradient"
        color="success"
        class="mt-2 mb-2 ms-2"
        @click.prevent="saveUnselectedSpots"
        v-if="visible"
      >
        저장
      </MaterialButton>
    </div>
  </div>
</template>
<script setup>
import MaterialButton from "@/components/MaterialButton.vue";
</script>
<script>
import axios from "axios";
import { useAuthStore } from "../../../../stores/index.js";

export default {
  props: {
    places: Array,
  },
  data() {
    return {
      visible: false,
      book_id: 1,
      selectedFilter: "전체",
      touristSpots: [],
      selectedSpots: [],
      workSpaces: [],
    };
  },
  mounted() {
    this.fetchData();
  },
  computed: {
    filteredData() {
      if (this.selectedFilter === "전체") {
        return this.touristSpots.concat(this.workSpaces);
      } else if (this.selectedFilter === "관광지") {
        return this.touristSpots;
      } else if (this.selectedFilter === "업무공간") {
        return this.workSpaces;
      }
    },
  },
  methods: {
    async fetchData() {
      const authStore = useAuthStore();
      const apiUrl = `/api/bookmark?user_id=${authStore.userInfo.user_id}`;

      try {
        axios.get(apiUrl).then((response) => {
          console.log(response.data);
          //this.book_id = response.data.boomark_id;
          //console.log(book_id);
          this.touristSpots = this.extractTouristSpots(response.data.data);
          this.workSpaces = this.extractWorkSpaces(response.data.data);
          // this.places = [...this.touristSpots, ...this.workSpaces];

          console.log(this.places);
          console.log("czcz");
        });
      } catch (error) {
        console.error("데이터 가져오기 오류:", error);
      }
    },
    extractWorkSpaces(data) {
      const workSpaces = [];
      console.log("workspace: ", data);
      
      const workspaces = data.workspaces;
      console.log(workspaces);
      for (const idx in workspaces) {
        const workspace = workspaces[idx];
        
  	workSpaces.push({
          id: workspace.workspace_id,
          NAME: workspace.name,
          ADDRESS: workspace.road_address, // 적절한 주소 속성으로 변경
          X_COORD: workspace.x,
          Y_COORD: workspace.y,
          TYPE: workspace.type,
        });
      }

      return workSpaces;
    },
    extractTouristSpots(data) {
      const touristSpots = [];
      console.log("tour spot: ", data);
      const tourists = data.tourists;
      console.log(tourists);
      
      for (const idx in data) {
        console.log("idx: ", idx);
      }
 
      for (const idx in tourists) {
        const tourSpot = tourists[idx];
        
	touristSpots.push({
          id: tourSpot.tourist_id,
	  NAME: tourSpot.name, // 수정된 부분
          ADDRESS: tourSpot.road_address, // 수정된 부분
          X_COORD: tourSpot.x, // 수정된 부분
          Y_COORD: tourSpot.y, // 수정된 부분
          TYPE: tourSpot.type,
        });
      }
      return touristSpots;
    },
    filterall(a) {
      this.selectedFilter = a;
    },
    filtertour(b) {
      this.selectedFilter = b;
    },
    filterwork(c) {
      this.selectedFilter = c;
    },
    filterData() {
      if (this.selectedFilter === "전체") {
        return this.touristSpots.concat(this.workSpaces);
      } else if (this.selectedFilter === "관광지") {
        return this.touristSpots;
      } else if (this.selectedFilter === "업무공간") {
        return this.workSpaces;
      }
    },

    handleClick(spot) {
      const index = this.selectedSpots.findIndex(
        (selectedSpot) => selectedSpot.id === spot.id
      );

      if (index === -1) {
        this.selectedSpots.push(spot);
      } else {
        this.selectedSpots.splice(index, 1);
      }
      this.$emit("spot-click", {
        name: spot.NAME,
        x: spot.X_COORD,
        y: spot.Y_COORD,
        selectedSpots: this.selectedSpots,
      });
    },
    isSelected(spot) {
      return this.selectedSpots.some(
        (selectedSpot) => selectedSpot.id === spot.id
      );
    },
    editMode() {
      this.visible = true;
    },
    deleteSelectedSpots() {
      this.touristSpots = this.touristSpots.filter(
        (spot) => !this.isSelected(spot)
      );
      this.workSpaces = this.workSpaces.filter(
        (space) => !this.isSelected(space)
      );
      this.selectedSpots = [];
    },
    saveUnselectedSpots() {
      this.touristSpots = this.touristSpots.filter(
        (_, index) => !this.selectedSpots.includes(index)
      );
      this.workSpaces = this.workSpaces.filter(
        (space) => !this.isSelected(space)
      );
      this.selectedSpots = [];
      this.visible = false;
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
