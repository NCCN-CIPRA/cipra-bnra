import { useNavigate } from "react-router-dom";
import fileToByteArray from "../functions/fileToByteArray";
import { DVAttachment } from "../types/dataverse/DVAttachment";
import { DVCascadeAnalysis } from "../types/dataverse/DVCascadeAnalysis";
import { DVContact } from "../types/dataverse/DVContact";
import { DVDirectAnalysis } from "../types/dataverse/DVDirectAnalysis";
import { DVRiskCascade } from "../types/dataverse/DVRiskCascade";
import { DVRiskFile } from "../types/dataverse/DVRiskFile";
import { DVValidation } from "../types/dataverse/DVValidation";

export enum DataTable {
  RISK_FILE,
  RISK_CASCADE,

  VALIDATION,
  DIRECT_ANALYSIS,
  CASCADE_ANALYSIS,

  ATTACHMENT,
}

export interface AuthResponse<T = null> {
  data?: T;
  error?: string;
}

export interface RegistrationData {
  formHtml: string;
}

export interface CreateResponse {
  id: string;
}

export interface API {
  login(email: string, password: string, remember: boolean): Promise<AuthResponse>;
  requestPasswordReset(email: string): Promise<AuthResponse>;
  requestRegistrationLink(invitationCode: string): Promise<AuthResponse<RegistrationData>>;
  getUser(): Promise<DVContact>;

  getRiskFiles<T = DVRiskFile>(query?: string): Promise<T[]>;
  getRiskFile<T = DVRiskFile>(id: string, query?: string): Promise<T>;
  updateRiskFile(id: string, fields: object): Promise<void>;

  getRiskCascades<T = DVRiskCascade>(query?: string): Promise<T[]>;
  getRiskCascade<T = DVRiskCascade>(id: string, query?: string): Promise<T>;
  createCascade(fields: object): Promise<CreateResponse>;
  updateCascade(id: string, fields: object): Promise<void>;
  deleteCascade(id: string): Promise<void>;

  getValidations<T = DVValidation>(query?: string): Promise<T[]>;
  getValidation<T = DVValidation>(id: string, query?: string): Promise<T>;
  updateValidation(id: string, fields: object): Promise<void>;

  getDirectAnalyses<T = DVDirectAnalysis>(query?: string): Promise<T[]>;
  getDirectAnalysis<T = DVDirectAnalysis>(id: string, query?: string): Promise<T>;
  updateDirectAnalysis(id: string, fields: object): Promise<void>;

  getCascadeAnalyses<T = DVCascadeAnalysis>(query?: string): Promise<T[]>;
  getCascadeAnalysis<T = DVCascadeAnalysis>(id: string, query?: string): Promise<T>;
  updateCascadeAnalysis(id: string, fields: object): Promise<void>;

  getAttachments<T = DVAttachment>(query?: string): Promise<T[]>;
  createAttachment(fields: object, file: File): Promise<CreateResponse>;
}

