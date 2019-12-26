'use strict';

import Api from './api'

export const getCategories = (params = {}) => Api().get('/api/services/categories/', { params })

export const getCategory = (id) => Api().get(`/api/services/categories/${id}`)

export const addCategory = (data) => Api().post(`/api/services/categories/`, data)

export const updateCategory = (id, data) => Api().put(`/api/services/categories/${id}/`, data)

export const deleteCategory = (id) => Api().delete(`/api/services/categories/${id}/`)
