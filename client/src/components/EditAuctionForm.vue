<template>
  <div class="editData">
    <div class="editForm">
    <p v-if="error" class="error">{{error}}</p>
      <form action="#" @submit.prevent="edit">
        <div class="itemName">
          <label for="itemName">Nazwa przedmiotu</label>
          <input type="text" name="itemName" id="itemName" class="form-input" v-model="itemName" />
        </div>
        <div class="description">
          <label for="description">Opis</label>
          <input type="text" name="description" id="description" class="form-input" v-model="description"/>
        </div>
        <div class="price">
          <label for="price">Cena</label>
          <input type="number" min="0" step="0.01" name="price" id="price" class="form-input" v-model="price" />
        </div>
        <div class="auctionable">
          <label for="auctionable">Licytacja?</label>
          <input
            type="checkbox"
            name="auctionable"
            id="auctionable"
            class="form-input"
            v-model="auctionable"
          />
        </div>
        <div class="beginDate">
          <label for="begin">Data i czas rozpoczęcia:</label>
          <input type="date" name="begin" id="begin" class="form-input" :min="today" v-model="begin" />
          <input type="time" name="beginTime" id="beginTime" class="form-input" v-model="beginTime" />
        </div>
        <div class="endDate">
          <label for="end">Data i czas zakończenia:</label>
          <input type="date" name="end" id="end" class="form-input" :min="begin" v-model="end" />
          <input type="time" name="endTime" id="endTime" class="form-input" v-model="endTime" />
        </div>
        <div class="pictures" id="radio">
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
        <div class="submit">
          <button type="submit">ZATWIERDŹ</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
const url = "api/auctions";

export default {
  name: "editAuction",
  props: ["auction"],
  data() {
    return {
      error: null,
      message: null,
      today: "",
      itemName: this.auction.itemName,
      description: this.auction.description,
      price: this.auction.price,
      auctionable: this.auction.isAuctionable,
      begin: "",
      beginTime: "",
      end: "",
      endTime: "",
      picture: this.auction.picture
    };
  },
  created() {
    axios
      .get(url, { withCredentials: true })
      .then(resp => {
        this.begin = this.auction.beginTime.substring(0,10);
        this.end = this.auction.endTime.substring(0,10);
        let today = new Date();
        this.today = today.toISOString().substring(0,10);
        let bMinutes = new Date(this.auction.beginTime).getMinutes();
        let eMinutes = new Date(this.auction.endTime).getMinutes();
        let bHours = new Date(this.auction.beginTime).getHours();
        let eHours = new Date(this.auction.endTime).getHours();
        if(bMinutes < 10){
          bMinutes = "0" + bMinutes;
        }
        if(eMinutes < 10){
          eMinutes = "0" + eMinutes;
        }
        if(bHours < 10) {
          bHours = "0" + bHours;
        }
        if(eHours < 10) {
          eHours = "0" + eHours;
        }
        this.beginTime = bHours + ":" + bMinutes;
        this.endTime = eHours + ":" + eMinutes;
      })
      .catch(error => {
        this.error = error;
      });
  },
  methods: {
    edit() {
      if(this.begin===this.end && this.beginTime > this.endTime){
        this.error = "Data zakończenia musi być większa niż rozpoczęcia";
      }else{
        if(!this.auctionable){
          this.auctionable=false;
        }
        axios.patch(url, {
            itemName: this.itemName,
            description: this.description,
            price: this.price,
            auctionable: this.auctionable,
            begin: this.begin,
            beginTime: this.beginTime,
            end: this.end,
            endTime: this.endTime,
            picture: this.picture,
            auctionId: this.auction._id,
            oldBegin: this.auction.beginTime
          }, { withCredentials: true })
          .then(resp => {
            this.message = resp.data.msg;            
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

@mixin formDiv {
    display: flex;
    flex-direction: column;
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
.editData {
  .editForm {
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
        display:none;
        display: grid;
        grid-template-columns: 40% 10% 25% 25%;
        grid-template-rows: 20% 40% 20% 20%;
        .itemName{
            grid-area: 1 / 1 / span 1 / span 1;
            @include formDiv();
        }
        .description{
            grid-area: 2 / 2 / span 1 / span 3;
            @include formDiv();

        }
        .price {
            grid-area: 3 / 4 / span 1 / span 1;
            @include formDiv();

        }
        .auctionable {
            grid-area: 3 / 3 / span 1 / span 1;
            @include formDiv();

        }
        .beginDate {
            grid-area: 1 / 3 / span 1 / span 1;
            @include formDiv();

        }
        .endDate {
            grid-area: 1 / 4 / span 1 / span 1;
            @include formDiv();

        }
        .pictures {
            grid-area: 2 / 1 / span 2 / span 1;
        }
        .submit {
            grid-area: 4 / 4 / span 1 / span 1;
        }
            #radio{
                display: grid;
                grid-template-columns: repeat(5, auto);
                grid-template-rows: repeat(5, auto);
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
                margin-bottom: 50px;
                }
            }
    }
  }
}
</style>