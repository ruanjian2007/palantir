const required = (key: string, fallback?: string) => {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing required env: ${key}`);
  }
  return value;
};

export const env = {
  databaseUrl: required("DATABASE_URL", "postgresql://onto:onto@127.0.0.1:5432/onto_romaapi?schema=public"),
  appUrl: process.env.APP_URL ?? "http://localhost:3000",
  opsConsoleSecret: required("OPS_CONSOLE_SECRET", "roma-onto-secret"),
  opsConsoleAccessKey: required("OPS_CONSOLE_ACCESS_KEY", "replace-this-key"),
  agentLlmBaseUrl: process.env.AGENT_LLM_BASE_URL ?? "",
  agentLlmApiKey: process.env.AGENT_LLM_API_KEY ?? "",
  agentLlmModel: process.env.AGENT_LLM_MODEL ?? "gpt-5.4"
};
