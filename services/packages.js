'use strict';

import Api from './api'

export const getPackages = (params = {}) => Api().get('/api/packages/', { params })

export const getPackage = (id) => Api().get(`/api/packages/${id}`)

export const getSinglePackage = (id) => Api().get(`/api/packages/single/${id}`)

export const getSessionServices = (id) => Api().get(`/api/packages/session/${id}`)

export const addPackage = (data) => Api().post(`/api/packages/`, data)

export const updatePackage = (id, data) => Api().put(`/api/packages/${id}/`, data)

export const getPackageEdition = (id) => Api().get(`/api/packages/${id}/editions/`)
