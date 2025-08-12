import { supabase } from "./supabaseClient";

export async function checkProductExists(id: number) {
  const { data } = await supabase
    .from("products")
    .select("id")
    .eq("id", id)
    .maybeSingle();
  if (data) {
    return true;
  } else {
    return false;
  }
}
