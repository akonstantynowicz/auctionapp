<template>
    <div class="chatWindow">
        <h2 v-if="!conversation">Wybierz rozmowę</h2>
        <div v-else>
          <h2>Chat z: {{username}}</h2>
            <div v-if="messages" class="messages">
                <div class="message" v-for="message in messages" :key="message._id">
                    <div v-if="message.userId===yourId" class="yourMessage">
                        <div class="username">Ty:</div>
                        <div class="content"> {{ message.content }} </div>
                        <div class="date">{{new Date(message.date).toUTCString().slice(0,-4) }}</div>
                    </div>
                    <div v-else class="elseMessage">
                        <div class="username">{{ username }}:</div>
                        <div class="content"> {{ message.content }} </div>
                        <div class="date">{{new Date(message.date).toUTCString().slice(0,-4) }}</div>
                    </div>
                </div>
            </div>
            <form @submit.prevent="sendMessage" class="messageContainer">
                <input type="text" v-model.lazy="msg">
                <button :disabled="!msg">WYŚLIJ</button>
            </form>
        </div>
        </div>
</template>

<script>
import io from 'socket.io-client';
const url = window.location.host + "/api/chat";
//const url = "https://localhost:3000/api/chat";

export default {
    data () {
        return {
            conversation: null,
            username: null,
            yourId: null,
            yourUsername: null,
            msg: null,
            messages: [],
            socket: null
        };
    },
    methods: {
        joinConversation () {
            this.socket.emit("joinChat", this.conversation._id, this.yourId, this.yourUsername);
            this.fetchMessages();
        },
        fetchMessages () {
            this.socket.on("fetchMessages", data => {
                this.messages = data;                
            })
        },
        sendMessage () {
            if(!this.msg){
                alert("wiadomość nie może być pusta");
                return;
            }
            this.socket.emit("sendMessage", this.conversation._id, this.msg, this.username, this.yourId);
            this.msg="";
        },
    },
    created () {
        this.$root.$on("conversationSelected", (conversation, username, userIdFrom, usernameFrom) => {
            if(this.socket!==null){
                this.socket.emit("leaveRoom", this.conversation._id);
            }
            this.conversation = conversation;
            this.username = username;
            this.yourId = userIdFrom;
            this.yourUsername = usernameFrom;
            this.$root.$emit("hide");
            this.conversation.show = true;
            
            this.socket = io(url);
            this.joinConversation();
            this.socket.on("message", message => {
            this.messages.push(message);
            })
        });
    },
    updated() {
        document.querySelector(".messages").scrollTo(0,document.querySelector(".messages").scrollHeight-1);
    },
    beforeDestroy () {
        if(this.socket){
            this.socket.emit("leaveRoom", this.conversation._id);
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
$lighterWood: rgba(245, 234, 214, 0.829);
$brown: rgb(57, 42, 28);
$grey: rgb(190, 216, 202);
$burgundy: rgb(129, 25, 25);
$lighterBurgundy: rgba(133, 55, 55, 0.514);

@mixin message {
    display: flex;
    flex-direction: column;
    background-color: $darkTeal;
    border-radius: 20px;
    color: $lighterWood;
  }

.chatWindow {
background-color: $wood;
display: grid;
grid-template-rows:80% 20%;
grid-template-columns: 100%;
font-size: medium;
color: $darkTeal;
    .messages {
        grid-area: 1 / 1 / span 1 / span 1;
        background-color: $lighterWood;
        font-weight: bolder;
        height: 350px;
        overflow: scroll;
        .message {
            margin-top: 5px;
            margin-bottom: 5px;
            margin-left: 10px;
            .yourMessage {
                @include message();
                background-color: $lightTeal;
                grid-area: auto / 2 / span 1 / span 1;
                align-items: flex-end;
                padding-right: 15px;
                .username {
                    font-size: smaller;
                    margin-right: 15px;
                }
                .content {
                    flex: 1;
                }
                .date {
                    font-size: small;
                }
            }
            .elseMessage {
                @include message();
                grid-area: auto / 1 / span 1 / span 1;
                padding-left: 15px;
                flex-direction: column;
                align-items: flex-start;
                .username {
                    font-size: smaller;
                }
                .content {
                    flex: 1;
                }
                .date {
                    font-size: small;
                }
            }
        }
    }
    .messageContainer {
        grid-area: 2 / 1 / span 1 / span 1;
        background-color: $wood;
        input {
            width:65%;
            min-height:40px;
            border-radius: 20px;
            border: none;
            padding-left: 10px;
            background-color: $lightWood;
        }
        button {
            width: 30%;
            align-self: center;
            background-color: $darkTeal;
            color: $wood;
            border: none;
            border-radius: 20px;
            height: 50px;
            font-weight: bolder;
        }
    }
}
</style>
