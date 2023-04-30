import Vue from 'vue'
import axios from 'axios'

var baseURL;
var auth = {};

if (process.env.DEV) {
    // baseURL = 'http://localhost:3000/api/';
    baseURL = 'https://api.sabkino.com/api/'
} else {
    baseURL = 'https://api.sabkino.com/api/'
}
Vue.prototype.$axios = axios.create({
    baseURL, 
})