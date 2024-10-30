<template>
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Liste des Workflows</h1>
        
        <div class="bg-white shadow-md rounded-lg divide-y">
          <div v-for="workflow in workflows" :key="workflow.workflow_id" class="p-4">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-lg font-medium">{{ workflow.name }}</h3>
                <p class="text-sm text-gray-500">Source: {{ workflow.data_source }}</p>
              </div>
              <div class="flex gap-2">
                <button 
                  @click="viewStatus(workflow.workflow_id)"
                  class="px-3 py-1 bg-blue-100 text-blue-600 rounded"
                >
                  Voir le statut
                </button>
                <button 
                  @click="executeWorkflow(workflow.workflow_id)"
                  class="px-3 py-1 bg-green-100 text-green-600 rounded"
                >
                  Exécuter
                </button>
                <button 
                  @click="deleteWorkflow(workflow.workflow_id)"
                  class="px-3 py-1 bg-red-100 text-red-600 rounded"
                >
                  Supprimer
                </button>
              </div>
            </div>
            
            <div class="mt-3">
              <h4 class="text-sm font-medium text-gray-700">Étapes:</h4>
              <ul class="mt-1 space-y-1">
                <li v-for="(step, index) in workflow.steps" :key="index" 
                  class="text-sm text-gray-600">
                  {{ step.step_type }} - {{ step.status }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import apiService from '@/services/api.service';
  
  export default {
    name: 'WorkflowList',
    data() {
      return {
        workflows: []
      };
    },
    async created() {
      await this.loadWorkflows();
    },
    methods: {
      async loadWorkflows() {
        try {
          const response = await apiService.getAllWorkflows();
          this.workflows = response;
        } catch (error) {
          console.error('Erreur chargement workflows:', error);
        }
      },
      viewStatus(id) {
        this.$router.push(`/check-status/${id}`);
      },
      async executeWorkflow(id) {
        try {
          await apiService.executeWorkflow(id);
          await this.loadWorkflows();
        } catch (error) {
          console.error('Erreur exécution workflow:', error);
        }
      },
      async deleteWorkflow(id) {
        try {
          await apiService.deleteWorkflow(id);
          await this.loadWorkflows();
        } catch (error) {
          console.error('Erreur suppression workflow:', error);
        }
      }
    }
  };
  </script>