const axios = require("axios");

const instance = axios.create({
  baseURL: "https://api.warframestat.us",
});

module.exports = instance;
