<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h1>
          Chat
          <button type="button" class="btn btn-primary position-relative">
            New Messages
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {{ messageCount }}+
              <span class="visually-hidden">unread messages</span>
            </span>
          </button>
        </h1>
      </div>
      <div class="card-body">
        <textarea rows="10" cols="200"></textarea>
        <form :submit="submitForm">
          <div class="input-group">
            <span>
              <select  id="receivers" class="form-select">
              <option selected>Choose a receiver : </option>
              <option v-for="user of users" :key="user" :value="user">{{ user }}</option>
              </select>
            </span>
            <input type="text" class="form-control" placeholder="Your message">
            <div class="input-group-append">
              <button class="btn btn-outline-secondary" type="button">Send</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'MessagesView',
  data() {
    return {
      email: "",
      password: "",
      messageCount: 99,
      users : [
        'hamzatamry@outlook.fr',
        'zakariasabour@outlook.fr',
        'test@test.com'
      ]
    }
  },
  methods: {
    validateForm() {

    },
    submitForm() {
      console.log(this.email + " " + this.password);
    },
  }
});
</script>