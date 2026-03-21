export default function DatenschutzPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Datenschutzerklärung</h1>

      <div className="space-y-8 text-zinc-300 leading-7">
        <section>
          <h2 className="text-xl font-semibold mb-2 text-white">
            1. Allgemeine Hinweise
          </h2>
          <p>
            Der Schutz deiner persönlichen Daten ist uns wichtig. In dieser
            Datenschutzerklärung informieren wir darüber, welche Daten auf
            FlightMods.de erfasst und verarbeitet werden.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-white">
            2. Verantwortliche Stelle
          </h2>
          <p>
            Christoph [Nachname]
            <br />
            [Straße und Hausnummer]
            <br />
            [PLZ Ort]
            <br />
            E-Mail: [deine E-Mail-Adresse]
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-white">
            3. Erhebung und Verarbeitung personenbezogener Daten
          </h2>
          <p>
            Beim Besuch und bei der Nutzung von FlightMods.de können insbesondere
            folgende Daten verarbeitet werden:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>E-Mail-Adresse bei Registrierung und Login</li>
            <li>gewählter Benutzername</li>
            <li>hochgeladene Dateien und Bilder</li>
            <li>technische Zugriffsdaten wie IP-Adresse und Zeitstempel</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-white">
            4. Hosting und technische Dienstleister
          </h2>
          <p>
            Diese Website wird über Vercel gehostet. Für Authentifizierung,
            Datenbank und Dateispeicherung wird Supabase verwendet. Dabei können
            technische Nutzungsdaten verarbeitet werden, soweit dies für den
            Betrieb der Plattform erforderlich ist.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-white">
            5. Zweck der Verarbeitung
          </h2>
          <p>
            Die Verarbeitung erfolgt zum Betrieb der Plattform, zur
            Benutzerverwaltung, zur Bereitstellung von Upload- und Download-
            Funktionen sowie zur Darstellung von Creator-Profilen und Addons.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-white">
            6. Speicherdauer
          </h2>
          <p>
            Personenbezogene Daten werden nur so lange gespeichert, wie dies für
            den Betrieb der Plattform oder aufgrund gesetzlicher Verpflichtungen
            erforderlich ist.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-white">
            7. Rechte betroffener Personen
          </h2>
          <p>
            Du hast im Rahmen der geltenden gesetzlichen Bestimmungen das Recht
            auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung
            sowie auf Widerspruch gegen die Verarbeitung deiner Daten.
          </p>
        </section>

        <section>
          <p className="text-zinc-500 text-sm">
            Hinweis: Diese Datenschutzerklärung ist eine technische Grundversion
            und sollte vor einem öffentlichen Launch rechtlich überprüft und um
            alle tatsächlich eingesetzten Dienste ergänzt werden.
          </p>
        </section>
      </div>
    </main>
  );
}