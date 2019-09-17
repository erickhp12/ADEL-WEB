export const hasPermission = (permission) => {
    try {
        let permisos = JSON.parse(localStorage.getItem('permisos'))
        let encontrado = permisos.find(o => o.id === permission) || {id:0}
        if (encontrado.id != 0)
        return true
    }catch(error){
        return false
    }
}