<template>
  <div>
    <div style="height: 450px; overflow-y: auto; border-bottom: 1px solid #ccc">
      <div v-for="(groupedSpots, areaGroup) in groupedTourSpots" :key="areaGroup">
        <div><b style="color: black;">{{ areaGroup }}</b></div>
        <ul>
          <li v-for="spot in groupedSpots" :key="spot.id" @click="handleClick(spot)" :class="{ selected: isSelected(spot) }">
            <div style="display: flex; align-items: flex-start; padding: 8px; margin-top: 10px;">
              <!--<img :src="getImagePath(spot.id)" alt="Spot Image" style="width: 50px; height: 50px; margin-right: 10px; border-radius: 5px;" /> -->
              <div>
                <span style="color: black">{{ spot.VISIT_AREA_NM }}</span>
                <span style="color: gray; font-size: 0.8em">{{ spot.ADDRESS }}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div style="margin-top: 5px">
      <MaterialButton variant="gradient" color="success" class="mt-2 mb-2" @click="sendSelectedSpotsToUserInfo">
        관광지 저장
      </MaterialButton>
    </div>
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
      tourSpots: [],
    };
  },
  mounted() {
    this.fetchTouristSpots();
  },
  computed: {
    groupedTourSpots() {
      return this.tourSpots.reduce((grouped, spot) => {
        const areaGroup = spot.AREA_GROUP;
        if (!grouped[areaGroup]) {
          grouped[areaGroup] = [];
        }
        grouped[areaGroup].push(spot);
        return grouped;
      }, {});
    },
  },
  methods: {
    async getImagePath(spotId) {
      try {
	const imageModule = await import(`/assets/img/tour-spots/${spotId}.jpg`)
	return imageModule.default;
      } catch (error) {
	// Hand error (e.g., image not found)
	console.error(error);
	return null;
      }

    },
    async fetchTouristSpots() {
      await axios
        .get("http://18.224.246.126:8080/api/tourist")
        .then((response) => {
          console.log(response.data);
          this.tourSpots = this.extractTouristSpots(response.data);
        })
        .catch((error) => {
          console.error("여행지 데이터를 불러오는 중 오류 발생", error);
        });
    },
    extractTouristSpots(data) {
      const tourSpotList = [];
      for (const idx in data) {
        const tourSpot = data[idx];
        const imgURL = "@/assets/img/tour-spots/" + tourSpot.ITEM_ID + ".jpg";

        tourSpotList.push({
          id: tourSpot.ITEM_ID,
          VISIT_AREA_NM: tourSpot.VISIT_AREA_NM,
          ADDRESS: tourSpot.ADDRESS,
          X_COORD: tourSpot.X_COORD,
          Y_COORD: tourSpot.Y_COORD,
          IMG_URL: imgURL,
          AREA_GROUP: tourSpot.AREA_GROUP,
        });
      }

      return tourSpotList;
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

      this.$emit("tourist-spot-click", {
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
    sendSelectedSpotsToUserInfo() {
      const authStore = useAuthStore();
      const numberOfDays = authStore.period;

      let minSelectedSpots;
      let maxSelectedSpots;
      if (numberOfDays >= 3 && numberOfDays <= 7) {
        minSelectedSpots = 2;
        maxSelectedSpots = 5;
      } else if (numberOfDays >= 8 && numberOfDays <= 14) {
        minSelectedSpots = 6;
        maxSelectedSpots = 10;
      } else if (numberOfDays >= 15 && numberOfDays <= 21) {
        minSelectedSpots = 11;
        maxSelectedSpots = 15;
      } else if (numberOfDays >= 22 && numberOfDays <= 30) {
        minSelectedSpots = 16;
        maxSelectedSpots = 20;
      } else {
        console.error("Invalid numberOfDays:", numberOfDays);
        return;
      }

      if (this.selectedSpots.length < minSelectedSpots) {
        alert(`최소 ${minSelectedSpots}개의 여행지를 선택해주세요.`);
        return;
      }

      if (this.selectedSpots.length > maxSelectedSpots) {
        alert(`최대 ${maxSelectedSpots}개의 여행지까지 선택 가능합니다.`);
        return;
      }

      this.sendSelectedSpotsToBackend();
      this.$emit("button-click");
    },
    sendSelectedSpotsToBackend() {
      const authStore = useAuthStore();
      authStore.setTravelIds(this.selectedSpots.map((spot) => spot.id));
      console.log(this.selectedSpots.map((spot) => spot.id));
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
