'use strict';

import Api from './api'

export const getAppointments = (params = {}) => Api().get('/api/appointments/', { params })

export const getAppointment = (id) => Api().get(`/api/appointment/${id}`)

export const addAppointment = (data) => Api().post(`/api/appointments/`, data)

export const updateAppointment = (id, data) => Api().put(`/api/appointment/${id}/`, data)

export const checkAssociatedAvailability = (data) => Api().post(`/api/appointments/check-associate-availability/`, data)

export const updateAppointmentStatus = (id, data) => Api().put(`/api/appointments/status/${id}/`, data)
