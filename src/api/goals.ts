// import { apiFetch } from "@/api/client";

// export type GoalTargetType = "profit" | "risk" | "order" | "learning";

// export type Goal = {
//   id: string;
//   title: string;
//   progress: number;
//   target_type: GoalTargetType;
//   target_value: number;
//   deadline: string;
// };

// export type GoalInput = {
//   title: string;
//   target_type: GoalTargetType;
//   target_value: number;
//   deadline: string;
// };

// type RawGoal = {
//   id?: string | number;
//   title?: string;
//   progress?: number;
//   target_type?: string;
//   target_value?: number;
//   deadline?: string;
// };

// function asList(payload: unknown): RawGoal[] {
//   if (Array.isArray(payload)) return payload as RawGoal[];
//   if (!payload || typeof payload !== "object") return [];

//   const data = payload as Record<string, unknown>;
//   if (Array.isArray(data.results)) return data.results as RawGoal[];
//   if (Array.isArray(data.data)) return data.data as RawGoal[];
//   if (Array.isArray(data.goals)) return data.goals as RawGoal[];
//   if ("title" in data || "id" in data) return [data as RawGoal];
//   return [];
// }

// function normalizeGoal(raw: RawGoal, index = 0): Goal {
//   return {
//     id: String(raw.id ?? index + 1),
//     title: raw.title ?? "بدون عنوان",
//     progress: Number(raw.progress ?? 0),
//     target_type: (raw.target_type as GoalTargetType) ?? "profit",
//     target_value: Number(raw.target_value ?? 0),
//     deadline: raw.deadline ?? "",
//   };
// }

// export async function listGoals(): Promise<Goal[]> {
//   const payload = await apiFetch<unknown>("/app/goal/");
//   return asList(payload).map(normalizeGoal);
// }

// export async function addGoal(input: GoalInput): Promise<Goal> {
//   const payload = await apiFetch<unknown>("/app/goal/add/", {
//     method: "POST",
//     body: JSON.stringify(input),
//   });

//   const [created] = asList(payload).map(normalizeGoal);
//   return (
//     created ?? {
//       id: crypto.randomUUID(),
//       progress: 0,
//       ...input,
//     }
//   );
// }

// export async function editGoal(id: string, input: GoalInput): Promise<Goal> {
//   const payload = await apiFetch<unknown>(`/app/goal/edit/${id}/`, {
//     method: "POST",
//     body: JSON.stringify(input),
//   });

//   const [updated] = asList(payload).map((item) => normalizeGoal(item));
//   return updated ?? { id, progress: 0, ...input };
// }

// export async function deleteGoal(id: string): Promise<void> {
//   await apiFetch<void>(`/app/goal/delete/${id}/`, {
//     method: "DELETE",
//   });
// }


import { apiFetch } from "@/api/client";

export type GoalTargetType =
  | "profit"
  | "risk"
  | "order"
  | "learning";

export type Goal = {
  id: string;
  title: string;
  progress: number;
  target_type: GoalTargetType;
  target_value: number;
  deadline: string;
};

export type GoalInput = {
  title: string;
  target_type: GoalTargetType;
  target_value: number;
  deadline: string;
};

type RawGoal = {
  id?: string | number;
  title?: string;
  progress?: number | string;
  target_type?: string;
  target_value?: number | string;
  deadline?: string;
};

function asList(
  payload: unknown,
): RawGoal[] {
  if (Array.isArray(payload)) {
    return payload as RawGoal[];
  }

  if (
    !payload ||
    typeof payload !== "object"
  ) {
    return [];
  }

  const data =
    payload as Record<
      string,
      unknown
    >;

  if (Array.isArray(data.results)) {
    return data.results as RawGoal[];
  }

  if (Array.isArray(data.data)) {
    return data.data as RawGoal[];
  }

  if (Array.isArray(data.goals)) {
    return data.goals as RawGoal[];
  }

  if (
    "title" in data ||
    "id" in data
  ) {
    return [data as RawGoal];
  }

  return [];
}

function normalizeGoal(
  raw: RawGoal,
  index = 0,
): Goal {
  const targetType =
    [
      "profit",
      "risk",
      "order",
      "learning",
    ].includes(
      String(raw.target_type),
    )
      ? (raw.target_type as GoalTargetType)
      : "profit";

  return {
    id: String(
      raw.id ??
        index + 1,
    ),

    title:
      typeof raw.title ===
      "string"
        ? raw.title
        : "بدون عنوان",

    progress: Number(
      raw.progress ?? 0,
    ),

    target_type:
      targetType,

    target_value: Number(
      raw.target_value ?? 0,
    ),

    deadline:
      typeof raw.deadline ===
      "string"
        ? raw.deadline
        : "",
  };
}

export async function listGoals(): Promise<Goal[]> {
  const payload =
    await apiFetch<unknown>(
      "/app/goal/",
    );

  return asList(
    payload,
  ).map(
    normalizeGoal,
  );
}

export async function addGoal(
  input: GoalInput,
): Promise<Goal> {
  const payload =
    await apiFetch<unknown>(
      "/app/goal/add/",
      {
        method: "POST",
        body: JSON.stringify(
          input,
        ),
      },
    );

  const [created] =
    asList(payload).map(
      normalizeGoal,
    );

  return (
    created ?? {
      id: crypto.randomUUID(),
      progress: 0,
      ...input,
    }
  );
}

export async function editGoal(
  id: string,
  input: GoalInput,
): Promise<Goal> {
  const payload =
    await apiFetch<unknown>(
      `/app/goal/edit/${id}/`,
      {
        method: "POST",
        body: JSON.stringify(
          input,
        ),
      },
    );

  const [updated] =
    asList(payload).map(
      normalizeGoal,
    );

  return (
    updated ?? {
      id,
      progress: 0,
      ...input,
    }
  );
}

export async function deleteGoal(
  id: string,
): Promise<void> {
  await apiFetch<void>(
    `/app/goal/delete/${id}/`,
    {
      method: "DELETE",
    },
  );
}
