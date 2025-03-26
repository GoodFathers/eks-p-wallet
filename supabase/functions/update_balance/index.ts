// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.com/manual/runtime/manual/integrations/bundlers

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    // Get the session of the authenticated user
    const {
      data: { session },
      error: sessionError,
    } = await supabaseClient.auth.getSession();
    if (sessionError || !session) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized",
          message: "User not authenticated",
        }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const userId = session.user.id;

    // Get the current balance
    const { data: balance, error: balanceError } = await supabaseClient
      .from("balances")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (balanceError && balanceError.code !== "PGRST116") {
      return new Response(JSON.stringify({ error: balanceError.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // If no balance record exists, create one with default values
    if (!balance) {
      const { data: newBalance, error: createError } = await supabaseClient
        .from("balances")
        .insert({
          user_id: userId,
          locked_balance: 1500000, // Default values
          automatic_balance: 275000,
          growth_rate: 3.1731,
        })
        .select()
        .single();

      if (createError) {
        return new Response(JSON.stringify({ error: createError.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ data: newBalance }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Calculate the new automatic balance based on the growth rate
    const now = new Date();
    const lastUpdated = new Date(balance.last_updated);
    const secondsElapsed = (now.getTime() - lastUpdated.getTime()) / 1000;
    const growthAmount = secondsElapsed * balance.growth_rate;
    const newAutomaticBalance = balance.automatic_balance + growthAmount;

    // Update the balance
    const { data: updatedBalance, error: updateError } = await supabaseClient
      .from("balances")
      .update({
        automatic_balance: newAutomaticBalance,
        last_updated: now.toISOString(),
        updated_at: now.toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (updateError) {
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ data: updatedBalance }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
