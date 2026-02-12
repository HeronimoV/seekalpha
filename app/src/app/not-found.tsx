export default function NotFound() {
  return (
    <div className="text-center py-24">
      <div className="text-6xl mb-6">🔮</div>
      <h1 className="text-4xl font-bold mb-4">404 — Market Not Found</h1>
      <p className="text-gray-400 mb-8">
        This prediction doesn&apos;t exist yet. Maybe you should create it?
      </p>
      <a
        href="/"
        className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-seek-purple to-seek-teal text-white font-medium hover:opacity-90 transition"
      >
        Browse Markets
      </a>
    </div>
  );
}
