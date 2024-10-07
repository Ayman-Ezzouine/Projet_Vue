<template>
    <div>
      <h2>Create Workflow</h2>
      <form @submit.prevent="createWorkflow">
        <input v-model="workflow.name" placeholder="Workflow Name" required />
        <input v-model="workflow.data_source" placeholder="Data Source" required />
        <textarea v-model="workflow.steps" placeholder="Steps (JSON format)" required></textarea>
        <button type="submit">Create Workflow</button>
      </form>
      <p v-if="response">{{ response }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        workflow: {
          name: '',
          data_source: '',
          steps: JSON.stringify([
            { step_type: "data_cleaning", parameters: { method: "remove_nulls" }},
            { step_type: "feature_engineering", parameters: { techniques: ["PCA", "scaling"] }},
            { step_type: "model_training", model_type: "linear_regression" }
          ])
        },
        response: ''
      };
    },
    methods: {
      async createWorkflow() {
        try {
          const res = await axios.post('http://localhost:3000/workflow', this.workflow, {
            headers: { 'Content-Type': 'application/json' }
          });
          this.response = res.data;
        } catch (error) {
          this.response = 'Error creating workflow';
        }
      }
    }
  };
  </script>
  