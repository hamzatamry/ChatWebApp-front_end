<template>
  <div class="container">
    <nav class="navbar navbar-expand-lg bg-primary">
      <div class="container">
        <a class="navbar-brand" href="#" style="color: white;">Welcome to Chat</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown2" aria-controls="navbarNavDropdown2" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse  justify-content-end" id="navbarNavDropdown2">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" href="#" style="color: white;">
                <button type="button" class="btn btn-success position-relative" @click="addIncomingMessages()">
                  Inbox
                  <span v-if="inboxMessages.length > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {{ inboxMessages.length }}
                    <span class="visually-hidden">unread messages</span>
                  </span>
                </button>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" style="color: white;">
                <button class="btn btn-danger" @click="logout()">Logout</button>
              </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" style="color: white;">
                  <button type="button" class="btn btn-primary">{{ this.$store.getters.email }} </button>
                </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    
    <div class="card">
      <div class="card-body">
        <div class="form-floating">
          <textarea readonly class="form-control" placeholder="Leave a comment here" id="floatingTextarea" style="height: 400px;" v-model="chat" ></textarea>
          <label for="floatingTextarea">Messages</label>
        </div>
        <!-- <textarea rows="10" cols="200" v-model="chat"></textarea> -->
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
      oldMessages: [] as { senderEmail: string, message: string}[],
      inboxMessages: [],
      chat: "",
      notificationClicked: false,
      formIsValid: true
    }
  },
  created() {
    this.connection = new HubConnectionBuilder().withUrl('/chat').build();

    this.connection.on('ReceiveMessage', (senderEmail: string, message: string) => {
      const msg: string = `${senderEmail}: ${message}\n`;
      this.inboxMessages.push(msg);
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
    getMessages() {
      const url = `/api/messages/${this.$store.getters.userId}`;
      axios.get<{ senderEmail: string, message: string}[]>(url)
      .then((response) => {
        console.log(response.data); 
        
        this.oldMessages = response.data;

        for (let oldMessage of this.oldMessages) {
          this.chat += `${oldMessage.senderEmail}: ${oldMessage.message}\n`;
        }

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
    },
    addIncomingMessages() {
      this.chat += this.inboxMessages;
      this.inboxMessages = [];
    },
    logout() {
      this.$store.dispatch('logout', { connection: this.connection });
    }
  },
  destroyed() {
    console.log("destroyed");
    this.connection?.stop();
  } 
});
</script>
