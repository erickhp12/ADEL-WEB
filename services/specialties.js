'use strict';

import Api from './api'

export const getSpecialties = (params = {}) => Api().get('/api/specialties/', { params })

export const getSpecialty = (id) => Api().get(`/api/specialties/${id}`)

export const addSpecialty = (data) => Api().post(`/api/specialties/`, data)

export const updateSpecialty = (id, data) => Api().put(`/api/specialties/${id}/`, data)

export const deleteSpecialty = (id) => Api().delete(`/api/specialties/${id}/`)
