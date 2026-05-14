import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { programs } from "~/data/programs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { programId: string; token: string };
    const { programId, token } = body;

    if (!programId || !token) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create client using the user's token so RLS policies pass
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    // Check if program exists
    const program = programs.find(p => p.id === programId);
    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    const amount = programId === 'fsd' ? 4999 : 5999;

    // Insert payment
    const { error: paymentError } = await supabase.from("payments").insert([{
      user_id: userId,
      program_id: programId,
      amount: amount,
      status: "success",
    }]);

    if (paymentError) {
      console.error("Payment insert error (this may happen if RLS is not configured for payments table or it is missing):", paymentError);
      // We do NOT return 500 here. We want to ensure the user gets access to their program regardless of payment log failure.
    }

    // Update the user's profile to reflect this program
    try {
      const fullTitle = `${program.title} ${program.titleHighlight}`.trim();
      const { error: profileError } = await supabase.from("profiles")
        .update({ program_id: program.id, program: fullTitle })
        .eq("id", userId);
        
      if (profileError) {
         console.error("Profile update error:", profileError);
         return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
      }
    } catch (e) {
      console.warn("Could not update profile immediately.", e);
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Enrollment error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
