<template>
    <div class="container">
        <div v-if="isAuthenticated" class="main">
            <conversations></conversations>
            <conversationActions></conversationActions>
        </div>
        <h1 v-else>Z A L O G U J <br> S I Ę</h1>
    </div>
</template>

<script>
import axios from "axios";
const url = "api";
import Conversations from "../components/Conversations";
import ConversationActions from "../components/ConversationActions";

export default {
    name: "chat",
    components: {
        Conversations,
        ConversationActions
    },
    data () { 
        return {
            isAuthenticated: null,
            user: null
        };
    },
    created() {
        axios.get(url, { withCredentials: true })
        .then(res => {
            this.isAuthenticated = res.data.isAuthenticated;
            this.user = res.data.user;
        })
        .catch(error => {
            this.error = error.response.data.message;
        });
    }
};
</script>

<style lang="scss">
.main {
    display: grid;
    grid-template-columns: 20% 80%;
}
@media (max-width: 768px) {
    .main {
        display: grid;
        grid-template-columns: 30% 70%;
    }
}
@media (max-width: 550px) {
    .main{
        display: grid;
        grid-template-columns: 40% 60%;
    }
}
</style>
