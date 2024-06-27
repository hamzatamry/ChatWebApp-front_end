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
          <button class="btn btn-primary">{{ submitButtonCaption }}</button>
          <div @click="switchAuthMode" class="btn">{{ switchModeButtonCaption }}</div>
        </div>
      </form>
    </div>  
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'HomeView',
  data() {
    return {
      email: '',
      password: '',
      formIsValid: true,
      mode: 'login'
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
      console.log(this.email);
      console.log(this.password);
      console.log(this.mode);

      console.log(this.email + " " + this.password);
      this.$router.push({ name: 'messages'});
    }
  }
});
</script>