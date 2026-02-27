CRM Contact

Aplicación de gestión de contactos construida con un enfoque moderno y minimalista. Este proyecto utiliza un stack desacoplado para garantizar escalabilidad y una experiencia de usuario fluida.

Stack Tecnológico

    - Backend: Laravel 12 + PHP 8.3 (Laravel Sail/Docker).
    - Frontend: Vue 3 (Composition API) + TypeScript + Vite.
    - Estilos: Tailwind CSS.
    - Iconografía: Lucide Icons.
    - Autenticación: Laravel Sanctum (SPA Authentication).

## Guía de Instalación

Sigue estos pasos para replicar el entorno de desarrollo utilizando Docker.

1. Requisitos Previos

    Asegúrate de tener instalados:
    - Docker
    - Git

2. Clonación
   Clona el repositorio y navega al directorio raíz:

`git clone git@github.com:MisaelAJ/MisaelAJ-crm-contacts.git
cd MisaelAJ-crm-contacts`

Dado que el proyecto utiliza Laravel Sail, se requiere instalar las dependencias iniciales de Composer sin necesidad de tener PHP localmente:
Bash

```
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v "$(pwd):/var/www/html" \
    -w /var/www/html \
    laravelsail/php83-composer:latest \
    composer install --ignore-platform-reqs
```

3. Configuración del Entorno

Copiar el archivo de variables de entorno y levanta los servicios:
Bash

```
cp .env.example .env
./vendor/bin/sail up -d
```

4. Inicialización del Sistema

Ejecutar los comandos de mantenimiento dentro de los contenedores:
Bash

- Generar clave de aplicación
  `./vendor/bin/sail composer install`

- Generar clave de aplicación
  `./vendor/bin/sail artisan key:generate`

Correr migraciones y poblar base de datos con contactos de prueba
`./vendor/bin/sail artisan migrate --seed`

5. Preparación del Frontend

Instalar las dependencias de Node y arrancar el servidor de desarrollo de Vite:
Bash

```
./vendor/bin/sail npm install
./vendor/bin/sail npm run dev
```
