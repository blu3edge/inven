# Configuración del MCP de Garmin

## Instalación Rápida

### 1. Instalar el MCP Server

```bash
pip install garmin-mcp
```

### 2. Autenticarse con Garmin Connect

```bash
garmin-mcp-auth
```

Se abrirá un navegador para que inicies sesión con tu cuenta de Garmin Connect. Las credenciales se guardan de forma segura.

### 3. Iniciar el servidor MCP

```bash
garmin-mcp
```

El servidor estará disponible en `stdio` listo para ser usado por Claude u otros clientes MCP.

## Usar con Claude Code

Una vez que el servidor MCP está corriendo, puedes acceder a tus datos de Garmin:

```python
# Ejemplo: obtener actividades recientes
tools = [
    "list_activities",
    "get_activity", 
    "get_health_snapshot"
]
```

## Herramientas Disponibles Principales

### Actividades
- `list_activities(limit, start, ...)` - Listar actividades
- `get_activity(activity_id)` - Detalles completos
- `get_activities_summary(start_date, end_date)` - Resumen por período
- `edit_activity(activity_id, ...)` - Editar actividad

### Salud y Bienestar
- `get_health_snapshot()` - Estado actual
- `get_heart_rate_data(start_date, end_date)` - Datos de FC
- `get_sleep_data(start_date, end_date)` - Datos de sueño
- `get_daily_steps(start_date, end_date)` - Pasos diarios
- `get_stress_data(start_date, end_date)` - Datos de estrés

### Entrenamientos
- `get_workouts(start, limit)` - Entrenamientos
- `get_training_status()` - Estado de entrenamiento
- `get_training_load_focus()` - Enfoque de carga

### Equipos
- `get_gear()` - Listar equipos
- `get_device_info()` - Info de dispositivos

### Descargas
- `download_activity_file(activity_id, format)` - Descargar actividad (FIT, GPX, TCX, CSV)

## Variables de Entorno Opcionales

```bash
# Filtrar herramientas (lista blanca)
GARMIN_ENABLED_TOOLS=list_activities,get_activity,get_health_snapshot

# O deshabilitar específicas (lista negra)
GARMIN_DISABLED_TOOLS=delete_activity

# Directorio para descargar archivos
GARMIN_FIT_DOWNLOAD_DIR=/path/to/downloads
```

## Estructura de Datos de Ejemplo

### Actividad
```json
{
  "activityId": 12345,
  "activityName": "Morning Run",
  "activityType": "running",
  "distance": 5.0,
  "duration": 2100,
  "averageHeartRate": 145,
  "calories": 450,
  "startTime": "2024-01-15T06:30:00.000Z"
}
```

### Health Snapshot
```json
{
  "steps": 8234,
  "heart_rate": 62,
  "sleep_duration": 420,
  "stress": 25,
  "respiration_rate": 16
}
```

## Troubleshooting

### "No MCP tools available"
- Asegúrate que el servidor MCP está corriendo: `garmin-mcp`
- Verifica que la autenticación es correcta: `garmin-mcp-auth`

### Error de autenticación
- Regenera credenciales: `rm ~/.garmin_mcp/config.json && garmin-mcp-auth`
- Verifica que tu cuenta Garmin Connect funciona correctamente

### Herramientas limitadas
- Usa `GARMIN_ENABLED_TOOLS` para seleccionar solo lo que necesitas
- Esto reduce el contexto necesario para Claude

## Referencias

- GitHub: https://github.com/Taxuspt/garmin_mcp
- Python Garmin Connect: https://github.com/cyberjunky/python-garminconnect
- MCP Protocol: https://modelcontextprotocol.io
