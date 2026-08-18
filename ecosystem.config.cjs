module.exports = {
  apps: [
    {
      name: 'trader-journal',
      script: '/home/ghafari/.bun/bin/bun',
      args: 'run start',
      env: {
        PORT: 8443,
        HOST: '0.0.0.0',
        NODE_ENV: 'production'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: '/home/ghafari/.pm2/logs/trader-journal-error.log',
      out_file: '/home/ghafari/.pm2/logs/trader-journal-out.log',
      log_file: '/home/ghafari/.pm2/logs/trader-journal-combined.log',
      time: true
    }
  ]
};
