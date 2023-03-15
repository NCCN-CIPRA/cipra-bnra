import { useNavigate } from "react-router-dom";
import { DVAttachment } from "../types/dataverse/DVAttachment";
import { DVCascadeAnalysis } from "../types/dataverse/DVCascadeAnalysis";
import { DVContact } from "../types/dataverse/DVContact";
import { DVDirectAnalysis } from "../types/dataverse/DVDirectAnalysis";
import { DVFeedback } from "../types/dataverse/DVFeedback";
import { DVInvitation } from "../types/dataverse/DVInvitation";
import { DVPage } from "../types/dataverse/DVPage";
import { DVParticipation } from "../types/dataverse/DVParticipation";
import { DVRiskCascade } from "../types/dataverse/DVRiskCascade";
import { DVRiskFile } from "../types/dataverse/DVRiskFile";
import { DVTranslation } from "../types/dataverse/DVTranslation";
import { DVValidation } from "../types/dataverse/DVValidation";
import { Buffer } from "buffer";

export enum DataTable {
  CONTACT,

  RISK_FILE,
  RISK_CASCADE,

  PARTICIPATION,

  VALIDATION,
  DIRECT_ANALYSIS,
  CASCADE_ANALYSIS,

  ATTACHMENT,

  TRANSLATIONS,

  PAGE,
}

export interface AuthResponse<T = null> {
  data?: T;
  error?: string;
}

export interface RegistrationData {
  formHtml: string;
  email: string;
}

export interface CreateResponse {
  id: string;
}

