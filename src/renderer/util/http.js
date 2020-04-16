const axios = require("axios");
const ip = require('ip');

let checkIp = ip.address().split(".");

if (checkIp[0] == 10 && checkIp[1] == 0 && checkIp[2] == 10) {
  console.log("rede master")
} else {
  console.log("rede não master")
}


const url = window.location.host.split(":")[0];

window.URL_API =
  process.env.NODE_ENV === "development"
    ? `http://${url}:3333`
    : `http://10.0.10.112:3333`;

const client = axios.create({
  baseURL: URL_API
});

export default client;

/*
const axios = require("axios");

//const url = window.location.host.split(":")[0];

const urlDevelopment = "http://localhost:3333";
const urlProduction = "http://10.0.10.95:8002";

window.URL_API = process.env.NODE_ENV === 'development' ? urlDevelopment : urlProduction

const client = axios.create({
  baseURL: process.env.NODE_ENV === "development" ? urlDevelopment : urlProduction
});

export default client;
*/


//ip.address()



