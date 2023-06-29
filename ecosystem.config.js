module.exports = {
    apps: [
      {
        name: 'USERS-CRUD',
        script: 'index.js',
        instances: 'max',
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'production',
            PORT: 3000,
            MONGO_URI: 'mongodb://localhost:27017/deployment_configuration',
        }
      },
    ],
  };
