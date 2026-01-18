# 🧩 Plugin de Soporte WordPress

Plugin personalizado desarrollado en PHP para integrar un formulario de solicitudes directamente en el CMS corporativo. Incluye protección anti-spam con Google reCAPTCHA v2.

## 📋 Características
* **Shortcode:** `[formulario_soporte]` para insertar en cualquier página.
* **Integración DB:** Guarda las solicitudes en una tabla personalizada de WordPress (`wp_solicitudes_soporte`).
* **Notificaciones:** Envía un correo electrónico al administrador usando `wp_mail()`.
* **Seguridad:** Validación de campos y verificación de CAPTCHA server-side.

## ⚙️ Instrucciones de Instalación

1. Copie la carpeta `reto-soporte` dentro del directorio de plugins de su instalación WordPress:
   `.../wp-content/plugins/reto-soporte/`

2. Acceda al **Panel de Administración de WordPress** > **Plugins**.

3. Busque **"Reto Técnico Soporte"** y haga clic en **Activar**.

4. Cree una nueva página en WordPress e inserte el shortcode:
   ```text
   [formulario_soporte]
   
## ⚠️ Configuración Adicional
Para que el reCAPTCHA funcione, debe editar el archivo index.php y colocar sus propias claves de API de Google (Site Key y Secret Key) en las constantes definidas al inicio del archivo.