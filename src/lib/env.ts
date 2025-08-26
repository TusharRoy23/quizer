export const env = {
    // App Info
    appName: process.env.NEXT_PUBLIC_APP_NAME || 'Quizer',
    appVersion: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',

    // API
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',

    // Environment
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
    env: process.env.NEXT_PUBLIC_ENV || 'development',
} as const;

// Runtime validation
export const validateEnv = () => {
    const required = ['NEXT_PUBLIC_API_BASE_URL'];

    required.forEach(key => {
        if (!process.env[key]) {
            console.warn(`Warning: Environment variable ${key} is not set`);
        }
    });
};