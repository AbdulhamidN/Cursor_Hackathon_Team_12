import { HEALTH_PATH, type HealthData } from '@ecb/contracts';
import { MODULES } from '@ecb/shared';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { apiRequest } from '../shared/api/client';
import { webModules } from './modules';

type ApiHealth =
  | { state: 'checking' }
  | { state: 'online'; health: HealthData }
  | { state: 'offline'; reason: string };

const RETRY_DELAY_MS = 5000;

function useApiHealth(): ApiHealth {
  const [apiHealth, setApiHealth] = useState<ApiHealth>({ state: 'checking' });

  useEffect(() => {
    const controller = new AbortController();
    let retryTimer: number | undefined;

    async function check(): Promise<void> {
      try {
        const health = await apiRequest<HealthData>(HEALTH_PATH, { signal: controller.signal });
        setApiHealth({ state: 'online', health });
      } catch (error) {
        if (controller.signal.aborted) return;
        const reason = error instanceof Error ? error.message : 'Unknown error';
        setApiHealth({ state: 'offline', reason });
        // The API starts a few seconds after the web app, so keep trying.
        retryTimer = window.setTimeout(() => void check(), RETRY_DELAY_MS);
      }
    }

    void check();

    return () => {
      controller.abort();
      window.clearTimeout(retryTimer);
    };
  }, []);

  return apiHealth;
}

function ApiStatus() {
  const apiHealth = useApiHealth();

  if (apiHealth.state === 'checking') {
    return <p className="text-sm text-coffee-700">Checking the API...</p>;
  }

  if (apiHealth.state === 'offline') {
    return (
      <p role="status" className="text-sm font-medium text-red-700">
        API offline: {apiHealth.reason}. Retrying...
      </p>
    );
  }

  const { database } = apiHealth.health;
  return (
    <p role="status" className="text-sm font-medium text-leaf-700">
      API online. Database {database}.
    </p>
  );
}

export function HomePage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold tracking-tight">Ethiopian Coffee Buy</h1>
        <p className="mt-2 max-w-2xl text-coffee-700">
          Buy traceable Ethiopian coffee directly from the farmers, cooperatives and exporters who
          produce it.
        </p>
        <div className="mt-4 inline-block rounded-lg border border-coffee-200 bg-white px-4 py-2">
          <ApiStatus />
        </div>
      </section>

      <section aria-labelledby="modules-heading">
        <h2 id="modules-heading" className="text-lg font-semibold">
          Platform modules
        </h2>
        <ul className="mt-3 grid gap-4 sm:grid-cols-2">
          {webModules.map(({ id, homePath }) => {
            const module = MODULES[id];
            return (
              <li key={id}>
                <Link
                  to={homePath}
                  className="block h-full rounded-2xl border border-coffee-200 bg-white p-5 transition-colors hover:border-coffee-500"
                >
                  <p className="text-xs font-semibold tracking-wide text-coffee-500 uppercase">
                    Module {module.number}
                  </p>
                  <h3 className="mt-1 font-semibold">{module.name}</h3>
                  <p className="mt-2 text-sm text-coffee-700">{module.summary}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
