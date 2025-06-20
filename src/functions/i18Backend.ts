import { Module, ModuleType } from "i18next";
import { DVTranslation } from "../types/dataverse/DVTranslation";

interface Translations {
  id: { [key: string]: string | null };
  en: { [key: string]: string | null };
  nl: { [key: string]: string | null };
  fr: { [key: string]: string | null };
  de: { [key: string]: string | null };
}

class DataverseBackend implements Module {
  type: ModuleType = "backend";

  translations: Promise<Translations>;

  constructor() {
    this.translations = this.fetchTranslations();
  }

  init() {
    // console.log("INIT");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async read(language: string, _namespace: string, callback: any) {
    callback(null, (await this.translations)[language as keyof Translations]);
  }

  async create(
    languages: string[],
    _namespace: string,
    key: string,
    fallbackValue: string
  ) {
    if (languages[0] !== "en") return;

    if (import.meta.env.PROD) {
      fetch(`https://bnra.powerappsportals.com/_api/cr4de_bnratranslations`, {
        method: "POST",
        headers: {
          __RequestVerificationToken:
            localStorage.getItem("antiforgerytoken") || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cr4de_name: key,
          [`cr4de_${languages[0]}`]: fallbackValue,
        }),
      });
    }
  }

  async refetchTranslations() {
    const t = await this.fetchTranslations();
    this.translations = Promise.resolve(t);
  }

  async fetchTranslations() {
    const response = await fetch(
      `https://bnra.powerappsportals.com/_api/cr4de_bnratranslations?$select=cr4de_en,cr4de_nl,cr4de_fr,cr4de_de,cr4de_name`
    );

    const allTranslations: DVTranslation[] = (await response.json()).value;

    const loadedTranslations: Translations = {
      en: {},
      nl: {},
      fr: {},
      de: {},
      id: {},
    };

    allTranslations.forEach((t) => {
      loadedTranslations.id[t.cr4de_name] = t.cr4de_bnratranslationid;
      if (t.cr4de_en) loadedTranslations.en[t.cr4de_name] = t.cr4de_en;
      if (t.cr4de_nl) loadedTranslations.nl[t.cr4de_name] = t.cr4de_nl;
      if (t.cr4de_fr) loadedTranslations.fr[t.cr4de_name] = t.cr4de_fr;
      if (t.cr4de_de) loadedTranslations.de[t.cr4de_name] = t.cr4de_de;
    });

    return loadedTranslations;
  }
}

export default DataverseBackend;