export interface API {
  authFetch(input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response>;

  login(email: string, password: string, remember: boolean): Promise<AuthResponse>;
  requestPasswordReset(email: string): Promise<AuthResponse>;
  resetPassword(userId: string, code: string, password: string): Promise<AuthResponse>;
  requestRegistrationLink(invitationCode: string): Promise<AuthResponse<RegistrationData>>;

  getContacts<T = DVContact>(query?: string): Promise<T[]>;
  createContact(fields: Partial<DVContact>): Promise<CreateResponse>;
  updateContact(id: string, fields: Partial<DVContact>): Promise<void>;
  deleteContact(id: string): Promise<void>;

  getInvitations<T = DVInvitation>(query?: string): Promise<T[]>;

  getRiskFiles<T = DVRiskFile>(query?: string): Promise<T[]>;
  getRiskFile<T = DVRiskFile>(id: string, query?: string): Promise<T>;
  updateRiskFile(id: string, fields: Partial<DVRiskFile>): Promise<void>;
  deleteRiskFile(id: string): Promise<void>;

  getRiskCascades<T = DVRiskCascade>(query?: string): Promise<T[]>;
  getRiskCascade<T = DVRiskCascade>(id: string, query?: string): Promise<T>;
  createCascade(fields: object): Promise<CreateResponse>;
  updateCascade(id: string, fields: object): Promise<void>;
  deleteCascade(id: string): Promise<void>;

  getParticipants<T = DVParticipation>(query?: string): Promise<T[]>;
  createParticipant(fields: object): Promise<CreateResponse>;
  updateParticipant(id: string, fields: object): Promise<void>;
  deleteParticipant(id: string): Promise<void>;

  getValidations<T = DVValidation>(query?: string): Promise<T[]>;
  getValidation<T = DVValidation>(id: string, query?: string): Promise<T>;
  createValidation(fields: object): Promise<CreateResponse>;
  updateValidation(id: string, fields: object): Promise<void>;
  deleteValidation(id: string): Promise<void>;

  getDirectAnalyses<T = DVDirectAnalysis>(query?: string): Promise<T[]>;
  getDirectAnalysis<T = DVDirectAnalysis>(id: string, query?: string): Promise<T>;
  createDirectAnalysis(fields: object): Promise<CreateResponse>;
  updateDirectAnalysis(id: string, fields: object): Promise<void>;
  deleteDirectAnalysis(id: string): Promise<void>;

  getCascadeAnalyses<T = DVCascadeAnalysis>(query?: string): Promise<T[]>;
  getCascadeAnalysis<T = DVCascadeAnalysis>(id: string, query?: string): Promise<T>;
  updateCascadeAnalysis(id: string, fields: object): Promise<void>;
  deleteCascadeAnalysis(id: string): Promise<void>;

  getAttachments<T = DVAttachment>(query?: string): Promise<T[]>;
  serveAttachmentFile(attachment: DVAttachment): Promise<void>;
  createAttachment(fields: object, file: File | null): Promise<CreateResponse>;
  updateAttachment(id: string, file: File | null): Promise<void>;
  updateAttachmentFields(id: string, fields: object): Promise<void>;
  deleteAttachment(id: string): Promise<void>;

  getFeedbacks<T = DVFeedback>(query?: string): Promise<T[]>;
  createFeedback(fields: object): Promise<CreateResponse>;
  updateFeedback(id: string, fields: object): Promise<void>;
  deleteFeedback(id: string): Promise<void>;

  getTranslations<T = DVTranslation>(query?: string): Promise<T[]>;
  updateTranslation(id: string, fields: object): Promise<void>;
  deleteTranslation(id: string): Promise<void>;

  getPage<T = DVPage>(name: string, query?: string): Promise<T>;
  updatePage(id: string, fields: object): Promise<void>;

  sendInvitationEmail(contactIds: string[]): Promise<void>;
  finishStep(riskFileId: string, contactId: string, step: string): Promise<void>;
}

export default function useAPI(): API {
  const navigate = useNavigate();

  const authFetch = async (input: RequestInfo | URL, init?: RequestInit | undefined) => {
    try {
      const response = await fetch(input, init);

      if (response.status === 403) {
        navigate("/auth");

        throw new Error("Not Authenticated");
      }

      return response;
    } catch (e) {
      throw e;
    }
  };

  return {
    authFetch,
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

      const responseHtml = await response.text();

      if (
        responseHtml.indexOf("Ongeldige aanmeldingspoging.") >= 0 ||
        responseHtml.indexOf("Er is een fout opgetreden") >= 0
      )
        return {
          error: "auth.login.error.message",
        };
      else if (responseHtml.indexOf("De gebruikersaccount is momenteel vergrendeld") >= 0)
        return {
          error: "auth.login.locked.message",
        };

      if (response.status === 200) {
        return { data: null };
      } else {
        return {
          error: "Invalid login",
        };
      }
    },
    requestPasswordReset: async function (email: string) {
      const response = await fetch("https://bnra.powerappsportals.com/Account/Login/ForgotPassword", {
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
    resetPassword: async function (userId: string, code: string, password: string) {
      const response = await fetch("https://bnra.powerappsportals.com/Account/Login/ResetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
          UserId: userId,
          Code: code,
          Password: password,
          ConfirmPassword: password,
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

        const e = responseText.match(/.*value="(.*)" id="EmailTextBox".*/);
        const email = e && e[1];

        return {
          data: {
            formHtml,
            email,
          },
        } as AuthResponse<RegistrationData>;
      } else {
        return {
          error: "Invalid invitation code",
        };
      }
    },

    getContacts: async function <T = DVContact>(query?: string): Promise<T[]> {
      const response = await authFetch(`https://bnra.powerappsportals.com/_api/contacts${query ? "?" + query : ""}`);

      return (await response.json()).value;
    },
    createContact: async function (fields: object): Promise<CreateResponse> {
      const response = await authFetch(`https://bnra.powerappsportals.com/_api/contacts`, {
        method: "POST",
        headers: {
          __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });

      return { id: response.headers.get("entityId") as string };
    },
    updateContact: async function (id: string, fields: object): Promise<void> {
      await authFetch(`https://bnra.powerappsportals.com/_api/contacts(${id})`, {
        method: "PATCH",
        headers: {
          __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });
    },
    deleteContact: async function (id: string): Promise<void> {
      await authFetch(`https://bnra.powerappsportals.com/_api/contacts(${id})`, {
        method: "DELETE",
        headers: {
          __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
          "Content-Type": "application/json",
        },
      });
    },

    getInvitations: async function <T = DVInvitation>(query?: string): Promise<T[]> {
      const response = await authFetch(
        `https://bnra.powerappsportals.com/_api/adx_invitations${query ? "?" + query : ""}`
      );

      return (await response.json()).value;
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
    deleteRiskFile: async function (id: string): Promise<void> {
      await authFetch(`https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${id})`, {
        method: "DELETE",
        headers: {
          __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
          "Content-Type": "application/json",
        },
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

    getParticipants: async function <T = DVParticipation>(query?: string): Promise<T[]> {
      const response = await authFetch(
        `https://bnra.powerappsportals.com/_api/cr4de_bnraparticipations${query ? "?" + query : ""}`
      );

      return (await response.json()).value;
    },
    createParticipant: async function (fields: object): Promise<CreateResponse> {
      const response = await authFetch(`https://bnra.powerappsportals.com/_api/cr4de_bnraparticipations`, {
        method: "POST",
        headers: {
          __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });

      return { id: response.headers.get("entityId") as string };
    },
    updateParticipant: async function (id: string, fields: object): Promise<void> {
      await authFetch(`https://bnra.powerappsportals.com/_api/cr4de_bnraparticipations(${id})`, {
        method: "PATCH",
        headers: {
          __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });
    },
    deleteParticipant: async function (id: string): Promise<void> {
      await authFetch(`https://bnra.powerappsportals.com/_api/cr4de_bnraparticipations(${id})`, {
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
    createValidation: async function (fields: object): Promise<CreateResponse> {
      const response = await authFetch(`https://bnra.powerappsportals.com/_api/cr4de_bnravalidations`, {
        method: "POST",
        headers: {
          __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });

      return { id: response.headers.get("entityId") as string };
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
    deleteValidation: async function (id: string): Promise<void> {
      await authFetch(`https://bnra.powerappsportals.com/_api/cr4de_bnravalidations(${id})`, {
        method: "DELETE",
        headers: {
          __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
          "Content-Type": "application/json",
        },
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
    createDirectAnalysis: async function (fields: object): Promise<CreateResponse> {
      const response = await authFetch(`https://bnra.powerappsportals.com/_api/cr4de_bnradirectanalysises`, {
        method: "POST",
        headers: {
          __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });

      return { id: response.headers.get("entityId") as string };
    },
    updateDirectAnalysis: async function (id: string, fields: object): Promise<void> {
      const response = await authFetch(`https://bnra.powerappsportals.com/_api/cr4de_bnradirectanalysises(${id})`, {
        method: "PATCH",
        headers: {
          __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });

      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.status.toString());
      }
    },
    deleteDirectAnalysis: async function (id: string): Promise<void> {
      await authFetch(`https://bnra.powerappsportals.com/_api/cr4de_bnradirectanalysises(${id})`, {
        method: "DELETE",
        headers: {
          __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
          "Content-Type": "application/json",
        },
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
    deleteCascadeAnalysis: async function (id: string): Promise<void> {
      await authFetch(`https://bnra.powerappsportals.com/_api/cr4de_bnracascadeanalysises(${id})`, {
        method: "DELETE",
        headers: {
          __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
          "Content-Type": "application/json",
        },
      });
    },

    getAttachments: async function <T = DVAttachment>(query?: string): Promise<T[]> {
      const response = await authFetch(
        `https://bnra.powerappsportals.com/_api/cr4de_bnraattachments${query ? "?" + query : ""}`
      );

      return (await response.json()).value;
    },
    serveAttachmentFile: async function (attachment: DVAttachment) {
      if (attachment.cr4de_url) {
        window.open(attachment.cr4de_url, "_blank");
      } else {
        let fileContent;

        if (new Date(attachment.createdon) < new Date("2023-02-01")) {
          const response = await authFetch(
            `https://bnra.powerappsportals.com/_api/cr4de_bnraattachments(${attachment.cr4de_bnraattachmentid})/cr4de_file?size=full`,
            {
              method: "GET",
              headers: {
                __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
                "Content-Type": "application/json",
              },
            }
          );

          const { value } = await response.json();

          fileContent = `data:application/pdf;base64,${value.value || value}`;
        } else {
          const response = await authFetch(
            `https://bnra.powerappsportals.com/_api/cr4de_bnraattachments(${attachment.cr4de_bnraattachmentid})/cr4de_file/$value`,
            {
              method: "GET",
              headers: {
                __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
                "Content-Type": "application/json",
              },
            }
          );

          const { value } = await response.json();

          fileContent = value;
        }

        const a = document.createElement("a");
        document.body.appendChild(a);
        a.setAttribute("style", "display: none");

        a.href = fileContent;
        a.download = attachment.cr4de_name;
        a.click();
      }
    },
    createAttachment: async function (fields: object, file: File | null): Promise<CreateResponse> {
      const response = await authFetch(`https://bnra.powerappsportals.com/_api/cr4de_bnraattachments`, {
        method: "POST",
        headers: {
          __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });

      const id = response.headers.get("entityId") as string;

      if (!file) return { id };

      return new Promise<CreateResponse>((resolve) => {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async function (e) {
          let fileContent = e.target?.result as string;

          await authFetch(`https://bnra.powerappsportals.com/_api/cr4de_bnraattachments(${id})/cr4de_file`, {
            method: "PUT",
            headers: {
              __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
              "Content-Type": "application/octet-stream",
              // "x-ms-file-name": "main.js",
            },
            body: JSON.stringify({
              value: fileContent,
              // file_name: "test.pdf",
            }),
          });

          return resolve({ id });
        };
      });
    },
    updateAttachment: async function (id: string, file: File | null): Promise<void> {
      if (!file) return;

      return new Promise<void>((resolve) => {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async function (e) {
          let fileContent = e.target?.result as string;

          await authFetch(`https://bnra.powerappsportals.com/_api/cr4de_bnraattachments(${id})/cr4de_file`, {
            method: "PUT",
            headers: {
              __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
              "Content-Type": "application/octet-stream",
              // "x-ms-file-name": "main.js",
            },
            body: JSON.stringify({
              value: fileContent,
            }),
          });

          return resolve();
        };
      });
    },
    updateAttachmentFields: async function (id: string, fields: object): Promise<void> {
      await authFetch(`https://bnra.powerappsportals.com/_api/cr4de_bnraattachments(${id})`, {
        method: "PATCH",
        headers: {
          __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });
    },
    deleteAttachment: async function (id: string): Promise<void> {
      await authFetch(`https://bnra.powerappsportals.com/_api/cr4de_bnraattachments(${id})`, {
        method: "DELETE",
        headers: {
          __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
          "Content-Type": "application/json",
        },
      });
    },

    getFeedbacks: async function <T = DVFeedback>(query?: string): Promise<T[]> {
      const response = await authFetch(
        `https://bnra.powerappsportals.com/_api/cr4de_bnrafeedbacks${query ? "?" + query : ""}`
      );

      return (await response.json()).value;
    },
    createFeedback: async function (fields: object): Promise<CreateResponse> {
      const response = await authFetch(`https://bnra.powerappsportals.com/_api/cr4de_bnrafeedbacks`, {
        method: "POST",
        headers: {
          __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });

      return { id: response.headers.get("entityId") as string };
    },
    updateFeedback: async function (id: string, fields: object): Promise<void> {
      await authFetch(`https://bnra.powerappsportals.com/_api/cr4de_bnrafeedbacks(${id})`, {
        method: "PATCH",
        headers: {
          __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });
    },
    deleteFeedback: async function (id: string): Promise<void> {
      await authFetch(`https://bnra.powerappsportals.com/_api/cr4de_bnrafeedbacks(${id})`, {
        method: "DELETE",
        headers: {
          __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
          "Content-Type": "application/json",
        },
      });
    },

    getTranslations: async function <T = DVTranslation>(query?: string): Promise<T[]> {
      const response = await authFetch(
        `https://bnra.powerappsportals.com/_api/cr4de_bnratranslations${query ? "?" + query : ""}`
      );

      return (await response.json()).value;
    },
    updateTranslation: async function (id: string, fields: object): Promise<void> {
      await authFetch(`https://bnra.powerappsportals.com/_api/cr4de_bnratranslations(${id})`, {
        method: "PATCH",
        headers: {
          __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });
    },
    deleteTranslation: async function (id: string): Promise<void> {
      await authFetch(`https://bnra.powerappsportals.com/_api/cr4de_bnratranslations(${id})`, {
        method: "DELETE",
        headers: {
          __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
          "Content-Type": "application/json",
        },
      });
    },

    getPage: async function <T = DVPage>(name: string, query?: string): Promise<T> {
      const response = await authFetch(
        `https://bnra.powerappsportals.com/_api/cr4de_bnrapages?$filter=cr4de_name eq '${name}'`
      );

      const results: T[] = (await response.json()).value;

      return results[0];
    },
    updatePage: async function (id: string, fields: object): Promise<void> {
      await authFetch(`https://bnra.powerappsportals.com/_api/cr4de_bnrapages(${id})`, {
        method: "PATCH",
        headers: {
          __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });
    },

    sendInvitationEmail: async function (contactIds: string[]): Promise<void> {
      await fetch(
        "https://prod-03.westeurope.logic.azure.com:443/workflows/987f8d4c173d41ff81d3d3259346d6c6/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=0h3uYyRN7UPfaTsc4VqJwezF8ZXqwwHEiFPD1iuv-ts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contacts: contactIds,
          }),
        }
      );
    },
    finishStep: async function (riskFileId: string, contactId: string, step: string): Promise<void> {
      await authFetch(
        "https://prod-233.westeurope.logic.azure.com:443/workflows/9ca84342adac4c8192391b17507e8a93/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=KvQCYydJbAMruMqSy7Psc3U6pqDXC8QehNcDwzGS3QY",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            riskFileId,
            contactId,
            step,
          }),
        }
      );
    },
  };
}
