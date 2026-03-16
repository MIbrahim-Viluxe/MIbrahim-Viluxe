import { supabase } from "./lib/supabase.ts";

async function test() {
    try {
        const { data, error } = await supabase.from("projects").select("*").limit(1);
        if (data && data.length > 0) {
            console.log("Columns:", Object.keys(data[0]));
        } else {
            console.log("No data found or error:", error);
        }
    } catch (e) {
        console.error("Catch error:", e);
    }
}
test();
