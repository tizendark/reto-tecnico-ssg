<?php
/**
 * Plugin Name: Reto Técnico Soporte
 * Description: Sistema de tickets con tabla personalizada y Google reCAPTCHA v2.
 * Version: 1.1
 * Author: Efraín Gutiérrez
 */

if (!defined('ABSPATH'))
    exit; // Seguridad

// CONFIGURACIÓN: PEGA TUS CLAVES AQUÍ
define('RTS_SITE_KEY', '6LdvJU0sAAAAAA_GJPJre-Zj6cJrVdJQuho5e0IH');
define('RTS_SECRET_KEY', '6LdvJU0sAAAAAOb8mbzEdRTwK26Gh-NrmdP9qIUO');

// 1. CARGAR SCRIPT DE GOOGLE RECAPTCHA
// Usamos wp_enqueue_scripts para hacerlo correctamente según estándares de WP
add_action('wp_enqueue_scripts', 'rts_cargar_scripts');

function rts_cargar_scripts()
{
    // Solo cargamos el script si estamos mostrando el shortcode (opcional, pero buena práctica)
    wp_register_script('google-recaptcha', 'https://www.google.com/recaptcha/api.js', array(), null, true);
    wp_enqueue_script('google-recaptcha');
}

// 2. CREAR TABLA (Igual que antes)
register_activation_hook(__FILE__, 'rts_crear_tabla');
function rts_crear_tabla()
{
    global $wpdb;
    $tabla = $wpdb->prefix . 'solicitudes_soporte';
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE $tabla (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        nombre varchar(100) NOT NULL,
        correo varchar(100) NOT NULL,
        asunto varchar(150) NOT NULL,
        mensaje text NOT NULL,
        fecha datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
        PRIMARY KEY  (id)
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}

// 3. SHORTCODE RENDERIZADO
add_shortcode('formulario_soporte', 'rts_render_formulario');

function rts_render_formulario()
{
    $mensaje_estado = '';

    // Procesar formulario si se envió
    if (isset($_POST['rts_submit'])) {
        $resultado = rts_procesar_envio();
        if ($resultado === true) {
            $mensaje_estado = '<div style="background:#d4edda;color:#155724;padding:10px;margin-bottom:10px;border-radius:5px;">¡Solicitud enviada con éxito!</div>';
        } else {
            // Mostrar el error específico (ej: Error de captcha)
            $mensaje_estado = '<div style="background:#f8d7da;color:#721c24;padding:10px;margin-bottom:10px;border-radius:5px;">Error: ' . $resultado . '</div>';
        }
    }

    ob_start();
    ?>
    <div class="rts-formulario"
        style="max-width:500px; margin:20px 0; padding:20px; border:1px solid #ddd; background:#fff;">
        <?php echo $mensaje_estado; ?>

        <form method="post" action="">
            <div style="margin-bottom:15px;">
                <label style="font-weight:bold;">Nombre:</label>
                <input type="text" name="rts_nombre" style="width:100%; padding:8px;" required>
            </div>
            <div style="margin-bottom:15px;">
                <label style="font-weight:bold;">Correo:</label>
                <input type="email" name="rts_correo" style="width:100%; padding:8px;" required>
            </div>
            <div style="margin-bottom:15px;">
                <label style="font-weight:bold;">Asunto:</label>
                <input type="text" name="rts_asunto" style="width:100%; padding:8px;" required>
            </div>
            <div style="margin-bottom:15px;">
                <label style="font-weight:bold;">Mensaje:</label>
                <textarea name="rts_mensaje" style="width:100%; padding:8px; height:100px;" required></textarea>
            </div>

            <div style="margin-bottom:15px;">
                <div class="g-recaptcha" data-sitekey="<?php echo RTS_SITE_KEY; ?>"></div>
            </div>

            <input type="submit" name="rts_submit" value="Enviar Solicitud"
                style="background:#007bff; color:white; padding:10px 20px; border:none; cursor:pointer;">
        </form>
    </div>
    <?php
    return ob_get_clean();
}

// 4. LÓGICA DE PROCESAMIENTO Y VALIDACIÓN
function rts_procesar_envio()
{
    global $wpdb;

    // A. Validar reCAPTCHA primero
    if (empty($_POST['g-recaptcha-response'])) {
        return 'Por favor, confirma que no eres un robot.';
    }

    // Llamada a la API de Google para verificar el token
    $verify_url = 'https://www.google.com/recaptcha/api/siteverify';
    $response = wp_remote_post($verify_url, array(
        'body' => array(
            'secret' => RTS_SECRET_KEY,
            'response' => $_POST['g-recaptcha-response'],
            'remoteip' => $_SERVER['REMOTE_ADDR']
        )
    ));

    if (is_wp_error($response)) {
        return 'Error al conectar con Google reCAPTCHA.';
    }

    $response_body = wp_remote_retrieve_body($response);
    $result = json_decode($response_body);

    if (!$result->success) {
        return 'Verificación de robot fallida. Intenta nuevamente.';
    }

    // B. Si pasó el Captcha, procesamos los datos
    $tabla = $wpdb->prefix . 'solicitudes_soporte';

    $nombre = sanitize_text_field($_POST['rts_nombre']);
    $correo = sanitize_email($_POST['rts_correo']);
    $asunto = sanitize_text_field($_POST['rts_asunto']);
    $mensaje = sanitize_textarea_field($_POST['rts_mensaje']);

    // Insertar en BD
    $insertado = $wpdb->insert(
        $tabla,
        array(
            'nombre' => $nombre,
            'correo' => $correo,
            'asunto' => $asunto,
            'mensaje' => $mensaje,
            'fecha' => current_time('mysql')
        )
    );

    if ($insertado === false) {
        return 'Error al guardar en la base de datos.';
    }

    // Enviar Email al Admin
    $admin_email = get_option('admin_email');
    $headers = array('Content-Type: text/html; charset=UTF-8');
    // Silenciamos errores de mail en local para que no rompa la ejecución si no hay servidor SMTP
    @wp_mail($admin_email, "Nueva Solicitud: $asunto", "De: $nombre ($correo)<br>Mensaje: $mensaje", $headers);

    return true; // Éxito total
}