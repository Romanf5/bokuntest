'use strict';
import moment from 'moment';
import axios from 'axios';
const hmacsha1 = require('hmacsha1');

const baseURL = 'https://api.bokun.is';
const accessKey = '24f2bb7ce61f488ba6033c5c9eb16a84';
const secretKey = 'badfde9ec56b47d8aa6a53b932b7fdaf';

class Http {
  constructor() {
    this.send = axios.create({
      baseURL: baseURL,
      headers: {
        'Content-Type': 'application/json',
        'X-Bokun-AccessKey': accessKey
      }
    });

    this.interceptRequest();
  }

  get date() {
    return moment().format('YYYY-MM-DD HH:mm:ss');
  }

  interceptRequest() {
    this.send.interceptors.request.use((config) => {
      let date = this.date;
      let str = `${date}${accessKey}${config.method.toUpperCase()}${config.url}`;
      config.headers['X-Bokun-Signature'] = hmacsha1(secretKey, str);
      config.headers['X-Bokun-Date'] = date;
      return config;
    }, (e) => { return Promise.reject(e) });
  }
}

export default new Http().send;
