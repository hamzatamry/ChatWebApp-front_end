<template>
  <div class="card">
    <div class="card-body">
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="email">Email address : </label>
          <input id="email" type="email" class="form-control"  name="email" v-model="email" placeholder="Enter email" />
        </div>
        <div class="form-group">
          <label for="password">Password : </label>
          <input id="password" type="password" class="form-control" name="password" v-model="password" placeholder="Password" />
        </div>
        <p v-if="!formIsValid" style="color: red;">The form is not valid</p>
        <div>
          <p :style="{ color: success ? 'green' : 'red' }">{{ formMessage }}</p>
          <button class="btn btn-primary">{{ submitButtonCaption }}</button>
          <div @click="switchAuthMode" class="btn">{{ switchModeButtonCaption }}</div>
        </div>
      </form>
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
      formIsValid: true,
      formMessage: "",
      mode: 'login',
      success: true,
      
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
    validateForm() {
      //validation logic

      //changing formIsValid
    },
    submitForm() {
      if (!this.formIsValid) {
        return;
      }

      if (this.mode === 'login') {

        this.$store.dispatch('login', {
          email: this.email,
          password: this.password
        })
        .then((response: any) => {        
          
          this.success = true; this.formMessage = response.data

          //sorry for running the mutation directly and not through an action, i think i don't have a choice here :)
          this.$store.commit('setUser', {
              token: response.data.token,
              userId: response.data.userId,
              email: this.email
              //tokenExpiration: response.expiresIn
          });

          localStorage.setItem("userData", JSON.stringify({ id: this.$store.getters.userId, token : this.$store.getters.token }));
          
          this.$router.push({ name: "chat"});
        })
        .catch(error => {
          this.success = false; this.formMessage = error.response.data.message;
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
          this.success = true;
          this.formMessage = response.data;
        })
        .catch((error: any) => {
          console.log(error);
          this.success = false;
          this.formMessage = error.response.data.message;
        })    
      } 
    }
  }
});
</script>
