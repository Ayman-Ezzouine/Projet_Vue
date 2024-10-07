<template>
    <div>
      <h1>Entraîner un Modèle</h1>
      <form @submit.prevent="trainModel">
        <div>
          <label for="model_type">Type de Modèle:</label>
          <select v-model="model.model_type" required>
            <option value="random_forest">Forêt Aléatoire</option>
            <option value="linear_regression">Régression Linéaire</option>
          </select>
        </div>
        <div>
          <label for="data_source">Source de Données:</label>
          <input type="text" v-model="model.data_source" required />
        </div>
        <div>
          <h3>Paramètres:</h3>
          <label for="n_estimators">Nombres d'Estimateurs:</label>
          <input type="number" v-model="model.parameters.n_estimators" required />
          <label for="max_depth">Profondeur Max:</label>
          <input type="number" v-model="model.parameters.max_depth" required />
        </div>
        <button type="submit">Entraîner Modèle</button>
      </form>
      <div v-if="trainStatus">
        <h2>ID du Modèle: {{ trainStatus.model_id }}</h2>
        <p>Statut: {{ trainStatus.status }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TrainModel',
    data() {
      return {
        model: {
          model_type: 'random_forest',
          data_source: '',
          parameters: {
            n_estimators: 100,
            max_depth: 10
          }
        },
        trainStatus: null
      };
    },
    methods: {
      async trainModel() {
        try {
          const response = await fetch('http://localhost:3000/model/train', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.model)
          });
          this.trainStatus = await response.json();
        } catch (error) {
          console.error('Erreur lors de l\'entraînement du modèle:', error);
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
  