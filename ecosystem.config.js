/** @type {import('pm2').StartOptions} */
module.exports = {
  apps: [
    {
      name: "readymetry",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: "/root/readymetry",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3002,
      },
      error_file: "/root/logs/readymetry-error.log",
      out_file: "/root/logs/readymetry-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      restart_delay: 3000,
      max_restarts: 10,
    },
  ],
};
