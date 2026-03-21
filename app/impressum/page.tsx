export default function ImpressumPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Impressum</h1>

      <div className="space-y-6 text-zinc-300 leading-7">
        <section>
          <h2 className="text-xl font-semibold mb-2 text-white">
            Angaben gemäß § 5 DDG
          </h2>
          <p>
            Christoph [Nachname]
            <br />
            [Straße und Hausnummer]
            <br />
            [PLZ Ort]
            <br />
            Deutschland
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-white">Kontakt</h2>
          <p>E-Mail: [deine E-Mail-Adresse]</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-white">
            Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
          </h2>
          <p>
            Christoph [Nachname]
            <br />
            [Straße und Hausnummer]
            <br />
            [PLZ Ort]
          </p>
        </section>

        <section>
          <p className="text-zinc-500 text-sm">
            Hinweis: Bitte ersetze die Platzhalter durch deine echten Angaben,
            bevor die Seite öffentlich beworben wird.
          </p>
        </section>
      </div>
    </main>
  );
}