'use strict';

import Api from './api'

export const getServiceCategories = (params = {}) => Api().get('/api/services/categories/', { params })

export const getServiceCategory = (id) => Api().get(`/api/services/categories/${id}`)

export const addServiceCategory = (data) => Api().post(`/api/services/categories/`, data)

export const updateServiceCategory = (id, data) => Api().put(`/api/services/categories/${id}/`, data)
