import { DVAttachment } from "../types/dataverse/DVAttachment";
import { DVContact } from "../types/dataverse/DVContact";
import { DVFeedback } from "../types/dataverse/DVFeedback";
import { DVInvitation } from "../types/dataverse/DVInvitation";
import { DVPage } from "../types/dataverse/DVPage";
import { DVParticipation } from "../types/dataverse/DVParticipation";
import { DVRiskCascade } from "../types/dataverse/DVRiskCascade";
import { DVRiskFile } from "../types/dataverse/DVRiskFile";
import { DVTranslation } from "../types/dataverse/DVTranslation";
import { DVValidation } from "../types/dataverse/DVValidation";
import { DVRiskSummary } from "../types/dataverse/DVRiskSummary";
import {
  ParsedRiskFields,
  UnparsedRiskFields,
} from "../types/dataverse/Riskfile";
import { unwrap as unwrapHE } from "./historicalEvents";
import { unwrap as unwrapS } from "./scenarios";
import { unwrap as unwrapIP } from "./intensityParameters";
import { getResultSnapshot } from "../types/dataverse/DVSmallRisk";
import { DVDirectAnalysis } from "../types/dataverse/DVDirectAnalysis";
import { DVCascadeAnalysis } from "../types/dataverse/DVCascadeAnalysis";
import { DVAnalysisRun } from "../types/dataverse/DVAnalysisRun";
import { getCascadeResultSnapshot } from "./snapshot";
import {
  DVRiskSnapshot,
  SerializedRiskSnapshotResults,
} from "../types/dataverse/DVRiskSnapshot";
import {
  DVCascadeSnapshot,
  SerializedCauseSnapshotResults,
  SerializedEffectSnapshotResults,
} from "../types/dataverse/DVCascadeSnapshot";

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
  authFetch(
    input: RequestInfo | URL,
    init?: RequestInit | undefined
  ): Promise<Response>;

  login(
    email: string,
    password: string,
    remember: boolean
  ): Promise<AuthResponse>;
  requestPasswordReset(email: string): Promise<AuthResponse>;
  resetPassword(
    userId: string,
    code: string,
    password: string
  ): Promise<AuthResponse>;
  requestRegistrationLink(
    invitationCode: string
  ): Promise<AuthResponse<RegistrationData>>;

  getContacts<T = DVContact>(query?: string): Promise<T[]>;
  createContact(fields: Partial<DVContact>): Promise<CreateResponse>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateContact(id: string, fields: Partial<any>): Promise<void>;
  deleteContact(id: string): Promise<void>;

  getInvitations<T = DVInvitation>(query?: string): Promise<T[]>;

  getRiskSummaries<T = DVRiskSummary>(query?: string): Promise<T[]>;
  getRiskSummary<T = DVRiskSummary>(id: string, query?: string): Promise<T>;
  createRiskSummary(fields: Partial<DVRiskSummary>): Promise<CreateResponse>;
  updateRiskSummary(id: string, fields: Partial<DVRiskSummary>): Promise<void>;
  deleteRiskSummary(id: string): Promise<void>;

  getRiskSnapshots<T = DVRiskSnapshot<unknown, SerializedRiskSnapshotResults>>(
    query?: string
  ): Promise<T[]>;
  getRiskSnapshot<T = DVRiskSnapshot<unknown, SerializedRiskSnapshotResults>>(
    id: string,
    query?: string
  ): Promise<T>;
  createRiskSnapshot(
    fields: Partial<DVRiskSnapshot<unknown, SerializedRiskSnapshotResults>>
  ): Promise<CreateResponse>;
  updateRiskSnapshot(
    id: string,
    fields: Partial<DVRiskSnapshot<unknown, SerializedRiskSnapshotResults>>
  ): Promise<void>;
  deleteRiskSnapshot(id: string): Promise<void>;

  getCascadeSnapshots<
    T = DVCascadeSnapshot<
      unknown,
      unknown,
      unknown,
      SerializedCauseSnapshotResults,
      SerializedEffectSnapshotResults
    >
  >(
    query?: string
  ): Promise<T[]>;
  getCascadeSnapshot<
    T = DVCascadeSnapshot<
      unknown,
      unknown,
      unknown,
      SerializedCauseSnapshotResults,
      SerializedEffectSnapshotResults
    >
  >(
    id: string,
    query?: string
  ): Promise<T>;
  createCascadeSnapshot(
    fields: Partial<
      DVCascadeSnapshot<
        unknown,
        unknown,
        unknown,
        SerializedCauseSnapshotResults,
        SerializedEffectSnapshotResults
      >
    >
  ): Promise<CreateResponse>;
  updateCascadeSnapshot(
    id: string,
    fields: Partial<
      DVCascadeSnapshot<
        unknown,
        unknown,
        unknown,
        SerializedCauseSnapshotResults,
        SerializedEffectSnapshotResults
      >
    >
  ): Promise<void>;
  deleteCascadeSnapshot(id: string): Promise<void>;

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
  // getDirectAnalysis<T = DVDirectAnalysis>(
  //   id: string,
  //   query?: string
  // ): Promise<T>;
  // createDirectAnalysis(fields: object): Promise<CreateResponse>;
  // updateDirectAnalysis(id: string, fields: object): Promise<void>;
  // deleteDirectAnalysis(id: string): Promise<void>;

  getCascadeAnalyses<T = DVCascadeAnalysis>(query?: string): Promise<T[]>;
  // getCascadeAnalysis<T = DVCascadeAnalysis>(
  //   id: string,
  //   query?: string
  // ): Promise<T>;
  // createCascadeAnalysis(fields: object): Promise<CreateResponse>;
  // updateCascadeAnalysis(id: string, fields: object): Promise<void>;
  // deleteCascadeAnalysis(id: string): Promise<void>;

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
  createTranslation(fields: Partial<DVTranslation>): Promise<CreateResponse>;
  updateTranslation(id: string, fields: Partial<DVTranslation>): Promise<void>;
  deleteTranslation(id: string): Promise<void>;

  getPages<T = DVPage>(query?: string): Promise<T[]>;
  getPage<T = DVPage>(name: string, query?: string): Promise<T>;
  updatePage(id: string, fields: object): Promise<void>;

  sendInvitationEmail(contactIds: string[]): Promise<void>;
  finishStep(
    riskFileId: string,
    contactId: string,
    step: string
  ): Promise<void>;

  getAnalysisRuns<T = DVAnalysisRun>(query?: string): Promise<T[]>;
  // getAnalysisRun<T = DVAnalysisRun>(id: string, query?: string): Promise<T>;
  createAnalysisRun(fields: object): Promise<CreateResponse>;

  // getContactRoles<T = DVContact>(query?: string): Promise<T[]>;
}

