import { apiFetch } from "@/api/client";

export type CurrentPlan = {
  id: number;
  user: number;
  type: number;
  type_name: string;
  start_date: string;
  end_date: string | null;
};

export type Plan = {
  id: number;
  name: string;
  price: number;
};

type CurrentPlanResponse = {
  plan: CurrentPlan;
};

type PlansResponse = {
  plans: Plan[];
};

/**
 * دریافت اشتراک فعلی کاربر
 */
export async function getCurrentPlan(): Promise<CurrentPlan> {
  const response = await apiFetch<CurrentPlanResponse>(
    "/app/settings/plan/",
  );

  return response.plan;
}

/**
 * دریافت لیست پلن‌های قابل خرید
 */
export async function getPlans(): Promise<Plan[]> {
  const response = await apiFetch<PlansResponse>(
    "/app/settings/plans/",
  );

  return response.plans;
}