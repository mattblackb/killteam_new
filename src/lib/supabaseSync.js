import { hasSupabaseConfig, supabase } from "./supabaseClient";

const SESSION_TABLE = "kt_sessions";
const SESSION_ARMIES_TABLE = "kt_session_armies";
const SESSION_STATE_TABLE = "kt_session_state";

function requireClient() {
  if (!hasSupabaseConfig || !supabase) {
    throw new Error("Supabase environment is not configured.");
  }
  return supabase;
}

export function supabaseConfigured() {
  return hasSupabaseConfig;
}

export async function ensureSession({ code, hostCode }) {
  const client = requireClient();

  const { error } = await client
    .from(SESSION_TABLE)
    .upsert(
      {
        code,
        host_code: hostCode,
        status: "waiting",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "code" }
    );

  if (error) {
    throw new Error(error.message || "Could not create session.");
  }
}

export async function verifySession(code) {
  const client = requireClient();

  const { data, error } = await client
    .from(SESSION_TABLE)
    .select("code")
    .eq("code", code)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Could not verify session.");
  }

  return Boolean(data?.code);
}

export async function publishArmyToSession({ sessionCode, ownerCode, ownerName, army }) {
  const client = requireClient();

  const payload = {
    session_code: sessionCode,
    owner_code: ownerCode,
    owner_name: ownerName,
    army_name: army.armyName,
    army_type_name: army.armyTypeName,
    army_payload: army,
    updated_at: new Date().toISOString(),
  };

  const { error } = await client
    .from(SESSION_ARMIES_TABLE)
    .upsert(payload, { onConflict: "session_code,owner_code" });

  if (error) {
    throw new Error(error.message || "Could not publish army.");
  }
}

export async function fetchSessionArmies(sessionCode) {
  const client = requireClient();

  const { data, error } = await client
    .from(SESSION_ARMIES_TABLE)
    .select("id, session_code, owner_code, owner_name, army_name, army_type_name, army_payload, updated_at")
    .eq("session_code", sessionCode)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Could not load session armies.");
  }

  return Array.isArray(data) ? data : [];
}

export function subscribeToSessionArmies(sessionCode, onChange) {
  const client = requireClient();

  const channel = client
    .channel(`session-armies-${sessionCode}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: SESSION_ARMIES_TABLE,
        filter: `session_code=eq.${sessionCode}`,
      },
      () => {
        onChange();
      }
    )
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
}

export async function publishSessionBattleState({ sessionCode, battleState, updatedBy }) {
  const client = requireClient();

  const { error } = await client
    .from(SESSION_STATE_TABLE)
    .upsert(
      {
        session_code: sessionCode,
        battle_state: battleState,
        updated_by: updatedBy,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "session_code" }
    );

  if (error) {
    throw new Error(error.message || "Could not publish battle state.");
  }
}

export async function fetchSessionBattleState(sessionCode) {
  const client = requireClient();

  const { data, error } = await client
    .from(SESSION_STATE_TABLE)
    .select("session_code, battle_state, updated_by, updated_at")
    .eq("session_code", sessionCode)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Could not fetch battle state.");
  }

  return data || null;
}

export function subscribeToSessionBattleState(sessionCode, onChange) {
  const client = requireClient();

  const channel = client
    .channel(`session-battle-${sessionCode}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: SESSION_STATE_TABLE,
        filter: `session_code=eq.${sessionCode}`,
      },
      () => {
        onChange();
      }
    )
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
}