function getOne<InType, OutType = InType>(
  customFetch: (url: string) => Promise<Response>,
  tableName: string,
  defaultQuery?: string,
  transform: (d: InType) => OutType = (d) => d as unknown as OutType
) {
  return async <T = OutType>(
    id: string,
    query: string | undefined = defaultQuery
  ) => {
    const response = await customFetch(
      `/_api/${tableName}(${id})${query ? "?" + query : ""}`
    );

    return transform(await response.json()) as unknown as T;
  };
}
function getMultiple<InType, OutType = InType>(
  customFetch: (url: string) => Promise<Response>,
  tableName: string,
  defaultQuery?: string,
  transform: (d: InType) => OutType = (d) => d as unknown as OutType
) {
  return async <T = OutType>(query: string | undefined = defaultQuery) => {
    const response = await customFetch(
      `/_api/${tableName}${query ? "?" + query : ""}`
    );

    return (await response.json()).value.map(transform) as T[];
  };
}
function create<R>(
  customFetch: (url: string, opts?: RequestInit) => Promise<Response>,
  tableName: string,
  antiForgeryToken: string
) {
  return async <T = R>(fields: Partial<T>): Promise<CreateResponse> => {
    const response = await customFetch(`/_api/${tableName}`, {
      method: "POST",
      headers: {
        __RequestVerificationToken: antiForgeryToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fields),
    });

    return { id: response.headers.get("entityId") as string };
  };
}
function update<R>(
  customFetch: (url: string, opts?: RequestInit) => Promise<Response>,
  tableName: string,
  antiForgeryToken: string
) {
  return async <T = R>(id: string, fields: Partial<T>) => {
    await customFetch(`/_api/${tableName}(${id})`, {
      method: "PATCH",
      headers: {
        __RequestVerificationToken: antiForgeryToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fields),
    });
  };
}
function remove(
  customFetch: (url: string, opts?: RequestInit) => Promise<Response>,
  tableName: string,
  antiForgeryToken: string
) {
  return async (id: string) => {
    await customFetch(`/_api/${tableName}(${id})`, {
      method: "DELETE",
      headers: {
        __RequestVerificationToken: antiForgeryToken,
        "Content-Type": "application/json",
      },
    });
  };
}

