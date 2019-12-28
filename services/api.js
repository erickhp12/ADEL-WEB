'use strict';

import axios from 'axios'
import { getToken } from './auth'

export default () => {
    const instance = axios.create({
        // baseURL: 'http://165.227.18.175:8000/',
        baseURL: 'http://localhost:8000/',
        // timeout: 5000,s
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
