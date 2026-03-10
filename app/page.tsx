export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">FlightMods</h1>
        <p className="text-gray-400 text-xl mb-10">
          Your Plattform for Flight Simulator Addons
        </p>

        <div className="flex justify-center gap-4">
          <a
            href="/addons"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg"
          >
            Addons entdecken
          </a>

          <a
            href="/upload"
            className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg"
          >
            Addon hochladen
          </a>
        </div>
      </div>
    </main>
  );
}