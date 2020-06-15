<template>
  <div class="auctionData">
    <h2 v-if="!isAuthenticated" class="title"> Z A L O G U J <br/> S I Ę</h2>
    <div v-else class="auctionForm">
      <form action="#" @submit.prevent="addNew">
        <h2 class="title">DODAJ NOWĄ AUKCJĘ</h2>
        <p v-if="error" class="error">{{error}}</p>
        <div class="formDiv">
          <label for="itemName">Nazwa przedmiotu</label>
          <input type="text" name="itemName" id="itemName" class="form-input" v-model="itemName" />
        </div>
        <div class="formDiv">
          <label for="description">Opis</label>
          <input
            type="text"
            name="description"
            id="description"
            class="form-input"
            v-model="description"
          />
        </div>
        <div class="formDiv">
          <label for="price">Cena</label>
          <input type="number" min="0" step="0.01" name="price" id="price" class="form-input" v-model="price" />
        </div>
        <div class="formDiv">
          <label for="auctionable">Licytacja?</label>
          <input
            type="checkbox"
            name="auctionable"
            id="auctionable"
            class="form-input"
            v-model="auctionable"
          />
        </div>
        <div class="formDiv">
          <label for="begin">Data i czas rozpoczęcia:</label>
          <input type="date" name="begin" id="begin" class="form-input" :min="today" v-model="begin" />
          <input type="time" name="beginTime" id="beginTime" class="form-input" v-model="beginTime" />
        </div>
        <div class="formDiv">
          <label for="end">Data i czas zakończenia:</label>
          <input type="date" name="end" id="end" class="form-input" :min="begin" v-model="end" />
          <input type="time" name="endTime" id="endTime" class="form-input" v-model="endTime" />
        </div>
        <div class="formDiv" id="radio">
          <label><input v-model="picture" type="radio" id="devices" name="picture" value="devices.png">
          <img src="../assets/devices.png"/></label>
          <label><input v-model="picture" type="radio" id="agd" name="picture" value="agd.png">
          <img src="../assets/agd.png"/></label>
          <label><input v-model="picture" type="radio" id="clothes" name="picture" value="clothes.png">
          <img src="../assets/clothes.png"/></label>
          <label><input v-model="picture" type="radio" id="furniture" name="picture" value="furniture.png">
          <img src="../assets/furniture.png"/></label>
          <label><input v-model="picture" type="radio" id="garden" name="picture" value="garden.png">
          <img src="../assets/garden.png"/></label>
        </div>
        <div class="formDiv">
          <button type="submit">ZATWIERDŹ</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
const url = "/api/auctions";
const aUrl = "api";

export default {
  name: "addAuction",
  data() {
    return {
      isAuthenticated: null,
      user: null,
      error: null,
      message: null,
      today: "",
      itemName: "",
      description: "",
      price: "",
      auctionable: "",
      begin: "",
      beginTime: "",
      end: "",
      endTime: "",
      picture: ""
    };
  },
  created() {
    axios
      .get(aUrl, { withCredentials: true })
      .then(resp => {
        this.isAuthenticated = resp.data.isAuthenticated;
        this.user = resp.data.user;
        this.today = new Date();
        this.begin = this.today.toISOString().substring(0,10);
        let minutes = this.today.getMinutes();
        let hours = this.today.getHours();
        if(minutes < 10){
          minutes = "0" + minutes;
        }
        if(hours < 10) {
          hours = "0" + hours;
        }
        this.beginTime = hours + ":" + minutes;        
        this.today = this.begin;
      })
      .catch(error => {
        this.error = error.response.data.message;
      });
  },
  methods: {
    addNew() {
      if(this.begin===this.end && this.beginTime > this.endTime){
        this.error = "Data zakończenia musi być większa niż rozpoczęcia";
      }else{
        if(!this.auctionable){
          this.auctionable=false;
        }
        axios.post(url, {
            itemName: this.itemName,
            description: this.description,
            price: this.price,
            auctionable: this.auctionable,
            begin: this.begin,
            beginTime: this.beginTime,
            end: this.end,
            endTime: this.endTime,
            picture: this.picture
          }, { withCredentials: true })
          .then(resp => {
            this.$router.push("/history");
          })
          .catch(error => {
            this.error = error.response.data.message;
          });
      }
    }
  }
};
</script>

<style lang="scss">
$darkTeal: rgb(30, 78, 71);
$lighterTeal: rgb(42, 107, 97);
$lightTeal: rgb(53, 133, 121);
$wood: rgb(223, 206, 174);
$lightWood: rgba(245, 234, 214, 0.562);
$brown: rgb(57, 42, 28);
$grey: rgb(190, 216, 202);
$burgundy: rgb(129, 25, 25);
$lighterBurgundy: rgba(133, 55, 55, 0.514);

.auctionData {
  display: flex;
  justify-content: center;
  .auctionForm {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 30%;
    background-color: $wood;
    .title {
      color: $lighterTeal;
    }
    .error {
      color: $burgundy;
      background-color: $lighterBurgundy;
      border-radius: 20px;
    }
    form {
      display: flex;
      flex-direction: column;
      .formDiv {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 5px;
        label {
          color: $brown;
          font-weight: bolder;
        }
        input {
          border: none;
          background-color: $lightWood;
          border-radius: 20px;
          height: 30px;
          text-align: center;
        }
        
      }
      #radio{
        display: inline-block;
        [type=radio] { 
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }
        [type=radio] + img {
          cursor: pointer;
        }
        [type=radio]:checked + img {
          outline: 2px solid $burgundy;
        }
        img{
          height: 50px;
          width: 50px;
        }
      }
      button {
        background-color: $darkTeal;
        color: $wood;
        border: none;
        border-radius: 20px;
        height: 30px;
        font-weight: bolder;
        margin-bottom: 10px;
      }
    }
  }
}

@media (max-width: 768px) {
  .auctionData {
    .auctionForm {
      width: 50%;
    }
  }
}
@media (max-width: 550px) {
  .auctionData {
    .auctionForm {
      width: 70%;
    }
  }
}
</style>