import type { Instrumentation } from "next";

export const onRequestError: Instrumentation.onRequestError = async (error, request, context) => {
  const errorName = error instanceof Error ? error.name : "UnknownError";
  const digest = typeof error === "object" && error !== null && "digest" in error && typeof error.digest === "string"
    ? error.digest
    : null;
  const report = {
    level: "error",
    service: "readymetry-web",
    errorName,
    digest,
    method: request.method,
    path: request.path.split("?", 1)[0],
    routePath: context.routePath,
    routeType: context.routeType,
    timestamp: new Date().toISOString(),
  };

  console.error(JSON.stringify(report));

  const endpoint = process.env.ERROR_MONITOR_WEBHOOK_URL;
  if (!endpoint) return;
  try {
    await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.ERROR_MONITOR_BEARER_TOKEN
          ? { Authorization: `Bearer ${process.env.ERROR_MONITOR_BEARER_TOKEN}` }
          : {}),
      },
      body: JSON.stringify(report),
      signal: AbortSignal.timeout(3000),
    });
  } catch (monitorError) {
    console.error(JSON.stringify({
      level: "error",
      service: "readymetry-web",
      event: "error_monitor_delivery_failed",
      errorName: monitorError instanceof Error ? monitorError.name : "UnknownError",
      timestamp: new Date().toISOString(),
    }));
  }
};
