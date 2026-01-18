# 💻 Web Application (Next.js)

Módulo principal del Sistema de Gestión de Solicitudes (SSG). Aplicación moderna desarrollada con Next.js 14 (App Router) y Tailwind CSS, conectada a Supabase para la persistencia de datos y autenticación.

## 🛠️ Stack Tecnológico
* **Framework:** Next.js 14
* **Estilos:** Tailwind CSS + Lucide React (Iconos)
* **Base de Datos:** Supabase (PostgreSQL Cloud)
* **Lenguaje:** TypeScript

## 🚀 Instalación y Ejecución

1. **Instalar dependencias:**
   ```bash
   npm install

2. **Configurar Variables de Entorno: Crea un archivo .env.local en esta carpeta con las credenciales de Supabase:**
	NEXT_PUBLIC_SUPABASE_URL=https://snstpymxafunvnnbcvqe.supabase.co
	NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuc3RweW14YWZ1bnZubmJjdnFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1OTIyNTAsImV4cCI6MjA4NDE2ODI1MH0.9xLpI_-BBtQ7cPcLk8LsFSdt8dEsHhpW7sSfdE5IoRc
	
3. **Ejecutar en desarrollo:**
	npm run dev
	
	Abra http://localhost:3000 en su navegador.
	
**Credenciales de Prueba**
Para acceder a los paneles protegidos (/admin/dashboard o /designer/dashboard):

Usuario: disenador@test.com
Contraseña: 123456789

**Despliegue**
Este proyecto está optimizado para Vercel.
- Asegúrese de configurar el "Root Directory" en Vercel como web-app.
- Agregue las variables de entorno en el panel de Vercel.

