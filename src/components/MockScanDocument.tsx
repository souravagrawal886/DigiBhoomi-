import type { LandRecord } from "@/data/mockData";

/**
 * Synthetic scanned land-record page rendered in the browser for the demo.
 * It imitates an aged Indian RoR extract (Hindi headings, English labels,
 * tabular khasra entries, handwritten annotation, office stamp).
 * No real document or landowner data is reproduced.
 */
export function MockScanDocument({ record, page = 1 }: { record: LandRecord; page?: number }) {
  return (
    <article
      className="paper-scan mx-auto w-[640px] max-w-full rounded-sm border border-border/60 p-8 shadow-raised"
      aria-label={`Demonstration scanned land record for ${record.id}, page ${page}`}
    >
      <header className="border-b-2 border-current/40 pb-3 text-center">
        <p className="font-hi text-[13px] tracking-wide">
          भारत सरकार · राजस्व विभाग (प्रदर्शन प्रति)
        </p>
        <h4 className="font-hi mt-1 text-lg font-bold">भू-अभिलेख / अधिकार अभिलेख</h4>
        <p className="text-[11px] tracking-[0.2em] uppercase opacity-80">
          Record of Rights — Specimen
        </p>
      </header>

      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-[12px]">
        <Row hi="ग्राम" en="Village" value={`${record.villageHi} / ${record.village}`} />
        <Row hi="तहसील" en="Tehsil" value={record.tehsil} />
        <Row hi="जिला" en="District" value={record.district} />
        <Row hi="राज्य" en="State" value={record.state} />
      </div>

      <table className="mt-5 w-full border-collapse text-[12px]">
        <thead>
          <tr>
            {["खसरा सं.", "खाता सं.", "क्षेत्रफल (हे.)", "भूमि श्रेणी"].map((h) => (
              <th
                key={h}
                className="font-hi border border-current/40 px-2 py-1 text-left font-semibold"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-current/40 px-2 py-1.5">{record.khasraNumber}</td>
            <td className="border border-current/40 px-2 py-1.5">{record.khataNumber}</td>
            <td className="border border-current/40 px-2 py-1.5">
              <span className="italic opacity-90" style={{ fontFamily: "cursive" }}>
                {record.plotArea}
              </span>
            </td>
            <td className="border border-current/40 px-2 py-1.5">{record.landClassification}</td>
          </tr>
          <tr>
            <td className="border border-current/40 px-2 py-1.5">{record.surveyNumber}</td>
            <td className="border border-current/40 px-2 py-1.5">—</td>
            <td className="border border-current/40 px-2 py-1.5">—</td>
            <td className="font-hi border border-current/40 px-2 py-1.5">सिंचित</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-5 space-y-1.5 text-[12px]">
        <p>
          <span className="font-hi font-semibold">भूमिधर का नाम / Owner: </span>
          <span className="font-hi">{record.ownerNameHi}</span> ({record.ownerName})
        </p>
        <p>
          <span className="font-hi font-semibold">पिता का नाम / Father: </span>
          {record.fatherName}
        </p>
        <p>
          <span className="font-semibold">Mutation No.: </span>
          {record.mutationNumber} &nbsp;·&nbsp;
          <span className="font-semibold">Registration No.: </span>
          {record.registrationNumber}
        </p>
      </div>

      <div className="mt-6 flex items-end justify-between gap-6">
        <p
          className="max-w-[55%] -rotate-2 text-[13px] leading-snug opacity-80"
          style={{ fontFamily: "cursive" }}
        >
          क्षेत्रफल संशोधित — पटवारी टिप्पणी
          <br />
          area entry re-measured {record.plotArea} ha
        </p>
        <div className="grid h-24 w-24 shrink-0 -rotate-12 place-items-center rounded-full border-4 border-current/40 text-center text-[9px] leading-tight font-semibold opacity-60">
          <span>
            TEHSIL OFFICE
            <br />
            {record.tehsil.toUpperCase()}
            <br />
            SPECIMEN
          </span>
        </div>
      </div>

      <footer className="mt-6 flex items-center justify-between border-t border-current/30 pt-2 text-[10px] opacity-70">
        <span>Demo scan · not an official document</span>
        <span>Page {page}</span>
      </footer>
    </article>
  );
}

function Row({ hi, en, value }: { hi: string; en: string; value: string }) {
  return (
    <p>
      <span className="font-hi font-semibold">{hi}</span> /{" "}
      <span className="font-semibold">{en}</span>: <span className="font-hi">{value}</span>
    </p>
  );
}
