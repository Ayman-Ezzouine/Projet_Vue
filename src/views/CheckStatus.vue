<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Suivi de l'État du Workflow</h1>

      

      <form @submit.prevent="checkStatus" class="space-y-6 mb-8">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            ID du Workflow
          </label>
          <input
            type="text"
            v-model="workflowId"
            placeholder="Entrez l'ID du workflow"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <button type="submit" 
          class="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Vérifier le Statut
        </button>
      </form>

      <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
        {{ error }}
      </div>

      <div v-if="status" class="bg-gray-50 rounded-lg p-4">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          État du Workflow:
        </h2>
        <div v-if="$route.params.id" class="mb-4 text-lg text-gray-700">
        ID  : {{ status.workflow_id }}
      </div>
        <p class="text-green-600 font-medium mb-4">Statut: {{ status.status }}</p>

        <h3 class="text-lg font-medium text-gray-900 mb-2">Étapes:</h3>
        <ul class="space-y-2">
          <li v-for="(step, index) in status.steps" :key="index" class="flex items-center text-gray-700">
            <i :class="getStepIcon(step.status)" class="w-5 h-5 mr-2"></i>
            {{ step.step_type }}: {{ step.status }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import apiService from '@/services/api.service';

export default {
  name: 'CheckStatus',
  data() {
    return {
      workflowId: this.$route.params.id || '',
      status: null,
      error: null,
      pollingInterval: null
    };
  },
  async created() {
    if (this.$route.params.id) {
      await this.checkStatus();
      this.startPolling();
    }
  },
  methods: {
    async checkStatus() {
      try {
        const id = this.workflowId;
        const response = await apiService.getWorkflowStatus(id);
        this.status = response;
        if (!this.pollingInterval && this.$route.params.id) {
          this.startPolling();
        }
        this.error = null;
      } catch (error) {
        console.error('Error:', error);
        this.error = "Impossible de récupérer l'état du workflow";
      }
    },
    getStepIcon(status) {
      switch (status) {
        case 'completed': return 'fas fa-check-circle text-green-500';
        case 'in_progress': return 'fas fa-spinner text-blue-500';
        default: return 'far fa-circle text-gray-300';
      }
    },
    startPolling() {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval);
      }
      this.pollingInterval = setInterval(this.checkStatus, 5000);
    }
  },
  beforeUnmount() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }
};
</script>