module.exports = {
  apps: [
    {
      name: "onto-romaapi",
      cwd: "/root/palantir",
      script: "node_modules/next/dist/bin/next",
      args: "start --hostname 0.0.0.0 --port 3015",
      env: {
        NODE_ENV: "production",
        PORT: process.env.PORT || "3015",
        APP_URL: process.env.APP_URL || "https://onto.romaapi.com",
        DATABASE_URL: process.env.DATABASE_URL || "postgresql://onto:onto@127.0.0.1:5433/onto_romaapi?schema=public",
        OPS_CONSOLE_SECRET: process.env.OPS_CONSOLE_SECRET || "roma-onto-secret",
        OPS_CONSOLE_ACCESS_KEY: process.env.OPS_CONSOLE_ACCESS_KEY || "replace-this-key",
        AGENT_LLM_BASE_URL: process.env.AGENT_LLM_BASE_URL || "",
        AGENT_LLM_API_KEY: process.env.AGENT_LLM_API_KEY || "",
        AGENT_LLM_MODEL: process.env.AGENT_LLM_MODEL || "gpt-5.4"
      }
    }
  ]
};
