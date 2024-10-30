<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto p-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Data Workflow App</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center mb-4">
            <i class="fas fa-plus w-6 h-6 text-blue-500 mr-2"></i>
            <h2 class="text-xl font-semibold text-gray-800">Créer Workflow</h2>
          </div>
          <p class="text-gray-600 mb-4">Créez et configurez un nouveau workflow de données</p>
          <router-link 
            to="/create-workflow" 
            class="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Commencer
          </router-link>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center mb-4">
            <i class="fas fa-check-circle w-6 h-6 text-green-500 mr-2"></i>
            <h2 class="text-xl font-semibold text-gray-800">État Workflow</h2>
          </div>
          <p class="text-gray-600 mb-4">Suivez l'état et la progression de vos workflows</p>
          <router-link 
            to="/check-status" 
            class="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Vérifier
          </router-link>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center mb-4">
            <i class="fas fa-play w-6 h-6 text-purple-500 mr-2"></i>
            <h2 class="text-xl font-semibold text-gray-800">Entraîner Modèle</h2>
          </div>
          <p class="text-gray-600 mb-4">Configurez et lancez l'entraînement de modèles</p>
          <router-link 
            to="/train-model" 
            class="inline-block bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Entraîner
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
};
</script>