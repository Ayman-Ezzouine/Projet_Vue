<template>
    <div>
      <h2>Check Model Status</h2>
      <input v-model="modelId" placeholder="Enter Model ID" />
      <button @click="checkStatus">Check Status</button>
      <p v-if="status">{{ status }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        modelId: '',
        status: ''
      };
    },
    methods: {
      async checkStatus() {
        try {
          const res = await axios.get(`http://localhost:3000/model/${this.modelId}/status`, {
            headers: { 'Content-Type': 'application/json' }
          });
          this.status = res.data;
        } catch (error) {
          this.status = 'Error fetching status';
        }
      }
    }
  };
  </script>
  