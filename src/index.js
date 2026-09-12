require('dotenv').config();
const GarminConnector = require('./garmin-connector');

async function main() {
  try {
    const garmin = new GarminConnector({
      username: process.env.GARMIN_USERNAME,
      password: process.env.GARMIN_PASSWORD,
    });

    console.log('🏃 Iniciando conexión con Garmin...');
    await garmin.authenticate();
    console.log('✅ Autenticación exitosa');

    const activities = await garmin.getActivities();
    console.log(`📊 ${activities.length} actividades encontradas`);
    console.log(activities);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
