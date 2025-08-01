import AsyncStorage from "@react-native-async-storage/async-storage";
import { PaginatedResponse } from "../constants/interfaces";

// const hostURL = "https://bpc.mathiavelli.com";
const hostURL = "http://192.168.254.164:8000";
export function autoFormData(body: Record<string, any>) {
  let needsFormData = false;
  const fileExtensionRegex = /\.(jpg|jpeg|png|gif|pdf|docx?|xlsx?|txt)$/i;

  for (const value of Object.values(body)) {
    if (typeof value === "object" && value?.uri && value?.type) {
      needsFormData = true;
      break;
    }
  }

  if (!needsFormData) {
    const filtered: Record<string, any> = {};
    for (const key in body) {
      if (
        !(typeof body[key] === "string" && fileExtensionRegex.test(body[key]))
      ) {
        filtered[key] = body[key];
      }
    }
    return filtered;
  }

  const formData = new FormData();
  for (const key in body) {
    const value = body[key];
    if (typeof value === "string" && key !== "file") {
      formData.append(key, value);
    } else {
      // formData.append(key, value);
    }
  }

  return formData;
}

export const fetchCSRF = async () => {
  return await guidedRequest("csrf/", {
    method: "GET",
  });
};

export async function guidedRequest<T>(
  endpoint: string,
  options: {
    method: "GET" | "POST" | "PATCH" | "DELETE";
    body?: any;
    itemId?: number | string;
    params?: string;
  },
  customURL?: string,
  hasNoCredentials?: boolean
): Promise<{ details: any; ok: boolean; data: T | null }> {
  const input = new URLSearchParams(options.params);
  const filtered = new URLSearchParams();

  for (const [key, value] of input.entries()) {
    if (value.trim()) filtered.append(key, value);
  }

  let url = customURL ? `${customURL}/${endpoint}` : `${hostURL}/${endpoint}`;
  if (options.itemId) url += `${options.itemId}/`;
  if (options.params) url += `?${filtered.toString()}`;

  const preparedBody = options.body ? autoFormData(options.body) : undefined;
  const isFormData = preparedBody instanceof FormData;

  const token = await AsyncStorage.getItem("token");

  const headers: Record<string, string> = {
    "ngrok-skip-browser-warning": "any",
    "X-From-Mobile": "true",
    Authorization: `Token ${token}`,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  } else {
    headers["Content-Type"] = "multipart/form-data";
  }

  if (preparedBody && "_parts" in preparedBody) {
    for (let [key, value] of preparedBody["_parts"]) {
      console.log(`${key}:`, value);
    }
  }

  const response = await fetch(url, {
    method: options.method,
    credentials: hasNoCredentials ? undefined : "include",
    body: preparedBody
      ? isFormData
        ? preparedBody
        : JSON.stringify(preparedBody)
      : undefined,
    headers,
  });

  if (!response.ok) {
    const msg = await response.json();
    return { details: msg, ok: false, data: null };
  }

  try {
    if (options.method === "DELETE") {
      return { details: "", ok: true, data: null };
    }
    const json: T = await response.json();
    return { details: "", ok: true, data: json };
  } catch (error) {
    console.error("Parsing Error", error, await response.json());
    return { details: "Parsing Error", ok: false, data: null };
  }
}

export async function fetchItemsRequest<T>(
  endpoint: string,
  params?: string
): Promise<{
  details: any;
  ok: boolean;
  data: T[] | null;
  pageDetails?: Omit<PaginatedResponse<T>, "results">;
}> {
  const result = await guidedRequest<{
    results: T[];
    count: number;
    next: string | null;
    previous: string | null;
    currentPage: number;
    totalPages: number;
    ids: number[];
  }>(endpoint, { method: "GET", params: params });

  if (!result.ok || !result.data) return { ...result, data: null };

  const { results, ...pageDetails } = result.data;

  return { details: "", ok: true, data: results, pageDetails };
}

export async function postItemRequest<T>(
  endpoint: string,
  body?: T,
  hasNoCredentials?: boolean
) {
  return await guidedRequest<T>(
    endpoint,
    {
      method: "POST",
      body: body,
    },
    undefined,
    hasNoCredentials
  );
}

export async function updateItemRequest<T>(
  endpoint: string,
  itemId: number | string,
  body: T
) {
  return await guidedRequest<T>(endpoint, {
    method: "PATCH",
    body: body,
    itemId: itemId,
  });
}

export async function deleteItemRequest(
  endpoint: string,
  itemId: number | string
) {
  return await guidedRequest(endpoint, {
    method: "DELETE",
    itemId: itemId,
  });
}
