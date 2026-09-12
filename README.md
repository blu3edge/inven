# Inven - Garmin Connection via MCP

Proyecto para conectar y acceder a datos desde dispositivos Garmin usando el Garmin MCP Server.

## Funcionalidades del MCP de Garmin

✅ **Activity Management** (20 tools)
- Listar actividades recientes con paginación
- Obtener detalles de actividades
- Editar actividades (nombre, tipo, descripción, esfuerzo percibido)

✅ **Health & Wellness** (33 tools)
- Pasos, frecuencia cardíaca, sueño, estrés, respiración
- Composición corporal
- Métricas de entrenamiento

✅ **Training & Performance** (13 tools)
- Estado de entrenamiento
- Tendencias de HRV, VO2 max
- Zonas de potencia (ciclismo)

✅ **Workouts & Planning** (8 tools)
- Acceder a entrenamientos y planes
- Crear entrenamientos personalizados

✅ **Gear Management** (5 tools)
- Administrar equipos y equipamiento

✅ **Y muchos más**: Nutrition, Weight Tracking, Courses, Women's Health, Challenges...

## Configuración

### Requisitos
- Python 3.12+
- `uv` / `uvx`
- Cliente MCP compatible (Claude Desktop, Codex, etc.)
- Cuenta de Garmin Connect

### Autenticación inicial

El paquete no está en PyPI; se ejecuta desde GitHub:

```bash
uvx --python 3.12 --from git+https://github.com/Taxuspt/garmin_mcp garmin-mcp-auth
```

Pide email, contraseña y MFA una sola vez, y guarda los tokens OAuth en `~/.garminconnect`.

### Configuración del cliente

```json
{
  "mcpServers": {
    "garmin": {
      "command": "uvx",
      "args": ["--python", "3.12", "--from", "git+https://github.com/Taxuspt/garmin_mcp", "garmin-mcp"]
    }
  }
}
```

Sin credenciales en el archivo: el servidor usa los tokens guardados.

### Variables de entorno opcionales

```
GARMIN_ENABLED_TOOLS=list_activities,get_activity,get_sleep_data
GARMIN_FIT_DOWNLOAD_DIR=/ruta/de/descargas
```

Los pasos completos están en [GARMIN_MCP_SETUP.md](GARMIN_MCP_SETUP.md).

## Herramientas Disponibles

110+ herramientas. Nombres reales de las más usadas:

**Actividades**
- `get_activities` — listar actividades con paginación
- `get_activities_by_date` — actividades en un rango de fechas
- `get_activity` — detalle de una actividad
- `get_activity_splits`, `get_activity_weather`, `get_activity_gear`
- `set_activity_name`, `set_activity_type`, `set_activity_description`,
  `set_perceived_effort`, `set_activity_feel` — edición

**Salud**
- `get_stats` / `get_user_summary` / `get_stats_and_body` — resumen diario
- `get_daily_steps`, `get_steps_data`, `get_weekly_steps`
- `get_sleep_data`, `get_sleep_summary`
- `get_heart_rates`, `get_rhr_day`
- `get_stress_data`, `get_all_day_stress`, `get_weekly_stress`
- `get_body_battery`, `get_respiration_data`, `get_spo2_data`
- `get_body_composition`, `get_hydration_data`

**Entrenamiento**
- `get_training_readiness`, `get_morning_training_readiness`
- `get_training_effect`, `get_hrv_data`
- `get_endurance_score`, `get_hill_score`
- `get_progress_summary_between_dates`

La lista completa está en el README de
[Taxuspt/garmin_mcp](https://github.com/Taxuspt/garmin_mcp).
