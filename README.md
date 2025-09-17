# RecruitAI - Asistente Inteligente de Selección de Personal

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/luis-molinas-projects/v0-app-recruitment-ia-front)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=for-the-badge)](https://opensource.org/licenses/Apache-2.0)

## 📋 Descripción

RecruitAI es una plataforma de reclutamiento inteligente que utiliza inteligencia artificial para evaluar automáticamente candidatos, generar analytics detallados y optimizar el proceso de selección de personal. La aplicación permite a las empresas encontrar el candidato perfecto 4x más rápido mediante análisis automatizado y comparaciones inteligentes.

## ✨ Características Principales

### 🎯 Gestión de Candidatos
- **Evaluación Automática**: Análisis inteligente de CVs y perfiles de candidatos
- **Comparación de Candidatos**: Herramientas avanzadas para comparar múltiples candidatos
- **Subida de CVs**: Sistema de carga de documentos con análisis automático
- **Filtrado y Búsqueda**: Búsqueda avanzada con múltiples criterios

### 📊 Dashboard Analítico
- **Métricas en Tiempo Real**: Estadísticas de reclutamiento y rendimiento
- **Visualizaciones Interactivas**: Gráficos y tablas para análisis de datos
- **Reportes Detallados**: Informes completos del proceso de selección
- **Actividad Reciente**: Seguimiento de acciones y cambios

### 🏢 Gestión de Roles
- **Creación de Puestos**: Formularios dinámicos para definir roles
- **Requisitos Personalizados**: Especificación detallada de competencias
- **Seguimiento de Aplicaciones**: Monitoreo de candidatos por rol
- **Estados de Vacantes**: Control de estados (activo, pausado, cerrado)

### 🔐 Sistema de Autenticación
- **Registro de Usuarios**: Sistema de registro con validación
- **Inicio de Sesión Seguro**: Autenticación con JWT tokens
- **Roles de Usuario**: Diferentes niveles de acceso (admin, recruiter, hr_manager)
- **Integración con Supabase**: Backend robusto y escalable

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Next.js 15.2.4** - Framework de React con App Router
- **React 19** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Tailwind CSS 4.1.9** - Framework de CSS utilitario
- **Radix UI** - Componentes de interfaz accesibles
- **Lucide React** - Iconografía moderna
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas

### Backend & Base de Datos
- **Supabase** - Backend como servicio (BaaS)
- **PostgreSQL** - Base de datos relacional
- **JWT Authentication** - Autenticación basada en tokens

### Herramientas de Desarrollo
- **ESLint** - Linter para JavaScript/TypeScript
- **PostCSS** - Procesador de CSS
- **PNPM** - Gestor de paquetes
- **Vercel** - Plataforma de despliegue

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- PNPM (recomendado) o npm
- Cuenta de Supabase

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/recruimentappia-front.git
   cd recruimentappia-front
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install
   # o
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   ```
   
   Configurar las siguientes variables en `.env.local`:
   ```env
   NEXT_PUBLIC_API_BASE_URL="http://localhost:3000"
   ```

4. **Ejecutar en modo desarrollo**
   ```bash
   pnpm dev
   # o
   npm run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 📁 Estructura del Proyecto

```
recruimentappia-front/
├── app/                          # App Router de Next.js
│   ├── auth/                     # Páginas de autenticación
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/                # Panel principal
│   │   ├── analytics/           # Análisis y métricas
│   │   ├── candidates/          # Gestión de candidatos
│   │   ├── comparison/          # Comparación de candidatos
│   │   └── roles/               # Gestión de roles
│   ├── globals.css              # Estilos globales
│   ├── layout.tsx               # Layout principal
│   └── page.tsx                 # Página de inicio
├── components/                   # Componentes reutilizables
│   ├── auth/                    # Componentes de autenticación
│   ├── candidates/              # Componentes de candidatos
│   ├── dashboard/               # Componentes del dashboard
│   ├── roles/                   # Componentes de roles
│   └── ui/                      # Componentes de interfaz base
├── contexts/                     # Contextos de React
├── hooks/                       # Hooks personalizados
├── lib/                         # Utilidades y configuración
├── public/                      # Archivos estáticos
└── styles/                      # Archivos de estilos
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
pnpm dev          # Inicia el servidor de desarrollo

# Producción
pnpm build        # Construye la aplicación para producción
pnpm start        # Inicia el servidor de producción

# Calidad de código
pnpm lint         # Ejecuta ESLint
```

## 🌐 Despliegue

### Vercel (Recomendado)
1. Conecta tu repositorio con Vercel
2. Configura las variables de entorno
3. Despliega automáticamente

### Otros Proveedores
La aplicación es compatible con cualquier proveedor que soporte Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 📖 API Documentation

Para información detallada sobre la API, consulta el archivo [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

## 🤝 Contribución

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está licenciado bajo la Licencia Apache 2.0 - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Equipo

- **Desarrollador Principal**: Luis Molina

## 📞 Soporte

Para soporte técnico o preguntas:
- Abre un issue en GitHub
- Contacta al equipo de desarrollo

---

**RecruitAI** - Transformando el futuro del reclutamiento con inteligencia artificial.