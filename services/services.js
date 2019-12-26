'use strict';

import Api from './api'

export const getServices = (params = {}) => Api().get('/api/services/', { params })

export const getService = (id) => Api().get(`/api/services/${id}`)

export const addService = (data) => Api().post(`/api/services/`, data)

export const updateService = (id, data) => Api().put(`/api/services/${id}/`, data)

export const deleteService  = (id) => Api().delete(`/api/services/${id}/`)