export default function useAPI(): API {
  const navigate = useNavigate();

  const authFetch = async (input: RequestInfo | URL, init?: RequestInit | undefined) => {
    try {
      const response = await fetch(input, init);

      if (response.status === 403) {
        navigate("/auth");

        console.error(response, await response.json());
        throw new Error("Not Authenticated");
      }

      return response;
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  return {
    login: async function (email: string, password: string, remember: boolean) {
      const response = await fetch("https://bnra.powerappsportals.com/SignIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
          Username: email,
          PasswordValue: password,
          RememberMe: String(remember),
        }),
      });

      if (response.status === 200) {
        return { data: null };
      } else {
        return {
          error: "Invalid login",
        };
      }
    },
    requestPasswordReset: async function (email: string) {
      const response = await fetch("https://bnra.powerappsportals.com/ForgotPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
          Email: email,
        }),
      });

      if (response.status === 200) {
        return { data: null };
      } else {
        return {
          error: "Invalid email",
        };
      }
    },
    requestRegistrationLink: async function (invitationCode: string) {
      const response = await fetch("https://bnra.powerappsportals.com/Register?returnUrl=/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
          InvitationCode: invitationCode,
          RedeemByLogin: "false",
        }),
      });

      if (response.status === 200) {
        const responseText = await response.text();
        const r = responseText.match(/<form method="post" action="\.\/Register.*<\/form>/s);

        const formHtml = r && r[0].replace('action="./Register', 'action="/Account/Login/Register');

        return {
          data: {
            formHtml,
          },
        } as AuthResponse<RegistrationData>;
      } else {
        return {
          error: "Invalid invitation code",
        };
      }
    },
    getUser: async function () {
      const response = await fetch(`https://bnra.powerappsportals.com/_api/contacts`);

      if (response.status === 200) {
        const results = await response.json();

        if (results.value && results.value.length > 0) return results.value[0];
        return null;
      } else {
      }
    },

    getRiskFiles: async function <T = DVRiskFile>(query?: string): Promise<T[]> {
      const response = await authFetch(
        `https://bnra.powerappsportals.com/_api/cr4de_riskfileses${query ? "?" + query : ""}`
      );

      return (await response.json()).value;
    },
    getRiskFile: async function <T = DVRiskFile>(id: string, query?: string): Promise<T> {
      const response = await authFetch(
        `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${id})${query ? "?" + query : ""}`
      );

      return (await response.json()) as T;
    },
    updateRiskFile: async function (id: string, fields: object): Promise<void> {
      await authFetch(`https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${id})`, {
        method: "PATCH",
        headers: {
          __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });
    },

    getRiskCascades: async function <T = DVRiskCascade>(query?: string): Promise<T[]> {
      const response = await authFetch(
        `https://bnra.powerappsportals.com/_api/cr4de_bnrariskcascades${query ? "?" + query : ""}`
      );

      return (await response.json()).value;
    },
    getRiskCascade: async function <T = DVRiskCascade>(id: string, query?: string): Promise<T> {
      const response = await authFetch(
        `https://bnra.powerappsportals.com/_api/cr4de_bnrariskcascades(${id})${query ? "?" + query : ""}`
      );

      return (await response.json()) as T;
    },
    createCascade: async function (fields: object): Promise<CreateResponse> {
      const response = await authFetch(`https://bnra.powerappsportals.com/_api/cr4de_bnrariskcascades`, {
        method: "POST",
        headers: {
          __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });

      return { id: response.headers.get("entityId") as string };
    },
    updateCascade: async function (id: string, fields: object): Promise<void> {
      await authFetch(`https://bnra.powerappsportals.com/_api/cr4de_bnrariskcascades(${id})`, {
        method: "PATCH",
        headers: {
          __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });
    },
    deleteCascade: async function (id: string): Promise<void> {
      await authFetch(`https://bnra.powerappsportals.com/_api/cr4de_bnrariskcascades(${id})`, {
        method: "DELETE",
        headers: {
          __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
          "Content-Type": "application/json",
        },
      });
    },

    getValidations: async function <T = DVValidation>(query?: string): Promise<T[]> {
      const response = await authFetch(
        `https://bnra.powerappsportals.com/_api/cr4de_bnravalidations${query ? "?" + query : ""}`
      );

      return (await response.json()).value;
    },
    getValidation: async function <T = DVValidation>(id: string, query?: string): Promise<T> {
      const response = await authFetch(
        `https://bnra.powerappsportals.com/_api/cr4de_bnravalidations(${id})${query ? "?" + query : ""}`
      );

      return (await response.json()) as T;
    },
    updateValidation: async function (id: string, fields: object): Promise<void> {
      await authFetch(`https://bnra.powerappsportals.com/_api/cr4de_bnravalidations(${id})`, {
        method: "PATCH",
        headers: {
          __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });
    },

    getDirectAnalyses: async function <T = DVDirectAnalysis>(query?: string): Promise<T[]> {
      const response = await authFetch(
        `https://bnra.powerappsportals.com/_api/cr4de_bnradirectanalysises${query ? "?" + query : ""}`
      );

      return (await response.json()).value;
    },
    getDirectAnalysis: async function <T = DVDirectAnalysis>(id: string, query?: string): Promise<T> {
      const response = await authFetch(
        `https://bnra.powerappsportals.com/_api/cr4de_bnradirectanalysises(${id})${query ? "?" + query : ""}`
      );

      return (await response.json()) as T;
    },
    updateDirectAnalysis: async function (id: string, fields: object): Promise<void> {
      await authFetch(`https://bnra.powerappsportals.com/_api/cr4de_bnradirectanalysises(${id})`, {
        method: "PATCH",
        headers: {
          __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });
    },

    getCascadeAnalyses: async function <T = DVCascadeAnalysis>(query?: string): Promise<T[]> {
      const response = await authFetch(
        `https://bnra.powerappsportals.com/_api/cr4de_bnracascadeanalysises${query ? "?" + query : ""}`
      );

      return (await response.json()).value;
    },
    getCascadeAnalysis: async function <T = DVCascadeAnalysis>(id: string, query?: string): Promise<T> {
      const response = await authFetch(
        `https://bnra.powerappsportals.com/_api/cr4de_bnracascadeanalysises(${id})${query ? "?" + query : ""}`
      );

      return (await response.json()) as T;
    },
    updateCascadeAnalysis: async function (id: string, fields: object): Promise<void> {
      await authFetch(`https://bnra.powerappsportals.com/_api/cr4de_bnracascadeanalysises(${id})`, {
        method: "PATCH",
        headers: {
          __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });
    },

    getAttachments: async function <T = DVAttachment>(query?: string): Promise<T[]> {
      const response = await authFetch(
        `https://bnra.powerappsportals.com/_api/cr4de_bnracascadeanalysises${query ? "?" + query : ""}`
      );

      return (await response.json()).value;
    },
    createAttachment: async function (fields: object, file: File): Promise<CreateResponse> {
      const response = await authFetch(`https://bnra.powerappsportals.com/_api/cr4de_bnraattachments`, {
        method: "POST",
        headers: {
          __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });

      const id = response.headers.get("entityId") as string;

      await authFetch(`https://bnra.powerappsportals.com/_api/cr4de_bnraattachments(${id})/cr4de_file`, {
        method: "PUT",
        headers: {
          __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
        },
        body: await fileToByteArray(file),
      });

      return { id };
    },
  };
}
