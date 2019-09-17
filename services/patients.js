'use strict';

import Api from './api'

export const getPatients = (params = {}) => Api().get('/api/patients/', { params })

export const getPatient = (id) => Api().get(`/api/patients/${id}`)

export const getPatientPackages = (params = {}) => Api().get('/api/patient-packages/', { params })

export const getPatientPackage = (id) => Api().get(`/api/patient-packages/${id}`)

export const getPackagesInfo = () => Api().get(`/api/patients/packages/info`)

export const addPatient = (data) => Api().post(`/api/patients/`, data)

export const addPatientPackage = (data) => Api().post(`/api/patient-packages/`, data)

export const updatePatient = (id, data) => Api().put(`/api/patients/${id}/`, data)

export const savePatientsAddress = (id, data) => Api().post(`/api/patients/${id}/address/`, data)

export const savePatientsPersonalInfo = (id, data) => Api().post(`/api/patients/${id}/personal-information/`, data)

export const savePatientsNotes = (id, data) => Api().post(`/api/patients/${id}/notes/`, data)

export const deletePatientsNote = (patient_id, note_id) => Api().delete(`/api/patients/${patient_id}/notes/${note_id}/`)

export const addMedicalHistory = (id, data) => Api().post(`/api/patients/${id}/medical-history/`, data)

export const deleteMedicalHistory = (patient_id, medical_history_id) => Api().delete(`/api/patients/${patient_id}/medical-history/${medical_history_id}/`)
