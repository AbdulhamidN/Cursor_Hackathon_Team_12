import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <section className="py-16 text-center">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-coffee-700">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 inline-block font-medium text-coffee-700 underline">
        Back to the home page
      </Link>
    </section>
  );
}
