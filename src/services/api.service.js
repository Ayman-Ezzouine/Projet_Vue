import axios from 'axios';

const API_URL = 'http://localhost:3000';

export default {
  async createWorkflow(workflow) {
    try {
      const response = await axios.post(`${API_URL}/workflow`, workflow);
      const workflow_id = response.data.workflow_id;
      return { ...response.data, workflow_id: workflow_id };
    } catch (error) {
      console.error('Create workflow error:', error);
      throw error;
    }
  },

  async executeWorkflow(id) {
    try {
      const response = await axios.post(`${API_URL}/workflow/${id}/execute`);
      return response.data;
    } catch (error) {
      console.error('Execute workflow error:', error);
      throw error;
    }
  },

  async getWorkflowStatus(id) {
    try {
      const response = await axios.post(`${API_URL}/workflow/${id}/status`);
      return response.data;
    } catch (error) {
      console.error('Get status error:', error);
      throw error;
    }
  },

  async trainModel(formData) {
    try {
      const response = await axios.post(`${API_URL}/model/train`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Train model error:', error);
      throw error;
    }
  },

  async getModelStatus(id) {
    try {
      const response = await axios.get(`${API_URL}/model/${id}/status`);
      return response.data;
    } catch (error) {
      console.error('Get model status error:', error);
      throw error;
    }
  },

  async getPrediction(id) {
    try {
      const response = await axios.post(`${API_URL}/model/${id}/predict`);
      return response.data;
    } catch (error) {
      console.error('Get prediction error:', error);
      throw error;
    }
  },

  async deleteWorkflow(id) {
    try {
      const response = await axios.delete(`${API_URL}/workflow/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete workflow error:', error);
      throw error;
    }
  },

  async deleteModel(id) {
    try {
      const response = await axios.delete(`${API_URL}/model/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete model error:', error);
      throw error;
    }
  },
  async getAllWorkflows() {
    try {
      const response = await axios.get(`${API_URL}/workflows`);
      return response.data;
    } catch (error) {
      console.error('Get all workflows error:', error);
      throw error;
    }
  }
};