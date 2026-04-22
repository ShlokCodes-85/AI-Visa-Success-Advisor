import { useEffect, useState } from "react";

function getNodeBackendUrl() {
  const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  return import.meta.env.VITE_BACKEND_URL || (isLocalhost ? "http://localhost:5000" : "https://ai-visa-success-advisor.onrender.com");
}

function getPythonBackendUrl() {
  const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  return import.meta.env.VITE_PYTHON_BACKEND_URL || (isLocalhost ? "http://localhost:8000" : "");
}

async function pingBackend(url) {
  if (!url) {
    return false;
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 2000);

  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    return response.ok;
  } catch (error) {
    return false;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function StartupGate({ children }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let active = true;

    const wait = (delay) => new Promise((resolve) => window.setTimeout(resolve, delay));

    const checkBackends = async () => {
      const nodeBackendUrl = getNodeBackendUrl();
      const pythonBackendUrl = getPythonBackendUrl();

      while (active) {
        const [nodeReady, pythonReady] = await Promise.all([
          pingBackend(`${nodeBackendUrl}/api/health`),
          pingBackend(`${pythonBackendUrl}/health`),
        ]);

        if (!active) {
          return;
        }

        if (nodeReady && pythonReady) {
          setIsReady(true);
          return;
        }

        await wait(400);
      }
    };

    checkBackends();

    return () => {
      active = false;
    };
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <button
          type="button"
          className="inline-flex items-center gap-3 rounded-full bg-blue-600 px-6 py-4 shadow-lg shadow-blue-600/20 cursor-wait"
          disabled
          aria-busy="true"
          aria-live="polite"
        >
          <span
            className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin"
            aria-hidden="true"
          />
          <span className="text-white font-semibold tracking-wide">Loading Advisa</span>
        </button>
      </div>
    );
  }

  return children;
}

export default StartupGate;