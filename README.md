# IntiTrip – Formulario Visa Americana

Aplicación web para captura de datos del formulario de visa americana, con generación automática de PDF en Google Drive.

---

## Stack

React · Vite · TypeScript · Tailwind CSS · React Hook Form · Zod · ESLint · Prettier

---

## 1. Ejecutar localmente

```bash
# Clonar / descomprimir el proyecto
cd intitrip-visa-form

# Instalar dependencias
npm install

# Crear archivo de variables de entorno
cp .env.example .env
# → Editar .env y colocar la URL del Web App de Apps Script

# Iniciar servidor de desarrollo
npm run dev
# → http://localhost:5173
```

---

## 2. Generar build de producción

```bash
npm run build
# Genera la carpeta /dist lista para deploy
```

---

## 3. Desplegar en GitHub Pages

```bash
# 1. Crear repositorio en GitHub con el nombre: intitrip-visa-form
# 2. Inicializar git y subir código
git init
git remote add origin https://github.com/TU_USUARIO/intitrip-visa-form.git
git add .
git commit -m "feat: initial commit"
git push -u origin main

# 3. Desplegar (requiere haber configurado gh-pages en package.json ✓)
npm run deploy

# 4. En GitHub → Settings → Pages → Source: "gh-pages" branch → /root
# URL: https://TU_USUARIO.github.io/intitrip-visa-form/
```

> **Importante:** Verificar que en `vite.config.ts` el `base` sea `'/intitrip-visa-form/'`

---

## 4. Crear y publicar el Web App de Google Apps Script

1. Ir a [script.google.com](https://script.google.com) → **Nuevo proyecto**
2. Nombrar el proyecto: `IntiTrip Visa Form`
3. Copiar el contenido de `apps-script/Code.gs` en el editor
4. **Desplegar → Nueva implementación**
   - Tipo: **Aplicación web**
   - Ejecutar como: **Yo (tu cuenta Google)**
   - Quién puede acceder: **Cualquier usuario**
5. Copiar la **URL de implementación** generada (termina en `/exec`)
https://script.google.com/macros/s/AKfycbx1GH8JlT37cyBFxcsHgwsv4Bfz3QWs4dTgzMMIQF2BiCfKAQrcr2ehOEfBMCMXde_P/exec

---

## 5. Conectar React con Apps Script

1. Abrir el archivo `.env` del proyecto React
2. Pegar la URL copiada:

```env
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/TU_ID_AQUI/exec
```

3. Reconstruir el proyecto: `npm run build`

> **Nota sobre CORS:** Apps Script no admite CORS desde dominios externos de forma nativa.
> Si aparece error de CORS, usar un proxy simple o habilitar el acceso desde el mismo dominio de Google.
> Alternativa: enviar los datos mediante `no-cors` y manejar la respuesta con un ID de formulario guardado en Drive.

---

## 6. Configurar Google Drive

1. Crear una carpeta en tu Google Drive: `IntiTrip – Formularios Visa`
2. Abrir la carpeta → la URL tiene el ID:
   `https://drive.google.com/drive/folders/ESTE_ES_EL_ID`
3. Pegar ese ID en `apps-script/Code.gs`:
   ```js
   PARENT_FOLDER_ID: 'ESTE_ES_EL_ID',
   ```

---

## 7. Configurar la plantilla Google Docs

### Crear la plantilla

1. Crear un nuevo Google Doc: `Plantilla Visa Americana`
2. Diseñar el documento con el contenido del PDF original
3. Reemplazar cada dato variable con `{{nombreDeCampo}}`, por ejemplo:

```
DATOS PERSONALES
Nombre completo: {{fullName}}
Cédula:          {{cedula}}
Estado civil:    {{maritalStatus}}
Nacionalidad:    {{nationality}}
Celular:         {{cellPhone}}
Email:           {{email}}
Dirección:       {{address}}

TRABAJO ACTUAL
Cargo:           {{currentPosition}}
Empresa:         {{currentEmployer}}
Sueldo:          {{currentSalary}}
...
```

4. Guardar el documento
5. En la URL del Doc, copiar el ID:
   `https://docs.google.com/document/d/ESTE_ES_EL_ID/edit`
6. Pegarlo en `apps-script/Code.gs`:
   ```js
   TEMPLATE_DOC_ID: 'ESTE_ES_EL_ID',
   ```

### Variables disponibles en la plantilla

| Variable | Descripción |
|---|---|
| `{{cedula}}` | Cédula de identidad |
| `{{fullName}}` | Nombre completo |
| `{{maritalStatus}}` | Estado civil |
| `{{nationality}}` | Nacionalidad |
| `{{city}}` | Ciudad |
| `{{province}}` | Provincia |
| `{{cellPhone}}` | Celular |
| `{{email}}` | Email |
| `{{address}}` | Dirección |
| `{{facebook}}` | Usuario Facebook |
| `{{instagram}}` | Usuario Instagram |
| `{{currentPosition}}` | Cargo actual |
| `{{currentEmployer}}` | Empleador actual |
| `{{currentSalary}}` | Sueldo |
| `{{currentJobStartDate}}` | Fecha inicio trabajo |
| `{{universityInstitution}}` | Universidad |
| `{{careerName}}` | Carrera |
| `{{languages}}` | Idiomas |
| `{{fatherName}}` | Nombre del padre |
| `{{motherName}}` | Nombre de la madre |
| `{{travelHistory}}` | Historial de viajes |
| `{{tripPurpose}}` | Motivo del viaje |
| *(y todos los demás campos del formulario)* | |

---

## Flujo completo

```
Cliente llena formulario web (React)
    ↓
Validación Zod en frontend
    ↓
POST JSON → Google Apps Script Web App
    ↓
Apps Script:
  1. Crea carpeta: nombre_apellido_cedula
  2. Copia plantilla Google Docs
  3. Reemplaza {{variables}} con los datos
  4. Convierte a PDF
  5. Guarda PDF en la carpeta
    ↓
Devuelve { success: true, pdfUrl: "..." }
    ↓
React muestra pantalla de éxito con link al PDF
```

---

## Estructura del proyecto

```
intitrip-visa-form/
├── apps-script/
│   └── Code.gs                    # Google Apps Script
├── src/
│   ├── components/
│   │   ├── form/
│   │   │   ├── PersonalSection.tsx
│   │   │   ├── SocialMediaSection.tsx
│   │   │   ├── WorkSection.tsx
│   │   │   ├── EducationSection.tsx
│   │   │   ├── FamilySection.tsx
│   │   │   ├── TravelSection.tsx
│   │   │   └── ReviewSection.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── SuccessScreen.tsx
│   │   └── ui/
│   │       ├── Input.tsx
│   │       ├── Select.tsx
│   │       ├── RadioGroup.tsx
│   │       ├── Textarea.tsx
│   │       └── StepIndicator.tsx
│   ├── hooks/
│   │   └── useMultiStep.ts
│   ├── lib/
│   │   └── schema.ts              # Validaciones Zod
│   ├── services/
│   │   └── appsScript.ts          # Cliente API
│   ├── types/
│   │   └── form.ts                # Tipos TypeScript
│   ├── utils/
│   │   └── cn.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── .eslintrc.cjs
├── .prettierrc
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```
