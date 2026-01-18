Instrucciones vitales para que logren conectar el reporte.

```markdown
# 📊 Business Intelligence & Analytics

Tablero de control desarrollado en Microsoft Power BI para visualizar KPIs de rendimiento del equipo de diseño.

## 📈 Métricas Clave
* **Tiempo Promedio de Atención:** Diferencia entre creación y asignación de la solicitud.
* **Carga de Trabajo:** Solicitudes activas por estado.
* **Demanda por Área:** Volumen de solicitudes segregado por departamento.

## 🔌 Conexión a Datos (ODBC)

El reporte `.pbix` se conecta a Supabase (PostgreSQL) mediante ODBC.
**Requisito:** Tener instalado el driver `PostgreSQL Unicode(x64)`.

### Configuración del DSN (System DSN)
Debido a que Supabase descontinuó el soporte directo IPv4 gratuito, se debe usar el **Transaction Pooler** en el puerto 6543.

* **Driver:** PostgreSQL Unicode(x64)
* **Server:** `aws-0-us-east-1.pooler.supabase.com` (Verificar host actual en Supabase)
* **Port:** `6543` (¡Importante! No usar 5432)
* **Database:** `postgres`
* **SSL Mode:** `require`
* **Username:** `postgres.snstpymxafunvnnbcvqe`
* **Password:** `Sabbag987654321SSG2026$`

## 📂 Archivos
* **`ssg.pbix`:** Archivo fuente editable.
* **`/screenshots`:** Capturas de pantalla del reporte funcional (en caso de no poder configurar la conexión ODBC localmente).