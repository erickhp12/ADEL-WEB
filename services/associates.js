'use strict';

import Api from './api'

export const getAssociates = (params = {}) => Api().get('/api/associates/', { params })

export const getAssociate = (id) => Api().get(`/api/associates/${id}`)

export const deleteAssociate = (id) => Api().delete(`/api/associates/${id}/`)

export const getAppointmentsAssociate = (id, params = {}) => Api().get(`/api/associates/appointments/${id}/`, { params })

export const addAssociate = (data) => Api().post(`/api/associates/`, data)

export const updateAssociate = (id, data) => Api().put(`/api/associates/${id}/`, data)

export const updateAssociateAppointmentStatus = (id, data) => Api().put(`/api/associates/appointments/status/${id}/`, data)

export const getAssociateWorkDays = (id) => Api().get(`/api/associates/${id}/workdays`)

export const addAssociateWorkDays = (id, data) => Api().post(`/api/associates/${id}/workdays/`, data)

export const deleteAssociateWorkDays = (associate_id, id) => Api().delete(`/api/associates/${associate_id}/workdays/${id}`)