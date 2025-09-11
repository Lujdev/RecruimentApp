# RecruitAI - Asistente de Selección de Personal

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/luis-molinas-projects/v0-app-recruitment-ia-front)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 📋 Descripción

RecruitAI es una plataforma de reclutamiento inteligente que utiliza inteligencia artificial para evaluar automáticamente candidatos y optimizar el proceso de selección de personal. La aplicación permite a los reclutadores crear roles de trabajo, gestionar candidatos y obtener evaluaciones detalladas de CVs usando modelos de IA avanzados.

## ✨ Características Principales

### 🎯 Gestión de Roles
- **Creación de roles**: Define puestos de trabajo con descripciones detalladas y requisitos
- **Filtros avanzados**: Búsqueda por departamento, tipo de empleo, ubicación y estado
- **Gestión de estados**: Controla el ciclo de vida de los roles (activo, inactivo, cerrado)

### 👥 Gestión de Candidatos
- **Subida de CVs**: Carga de archivos PDF con validación automática
- **Evaluación automática**: Análisis de CVs usando IA (Gemini) para generar puntuaciones y evaluaciones
- **Comparación de candidatos**: Herramientas para comparar múltiples candidatos
- **Seguimiento de aplicaciones**: Estados de aplicación (pendiente, revisando, entrevistado, contratado, rechazado)

### 📊 Dashboard y Analytics
- **Estadísticas en tiempo real**: Métricas de roles, candidatos y evaluaciones
- **Gráficos interactivos**: Visualización de datos con Recharts
- **Actividad reciente**: Seguimiento de acciones del sistema
- **Distribución de puntuaciones**: Análisis de rendimiento de candidatos

### 🔐 Autenticación y Seguridad
- **Autenticación JWT**: Sistema seguro con tokens de Supabase
- **Roles de usuario**: Admin, Reclutador, Gerente de RRHH
- **OAuth con Google**: Inicio de sesión social
- **Gestión de perfiles**: Actualización de información personal y empresarial

## 🛠️ Tecnologías Utilizadas

### Frontend
- **[Next.js 15](https://nextjs.org/)** - Framework de React con App Router
- **[React 19](https://react.dev/)** - Biblioteca de interfaz de usuario
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático para JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework de CSS utility-first
- **[Radix UI](https://www.radix-ui.com/)** - Componentes de interfaz accesibles
- **[Lucide React](https://lucide.dev/)** - Iconos modernos
- **[Recharts](https://recharts.org/)** - Gráficos y visualizaciones
- **[React Hook Form](https://react-hook-form.com/)** - Gestión de formularios
- **[Zod](https://zod.dev/)** - Validación de esquemas

### Backend y Servicios
- **API REST** - Backend personalizado con autenticación JWT
- **Supabase** - Base de datos PostgreSQL y autenticación
- **Google Gemini AI** - Evaluación automática de CVs
- **Almacenamiento de archivos** - Supabase Storage para CVs

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- pnpm (recomendado) o npm
- Cuenta de Supabase
- API Key de Google Gemini

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/recruimentappia-front.git
cd recruimentappia-front
```

### 2. Instalar dependencias
```bash
pnpm install
# o
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

### 4. Ejecutar en desarrollo
```bash
pnpm dev
# o
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
recruimentappia-front/
├── app/                          # App Router de Next.js
│   ├── auth/                     # Páginas de autenticación
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/                # Dashboard principal
│   │   ├── analytics/           # Página de analytics
│   │   ├── candidates/          # Gestión de candidatos
│   │   ├── comparison/          # Comparación de candidatos
│   │   └── roles/               # Gestión de roles
│   ├── globals.css              # Estilos globales
│   ├── layout.tsx               # Layout raíz
│   └── page.tsx                 # Página de inicio
├── components/                   # Componentes reutilizables
│   ├── auth/                    # Componentes de autenticación
│   ├── candidates/              # Componentes de candidatos
│   ├── dashboard/               # Componentes del dashboard
│   ├── roles/                   # Componentes de roles
│   └── ui/                      # Componentes base (shadcn/ui)
├── contexts/                    # Contextos de React
│   └── AppContext.tsx           # Contexto global de la aplicación
├── hooks/                       # Hooks personalizados
├── lib/                         # Utilidades y configuración
│   ├── api.ts                   # Cliente API
│   └── utils.ts                 # Funciones utilitarias
├── public/                      # Archivos estáticos
└── styles/                      # Archivos de estilos adicionales
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

## 📚 API Documentation

La aplicación se conecta a una API REST que proporciona los siguientes endpoints:

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/google` - Autenticación con Google
- `GET /api/auth/profile` - Obtener perfil del usuario

### Roles
- `GET /api/roles` - Listar roles con filtros
- `POST /api/roles` - Crear nuevo rol
- `GET /api/roles/:id` - Obtener rol específico
- `PUT /api/roles/:id` - Actualizar rol
- `DELETE /api/roles/:id` - Eliminar rol

### Candidatos y Aplicaciones
- `POST /api/applications` - Crear nueva aplicación
- `GET /api/applications` - Listar aplicaciones
- `GET /api/candidates` - Listar candidatos
- `PUT /api/applications/:id` - Actualizar aplicación

### Evaluaciones
- `GET /api/evaluations` - Listar evaluaciones
- `POST /api/evaluations/reevaluate` - Re-evaluar candidato
- `GET /api/evaluations/stats` - Estadísticas de evaluaciones

### Dashboard
- `GET /api/dashboard/stats` - Estadísticas generales
- `GET /api/dashboard/analytics` - Datos de analytics
- `GET /api/dashboard/activity` - Actividad reciente

Para más detalles, consulta el archivo [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

## 🎨 Componentes UI

La aplicación utiliza una combinación de:
- **shadcn/ui** - Componentes base accesibles
- **Radix UI** - Primitivos de interfaz
- **Tailwind CSS** - Estilos utility-first
- **Lucide React** - Iconografía moderna

### Componentes Principales
- `DashboardHeader` - Encabezado del dashboard
- `DashboardSidebar` - Navegación lateral
- `RolesList` - Lista de roles de trabajo
- `CandidatesList` - Lista de candidatos
- `CandidateComparison` - Comparación de candidatos
- `AnalyticsDashboard` - Dashboard de analytics

## 🔒 Seguridad

- **Autenticación JWT** con tokens de Supabase
- **Validación de archivos** para CVs (solo PDF, máximo 10MB)
- **Rate limiting** en la API (10,000 requests por 15 minutos)
- **CORS** configurado para el dominio del frontend
- **Validación de esquemas** con Zod

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Despliega automáticamente

### Otras plataformas
La aplicación es compatible con cualquier plataforma que soporte Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas:
- 📧 Email: luisjmolina29@gmail.com

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) por el framework
- [Supabase](https://supabase.com/) por la base de datos y autenticación
- [Google Gemini](https://ai.google.dev/) por la IA de evaluación
- [Tailwind CSS](https://tailwindcss.com/) por el sistema de estilos
- [Radix UI](https://www.radix-ui.com/) por los componentes accesibles

---

**Desarrollado con ❤️ para optimizar el proceso de reclutamiento**