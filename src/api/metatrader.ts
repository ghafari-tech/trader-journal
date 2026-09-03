import { apiFetch } from "@/api/client";

export type MetaTraderStatus = {
  connected: boolean;
  platform: string;
  server: string;
  account_number: string;
  api_key: string;
};

export async function getMetaTraderStatus(): Promise<MetaTraderStatus> {
  return apiFetch<MetaTraderStatus>(
    "/app/settings/mt-status/",
    {
      method: "GET",
    },
  );
}