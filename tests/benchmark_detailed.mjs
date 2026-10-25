import http from "node:http";
import https from "node:https";
import os from "node:os";

/**
 * Moteur de test de charge haute précision
 * Mesure les débits (req/s), latences (p50, p95, p99), codes d'erreur et ressources.
 */

function calculatePercentiles(latencies) {
  if (!latencies || latencies.length === 0) {
    return { p50: 0, p90: 0, p95: 0, p99: 0, min: 0, max: 0, avg: 0 };
  }
  latencies.sort((a, b) => a - b);
  const len = latencies.length;
  const getIdx = (p) => Math.min(Math.floor(len * (p / 100)), len - 1);
  const sum = latencies.reduce((acc, v) => acc + v, 0);

  return {
    min: latencies[0],
    p50: latencies[getIdx(50)],
    p90: latencies[getIdx(90)],
    p95: latencies[getIdx(95)],
    p99: latencies[getIdx(99)],
    max: latencies[len - 1],
    avg: Math.round((sum / len) * 100) / 100
  };
}

export async function runLoadTest({
  url = "http://127.0.0.1:3000/api/products",
  concurrency = 100,
  durationSeconds = 10,
  label = "Test de charge",
  customHeaders = {}
} = {}) {
  const parsedUrl = new URL(url);
  const isHttps = parsedUrl.protocol === "https:";
  const protocol = isHttps ? https : http;

  const agent = new protocol.Agent({
    keepAlive: true,
    maxSockets: concurrency + 50,
    timeout: 10000
  });

  const latencies = [];
  const statusCodes = {};
  let errorsCount = 0;
  let totalBytes = 0;
  let isRunning = true;

  const startTime = Date.now();
  const memBefore = process.memoryUsage();

  async function worker() {
    while (isRunning) {
      await new Promise((resolve) => {
        const reqStart = performance.now();
        const req = protocol.request(
          url,
          {
            agent,
            method: "GET",
            headers: {
              "User-Agent": "PrinceCFA-LoadTest/2.0 (HighConcurrency)",
              "Accept-Encoding": "gzip, deflate",
              ...customHeaders
            }
          },
          (res) => {
            let bytes = 0;
            res.on("data", (chunk) => {
              bytes += chunk.length;
            });
            res.on("end", () => {
              const reqDuration = performance.now() - reqStart;
              latencies.push(Math.round(reqDuration * 100) / 100);
              statusCodes[res.statusCode] = (statusCodes[res.statusCode] || 0) + 1;
              totalBytes += bytes;
              resolve();
            });
          }
        );

        req.on("error", (err) => {
          errorsCount++;
          statusCodes[err.code || "ERR"] = (statusCodes[err.code || "ERR"] || 0) + 1;
          resolve();
        });

        req.setTimeout(8000, () => {
          req.destroy(new Error("ETIMEDOUT"));
        });

        req.end();
      });
    }
  }

  // Lancer les workers concurrents
  const workers = Array.from({ length: concurrency }, () => worker());

  // Attendre la durée spécifiée
  await new Promise((resolve) => setTimeout(resolve, durationSeconds * 1000));
  isRunning = false;

  await Promise.all(workers);
  agent.destroy();

  const totalTimeSeconds = (Date.now() - startTime) / 1000;
  const memAfter = process.memoryUsage();
  const stats = calculatePercentiles(latencies);
  const totalRequests = latencies.length + errorsCount;
  const reqPerSec = Math.round((latencies.length / totalTimeSeconds) * 10) / 10;
  const errorRate = totalRequests > 0 ? ((errorsCount / totalRequests) * 100).toFixed(2) : "0.00";
  const throughputMB = (totalBytes / (1024 * 1024 * totalTimeSeconds)).toFixed(2);

  return {
    label,
    url,
    concurrency,
    durationSeconds: totalTimeSeconds.toFixed(1),
    totalRequests,
    completedRequests: latencies.length,
    errorsCount,
    errorRate: `${errorRate}%`,
    reqPerSec,
    throughputMBps: `${throughputMB} Mo/s`,
    latencies: {
      avg: `${stats.avg} ms`,
      p50: `${stats.p50} ms`,
      p90: `${stats.p90} ms`,
      p95: `${stats.p95} ms`,
      p99: `${stats.p99} ms`,
      min: `${stats.min} ms`,
      max: `${stats.max} ms`
    },
    statusCodes,
    memoryDeltaMB: {
      rss: `${((memAfter.rss - memBefore.rss) / (1024 * 1024)).toFixed(2)} Mo`,
      heapUsed: `${((memAfter.heapUsed - memBefore.heapUsed) / (1024 * 1024)).toFixed(2)} Mo`
    }
  };
}

// Exécution directe CLI
if (process.argv[1]?.endsWith("benchmark_detailed.mjs")) {
  const targetUrl = process.argv[2] || "http://127.0.0.1:3000/api/products";
  const concurrencies = [50, 200, 500, 1000];
  const duration = parseInt(process.argv[3] || "5", 10);

  console.log(`\n======================================================`);
  console.log(`🏁 BANC D'ESSAI DE CHARGE & SCALABILITÉ — PRINCE CFA`);
  console.log(`Cible : ${targetUrl}`);
  console.log(`OS: ${os.type()} ${os.release()} | CPUs: ${os.cpus().length} cœurs`);
  console.log(`======================================================\n`);

  const testEtag = process.argv.includes("--etag");

  (async () => {
    let customHeaders = {};
    if (testEtag) {
      try {
        const probe = await fetch(targetUrl);
        const etag = probe.headers.get("etag");
        if (etag) {
          customHeaders = { "if-none-match": etag };
          console.log(`[ETag Mode Actif] En-tête If-None-Match envoyé : ${etag}\n`);
        }
      } catch (e) {
        console.warn("Impossible de récupérer l'ETag préalable:", e.message);
      }
    }

    for (const c of concurrencies) {
      console.log(`▶ Test avec ${c} utilisateurs virtuels simultanés (${duration}s)...`);
      try {
        const res = await runLoadTest({
          url: targetUrl,
          concurrency: c,
          durationSeconds: duration,
          label: `${c} Utilisateurs Simultanés`,
          customHeaders
        });
        console.log(`  - Requêtes/s : ${res.reqPerSec} req/s`);
        console.log(`  - Total requêtes : ${res.totalRequests} (Erreurs: ${res.errorsCount} / ${res.errorRate})`);
        console.log(`  - Latence Moyenne : ${res.latencies.avg} | p50: ${res.latencies.p50}`);
        console.log(`  - Latence p95 : ${res.latencies.p95} | p99: ${res.latencies.p99} (Max: ${res.latencies.max})`);
        console.log(`  - Débit réseau : ${res.throughputMBps}`);
        console.log(`  - Codes HTTP : ${JSON.stringify(res.statusCodes)}`);
        console.log(`  - Variation Mémoire : RSS ${res.memoryDeltaMB.rss}, Heap ${res.memoryDeltaMB.heapUsed}\n`);
      } catch (err) {
        console.error(`  ❌ Erreur test ${c} VU:`, err.message);
      }
    }
  })();
}
