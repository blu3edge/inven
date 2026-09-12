const axios = require('axios');

class GarminConnector {
  constructor(options = {}) {
    this.username = options.username || process.env.GARMIN_USERNAME;
    this.password = options.password || process.env.GARMIN_PASSWORD;
    this.baseURL = options.baseURL || process.env.GARMIN_API_URL || 'https://connect.garmin.com/';
    this.timeout = options.timeout || parseInt(process.env.API_TIMEOUT) || 30000;
    this.session = null;
    this.authenticated = false;
  }

  async authenticate() {
    try {
      const client = axios.create({
        baseURL: this.baseURL,
        timeout: this.timeout,
        withCredentials: true,
      });

      // Garmin Connect uses a login flow
      const response = await client.post('signin', {
        username: this.username,
        password: this.password,
        _csrf: await this.getCsrfToken(client),
      });

      this.session = client;
      this.authenticated = true;
      return true;
    } catch (error) {
      throw new Error(`Garmin authentication failed: ${error.message}`);
    }
  }

  async getCsrfToken(client) {
    try {
      const response = await client.get('');
      const match = response.data.match(/name="_csrf"\s+value="([^"]+)"/);
      return match ? match[1] : '';
    } catch (error) {
      console.warn('⚠️ Could not retrieve CSRF token:', error.message);
      return '';
    }
  }

  async getActivities(start = 0, limit = 50) {
    if (!this.authenticated) {
      throw new Error('Not authenticated. Call authenticate() first.');
    }

    try {
      const response = await this.session.get('/activity/search/activities', {
        params: {
          start,
          limit,
          sort: 'startTimeInSeconds',
          order: 'desc',
        },
      });

      return response.data || [];
    } catch (error) {
      throw new Error(`Failed to fetch activities: ${error.message}`);
    }
  }

  async getActivityDetails(activityId) {
    if (!this.authenticated) {
      throw new Error('Not authenticated. Call authenticate() first.');
    }

    try {
      const response = await this.session.get(`/activity/${activityId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch activity details: ${error.message}`);
    }
  }

  async getUserProfile() {
    if (!this.authenticated) {
      throw new Error('Not authenticated. Call authenticate() first.');
    }

    try {
      const response = await this.session.get('/userprofile-service/userprofile/v2/information');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch user profile: ${error.message}`);
    }
  }
}

module.exports = GarminConnector;
