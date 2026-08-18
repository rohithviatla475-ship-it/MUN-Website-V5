import { createClient } from "npm:@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const COMMITTEE_NAMES: Record<string, string> = {
  unhrc: "UN Human Rights Council (UNHRC)",
  unsc: "UN Security Council (UNSC)",
  unep: "UN Environment Programme (UNEP)",
  disec: "UN General Assembly — DISEC",
  who: "World Health Organization (WHO)",
  aippm: "All India Political Party Meet (AIPPM)",
  ip: "International Press (IP)",
};

interface Registration {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  institution: string;
  delegate_type: string;
  experience: string | null;
  preference_1: string;
  preference_2: string;
  preference_3: string;
  created_at: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const googleSheetsWebhookUrl = Deno.env.get("GOOGLE_SHEETS_WEBHOOK_URL");

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;

    const registrations = (data || []) as Registration[];

    const ambitusStudents = registrations.filter(
      (r) => r.delegate_type === "ambitus_student"
    );
    const externalDelegates = registrations.filter(
      (r) => r.delegate_type === "external_delegate"
    );

    const rowFor = (r: Registration) => ({
      "Full Name": r.full_name,
      "Email": r.email,
      "Phone": r.phone,
      "Institution": r.institution,
      "Experience": r.experience || "",
      "Preference 1": COMMITTEE_NAMES[r.preference_1] || r.preference_1,
      "Preference 2": COMMITTEE_NAMES[r.preference_2] || r.preference_2,
      "Preference 3": COMMITTEE_NAMES[r.preference_3] || r.preference_3,
      "Registered At": new Date(r.created_at).toISOString(),
    });

    const result: Record<string, unknown> = {
      total_registrations: registrations.length,
      ambitus_students: ambitusStudents.length,
      external_delegates: externalDelegates.length,
    };

    if (googleSheetsWebhookUrl) {
      const sheetsResponse = await fetch(googleSheetsWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ambitus_students: ambitusStudents.map(rowFor),
          external_delegates: externalDelegates.map(rowFor),
        }),
      });

      result["sheets_synced"] = sheetsResponse.ok;
      if (!sheetsResponse.ok) {
        result["sheets_error"] = `HTTP ${sheetsResponse.status}`;
      }
    } else {
      result["sheets_synced"] = false;
      result["sheets_error"] = "GOOGLE_SHEETS_WEBHOOK_URL not configured";
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
