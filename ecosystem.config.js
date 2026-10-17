for (const key of ["DATABASE_URL", "OPS_CONSOLE_SECRET", "OPS_CONSOLE_ACCESS_KEY"]) {
  if (!process.env[key]) throw new Error(`Missing required env: ${key}`);
}

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
        DATABASE_URL: process.env.DATABASE_URL,
        OPS_CONSOLE_SECRET: process.env.OPS_CONSOLE_SECRET,
        OPS_CONSOLE_ACCESS_KEY: process.env.OPS_CONSOLE_ACCESS_KEY,
        AGENT_LLM_BASE_URL: process.env.AGENT_LLM_BASE_URL || "",
        AGENT_LLM_API_KEY: process.env.AGENT_LLM_API_KEY || "",
        AGENT_LLM_MODEL: process.env.AGENT_LLM_MODEL || "gpt-5.4"
      }
    }
  ]
};
