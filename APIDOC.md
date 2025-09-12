# RecruitAI - Documentación de API

## Autenticación

### POST /api/auth/login
Autentica un usuario existente.

**Request Body:**
\`\`\`json
{
  "email": "string",
  "password": "string"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "message": "Login exitoso",
  "token": "string",
  "user": {
    "id": "number",
    "email": "string",
    "name": "string",
    "company": "string"
  }
}
\`\`\`

### POST /api/auth/register
Registra un nuevo usuario.

**Request Body:**
\`\`\`json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "company": "string"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "message": "Usuario creado exitosamente",
  "user": {
    "id": "number",
    "email": "string",
    "name": "string",
    "company": "string"
  }
}
\`\`\`

## Roles y Puestos

### GET /api/roles
Obtiene todos los roles creados por el usuario.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200):**
\`\`\`json
{
  "roles": [
    {
      "id": "number",
      "title": "string",
      "description": "string",
      "requirements": "string",
      "createdAt": "string",
      "userId": "number"
    }
  ]
}
\`\`\`

### POST /api/roles
Crea un nuevo rol.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "title": "string",
  "description": "string",
  "requirements": "string"
}
\`\`\`

### GET /api/roles/[id]/candidates
Obtiene todos los candidatos para un rol específico.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200):**
\`\`\`json
{
  "candidates": [
    {
      "id": "number",
      "name": "string",
      "email": "string",
      "cvUrl": "string",
      "score": "number",
      "strengths": ["string", "string"],
      "weaknesses": ["string", "string"],
      "evaluation": "string",
      "appliedAt": "string"
    }
  ]
}
\`\`\`

## Candidatos

### POST /api/roles/[id]/candidates
Sube un CV para un rol específico.

**Headers:**
\`\`\`
Authorization: Bearer <token>
Content-Type: multipart/form-data
\`\`\`

**Request Body (FormData):**
\`\`\`
cv: File (PDF)
name: string
email: string
\`\`\`

**Response (200):**
\`\`\`json
{
  "message": "CV procesado exitosamente",
  "candidate": {
    "id": "number",
    "name": "string",
    "email": "string",
    "score": "number",
    "strengths": ["string", "string"],
    "weaknesses": ["string", "string"],
    "evaluation": "string"
  }
}
\`\`\`

### GET /api/candidates/[id]
Obtiene detalles de un candidato específico.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200):**
\`\`\`json
{
  "candidate": {
    "id": "number",
    "name": "string",
    "email": "string",
    "cvUrl": "string",
    "score": "number",
    "strengths": ["string", "string"],
    "weaknesses": ["string", "string"],
    "evaluation": "string",
    "roleTitle": "string",
    "appliedAt": "string"
  }
}
\`\`\`

## Evaluación con IA

### POST /api/evaluate-cv
Evalúa un CV usando el modelo de lenguaje.

**Headers:**
\`\`\`
Authorization: Bearer <token>
Content-Type: application/json
\`\`\`

**Request Body:**
\`\`\`json
{
  "cvText": "string",
  "roleDescription": "string",
  "requirements": "string"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "score": "number",
  "strengths": ["string", "string"],
  "weaknesses": ["string", "string"],
  "evaluation": "string",
  "reasoning": "string"
}
\`\`\`

## Códigos de Error

- **400**: Bad Request - Datos inválidos
- **401**: Unauthorized - Token inválido o faltante
- **403**: Forbidden - Sin permisos para acceder al recurso
- **404**: Not Found - Recurso no encontrado
- **500**: Internal Server Error - Error del servidor

## Notas de Implementación

- Todos los endpoints requieren autenticación excepto `/api/auth/login` y `/api/auth/register`
- Los tokens tienen una duración de 24 horas
- Los archivos PDF se almacenan temporalmente para procesamiento
- La evaluación con IA puede tomar entre 5-15 segundos
- Se implementan principios SOLID en la arquitectura del backend
- Uso de características ES2020+ en todo el código
