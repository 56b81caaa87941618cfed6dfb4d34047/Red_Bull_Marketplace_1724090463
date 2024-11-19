<!--
 To add this component to the user's app, you must follow all three of these steps:
 1. In their html file, include `<table-with-title-add-button-and-edit-delete-options></table-with-title-add-button-and-edit-delete-options>`. Keep blank lines before and after this code. Do not remove the other components!
 2. In their html file, import the JS file for this component `./components/table-with-title-add-button-and-edit-delete-options.js` in the `HEAD` section. Keep blank lines before and after this code. Do not remove the other component imports!
 3. You are given the correct SQL statement -- replace the `PLACEHOLDER_SQL_STATEMENT` variable in this file with the actual SQL statement.
-->

<template>
  <div class="max-w-screen-xl mx-auto px-4 md:px-8 bg-magenta-500 bg-opacity-20 rounded-lg backdrop-filter backdrop-blur-lg shadow-lg p-6">
    <div class="items-start justify-between md:flex">
      <div class="max-w-lg">
        <h3 class="text-pink-200 text-xl font-bold sm:text-2xl">
          TABLE_TITLE_PLACEHOLDER_TEXT
        </h3>
      </div>
      <div class="mt-4 md:mt-0">
        <button class="px-4 py-2 text-pink-200 bg-magenta-600 bg-opacity-50 rounded-lg hover:bg-magenta-500 hover:bg-opacity-70 transition-colors duration-300 backdrop-filter backdrop-blur-sm shadow-lg">
          Hadoken
        </button>
      </div>
    </div>
    <div class="mt-8 bg-pink-400 bg-opacity-20 rounded-lg p-6 shadow-lg backdrop-filter backdrop-blur-md">
      <h4 class="text-xl font-semibold text-pink-200 mb-4">Email Santa</h4>
      <form @submit.prevent="sendEmailToSanta" class="space-y-4">
        <div>
          <label for="name" class="block text-pink-100 mb-2">Your Name:</label>
          <input type="text" id="name" v-model="santaEmail.name" required class="w-full px-4 py-2 rounded-lg bg-magenta-500 bg-opacity-20 text-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-pink-300">
        </div>
        <div>
          <label for="email" class="block text-pink-100 mb-2">Your Email:</label>
          <input type="email" id="email" v-model="santaEmail.email" required class="w-full px-4 py-2 rounded-lg bg-magenta-500 bg-opacity-20 text-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-pink-300">
        </div>
        <div>
          <label for="message" class="block text-pink-100 mb-2">Message to Santa:</label>
          <textarea id="message" v-model="santaEmail.message" required rows="4" class="w-full px-4 py-2 rounded-lg bg-magenta-500 bg-opacity-20 text-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-pink-300"></textarea>
        </div>
        <button type="submit" class="px-6 py-2 bg-pink-500 bg-opacity-70 text-white rounded-lg hover:bg-pink-400 hover:bg-opacity-80 transition-colors duration-300 shadow-lg backdrop-filter backdrop-blur-sm">Send to Santa</button>
      </form>
    </div>
    <div class="items-start justify-between md:flex mt-12 shadow-lg rounded-lg overflow-x-auto bg-magenta-400 bg-opacity-10 backdrop-filter backdrop-blur-md">
    </div>
    <div v-if="tableHeaders.length === 0" class="text-pink-100">
      Executing a SQL query to populate data into this table...
    </div>
    <div class="items-start justify-between md:flex mt-12 shadow-lg rounded-lg overflow-x-auto bg-magenta-400 bg-opacity-10 backdrop-filter backdrop-blur-md">
      <table class="w-full table-auto text-sm text-left">
        <thead class="bg-magenta-500 bg-opacity-30 text-pink-100 font-medium border-b border-pink-300">
          <tr>
            <th v-for="header in tableHeaders" :key="header" class="py-3 px-6 hover:bg-magenta-400 hover:bg-opacity-40 transition-colors duration-300" v-html="header"></th>
          </tr>
        </thead>
        <tbody class="text-pink-200 divide-y divide-pink-300">
          <tr v-for="(item, idx) in tableItems" :key="idx" class="hover:bg-magenta-400 hover:bg-opacity-20 transition-colors duration-300">
            <td
              v-for="(value, key) in item"
              :key="key"
              v-if="tableHeaders.includes(key)"
              class="py-3 px-6 whitespace-nowrap"
            >
              <span v-html="value"></span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "TableWithTitleAddButtonAndEditDeleteOptions",
  data() {
    return {
      tableItems: [],
      tableHeaders: [],
      SQL_statement: "PLACEHOLDER_SQL_STATEMENT",
      santaEmail: {
        name: '',
        email: '',
        message: ''
      }
    };
  },
  methods: {
    fetch_data_from_database(SQL_statement) {
      return axios.post("https://nl2sql-prod.azurewebsites.net/execute_sql", { query: SQL_statement })
        .then(response => {
          const tableItems = response.data.result;
          if (tableItems.length > 0) {
            const tableHeaders = Object.keys(tableItems[0]);
            this.tableItems = tableItems;
            this.tableHeaders = tableHeaders;
            return [tableHeaders, tableItems];
          }
        });
    },
    sendEmailToSanta() {
      // Here you would typically send the email using an API
      console.log('Sending email to Santa:', this.santaEmail);
      // Reset the form after sending
      this.santaEmail = {
        name: '',
        email: '',
        message: ''
      };
      alert('Your message has been sent to Santa!');
    }
  },
  mounted() {
    this.fetch_data_from_database(this.SQL_statement).then(([tableHeaders, tableItems]) => {
      this.tableHeaders = tableHeaders;
      this.tableItems = tableItems;
    });
  },
};
</script>