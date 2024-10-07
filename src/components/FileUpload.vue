<template>
    <div>
      <h2>Upload File</h2>
      <input type="file" @change="onFileChange" />
      <button @click="uploadFile">Upload</button>
      <p v-if="response">{{ response }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        file: null,
        response: ''
      };
    },
    methods: {
      onFileChange(event) {
        this.file = event.target.files[0];
      },
      async uploadFile() {
        const formData = new FormData();
        formData.append('file', this.file);
        try {
          const res = await axios.post('http://localhost:3000/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          this.response = res.data;
        } catch (error) {
          this.response = 'Error uploading file';
        }
      }
    }
  };
  </script>
  