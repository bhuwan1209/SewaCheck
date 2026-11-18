import type { Office } from "@/data/offices";
import { getDict, type Locale } from "@/i18n/dictionaries";

/** Embeds OpenStreetMap only when an official source gives coordinates. */
export function OfficeMap({ office, lang }: { office: Office; lang: Locale }) {
  const t = getDict(lang).offices;
  const name = lang === "ne" ? office.nameNe : office.name;
  if (!office.location) {
    const q = encodeURIComponent(office.name);
    return (
      <div className="rounded-xl border border-dashed border-navy-700/40 p-5 text-sm text-slate-700">
        <p className="font-medium text-navy-900">{t.mapUnknown}</p>
        <p className="mt-1">
          {t.mapUnknownText}{" "}
          <a className="underline" target="_blank" rel="noopener noreferrer" href={`https://www.openstreetmap.org/search?query=${q}`}>
            {t.searchOsm}
          </a>{" "}
          {t.searchNote}
        </p>
      </div>
    );
  }
  const { lat, lng } = office.location;
  const d = 0.005;
  const bbox = [lng - d, lat - d, lng + d, lat + d].join("%2C");
  return (
    <div>
      <iframe
        title={name}
        className="h-72 w-full rounded-xl border border-navy-100"
        loading="lazy"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`}
      />
      <p className="mt-1 text-xs text-slate-600">
        © OpenStreetMap contributors ·{" "}
        <a className="underline" target="_blank" rel="noopener noreferrer" href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`}>
          {t.larger}
        </a>
      </p>
    </div>
  );
}
