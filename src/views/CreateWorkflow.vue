<template>
    <div>
      <h1>Créer un Workflow</h1>
      <form @submit.prevent="createWorkflow">
        <div>
          <label for="name">Nom du Workflow:</label>
          <input type="text" v-model="workflow.name" required />
        </div>
        <div>
          <label for="data_source">Source de Données:</label>
          <input type="text" v-model="workflow.data_source" required />
        </div>
        <div>
          <h3>Étapes du Workflow:</h3>
          <div v-for="(step, index) in workflow.steps" :key="index">
            <label for="step_type">Type d'Étape:</label>
            <select v-model="step.step_type">
              <option value="data_cleaning">Nettoyage des Données</option>
              <option value="feature_engineering">Ingénierie des Caractéristiques</option>
              <option value="model_training">Entraînement du Modèle</option>
            </select>
            <div>
              <label for="parameters">Paramètres:</label>
              <input type="text" v-model="step.parameters.method" placeholder="Méthode" v-if="step.step_type === 'data_cleaning'" />
              <input type="text" v-model="step.parameters.techniques" placeholder="Techniques" v-if="step.step_type === 'feature_engineering'" />
            </div>
          </div>
        </div>
        <button type="submit">Créer Workflow</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CreateWorkflow',
    data() {
      return {
        workflow: {
          name: '',
          data_source: '',
          steps: [
            { step_type: 'data_cleaning', parameters: { method: 'remove_nulls' } },
            { step_type: 'feature_engineering', parameters: { techniques: ['PCA', 'scaling'] } },
            { step_type: 'model_training', parameters: {} }
          ]
        }
      };
    },
    methods: {
      async createWorkflow() {
        try {
          const response = await fetch('http://localhost:3000/workflow', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.workflow)
          });
          const result = await response.json();
          alert(`Workflow créé avec l'ID: ${result.workflow_id}`);
        } catch (error) {
          console.error('Erreur lors de la création du workflow:', error);
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
  