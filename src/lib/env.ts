const required = (key: string, fallback?: string) => {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing required env: ${key}`);
  }
  return value;
};

export const env = {
  databaseUrl: required("DATABASE_URL"),
  appUrl: process.env.APP_URL ?? "http://localhost:3000",
  opsConsoleSecret: required("OPS_CONSOLE_SECRET"),
  opsConsoleAccessKey: required("OPS_CONSOLE_ACCESS_KEY"),
  agentLlmBaseUrl: process.env.AGENT_LLM_BASE_URL ?? "",
  agentLlmApiKey: process.env.AGENT_LLM_API_KEY ?? "",
  agentLlmModel: process.env.AGENT_LLM_MODEL ?? "gpt-5.4"
};
