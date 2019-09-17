'use strict';

import moment from 'moment'
import BigCalendar from 'react-big-calendar'
moment.locale('es');

export const localizer = BigCalendar.momentLocalizer(moment) // or globalizeLocalizer

export const currencyformat = (value, decimalPosition = 2) => {
    return '$' + value
        .toFixed(decimalPosition)
        .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
}

export const dateFormat = (value) => {
    return moment(value).format('DD/MM/YYYY')
}

export const datetimeFormat = (value) => {
    return moment(value).format('DD/MM/YYYY HH:mm')
}

export const timeFormat = (value) => {
    return moment(value).format('HH:mm')
}

export const friendlyDateformat = (value) => {
    return moment(value).format('D MMMM YYYY')
}

export const friendlyFullDateformat = (value) => {
    return moment(value).format('D MMMM YYYY HH:mm')
}

export const DayMonthFormat = (value) => {
    return moment(value).format('D')
}

export const djangoDateFormat = (value) => {
    return moment(value).format('YYYY-MM-DD')
}

export const djangofriendlyDateformat = (value) => {
    return moment(value).format('YYYY-MM-DD HH:mm:ss')
}