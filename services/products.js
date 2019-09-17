'use strict';

import Api from './api'

export const getProducts = (params = {}) => Api().get('/api/products/', { params })

export const getProduct = (id) => Api().get(`/api/products/${id}`)

export const addProduct = (data) => Api().post(`/api/products/`, data)

export const updateProduct = (id, data) => Api().put(`/api/products/${id}/`, data)

export const currencyformat = (value, decimalPosition = 2) => {
    return '$' + value
        .toFixed(decimalPosition)
        .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
}
