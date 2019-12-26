const routes = require('next-routes')

module.exports = routes()
.add('index')
.add('login/')
.add('admin', '/admin/', 'admin/index')
//SUCURSALES
.add('branch_offices', '/admin/sucursales/', 'admin/branch_offices/index')
.add('add_branch_office', '/admin/sucursales/agregar/', 'admin/branch_offices/add_edit')
.add('edit_branch_office', '/admin/sucursales/editar/:id/', 'admin/branch_offices/add_edit')
//SERVICIOS
.add('services', '/admin/servicios/', 'admin/services/index')
.add('add_service', '/admin/servicios/agregar/', 'admin/services/add_edit')
.add('edit_service', '/admin/servicios/editar/:id/', 'admin/services/add_edit')
//CATEGORIA DE SERVICIOS
.add('categories', '/admin/categorias/', 'admin/categories/index')
.add('add_category', '/admin/categorias/agregar/', 'admin/categories/add_edit')
.add('edit_category', '/admin/categorias/editar/:id/', 'admin/categories/add_edit')
//ESPECIALIDADES
.add('add_specialty', '/admin/especialidades/agregar/', 'admin/specialties/add_edit')
.add('edit_specialty', '/admin/especialidades/editar/:id/', 'admin/specialties/add_edit')
//ASOCIADOS
.add('associates', '/admin/asociados/', 'admin/associates/index')
.add('add_associate', '/admin/asociados/agregar/', 'admin/associates/add_edit')
.add('edit_associate', '/admin/asociados/editar/:id/', 'admin/associates/add_edit')
//PACIENTES
.add('patients', '/admin/pacientes/', 'admin/patients/index')
.add('add_patient', '/admin/pacientes/agregar/', 'admin/patients/add_edit')
.add('edit_patient', '/admin/pacientes/editar/:id/', 'admin/patients/add_edit')
//PAQUETES DE PACIENTES
.add('patient_package', '/admin/pacientes/paquete/:id/', 'admin/patients/patient_package')
//USUARIOS
.add('users', '/admin/usuarios/', 'admin/users/index')
.add('add_user', '/admin/usuarios/agregar/', 'admin/users/add_edit')
.add('edit_user', '/admin/usuarios/editar/:id/', 'admin/users/add_edit')
//PRODUCTOS
.add('products', '/admin/productos/', 'admin/products/index')
.add('add_product', '/admin/productos/agregar/', 'admin/products/add_edit')
.add('edit_product', '/admin/productos/editar/:id/', 'admin/products/add_edit')
//PAQUETES
.add('packages', '/admin/paquetes/', 'admin/packages/index')
.add('add_package', '/admin/paquetes/agregar/', 'admin/packages/add_edit')
.add('edit_package', '/admin/paquetes/editar/:id/', 'admin/packages/add_edit')
.add('package_detail', '/admin/paquete/paciente/detalle/:patient_package_id/', 'admin/patients/package_detail')
.add('package_edition', '/admin/paquetes/:id/ediciones/', 'admin/packages/editions')
//VENTAS
.add('sales', '/admin/ventas/', 'admin/sales/index')
.add('ticket', '/admin/ventas/ticket/:id/', 'admin/sales/ticket')
.add('add_sale', '/admin/ventas/agregar/', 'admin/sales/add_edit')
.add('edit_sale', '/admin/ventas/editar/:id/', 'admin/sales/add_edit')
.add('sale_detail', '/admin/ventas/:id/', 'admin/sales/sale_detail')
//CAJA
.add('cash', '/admin/caja/', 'admin/sales/cash')
.add('cash-closing', '/admin/caja/corte/', 'admin/sales/cash-closing')
.add('cash-closing-list', '/admin/caja/cortes/', 'admin/sales/cash-closing-list')
.add('cash-closing-detail', '/admin/caja/corte/detalle/:id/', 'admin/sales/cash-closing-detail')
//INVENTARIO
.add('inventory', '/admin/inventario/', 'admin/inventory/index')
.add('inventory_branch_office', '/admin/inventario/sucursal/:id/', 'admin/inventory/add_edit')
//REPORTES
.add('reports', '/admin/reportes/', 'admin/reports/index')
//PROVEEDORES
.add('providers', '/admin/proveedores/', 'admin/providers/index')
.add('add_provider', '/admin/proveedores/agregar/', 'admin/providers/add_edit')
.add('edit_provider', '/admin/proveedores/editar/:id/', 'admin/providers/add_edit')
//CITAS
.add('appointments', '/admin/citas/', 'admin/appointments/index')
.add('add_appointment', '/admin/citas/agregar/', 'admin/appointments/add_edit')
.add('add_appointment_session', '/admin/citas/agregar/:session_id/:patient_id/:patient_package_id', 'admin/appointments/add_edit_session')
.add('edit_appointment', '/admin/citas/editar/:id/', 'admin/appointments/add_edit')
.add('appointment_detail', '/admin/citas/:id/', 'admin/appointments/appointment_detail')
//CALENDARIO
.add('calendar', '/admin/citas/ver/calendario/', 'admin/appointments/calendar')
//AJUSTES
.add('settings', '/admin/configuraciones/', 'admin/settings/index')