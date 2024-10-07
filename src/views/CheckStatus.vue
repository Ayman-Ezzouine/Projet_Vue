<template>
    <div>
      <h1>Suivi de l'État du Workflow</h1>
      <form @submit.prevent="checkStatus">
        <div>
          <label for="workflowId">ID du Workflow:</label>
          <input type="text" v-model="workflowId" required />
        </div>
        <button type="submit">Vérifier l'État</button>
      </form>
      <div v-if="status">
        <h2>État du Workflow: {{ status.workflow_id }}</h2>
        <p>Statut: {{ status.status }}</p>
        <h3>Étapes:</h3>
        <ul>
          <li v-for="(step, index) in status.steps" :key="index">
            {{ step.step_type }}: {{ step.status }}
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CheckStatus',
    data() {
      return {
        workflowId: '',
        status: null
      };
    },
    methods: {
      async checkStatus() {
        try {
          const response = await fetch(`http://localhost:3000/workflow/${this.workflowId}/status`);
          this.status = await response.json();
        } catch (error) {
          console.error('Erreur lors de la vérification de l\'état:', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  form {
    display: flex;
    flex-direction: column;
  }
  </style>
  