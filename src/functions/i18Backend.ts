import { Module, ModuleType, NewableModule } from "i18next";
import { DVTranslation } from "../types/dataverse/DVTranslation";

interface Translations {
  en: { [key: string]: string | null };
  nl: { [key: string]: string | null };
  fr: { [key: string]: string | null };
  de: { [key: string]: string | null };
}

class DataverseBackend implements Module {
  type: ModuleType = "backend";

  translations: Promise<Translations>;

  constructor() {
    this.translations = new Promise<Translations>(async (resolve) => {
      const response = await fetch(`https://bnra.powerappsportals.com/_api/cr4de_bnratranslations`);

      const allTranslations: DVTranslation[] = (await response.json()).value;
      console.log(allTranslations);
      const loadedTranslations: Translations = {
        en: {},
        nl: {},
        fr: {},
        de: {},
      };

      allTranslations.forEach((t) => {
        loadedTranslations.en[t.cr4de_name] = t.cr4de_en;
        loadedTranslations.nl[t.cr4de_name] = t.cr4de_nl;
        loadedTranslations.fr[t.cr4de_name] = t.cr4de_fr;
        loadedTranslations.de[t.cr4de_name] = t.cr4de_de;
      });

      return resolve(loadedTranslations);
    });
  }

  init() {
    console.log("INIT");
  }

  async read(language: string, namespace: string, callback: any) {
    callback(null, (await this.translations)[language as keyof Translations]);
  }

  async create(languages: string[], namespace: string, key: string, fallbackValue: string) {
    fetch(`https://bnra.powerappsportals.com/_api/cr4de_bnratranslations`, {
      method: "POST",
      headers: {
        __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cr4de_name: key,
        [`cr4de_${languages[0]}`]: fallbackValue,
      }),
    });
  }
}

export default DataverseBackend;
