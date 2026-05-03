import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

async function callAdminApi(action: string, password: string, params: Record<string, any> = {}) {
  const response = await supabase.functions.invoke("admin-api", {
    body: { action, password, ...params },
  });

  if (response.error) {
    throw new Error(response.error.message || "Erro na API admin");
  }

  const result = response.data;
  if (result?.error) {
    throw new Error(result.error);
  }

  return result?.data;
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  try {
    const result = await callAdminApi("verify_password", password);
    return result?.valid === true;
  } catch {
    return false;
  }
}

export async function fetchTransactions(password: string, filter: "pending" | "all") {
  return callAdminApi("get_transactions", password, { filter });
}

export async function updateTransactionStatus(password: string, id: string, status: "confirmed" | "rejected") {
  return callAdminApi("update_transaction", password, { id, status });
}

export async function fetchComplaints(password: string) {
  return callAdminApi("get_complaints", password);
}

export async function updateComplaintStatus(password: string, id: string, status: string) {
  return callAdminApi("update_complaint", password, { id, status });
}

export async function fetchPixLeads(password: string) {
  return callAdminApi("get_pix_leads", password);
}

export async function checkPixStatus(password: string, transactionId: string) {
  return callAdminApi("check_pix_status", password, { transaction_id: transactionId });
}

export async function changeAdminPassword(currentPassword: string, newPassword: string) {
  return callAdminApi("change_password", currentPassword, { new_password: newPassword });
}

export async function getActiveGateway(password: string): Promise<string> {
  const result = await callAdminApi("get_active_gateway", password);
  return result?.gateway || "blackcat";
}

export async function setActiveGateway(password: string, gateway: string) {
  return callAdminApi("set_active_gateway", password, { gateway });
}
