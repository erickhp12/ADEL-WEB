'use strict';

import Api from './api'

export const getProviders = (params = {}) => Api().get('/api/providers/', { params })

export const getProvider = (id) => Api().get(`/api/providers/${id}`)

export const addProvider = (data) => Api().post(`/api/providers/`, data)

export const updateProvider = (id, data) => Api().put(`/api/providers/${id}/`, data)
