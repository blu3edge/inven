/**
 * Ejemplo de cómo usar el MCP de Garmin con Claude
 *
 * El MCP de Garmin expone 110+ herramientas para acceder a:
 * - Actividades y entrenamientos
 * - Datos de salud (pasos, FC, sueño, estrés)
 * - Análisis de rendimiento
 * - Equipos y dispositivos
 * - Planes de entrenamiento
 */

/**
 * Herramientas principales disponibles en el MCP de Garmin
 */

const GARMIN_MCP_TOOLS = {
  // ========== ACTIVIDADES ==========
  ACTIVITIES: {
    // Listar actividades recientes
    list_activities: {
      description: "Listar actividades recientes con paginación",
      params: { limit: 50, start: 0 },
      example: "Muestra mis últimas 10 actividades"
    },

    // Obtener detalles de una actividad
    get_activity: {
      description: "Obtener detalles completos de una actividad",
      params: { activity_id: "required" },
      example: "Dame los detalles de mi actividad 12345"
    },

    // Editar una actividad
    edit_activity: {
      description: "Editar nombre, tipo, descripción, esfuerzo",
      params: { activity_id: "required", activity_name: "optional", description: "optional" },
      example: "Cambia el nombre de la actividad 12345 a 'Fast Run'"
    }
  },

  // ========== SALUD Y BIENESTAR ==========
  HEALTH: {
    // Estado de salud actual
    get_health_snapshot: {
      description: "Snapshot actual de salud",
      params: {},
      example: "¿Cuál es mi estado de salud actual?"
    },

    // Pasos diarios
    get_daily_steps: {
      description: "Pasos por día",
      params: { start_date: "required", end_date: "required" },
      example: "¿Cuántos pasos di la semana pasada?"
    },

    // Datos de sueño
    get_sleep_data: {
      description: "Información de sueño",
      params: { start_date: "required", end_date: "required" },
      example: "¿Cuánto dormí los últimos 7 días?"
    },

    // Frecuencia cardíaca
    get_heart_rate_data: {
      description: "Datos de frecuencia cardíaca",
      params: { start_date: "required", end_date: "required" },
      example: "¿Cuál fue mi FC promedio ayer?"
    },

    // Estrés
    get_stress_data: {
      description: "Niveles de estrés",
      params: { start_date: "required", end_date: "required" },
      example: "¿Cuál es mi nivel de estrés hoy?"
    }
  },

  // ========== ENTRENAMIENTOS ==========
  TRAINING: {
    // Estado de entrenamiento
    get_training_status: {
      description: "Estado actual de entrenamiento",
      params: {},
      example: "¿Cuál es mi estado de entrenamiento?"
    },

    // Carga de entrenamiento
    get_training_load_focus: {
      description: "Enfoque y carga de entrenamiento",
      params: {},
      example: "¿En qué debo enfocarme en el entrenamiento?"
    },

    // Listado de entrenamientos
    get_workouts: {
      description: "Entrenamientos disponibles",
      params: { start: 0, limit: 20 },
      example: "¿Qué entrenamientos tengo disponibles?"
    },

    // Tendencias de rendimiento
    get_training_load_trend: {
      description: "Tendencia de carga (CTL/ATL/TSB)",
      params: {},
      example: "¿Cómo está la tendencia de mi carga de entrenamiento?"
    }
  },

  // ========== EQUIPOS ==========
  GEAR: {
    // Listar equipos
    get_gear: {
      description: "Listar todos los equipos",
      params: {},
      example: "¿Qué equipos tengo registrados?"
    },

    // Info de dispositivos
    get_device_info: {
      description: "Información de dispositivos",
      params: {},
      example: "¿Qué dispositivos tengo conectados?"
    }
  },

  // ========== DESCARGAS ==========
  DOWNLOADS: {
    // Descargar archivo de actividad
    download_activity_file: {
      description: "Descargar actividad en FIT, GPX, TCX o CSV",
      params: { activity_id: "required", format: "fit" },
      example: "Descarga mi última carrera en formato GPX"
    }
  }
};

