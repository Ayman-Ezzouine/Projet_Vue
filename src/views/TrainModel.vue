<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Entraîner un Modèle</h1>
      
      <form @submit.prevent="trainModel" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Type de Modèle
          </label>
          <select
            v-model="model.model_type"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="random_forest">Forêt Aléatoire</option>
            <option value="linear_regression">Régression Linéaire</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Données d'entraînement
          </label>
          <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div class="space-y-1 text-center">
              <svg
                class="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <div class="flex text-sm text-gray-600">
                <label
                  for="file-upload"
                  class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Sélectionner un fichier</span>
                  <input
                    id="file-upload"
                    type="file"
                    class="sr-only"
                    @change="handleFileUpload"
                    accept=".csv,.xlsx"
                  />
                </label>
                <p class="pl-1">ou glisser-déposer</p>
              </div>
              <p class="text-xs text-gray-500">CSV ou XLSX jusqu'à 10MB</p>
            </div>
          </div>
          <div v-if="selectedFile" class="mt-2 text-sm text-gray-600">
            Fichier sélectionné: {{ selectedFile.name }}
          </div>
        </div>

        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900">Paramètres</h3>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nombre d'Estimateurs
            </label>
            <input
              type="number"
              v-model.number="model.parameters.n_estimators"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Profondeur Max
            </label>
            <input
              type="number"
              v-model.number="model.parameters.max_depth"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="!selectedFile"
          :class="[
            'w-full text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2',
            !selectedFile 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-purple-500 hover:bg-purple-600 focus:ring-purple-500'
          ]"
        >
          {{ isTraining ? 'Entraînement en cours...' : 'Entraîner le Modèle' }}
        </button>
      </form>

      <div v-if="trainStatus" class="mt-6 p-4 bg-gray-50 rounded-lg">
        <h2 class="text-lg font-medium text-gray-900">Statut de l'entraînement</h2>
        <p class="mt-2 text-gray-700">ID du Modèle: {{ trainStatus.model_id }}</p>
        <p class="text-gray-700">Statut: {{ trainStatus.status }}</p>
        <div v-if="trainStatus.metrics" class="mt-4">
          <h3 class="text-md font-medium text-gray-900">Métriques:</h3>
          <div class="mt-2 grid grid-cols-3 gap-4">
            <div class="text-center p-2 bg-white rounded shadow">
              <p class="text-sm text-gray-600">Précision</p>
              <p class="text-lg font-semibold">{{ (trainStatus.metrics.accuracy * 100).toFixed(1) }}%</p>
            </div>
            <div class="text-center p-2 bg-white rounded shadow">
              <p class="text-sm text-gray-600">Précision</p>
              <p class="text-lg font-semibold">{{ (trainStatus.metrics.precision * 100).toFixed(1) }}%</p>
            </div>
            <div class="text-center p-2 bg-white rounded shadow">
              <p class="text-sm text-gray-600">Rappel</p>
              <p class="text-lg font-semibold">{{ (trainStatus.metrics.recall * 100).toFixed(1) }}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiService from '@/services/api.service';

export default {
  name: 'TrainModel',
  data() {
    return {
      model: {
        model_type: 'random_forest',
        parameters: {
          n_estimators: 100,
          max_depth: 10
        }
      },
      selectedFile: null,
      trainStatus: null,
      isTraining: false,
      pollingInterval: null
    };
  },
  methods: {
    handleFileUpload(event) {
      this.selectedFile = event.target.files[0];
    },
    async trainModel() {
      try {
        this.isTraining = true;
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        formData.append('model_type', this.model.model_type);
        formData.append('parameters', JSON.stringify(this.model.parameters));

        const response = await apiService.trainModel(formData);
        this.trainStatus = response;
        this.startPolling(response.model_id);
      } catch (error) {
        console.error('Erreur lors de l\'entraînement du modèle:', error);
      }
    },
    async startPolling(modelId) {
      this.pollingInterval = setInterval(async () => {
        try {
          const status = await apiService.getModelStatus(modelId);
          this.trainStatus = status;
          
          if (status.status === 'training_completed') {
            this.isTraining = false;
            clearInterval(this.pollingInterval);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération du statut:', error);
          clearInterval(this.pollingInterval);
        }
      }, 2000);
    }
  },
  beforeUnmount() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }
};
</script>