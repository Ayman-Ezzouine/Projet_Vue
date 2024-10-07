<template>
    <div>
      <h1>Welcome to the Data Workflow App</h1>
      <router-link to="/create-workflow">Create Workflow</router-link>
      <router-link to="/check-status">Check Workflow Status</router-link>
      <router-link to="/train-model">Train Model</router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HomeView'
  };
  </script>
  
  <style scoped>
  h1 {
    color: #2c3e50;
  }
  </style>
  