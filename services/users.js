'use strict';

import Api from './api'

export const getUsers = (params = {}) => Api().get('/api/users/', { params })

export const getUser = (id) => Api().get(`/api/users/${id}`)

export const getUserPermissions = (id) => Api().get(`/api/user/${id}/permissions`)

export const getProfile = () => Api().get(`/api/profile/`)

export const getPermissions = (id) => Api().get(`/api/permissions`)

export const addUser = (data) => Api().post(`/api/users/`, data)

export const addPermission = (id, data) => Api().put(`/api/user/${id}/permissions/`, data)

export const deletePermission = (id, permission_id) => Api().delete(`/api/users/${id}/permissions/${permission_id}/`)

export const updateUser = (id, data) => Api().put(`/api/users/${id}/`, data)

export const deleteUser = (id) => Api().delete(`/api/users/${id}/`)