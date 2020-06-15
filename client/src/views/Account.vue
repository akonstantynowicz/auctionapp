<template>
    <div class="accountData">
    <h2 v-if="!isAuthenticated" class="title">Z A L O G U J <br> S I Ę </h2>
    <div v-else class="accountForm">
        <h2 class="title">M O J E<br>K O N T O</h2>
        <p class="error" v-if="error">{{ error }}</p>
        <div class="form">
            <div class="formDiv">
                <label for="email">E M A I L</label>
                <input v-if="editEmail===1" type="email" name="email" id="email" class="form-input" v-model="email">
                <p v-else class="fieldName">{{ user.email }}<button @click="updateEmail"><img class="editImg" src="../assets/edit.png"></button></p>
            </div>
            <div class="formDiv">
                <label for="username">N A Z W A</label>
                <input v-if="editUsername===1" type="text" name="username" id="username" class="form-input" v-model="username">
                <p v-else class="fieldName">{{ user.username }}<button @click="updateUsername"><img class="editImg" src="../assets/edit.png"></button></p>
            </div>
            <div class="formDiv">
                <label for="password">H A S Ł O</label>
                <input v-if="editPassword===1" type="password" name="password" id="password" class="form-input" v-model="password">
                <p v-else class="fieldName"><button @click="updatePassword"><img class="editImg" src="../assets/edit.png"></button></p>
            </div>
            <div class="formDiv">
                <button @click="changeData">ZATWIERDŹ ZMIANY</button>
            </div>
        </div>
    </div>
    </div>
</template>

<script>
import axios from "axios";
const url = "api/account"

export default{
    name: "account",
    data() {
        return {
            isAuthenticated: null,
            user: null,
            error: null,
            message: null,
            username: "",
            email: "",
            password: "",
            editEmail: 0,
            editUsername: 0,
            editPassword: 0
        }
    },
    created(){
        axios.get(url, {withCredentials: true})
        .then((resp) => {
            this.isAuthenticated = resp.data.isAuthenticated;
            this.user = resp.data.user;
            this.email= this.user.email;
            this.username = this.user.username;
        })
        .catch(error => {
            this.error = error.response.data.message;
        })
    },
    methods: {
        changeData(){
            axios.patch(url, {
                email: this.email,
                username: this.username,
                password: this.password
            }, { withCredentials: true} )
            .then((resp) => {
                this.message = resp.data.msg;
                this.editEmail=0;
                this.editUsername=0;
                this.editPassword=0;
                this.user=resp.data.user;
            })
            .catch(error => {
                this.error = error.response.data.message;
            });
        },
        updateEmail(){
            this.editEmail=1;
        },
        updateUsername(){
            this.editUsername=1;
        },
        updatePassword(){
            this.editPassword=1;
        }
    }

}
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


.accountData {
    display:flex;
    justify-content: center;
        .accountForm {
            display: flex;
            flex-direction: column;
            justify-content: center;
            width: 30%;
            background-color: $wood;
            .title {
                color: $darkTeal;
            }
            .error {
                color: $burgundy;
                background-color: $lighterBurgundy;
                border-radius: 20px;
            }
            .form {
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
                    .fieldName{
                        font-weight: bolder;
                        color: $lighterTeal;
                    }
                    button {
                        background-color: $darkTeal;
                        color: $wood;
                        border: none;
                        border-radius: 20px;
                        height: 30px;
                        font-weight: bolder;
                        margin-bottom: 10px;
                        .editImg {
                            height: 15px;
                        }
                    }
                }
            }
        }
}

@media (max-width: 768px) {
    .accountData{
        .accountForm{
            width: 50%;
        }
    }
}
@media (max-width: 550px) {
    .accountData{
        .accountForm{
            width: 70%;
        }
    }
}
</style>
