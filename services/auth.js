'use strict';

import Api from './api'

const USER_AUTH_KEY = "adel-token"

/**
 * Realiza el inicio de sesión del usuario.
 * @param {object} credenciales recibe el email y password en un objeto JSON.
 * @returns Regresa una promesa.
 */
async function login(credentials) {
    let resp = {
        errors: {},
        status: 200,
        error: false
    }
    try {
        const token = await Api().post('/api/auth/login/', credentials)
        setToken(token.data.token)
    } catch (error) {
        resp.error = true
        resp.status = error.response.status
        resp.errors = error.response.data
    }
    return resp
}

/**
 * Verifica que este guardado el token.
 * @returns {boolean} Indica si esta logueado o no.
 */
const logged = () => getToken() ? true : false

/**
 * Obtiene el token del usuario de localStorage
 * @returns Regresa el token o null si no lo encuentra
 */
export const getToken = () => {
    try {
        return localStorage.getItem(USER_AUTH_KEY)
    } catch (error) {
        return null
    }
}

/**
 * Guarda el token del usuario en localStorage
 * @param {string} token Token de usuario a guardar en localStorage
 */
const setToken = (token) => localStorage.setItem(USER_AUTH_KEY, `Bearer ${token}`)

/** Limpia el token de usuario y su perfil del localStorage */
function logout() {
    localStorage.removeItem(USER_AUTH_KEY);
}

export default {
    login,
    logout,
    logged,
    setToken
}