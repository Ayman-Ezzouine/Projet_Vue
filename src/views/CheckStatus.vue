```vue
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
          ID : {{ status.workflow_id }}
        </div>
        <p :class="`font-medium mb-4 ${getStatusColor(status.status)}`">
          Statut: {{ status.status }}
        </p>

        <h3 class="text-lg font-medium text-gray-900 mb-2">Étapes:</h3>
        <ul class="space-y-2">
          <li v-for="(step, index) in status.steps" :key="index" 
              class="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
            <div class="flex items-center">
              <i :class="getStepIcon(step.status)" class="w-5 h-5 mr-2"></i>
              <span class="font-medium">{{ step.step_type }}</span>
            </div>
            <div class="flex items-center space-x-4">
              <span :class="getStatusColor(step.status)">
                {{ getStatusText(step.status) }}
              </span>
              <button 
                @click="executeWorkflow"
                :disabled="step.status === 'completed' || step.status === 'in_progress'"
                :class="[
                  'px-3 py-1 rounded-md text-sm',
                  step.status === 'completed' || step.status === 'in_progress'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600'
                ]"
              >
                {{ 
                  step.status === 'completed' ? 'Terminé' :
                  step.status === 'in_progress' ? 'En cours...' :
                  'Exécuter'
                }}
              </button>
            </div>
          </li>
        </ul>

        <div v-if="status.steps && status.steps.length > 0" class="mt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Progression des étapes</h3>
          <div class="relative h-64" ref="chartContainer"></div>
        </div>
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
      pollingInterval: null,
      chart: null,
      lastCheckTime: null
    };
  },
  async mounted() {
    await this.loadApexCharts();
    if (this.status) {
      this.createChart();
    }
  },
  async created() {
    const lastWorkflowId = this.getCookie('lastWorkflowId');
    if (lastWorkflowId) {
      console.log('Dernier workflow consulté:', lastWorkflowId);
    }

    if (this.$route.params.id) {
      await this.checkStatus();
      this.startPolling();
    }
  },
  methods: {
    loadApexCharts() {
      return new Promise((resolve, reject) => {
        if (window.ApexCharts) {
          resolve(window.ApexCharts);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/apexcharts';
        script.async = true;
        script.onload = () => resolve(window.ApexCharts);
        script.onerror = () => reject(new Error("Échec du chargement d'ApexCharts"));
        document.head.appendChild(script);
      });
    },

    async executeWorkflow() {
      try {
        const response = await apiService.executeWorkflow(this.workflowId);
        console.log('Exécution lancée:', response);
        
        if (response) {
          this.status = {
            ...this.status,
            status: 'in_progress',
            steps: this.status.steps.map(step => ({
              ...step,
              status: 'in_progress'
            }))
          };
        }
        
        this.startPolling();
      } catch (error) {
        console.error('Erreur lors de l\'exécution:', error);
        this.error = "Impossible d'exécuter le workflow";
      }
    },
    
    createChart() {
      if (!window.ApexCharts || !this.$refs.chartContainer) return;
      
      if (this.chart) {
        this.chart.destroy();
      }

      const options = {
        series: [{
          name: 'Progression',
          data: this.status.steps.map(step => {
            switch(step.status) {
              case 'completed': return 100;
              case 'in_progress': return 50;
              default: return 0;
            }
          })
        }],
        chart: {
          type: 'bar',
          height: 250,
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
            dynamicAnimation: {
              enabled: true,
              speed: 350
            }
          }
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            borderRadius: 8,
            distributed: true
          },
        },
        colors: this.status.steps.map(step => {
          switch(step.status) {
            case 'completed': return '#22c55e';
            case 'in_progress': return '#3b82f6';
            default: return '#9ca3af';
          }
        }),
        dataLabels: {
          enabled: true,
          formatter: function(val) {
            return val + '%';
          }
        },
        xaxis: {
          categories: this.status.steps.map(step => step.step_type),
          labels: {
            style: {
              fontSize: '12px'
            }
          }
        },
        yaxis: {
          max: 100,
          title: {
            text: 'Progression (%)'
          }
        },
        title: {
          text: 'Progression des étapes',
          align: 'center',
          style: {
            fontSize: '16px'
          }
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return val + '%';
            }
          }
        }
      };

      this.chart = new window.ApexCharts(this.$refs.chartContainer, options);
      this.chart.render();
    },

    setCookie(name, value, days = 7) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      const expires = `expires=${date.toUTCString()}`;
      document.cookie = `${name}=${value};${expires};path=/`;
    },

    getCookie(name) {
      const nameEQ = `${name}=`;
      const ca = document.cookie.split(';');
      for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    },

    getStatusColor(status) {
      switch(status) {
        case 'completed': return 'text-green-600';
        case 'in_progress': return 'text-blue-600';
        case 'pending': return 'text-gray-600';
        default: return 'text-gray-600';
      }
    },

    getStatusText(status) {
      switch(status) {
        case 'completed': return 'Terminé';
        case 'in_progress': return 'En cours';
        case 'pending': return 'En attente';
        default: return status;
      }
    },

    getStepIcon(status) {
      switch (status) {
        case 'completed': return 'fas fa-check-circle text-green-500';
        case 'in_progress': return 'fas fa-spinner text-blue-500';
        case 'pending': return 'far fa-clock text-gray-500';
        default: return 'far fa-circle text-gray-300';
      }
    },

    async checkStatus() {
      try {
        const id = this.workflowId;
        const response = await apiService.getWorkflowStatus(id);
        this.status = response;
        this.lastCheckTime = new Date().toLocaleTimeString();
        this.setCookie('lastCheckedWorkflow', id);
        
        if (window.ApexCharts && this.$refs.chartContainer) {
          this.createChart();
        }

        if (!this.pollingInterval && this.$route.params.id) {
          this.startPolling();
        }
        this.error = null;
      } catch (error) {
        console.error('Error:', error);
        this.error = "Impossible de récupérer l'état du workflow";
      }
    },

    startPolling() {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval);
      }
      
      const pollStatus = () => this.checkStatus();
      this.pollingInterval = setInterval(pollStatus, 5000);
    }
  },
  beforeUnmount() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
    if (this.chart) {
      this.chart.destroy();
    }
  }
};
</script>
```