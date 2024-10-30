<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Créer un Workflow</h1>
      
      <form @submit.prevent="createWorkflow" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Nom du Workflow
          </label>
          <input
            type="text"
            v-model="workflow.name"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Source de Données
          </label>
          <input
            type="text"
            v-model="workflow.data_source"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">Étapes du Workflow</h3>
            <button 
              type="button"
              @click="addStep"
              class="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
            >
              + Ajouter une étape
            </button>
          </div>
          
          <div v-for="(step, index) in workflow.steps" :key="index" class="bg-gray-50 p-4 rounded-md space-y-4">
            <div class="flex justify-between">
              <h4 class="font-medium">Étape {{ index + 1 }}</h4>
              <button 
                type="button" 
                @click="removeStep(index)"
                class="text-red-600 hover:text-red-800"
              >
                Supprimer
              </button>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Type d'Étape
              </label>
              <select 
                v-model="step.step_type"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="data_cleaning">Nettoyage des Données</option>
                <option value="feature_engineering">Ingénierie des Caractéristiques</option>
                <option value="model_training">Entraînement du Modèle</option>
              </select>
            </div>

            <div v-if="step.step_type === 'data_cleaning'">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Méthode de Nettoyage
              </label>
              <select
                v-model="step.parameters.method"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="remove_nulls">Supprimer les valeurs nulles</option>
                <option value="impute_mean">Imputer par la moyenne</option>
                <option value="impute_median">Imputer par la médiane</option>
              </select>
            </div>

            <div v-if="step.step_type === 'feature_engineering'">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Techniques
              </label>
              <div class="space-y-2">
                <div v-for="technique in ['PCA', 'scaling', 'encoding']" :key="technique">
                  <label class="inline-flex items-center">
                    <input
                      type="checkbox"
                      v-model="step.parameters.techniques"
                      :value="technique"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span class="ml-2">{{ technique }}</span>
                  </label>
                </div>
              </div>
            </div>

            <div v-if="step.step_type === 'model_training'">
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Type de Modèle
                  </label>
                  <select
                    v-model="step.parameters.model_type"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="random_forest">Random Forest</option>
                    <option value="linear_regression">Régression Linéaire</option>
                    <option value="svm">SVM</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          class="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Créer Workflow
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import apiService from '@/services/api.service';

export default {
  name: 'CreateWorkflow',
  data() {
  return {
    workflow: {
      name: '',
      data_source: '',
      steps: [
        {
          step_type: 'data_cleaning',
          parameters: {
            method: 'remove_nulls',
            techniques: [] // Tableau vide au départ
          }
        }
      ]
    }
  };
},
  methods: {
    async createWorkflow() {
      try {
        const result = await apiService.createWorkflow(this.workflow);
        // On utilise l'ID corrigé pour la redirection
        this.$router.push(`/check-status/${result.workflow_id}`);
      } catch (error) {
        console.error('Erreur:', error);
      }
    },
    createDefaultStep() {
    return {
      step_type: 'data_cleaning',
      parameters: {
        method: 'remove_nulls',
        techniques: [], // Tableau vide par défaut
        model_type: 'random_forest'
      }
    };
  }
  }
};
</script>