/**
 * Ejemplos de uso con Claude
 */

const USAGE_EXAMPLES = {
  // Ejemplo 1: Resumen de la semana
  weekly_summary: {
    prompt: "Muéstrame un resumen de mi actividad de la semana",
    tools_needed: [
      "get_daily_steps",      // Pasos diarios
      "get_sleep_data",       // Calidad de sueño
      "list_activities",      // Actividades completadas
      "get_stress_data"       // Niveles de estrés
    ],
    example_response: `
    📊 Resumen de tu semana:
    - 🏃 Actividades: 4 carreras, 1 sesión de yoga
    - 👣 Pasos: 45,234 (promedio 6,462/día)
    - 😴 Sueño: Promedio 7.2 horas/noche
    - 😌 Estrés: Promedio 28/100
    `
  },

  // Ejemplo 2: Análisis de rendimiento
  performance_analysis: {
    prompt: "¿Cómo está mi rendimiento este mes?",
    tools_needed: [
      "get_training_status",
      "get_training_load_trend",
      "list_activities",
      "get_heart_rate_data"
    ],
    example_response: `
    💪 Tu rendimiento este mes:
    Estado: En forma óptima
    Carga: CTL 65, ATL 32, TSB 33 (en verde)
    Actividades: 12 sesiones completadas
    FC promedio en entrenamientos: 142 BPM
    `
  },

  // Ejemplo 3: Consejos personalizados
  personalized_advice: {
    prompt: "¿Qué deberías hacer basándote en mis datos?",
    tools_needed: [
      "get_health_snapshot",
      "get_stress_data",
      "get_training_status",
      "get_sleep_data"
    ],
    example_response: `
    🎯 Recomendaciones basadas en tus datos:
    1. Tu estrés está alto (42/100) - considera un día de descanso activo
    2. Dormiste solo 6 horas - prioriza el descanso
    3. Tu estado de entrenamiento es bueno - es buen momento para una sesión intensiva
    4. Lleva 8,200 pasos - intenta llegar a 10,000 hoy
    `
  },

  // Ejemplo 4: Análisis de una actividad
  activity_analysis: {
    prompt: "Analiza mi carrera de ayer",
    tools_needed: [
      "list_activities",  // Encontrar la actividad más reciente
      "get_activity"      // Obtener detalles completos
    ],
    example_response: `
    🏃 Análisis de tu carrera:
    Distancia: 10 km
    Tiempo: 52:34 (ritmo 5:15/km)
    FC máxima: 178 BPM
    Calorías: 687 kcal
    Mejoras: 3% más rápido que tu promedio mensual
    `
  }
};

/**
 * Cómo empezar
 */

console.log(`
╔════════════════════════════════════════════════════╗
║      MCP de Garmin - Ejemplos de Uso              ║
╚════════════════════════════════════════════════════╝

1️⃣  INSTALAR EL MCP:
    pip install garmin-mcp

2️⃣  AUTENTICARSE:
    garmin-mcp-auth

3️⃣  INICIAR EL SERVIDOR:
    garmin-mcp

4️⃣  USAR CON CLAUDE:
    Claude podrá acceder a tus datos de Garmin
    automáticamente a través del MCP

📚 EJEMPLOS DE PROMPTS QUE PUEDES USAR:
    - "Muéstrame mis actividades de esta semana"
    - "¿Cuánto dormí los últimos 7 días?"
    - "¿Cuál es mi estado de entrenamiento?"
    - "Descarga mi última actividad"
    - "¿Qué deberías hacer basándote en mis datos?"

🔧 FILTRAR HERRAMIENTAS (OPCIONAL):
    export GARMIN_ENABLED_TOOLS=list_activities,get_activity,get_health_snapshot
    garmin-mcp

📖 DOCUMENTACIÓN:
    https://github.com/Taxuspt/garmin_mcp
`);

module.exports = {
  GARMIN_MCP_TOOLS,
  USAGE_EXAMPLES
};
