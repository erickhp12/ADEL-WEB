'use strict';

import Api from './api'

export const getBranchOffices = (params = {}) => Api().get('/api/branch-offices/', { params })

export const getBranchOffice = (id) => Api().get(`/api/branch-offices/${id}`)

export const addBranchOffice = (data) => Api().post(`/api/branch-offices/`, data)

export const updateBranchOffice = (id, data) => Api().put(`/api/branch-offices/${id}/`, data)

export const deleteBranchOffice = (id) => Api().delete(`/api/branch-offices/${id}/`)