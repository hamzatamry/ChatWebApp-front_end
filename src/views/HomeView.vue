<template>
  <div class="container">
    <nav class="navbar navbar-expand-lg bg-primary" >
      <div class="container">
        <a class="navbar-brand" href="#" style="color: white;">Welcome to Chat</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown2" aria-controls="navbarNavDropdown2" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
      </div>
    </nav>
    <div class="card">
      <div class="card-body">
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="email">Email address : </label>
            <input id="email" type="email" class="form-control"  name="email" v-model="email" placeholder="Enter email" /> <!-- minlength="5"> -->
          </div>
          <div class="form-group">
            <label for="password">Password : </label>
            <input id="password" type="password" class="form-control" name="password" v-model="password" placeholder="Password" /> <!--minlength="8" maxlength="20" /> -->
          </div>
          <div>
            <p :style="{ color: feedbacksuccess ? 'green' : 'red' }">{{ feedbackMessage }}</p>
            <button class="btn btn-primary">{{ submitButtonCaption }}</button>
            <div @click="switchAuthMode" class="btn">{{ switchModeButtonCaption }}</div>
          </div>
        </form>
      </div>  
    </div>
  </div>
</template>

<script lang="ts">
import { AxiosError, AxiosResponse } from 'axios';
import Vue from 'vue';

export default Vue.extend({
  name: 'HomeView',
  data() {
    return {
      email: '',
      password: '',
      feedbackMessage: "", //coming from server validation
      feedbacksuccess: true, //server validation status
      mode: 'login',
    }
  },
  computed: {
    submitButtonCaption() {
      if (this.mode === 'login') {
        return 'Login';
      }
      else {
        return 'Signup';
      }
    },
    switchModeButtonCaption() {
      if (this.mode === 'login') {
        return 'Signup instead';
      }
      else {
        return 'Login instead';
      }
    }
  },
  methods: {
    switchAuthMode() {
      if (this.mode === 'login') {
        this.mode = 'signup';
      }
      else {
        this.mode = 'login';
      }
    },
    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(this.email);
    },
    validatePassword() {
      //must have both numbers min length of 8
      const minLength = 8;
      const hasNumbers = /\d/.test(this.password);
      return this.password.length >= minLength && hasNumbers;
    },
    validateForm() {
      if (!this.validateEmail(this.email) || !this.validatePassword(this.password)) {
        return false;
      }
      return true;
    },
    submitForm() {

      // commented for testing
      // if (!this.validateForm()) {
      //   return;
      // }

      if (this.mode === 'login') {
        this.$store.dispatch('login', {
          email: this.email,
          password: this.password
        })
        .then((response: any) => {        
          const responseData = response.data;
          
          localStorage.setItem("userId", responseData.userId)
          localStorage.setItem("token", responseData.token);

          this.$store.commit('setUser', {
              token: response.data.token,
              userId: response.data.userId,
              email: this.email,
              isAuthenticated: true
          });

          this.$router.push({ name: "chat"});
        })
        .catch(error => {
          this.feedbacksuccess = false; this.feedbackMessage = error.response.data.message;
          console.log(error);
        })
      }
      else {
        this.$store.dispatch('signup', {
          email: this.email,
          password: this.password
        }) 
        .then((response: AxiosResponse) => {
          console.log(response.data);
          this.feedbacksuccess = true;
          this.feedbackMessage = response.data.message;
        })
        .catch((error: any) => {
          console.log(error);
          this.feedbacksuccess = false;
          this.feedbackMessage = error.response.data.message;
        })    
      } 
    }
  }
});
</script>
