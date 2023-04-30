import Vue from 'vue'
import io from 'socket.io-client';


Vue.prototype.$socketId = io('https://service.padideit.com', {
  path: '/ws'
})