export const getAntiForgeryToken = async (headers = {}) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  const response = await fetch(
    `https://bnra.powerappsportals.com/_layout/tokenhtml?_=${Date.now()}`,
    {
      method: "GET",
      headers,
    }
  );

  return (await response.text()).split("value")[1].split('"')[1];
};

export const getAPI = (
  antiForgeryToken: string,
  customFetch: (input: string, init?: RequestInit) => Promise<Response>
): API => {
  const authFetch = async (input: string, init?: RequestInit | undefined) => {
    const response = await customFetch(input, init);

    // if (response.status === 403) {
    //   navigate("/auth");

    //   throw new Error("Not Authenticated");
    // } else if (response.status === 404) {
    //   throw new Error("Not Found");
    // }

    return response;
  };

  return {
    authFetch,
    login: async function (email: string, password: string, remember: boolean) {
      const response = await customFetch(
        "https://bnra.powerappsportals.com/SignIn",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            __RequestVerificationToken: antiForgeryToken,
            Username: email,
            PasswordValue: password,
            RememberMe: String(remember),
          }),
        }
      );

      const responseHtml = await response.text();

      if (
        responseHtml.indexOf("Ongeldige aanmeldingspoging.") >= 0 ||
        responseHtml.indexOf("Er is een fout opgetreden") >= 0
      )
        return {
          error: "auth.login.error.message",
        };
      else if (
        responseHtml.indexOf("De gebruikersaccount is momenteel vergrendeld") >=
        0
      )
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
      const response = await customFetch(
        "https://bnra.powerappsportals.com/Account/Login/ForgotPassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            __RequestVerificationToken: antiForgeryToken,
            Email: email,
          }),
        }
      );

      if (response.status === 200) {
        return { data: null };
      } else {
        return {
          error: "Invalid email",
        };
      }
    },
    resetPassword: async function (
      userId: string,
      code: string,
      password: string
    ) {
      const response = await customFetch(
        "https://bnra.powerappsportals.com/Account/Login/ResetPassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            __RequestVerificationToken: antiForgeryToken,
            UserId: userId,
            Code: code,
            Password: password,
            ConfirmPassword: password,
          }),
        }
      );

      if (response.status === 200) {
        return { data: null };
      } else {
        return {
          error: "Invalid email",
        };
      }
    },

    requestRegistrationLink: async function (invitationCode: string) {
      const response = await customFetch(
        "https://bnra.powerappsportals.com/Register?returnUrl=/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            __RequestVerificationToken: antiForgeryToken,
            InvitationCode: invitationCode,
            RedeemByLogin: "false",
          }),
        }
      );

      if (response.status === 200) {
        const responseText = await response.text();
        const r = responseText.match(
          /<form method="post" action="\.\/Register.*<\/form>/s
        );

        const formHtml =
          r &&
          r[0].replace('action="./Register', 'action="/Account/Login/Register');

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

    getContacts: getMultiple<DVContact>(authFetch, "contacts"),
    createContact: create<DVContact>(authFetch, "contacts", antiForgeryToken),
    updateContact: update<DVContact>(authFetch, "contacts", antiForgeryToken),
    deleteContact: remove(authFetch, "contacts", antiForgeryToken),

    getInvitations: getMultiple<DVInvitation>(authFetch, "adx_invitations"),

    getRiskSummaries: getMultiple(
      authFetch,
      "cr4de_bnrariskfilesummaries",
      undefined
    ),
    getRiskSummary: getOne(authFetch, "cr4de_bnrariskfilesummaries", undefined),
    createRiskSummary: create<DVRiskSummary>(
      authFetch,
      "cr4de_bnrariskfilesummaries",
      antiForgeryToken
    ),
    updateRiskSummary: update<DVRiskSummary>(
      authFetch,
      "cr4de_bnrariskfilesummaries",
      antiForgeryToken
    ),
    deleteRiskSummary: remove(
      authFetch,
      "cr4de_bnrariskfilesummaries",
      antiForgeryToken
    ),

    getRiskSnapshots: getMultiple(
      authFetch,
      "cr4de_bnrariskfilesnapshots",
      undefined
    ),
    getRiskSnapshot: getOne(
      authFetch,
      "cr4de_bnrariskfilesnapshots",
      undefined
    ),
    createRiskSnapshot: create<DVRiskSummary>(
      authFetch,
      "cr4de_bnrariskfilesnapshots",
      antiForgeryToken
    ),
    updateRiskSnapshot: update<DVRiskSummary>(
      authFetch,
      "cr4de_bnrariskfilesnapshots",
      antiForgeryToken
    ),
    deleteRiskSnapshot: remove(
      authFetch,
      "cr4de_bnrariskfilesnapshots",
      antiForgeryToken
    ),

    getCascadeSnapshots: getMultiple(
      authFetch,
      "cr4de_bnrariskcascadesnapshots",
      undefined
    ),
    getCascadeSnapshot: getOne(
      authFetch,
      "cr4de_bnrariskcascadesnapshots",
      undefined
    ),
    createCascadeSnapshot: create<DVCascadeSnapshot>(
      authFetch,
      "cr4de_bnrariskcascadesnapshots",
      antiForgeryToken
    ),
    updateCascadeSnapshot: update<DVCascadeSnapshot>(
      authFetch,
      "cr4de_bnrariskcascadesnapshots",
      antiForgeryToken
    ),
    deleteCascadeSnapshot: remove(
      authFetch,
      "cr4de_bnrariskcascadesnapshots",
      antiForgeryToken
    ),

    getRiskFiles: getMultiple<DVRiskFile>(
      authFetch,
      "cr4de_riskfileses",
      undefined,
      transformRiskFile
    ),
    getRiskFile: getOne<DVRiskFile>(
      authFetch,
      "cr4de_riskfileses",
      undefined,
      transformRiskFile
    ),
    updateRiskFile: update<DVRiskFile>(
      authFetch,
      "cr4de_riskfileses",
      antiForgeryToken
    ),
    deleteRiskFile: remove(authFetch, "cr4de_riskfileses", antiForgeryToken),

    getRiskCascades: getMultiple<DVRiskCascade>(
      authFetch,
      "cr4de_bnrariskcascades",
      undefined,
      transformRiskCascade
    ),
    getRiskCascade: getOne<DVRiskCascade>(
      authFetch,
      "cr4de_bnrariskcascades",
      undefined,
      transformRiskCascade
    ),
    createCascade: create<DVRiskCascade>(
      authFetch,
      "cr4de_bnrariskcascades",
      antiForgeryToken
    ),
    updateCascade: update<DVRiskCascade>(
      authFetch,
      "cr4de_bnrariskcascades",
      antiForgeryToken
    ),
    deleteCascade: remove(
      authFetch,
      "cr4de_bnrariskcascades",
      antiForgeryToken
    ),

    getParticipants: getMultiple<DVParticipation>(
      authFetch,
      "cr4de_bnraparticipations"
    ),
    createParticipant: create<DVParticipation>(
      authFetch,
      "cr4de_bnraparticipations",
      antiForgeryToken
    ),
    updateParticipant: update<DVParticipation>(
      authFetch,
      "cr4de_bnraparticipations",
      antiForgeryToken
    ),
    deleteParticipant: remove(
      authFetch,
      "cr4de_bnraparticipations",
      antiForgeryToken
    ),

    getValidations: getMultiple<DVValidation>(
      authFetch,
      "cr4de_bnravalidations"
    ),
    getValidation: getOne<DVValidation>(authFetch, "cr4de_bnravalidations"),
    createValidation: create<DVValidation>(
      authFetch,
      "cr4de_bnravalidations",
      antiForgeryToken
    ),
    updateValidation: update<DVValidation>(
      authFetch,
      "cr4de_bnravalidations",
      antiForgeryToken
    ),
    deleteValidation: remove(
      authFetch,
      "cr4de_bnravalidations",
      antiForgeryToken
    ),

    getDirectAnalyses: getMultiple<DVDirectAnalysis>(
      authFetch,
      "cr4de_bnradirectanalysises"
    ),

    //   return (await response.json()).value;
    // },
    // getDirectAnalysis: async function <T = DVDirectAnalysis>(
    //   id: string,
    //   query?: string
    // ): Promise<T> {
    //   const response = await authFetch(
    //     `https://bnra.powerappsportals.com/_api/cr4de_bnradirectanalysises(${id})${
    //       query ? "?" + query : ""
    //     }`
    //   );

    //   return (await response.json()) as T;
    // },
    // createDirectAnalysis: async function (
    //   fields: object
    // ): Promise<CreateResponse> {
    //   const response = await authFetch(
    //     `https://bnra.powerappsportals.com/_api/cr4de_bnradirectanalysises`,
    //     {
    //       method: "POST",
    //       headers: {
    //         __RequestVerificationToken: antiForgeryToken,
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(fields),
    //     }
    //   );

    //   return { id: response.headers.get("entityId") as string };
    // },
    // updateDirectAnalysis: async function (
    //   id: string,
    //   fields: object
    // ): Promise<void> {
    //   const response = await authFetch(
    //     `https://bnra.powerappsportals.com/_api/cr4de_bnradirectanalysises(${id})`,
    //     {
    //       method: "PATCH",
    //       headers: {
    //         __RequestVerificationToken: antiForgeryToken,
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(fields),
    //     }
    //   );

    //   if (response.status < 200 || response.status >= 300) {
    //     throw new Error(response.status.toString());
    //   }
    // },
    // deleteDirectAnalysis: async function (id: string): Promise<void> {
    //   await authFetch(
    //     `https://bnra.powerappsportals.com/_api/cr4de_bnradirectanalysises(${id})`,
    //     {
    //       method: "DELETE",
    //       headers: {
    //         __RequestVerificationToken: antiForgeryToken,
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
    // },

    getCascadeAnalyses: getMultiple<DVCascadeAnalysis>(
      authFetch,
      "cr4de_bnracascadeanalysises"
    ),

    //   // eslint-disable-next-line no-constant-condition
    //   while (true) {
    //     const result = await response.json();

    //     results.push(...result.value);

    //     if (!result["@odata.nextLink"]) {
    //       return results;
    //     }

    //     response = await authFetch(result["@odata.nextLink"]);
    //   }
    // },
    // getCascadeAnalysis: async function <T = DVCascadeAnalysis>(
    //   id: string,
    //   query?: string
    // ): Promise<T> {
    //   const response = await authFetch(
    //     `https://bnra.powerappsportals.com/_api/cr4de_bnracascadeanalysises(${id})${
    //       query ? "?" + query : ""
    //     }`
    //   );

    //   return (await response.json()) as T;
    // },
    // createCascadeAnalysis: async function (
    //   fields: object
    // ): Promise<CreateResponse> {
    //   const response = await authFetch(
    //     `https://bnra.powerappsportals.com/_api/cr4de_bnracascadeanalysises`,
    //     {
    //       method: "POST",
    //       headers: {
    //         __RequestVerificationToken: antiForgeryToken,
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(fields),
    //     }
    //   );

    //   return { id: response.headers.get("entityId") as string };
    // },
    // updateCascadeAnalysis: async function (
    //   id: string,
    //   fields: object
    // ): Promise<void> {
    //   await authFetch(
    //     `https://bnra.powerappsportals.com/_api/cr4de_bnracascadeanalysises(${id})`,
    //     {
    //       method: "PATCH",
    //       headers: {
    //         __RequestVerificationToken: antiForgeryToken,
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(fields),
    //     }
    //   );
    // },
    // deleteCascadeAnalysis: async function (id: string): Promise<void> {
    //   await authFetch(
    //     `https://bnra.powerappsportals.com/_api/cr4de_bnracascadeanalysises(${id})`,
    //     {
    //       method: "DELETE",
    //       headers: {
    //         __RequestVerificationToken: antiForgeryToken,
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
    // },

    getAttachments: getMultiple<DVAttachment>(
      authFetch,
      "cr4de_bnraattachments",
      "$expand=cr4de_referencedSource"
    ),
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
                __RequestVerificationToken: antiForgeryToken,
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
                __RequestVerificationToken: antiForgeryToken,
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
    createAttachment: async function (
      fields: object,
      file: File | null
    ): Promise<CreateResponse> {
      const response = await authFetch(
        `https://bnra.powerappsportals.com/_api/cr4de_bnraattachments`,
        {
          method: "POST",
          headers: {
            __RequestVerificationToken: antiForgeryToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fields),
        }
      );

      const id = response.headers.get("entityId") as string;

      if (!file) return { id };

      return new Promise<CreateResponse>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async function (e) {
          const fileContent = e.target?.result as string;

          await authFetch(
            `https://bnra.powerappsportals.com/_api/cr4de_bnraattachments(${id})/cr4de_file`,
            {
              method: "PUT",
              headers: {
                __RequestVerificationToken: antiForgeryToken,
                "Content-Type": "application/octet-stream",
                // "x-ms-file-name": "main.js",
              },
              body: JSON.stringify({
                value: fileContent,
                // file_name: "test.pdf",
              }),
            }
          );

          return resolve({ id });
        };
      });
    },
    updateAttachment: async function (
      id: string,
      file: File | null
    ): Promise<void> {
      if (!file) return;

      return new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async function (e) {
          const fileContent = e.target?.result as string;

          await authFetch(
            `https://bnra.powerappsportals.com/_api/cr4de_bnraattachments(${id})/cr4de_file`,
            {
              method: "PUT",
              headers: {
                __RequestVerificationToken: antiForgeryToken,
                "Content-Type": "application/octet-stream",
                // "x-ms-file-name": "main.js",
              },
              body: JSON.stringify({
                value: fileContent,
              }),
            }
          );

          return resolve();
        };
      });
    },
    updateAttachmentFields: async function (
      id: string,
      fields: object
    ): Promise<void> {
      await authFetch(
        `https://bnra.powerappsportals.com/_api/cr4de_bnraattachments(${id})`,
        {
          method: "PATCH",
          headers: {
            __RequestVerificationToken: antiForgeryToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fields),
        }
      );
    },
    deleteAttachment: async function (id: string): Promise<void> {
      await authFetch(
        `https://bnra.powerappsportals.com/_api/cr4de_bnraattachments(${id})`,
        {
          method: "DELETE",
          headers: {
            __RequestVerificationToken: antiForgeryToken,
            "Content-Type": "application/json",
          },
        }
      );
    },

    getFeedbacks: async function <T = DVFeedback>(
      query?: string
    ): Promise<T[]> {
      const response = await authFetch(
        `https://bnra.powerappsportals.com/_api/cr4de_bnrafeedbacks${
          query ? "?" + query : ""
        }`
      );

      return (await response.json()).value;
    },
    createFeedback: async function (fields: object): Promise<CreateResponse> {
      const response = await authFetch(
        `https://bnra.powerappsportals.com/_api/cr4de_bnrafeedbacks`,
        {
          method: "POST",
          headers: {
            __RequestVerificationToken: antiForgeryToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fields),
        }
      );

      return { id: response.headers.get("entityId") as string };
    },
    updateFeedback: async function (id: string, fields: object): Promise<void> {
      await authFetch(
        `https://bnra.powerappsportals.com/_api/cr4de_bnrafeedbacks(${id})`,
        {
          method: "PATCH",
          headers: {
            __RequestVerificationToken: antiForgeryToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fields),
        }
      );
    },
    deleteFeedback: async function (id: string): Promise<void> {
      await authFetch(
        `https://bnra.powerappsportals.com/_api/cr4de_bnrafeedbacks(${id})`,
        {
          method: "DELETE",
          headers: {
            __RequestVerificationToken: antiForgeryToken,
            "Content-Type": "application/json",
          },
        }
      );
    },

    getTranslations: getMultiple<DVTranslation>(
      authFetch,
      "cr4de_bnratranslations"
    ),
    createTranslation: create<DVTranslation>(
      authFetch,
      "cr4de_bnratranslations",
      antiForgeryToken
    ),
    updateTranslation: update<DVTranslation>(
      authFetch,
      "cr4de_bnratranslations",
      antiForgeryToken
    ),
    deleteTranslation: remove(
      authFetch,
      "cr4de_bnratranslations",
      antiForgeryToken
    ),

    getPages: getMultiple<DVPage>(authFetch, "cr4de_bnrapages"),
    getPage: async function <T = DVPage>(name: string): Promise<T> {
      const response = await authFetch(
        `https://bnra.powerappsportals.com/_api/cr4de_bnrapages?$filter=cr4de_name eq '${name}'`
      );

      const results: T[] = (await response.json()).value;

      return results[0];
    },
    updatePage: update<DVPage>(authFetch, "cr4de_bnrapages", antiForgeryToken),

    sendInvitationEmail: async function (contactIds: string[]): Promise<void> {
      await customFetch(
        "https://defaultde192ca2f7784bb0b5f15cce580378.9a.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/987f8d4c173d41ff81d3d3259346d6c6/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Cu_Yr1xialo9tLN_TOSTP1Yy1IwPSWapQmAI0v1cpU8",
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
    finishStep: async function (
      riskFileId: string,
      contactId: string,
      step: string
    ): Promise<void> {
      // Send an email to CIPRA analists
      await authFetch(
        "https://defaultde192ca2f7784bb0b5f15cce580378.9a.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/79ca88049c3644349691202d00a5c58c/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=pKd41laX7G9mr13hN2EENl2z-4ZanCZdPLetYklIbUw",
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

    getAnalysisRuns: async function <T = DVAnalysisRun>(
      query?: string
    ): Promise<T[]> {
      const response = await authFetch(
        `https://bnra.powerappsportals.com/_api/cr4de_bnraanalysisruns${
          query ? "?" + query : ""
        }`
      );

      return (await response.json()).value;
    },
    // getAnalysisRun: async function <T = DVAnalysisRun>(
    //   id: string,
    //   query?: string
    // ): Promise<T> {
    //   const response = await authFetch(
    //     `https://bnra.powerappsportals.com/_api/cr4de_bnraanalysisruns(${id})${
    //       query ? "?" + query : ""
    //     }`
    //   );

    //   return (await response.json()) as T;
    // },
    createAnalysisRun: async function (
      fields: object
    ): Promise<CreateResponse> {
      const response = await authFetch(
        `https://bnra.powerappsportals.com/_api/cr4de_bnraanalysisruns`,
        {
          method: "POST",
          headers: {
            __RequestVerificationToken: antiForgeryToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fields),
        }
      );

      return { id: response.headers.get("entityId") as string };
    },

    // getContactRoles: async function <T = DVContact>(): Promise<T[]> {
    //   const response = await customFetch(
    //     `https://bnra.powerappsportals.com/_api/adx_webroles`
    //   );

    //   return (await response.json()).value;
    // },
  };
};

export const transformRiskSummary = (
  rs: DVRiskSummary<unknown, UnparsedRiskFields>
): DVRiskSummary<unknown, ParsedRiskFields> => {
  const ip = unwrapIP(rs.cr4de_intensity_parameters);

  return {
    ...rs,
    cr4de_historical_events: unwrapHE(rs.cr4de_historical_events),
    cr4de_intensity_parameters: ip,
    cr4de_scenarios: unwrapS(
      ip,
      rs.cr4de_scenario_considerable,
      rs.cr4de_scenario_major,
      rs.cr4de_scenario_extreme
    ),
  };
};

export const transformRiskFile = (rf: DVRiskFile): DVRiskFile => {
  return {
    ...rf,
    results: getResultSnapshot(rf),
  };
};

export const transformRiskCascade = (rc: DVRiskCascade): DVRiskCascade => {
  return {
    ...rc,
    results: getCascadeResultSnapshot(rc),
  };
};
