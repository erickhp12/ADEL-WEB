'use strict';

import axios from 'axios'
import { getToken } from './auth'

export default () => {
    const instance = axios.create({
        // baseURL: 'http://api.opencabo.com/',
        baseURL: 'http://localhost:8000/',
        // timeout: 5000,
        headers:{
            Authorization: getToken()
        },
        responseType: 'json'
    })

    instance.interceptors.response.use(function (response) {
        return response;
    }, function (error) {
        if (401 === error.response.status) {
            window.location = '/login';
        } else {
            return Promise.reject(error);
        }
    });

    return instance;
}
