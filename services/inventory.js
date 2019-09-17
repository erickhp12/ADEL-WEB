'use strict';

import Api from './api'

export const getInventory = (branch_office_id) => Api().get(`/api/product-inventory/${branch_office_id}/`)

// export const getProduct = (id) => Api().get(`/api/products/${id}`)

// export const addProduct = (data) => Api().post(`/api/products/`, data)

// export const updateProduct = (id, data) => Api().put(`/api/products/${id}/`, data)

export const addInventoryAction = (branch_office_id, data) => Api().post(`/api/product-inventory/${branch_office_id}/actions/`, data)
