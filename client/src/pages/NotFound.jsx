import { Link } from 'react-router-dom'

const NotFound = () => (
  <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-12">
    <section className="rounded-4xl border border-slate-700/70 bg-slate-900/90 p-10 text-center shadow-2xl shadow-slate-950/30">
      <h1 className="text-5xl font-semibold">404</h1>
      <p className="mt-4 text-slate-400">The page you’re looking for doesn’t exist.</p>
      <Link to="/" className="mt-8 inline-flex rounded-full bg-slate-700 px-6 py-3 text-sm text-white transition hover:bg-slate-600">
        Back to home
      </Link>
    </section>
  </main>
)

export default NotFound
