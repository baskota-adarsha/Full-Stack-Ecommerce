import { supabase } from "./supabaseClient";

async function testConnection() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .limit(5);

  if (error) {
    console.log("Failed to connect to the databse", error.message);
  } else {
    console.log("Successfully connected to the database", data);
  }
}

testConnection();
