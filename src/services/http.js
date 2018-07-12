'use strict';
import axios from 'axios';

const baseURL = 'http://127.0.0.1:8000/api/curlsend';

class Http {
  constructor() {
    this.send = axios.create({
      baseURL: baseURL,
    });
  }
}

export default new Http().send;
