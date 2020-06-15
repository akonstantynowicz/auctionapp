<template>
    <div class="registerFlex">
        <div class="registerForm">
            <h2 class="title">R E J E S T R A C J A</h2>
            <p class="error" v-if="error">{{ error }}</p>
            <form action="#" @submit.prevent="register">
                <div class="formDiv">
                    <label for="email">Email</label>
                    <input type="email" name="email" id="email" class="form-input" v-model="email">
                </div>
                <div class="formDiv">
                    <label for="username">Nazwa użytkownika</label>
                    <input type="text" name="username" id="username" class="form-input" v-model="username">
                </div>
                <div class="formDiv">
                    <label for="password">Hasło</label>
                    <input type="password" name="password" id="password" class="form-input" v-model="password">
                </div>
                <div class="formDiv">
                    <button type="submit">ZAREJESTRUJ SIĘ</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from "axios";
const url = "api/register"

export default{
    name: "login",
    data() {
        return {
            email: "",
            username: "",
            password: "",
            error: ""
        }
    },
    methods: {
        register(){            
            axios.post(url,{
                email: this.email,
                username: this.username,
                password: this.password
            }, {withCredentials: true})
            .then((resp) => {
                this.$router.push("/login");
            })
            .catch(error => {
                this.error = error.response.data.message;
            });
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


.registerFlex {
    display:flex;
    justify-content: center;
        .registerForm {
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
}

@media (max-width: 768px) {
    .registerFlex{
        .registerForm{
            width: 50%;
        }
    }
}
@media (max-width: 550px) {
    .registerFlex{
        .registerForm{
            width: 70%;
        }
    }
}
</style>
