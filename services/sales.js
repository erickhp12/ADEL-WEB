'use strict';

import Api from './api'

export const getSales = (params = {}) => Api().get('/api/sales/', { params })

export const getSale = (id) => Api().get(`/api/sales/${id}`)

export const addSale = (data) => Api().post(`/api/sales/`, data)

export const addCashClosing = (data) => Api().post(`/api/sales/cash-closing/`, data)

export const getAllSalesByCashClosing = (id) => Api().get(`/api/sales/cash-closing/`)

export const getSalesByCashClosing = (id) => Api().get(`/api/sales/cash-closing/${id}`)

export const getSalesByCashClosingPending = () => Api().get(`/api/sales/cash-closing/pending/`)

export const getSaleAppointmentDetail = (id) => Api().get(`/api/sale/appointment/${id}`)

export const updateSale = (id, data) => Api().put(`/api/sales/${id}/`, data)