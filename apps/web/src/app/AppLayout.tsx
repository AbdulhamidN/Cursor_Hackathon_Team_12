import { Link, NavLink, Outlet } from 'react-router';
import { webModules } from './modules';

function navLinkClass({ isActive }: { isActive: boolean }): string {
  const base = 'rounded-lg px-3 py-2 text-sm font-medium transition-colors';
  return isActive
    ? `${base} bg-coffee-700 text-white`
    : `${base} text-coffee-700 hover:bg-coffee-100`;
}

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-coffee-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
          <Link to="/" className="text-lg font-bold text-coffee-900">
            Ethiopian Coffee Buy
          </Link>
          <nav aria-label="Main" className="flex flex-wrap gap-1">
            {webModules.map((module) => (
              <NavLink key={module.id} to={module.homePath} className={navLinkClass}>
                {module.navLabel}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
