#!/usr/bin/env python3
"""
Garmin Connect API Client
Conecta directamente a Garmin Connect para obtener datos de usuario
"""

import json
import urllib.request
import urllib.parse
import http.cookiejar
import sys
from datetime import datetime, timedelta

class GarminConnectClient:
    def __init__(self, email, password):
        self.email = email
        self.password = password
        self.base_url = "https://connect.garmin.com"
        self.session = None
        self.cookie_jar = http.cookiejar.CookieJar()
        self.opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(self.cookie_jar))

    def login(self):
        """Autenticarse con Garmin Connect"""
        try:
            print("🔐 Intentando autenticarse con Garmin Connect...")

            # Primera solicitud para obtener CSRF token
            login_url = f"{self.base_url}/signin"

            # Datos de login
            login_data = urllib.parse.urlencode({
                'email': self.email,
                'password': self.password,
                'remember_me': 'on'
            }).encode('utf-8')

            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Content-Type': 'application/x-www-form-urlencoded'
            }

            req = urllib.request.Request(login_url, data=login_data, headers=headers)
            response = self.opener.open(req, timeout=30)

            if response.status == 200:
                print("✅ Autenticación exitosa!")
                self.session = self.opener
                return True
            else:
                print(f"❌ Error de autenticación: {response.status}")
                return False

        except Exception as e:
            print(f"❌ Error al conectar: {str(e)}")
            return False

    def get_activities(self, limit=50, start=0):
        """Obtener lista de actividades recientes"""
        try:
            print(f"📊 Obteniendo últimas {limit} actividades...")

            url = f"{self.base_url}/proxy/activitylist-service/activities/search/activities"
            params = urllib.parse.urlencode({
                'start': start,
                'limit': limit,
                'sort': 'startTimeInSeconds',
                'order': 'desc'
            })

            req = urllib.request.Request(f"{url}?{params}")
            response = self.opener.open(req, timeout=30)
            data = response.read().decode('utf-8')

            activities = json.loads(data)
            return activities

        except Exception as e:
            print(f"⚠️ Error obteniendo actividades: {str(e)}")
            return []

    def get_heart_rate_data(self, start_date, end_date):
        """Obtener datos de frecuencia cardíaca"""
        try:
            url = f"{self.base_url}/proxy/wellness-service/wellness/dailyHeartRate"
            params = urllib.parse.urlencode({
                'startDate': start_date,
                'endDate': end_date
            })

            req = urllib.request.Request(f"{url}?{params}")
            response = self.opener.open(req, timeout=30)
            data = response.read().decode('utf-8')

            return json.loads(data)

        except Exception as e:
            print(f"⚠️ Error obteniendo FC: {str(e)}")
            return None

    def get_daily_steps(self, start_date, end_date):
        """Obtener pasos diarios"""
        try:
            url = f"{self.base_url}/proxy/wellness-service/wellness/dailySteps"
            params = urllib.parse.urlencode({
                'startDate': start_date,
                'endDate': end_date
            })

            req = urllib.request.Request(f"{url}?{params}")
            response = self.opener.open(req, timeout=30)
            data = response.read().decode('utf-8')

            return json.loads(data)

        except Exception as e:
            print(f"⚠️ Error obteniendo pasos: {str(e)}")
            return None

    def get_sleep_data(self, start_date, end_date):
        """Obtener datos de sueño"""
        try:
            url = f"{self.base_url}/proxy/wellness-service/wellness/dailySleep"
            params = urllib.parse.urlencode({
                'startDate': start_date,
                'endDate': end_date
            })

            req = urllib.request.Request(f"{url}?{params}")
            response = self.opener.open(req, timeout=30)
            data = response.read().decode('utf-8')

            return json.loads(data)

        except Exception as e:
            print(f"⚠️ Error obteniendo sueño: {str(e)}")
            return None

    def get_user_profile(self):
        """Obtener perfil del usuario"""
        try:
            url = f"{self.base_url}/proxy/userprofile-service/userprofile/v2/information"

            req = urllib.request.Request(url)
            response = self.opener.open(req, timeout=30)
            data = response.read().decode('utf-8')

            return json.loads(data)

        except Exception as e:
            print(f"⚠️ Error obteniendo perfil: {str(e)}")
            return None


def main():
    """Función principal para pruebas"""
    if len(sys.argv) < 3:
        print("Uso: python garmin_connector.py <email> <password>")
        sys.exit(1)

    email = sys.argv[1]
    password = sys.argv[2]

    print(f"\n{'='*50}")
    print(f"🏃 Garmin Connect Client")
    print(f"{'='*50}\n")

    client = GarminConnectClient(email, password)

    if not client.login():
        print("❌ No se pudo autenticar. Verifica tus credenciales.")
        sys.exit(1)

    # Obtener datos
    print("\n📥 Descargando tus datos...\n")

    # Actividades
    activities = client.get_activities(limit=10)
    if activities:
        print(f"✅ {len(activities)} actividades encontradas")
        print("\nÚltimas 3 actividades:")
        for i, activity in enumerate(activities[:3], 1):
            name = activity.get('activityName', 'N/A')
            activity_type = activity.get('activityType', {}).get('typeKey', 'N/A')
            distance = activity.get('distance', 0)
            print(f"  {i}. {name} ({activity_type}) - {distance:.2f} km")

    # Datos de los últimos 7 días
    end_date = datetime.now().strftime("%Y-%m-%d")
    start_date = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")

    print(f"\n📊 Datos de salud ({start_date} a {end_date}):")

    # Pasos
    steps = client.get_daily_steps(start_date, end_date)
    if steps:
        print(f"  👣 Pasos: {len(steps)} días registrados")

    # Sueño
    sleep = client.get_sleep_data(start_date, end_date)
    if sleep:
        print(f"  😴 Sueño: {len(sleep)} noches registradas")

    # FC
    hr = client.get_heart_rate_data(start_date, end_date)
    if hr:
        print(f"  ❤️ FC: {len(hr)} días registrados")

    # Perfil
    profile = client.get_user_profile()
    if profile:
        print(f"\n👤 Perfil de usuario:")
        name = profile.get('displayName', 'N/A')
        email = profile.get('email', 'N/A')
        print(f"  Nombre: {name}")
        print(f"  Email: {email}")

    print(f"\n{'='*50}")
    print("✅ ¡Conexión completada!")
    print(f"{'='*50}\n")


if __name__ == "__main__":
    main()
