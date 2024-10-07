<template>
    <div>
      <h2>Train Model</h2>
      <form @submit.prevent="trainModel">
        <input v-model="model.model_type" placeholder="Model Type" required />
        <input v-model="model.data_source" placeholder="Data Source" required />
        <textarea v-model="model.parameters" placeholder="Parameters (JSON format)" required></textarea>
        <button type="submit">Train Model</button>
      </form>
      <p v-if="response">{{ response }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        model: {
          model_type: '',
          data_source: '',
          parameters: JSON.stringify({
            n_estimators: 100,
            max_depth: 10
          })
        },
        response: ''
      };
    },
    methods: {
      async trainModel() {
        try {
          const res = await axios.post('http://localhost:3000/model/train', this.model, {
            headers: { 'Content-Type': 'application/json' }
          });
          this.response = res.data;
        } catch (error) {
          this.response = 'Error training model';
        }
      }
    }
  };
  </script>
  