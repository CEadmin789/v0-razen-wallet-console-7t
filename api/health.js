module.exports = function handler(req, res) {
  const started = Date.now();
  const method = (req.method || "GET").toUpperCase();
  if (method !== "GET" && method !== "HEAD") {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store, max-age=0");
    res.setHeader("Allow", "GET, HEAD");
    res.status(405).json({ status: "down", service: "razen-wallet-console", error: "method_not_allowed" });
    return;
  }

  const body = {
    status: "ok",
    service: "razen-wallet-console",
    app: "https://tmnce88.xyz",
    configuration: [],
    latencyMs: Date.now() - started,
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
  };

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (method === "HEAD") {
    res.status(200).end();
    return;
  }
  res.status(200).json(body);
};
