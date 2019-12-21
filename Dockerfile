#  Indica la base de la imagen
FROM node

# De la maquina anfitriona al contenedor
COPY ["package.json", "package-lock.json", "/usr/src/produccion/"]

# Ve hasta la carpeta dentro del contenedor
WORKDIR /usr/src/produccion

# Instala dependencias
RUN npm install

# De la maquina anfitriona al contenedor
COPY [".", "/usr/src/produccion/"]

# Expone el conenedor por el puerto 3000
EXPOSE 3000

# Command ( cual es el comando por defecto que va a correr un contenedor )
CMD [ "npm", "dev" ]