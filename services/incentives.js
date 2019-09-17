'use strict';

import Api from './api'

export const getIncentives = () => Api().get('/api/incentives/')

export const getIncentive = (id) => Api().get(`/api/incentives/${id}`)

export const addIncentive = (data) => Api().post(`/api/incentives/`, data)

export const updateIncentive = (id, data) => Api().put(`/api/incentives/${id}/`, data)

export const getIncentivesSettings = () => Api().get('/api/incentives/settings/')

export const getIncentiveSetting = (id) => Api().get(`/api/incentives/settings/${id}`)

export const addIncentiveSetting = (data) => Api().post(`/api/incentives/settings/`, data)

export const payComission = (id, data) => Api().put(`/api/incentives/${id}/`, data)

export const updateIncentiveSetting = (id, data) => Api().put(`/api/incentives/settings/${id}/`, data)