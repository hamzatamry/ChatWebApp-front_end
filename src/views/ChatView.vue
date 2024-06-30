<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h1>
          Chat 
          <button type="button" class="btn btn-primary">
            New Messages
            <span v-if="messages.length > 1" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {{ messages.length }}
              <span class="visually-hidden">unread messages</span>
            </span>
          </button>
        </h1>
        <h2>Connected user : {{ this.$store.getters.email }} <button class="btn btn-danger">Logout</button></h2>
      </div>
      <div class="card-body">
        
        <textarea rows="10" cols="200" v-model="chat"></textarea>
        
        <form @submit.prevent="sendMessage">
          <div class="input-group">
            <span>
              <select  id="receivers" class="form-select" @change="setReceiver($event)">
              <option selected disabled>Choose a receiver : </option>
              <option v-for="user of users" :key="user.userID"   :value="user.userID" >{{ user.email }}</option>
              </select>
            </span>
            <input type="text" required class="form-control" placeholder="Your message" v-model="message">
            <div class="input-group-append">
              <button type="submit" class="btn btn-outline-secondary" >Send</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { HubConnectionBuilder } from '@microsoft/signalr';
import axios from 'axios';

export default Vue.extend({
  name: 'ChatView',
  data() {
    return {
      email: "",
      password: "",
      users: [],
      receiverId: 1,
      connection: null as signalR.HubConnection | null,
      message: "",
      messages: [""],
      chat: "",
      notificationClicked: false,
      formIsValid: true
    }
  },
  created() {
    this.connection = new HubConnectionBuilder().withUrl('/chat').build();

    this.connection.on('ReceiveMessage', (senderEmail: string, message: string) => {
      const msg: string = `${senderEmail}: ${message}\n`;
      this.messages.push(msg);
      this.chat += msg;
    });

    this.connection.start()
    .then(() => {
      console.log('Connection started');
      console.log(this.connection?.connectionId);
      console.log(this.$store.getters.userId);

      //send connectionId wtih connected userID to database
      this.$store.dispatch('connect', { connectionId: this.connection?.connectionId, userId: this.$store.getters.userId })
      .then(response => console.log(response))
      .catch(error => console.log(error));
    })
    .catch(err => console.error('Error while starting connection: ' + err));
  },
  mounted() {
    this.getMessages();
    this.getUsers();
  },
  methods: {
    getMessages() {
      const url = "/api/messages";
    },
    getUsers() {
      //retrieve the list of users in the backend (userId + email)
      const url = "/api/users";

      console.log(this.$store.getters.userId);

      axios.get(url)
      .then((response) => {
        console.log(response);
        this.users = response.data; 
        this.users = this.users.filter(user => user.userID != this.$store.getters.userId); //except current user
      })
      .catch((error) => {
        console.log(error);
      })
    },
    setReceiver(event: any) {
      this.receiverId = parseInt(event.target.value);
    },
    validateForm() {
    },
    sendMessage() {
      const senderId = this.$store.getters.userId;

      console.log(senderId, this.receiverId, this.message);

      if (!this.formIsValid || this.connection == null) {
        return ;
      }

      this.connection.invoke('SendMessage', senderId, this.receiverId, this.message)
      .then(() => {
        this.message = '';
      })
      .catch(err => console.error(err));
    }
  },
  destroyed() {
    console.log("destroyed");
    this.connection?.stop();
  } 
});
</script>
