module.exports = {
  apps: [
    {
      name: "onto-romaapi",
      cwd: "/root/palantir",
      script: "node_modules/next/dist/bin/next",
      args: "start --hostname 0.0.0.0 --port 3015",
      env: {
        NODE_ENV: "production",
        PORT: "3015",
        APP_URL: "https://onto.romaapi.com",
        DATABASE_URL: "postgresql://onto:onto@127.0.0.1:5433/onto_romaapi?schema=public",
        OPS_CONSOLE_SECRET: "roma-onto-secret",
        OPS_CONSOLE_ACCESS_KEY: "replace-this-key"
      }
    }
  ]
};
