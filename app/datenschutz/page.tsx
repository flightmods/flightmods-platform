export default function DatenschutzPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

      <div className="space-y-8 text-zinc-300 leading-7">
        <section>
          <h2 className="text-xl font-semibold mb-2 text-white">
            1. General Information
          </h2>
          <p>
            The protection of your personal data is important to us. In this
            privacy policy, we inform you about which data is collected and
            processed on FlightMods.de.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-white">
            2. Responsible body
          </h2>
          <p>
            Christoph Adam
            <br />
            Lindenweg 29
            <br />
            61184 Karben
            <br />
            E-Mail: christoph_adam@outlook.de
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-white">
            3. Collection and processing of personal data
          </h2>
          <p>
            When visiting and using FlightMods.de, certain data may be processed, including:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>E-mail address during registration and login</li>
            <li>selected username</li>
            <li>uploaded files and images</li>
            <li>technical access data such as IP address and timestamp</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-white">
            4. Hosting and technical service providers
          </h2>
          <p>
            This website is hosted via Vercel. For authentication,
            database, and file storage, Supabase is used. During this process,
            technical usage data will be processed to the extent necessary for the
            operation of the platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-white">
            5. Purpose of data processing
          </h2>
          <p>
            The processing is carried out for the operation of the platform, 
            user management, the provision of upload and download
            functions as well as the presentation of creator profiles and addons.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-white">
            6. Storage Duration
          </h2>
          <p>
            Personal data will only be stored for as long as necessary for
            the operation of the platform or based on legal obligations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-white">
            7. Rights of Data Subjects
          </h2>
          <p>
            You have the right under the applicable legal provisions to obtain from the 
            controller information about the personal data stored about you, to request 
            correction or deletion of such data, to restrict processing, and to object 
            to processing for legitimate reasons.
          </p>
        </section>

        <section>
          <p className="text-zinc-500 text-sm">
            Note: This privacy policy is a technical draft
            and should be legally reviewed and updated to include
            all services actually in use before a public launch.
          </p>
        </section>
      </div>
    </main>
  );
}