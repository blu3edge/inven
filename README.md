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
- Python 3.10+
- MCP Cliente compatible (Claude, etc.)
- Credenciales de Garmin Connect

### Instalación del MCP Server

```bash
pip install garmin-mcp
```

### Autenticación Inicial

```bash
garmin-mcp-auth
```

Esto abrirá un navegador para autenticar con tu cuenta de Garmin Connect.

### Variables de Entorno Opcionales

```
GARMIN_ENABLED_TOOLS=list_activities,get_activity,get_health_snapshot
GARMIN_FIT_DOWNLOAD_DIR=/path/to/downloads
```

### Usar en Claude

El MCP de Garmin está disponible en https://github.com/Taxuspt/garmin_mcp

Para conectarlo a Claude:
1. Instala el MCP: `pip install garmin-mcp`
2. Ejecuta la autenticación: `garmin-mcp-auth`
3. Configura en Claude según la documentación del MCP

## Herramientas Disponibles

110+ herramientas incluyendo:
- `list_activities` - Listar actividades
- `get_activity` - Detalles de actividad
- `get_health_snapshot` - Snapshot de salud actual
- `get_sleep_data` - Datos de sueño
- `get_daily_steps` - Pasos diarios
- `get_heart_rate_data` - Datos de FC
- Y mucho más...
