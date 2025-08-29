import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 p-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-4">
          Tailwind is live
        </h1>
        <p className="text-neutral-600 mb-6">
          You're using Tailwind v4 with Vite + React + TS.
        </p>
        <div className="flex items-center justify-center gap-3">
          <a
            className="inline-flex items-center gap-2 rounded-md bg-black px-4 py-2 text-white hover:bg-neutral-800 active:scale-[.99] transition"
            href="https://tailwindcss.com/docs"
            target="_blank"
            rel="noreferrer"
          >
            Tailwind Docs
          </a>
          <button className="rounded-md border border-neutral-300 bg-white px-4 py-2 hover:bg-neutral-100">
            Secondary
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
