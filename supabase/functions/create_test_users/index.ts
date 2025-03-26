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
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_KEY") ?? "",
    );

    // Get role IDs
    const { data: roles, error: rolesError } = await supabaseAdmin
      .from("roles")
      .select("id, name");

    if (rolesError) {
      return new Response(JSON.stringify({ error: rolesError.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const roleMap = {};
    roles.forEach((role) => {
      roleMap[role.name] = role.id;
    });

    // Create test users if they don't exist
    const testUsers = [
      {
        email: "superadmin@example.com",
        password: "SuperAdmin123!",
        full_name: "Super Admin",
        role: "super_admin",
      },
      {
        email: "admin@example.com",
        password: "Admin123!",
        full_name: "Admin User",
        role: "admin",
      },
      {
        email: "user@example.com",
        password: "User123!",
        full_name: "Regular User",
        role: "visitor",
      },
    ];

    const results = [];

    for (const user of testUsers) {
      // Check if user already exists
      const { data: existingUsers } =
        await supabaseAdmin.auth.admin.listUsers();
      const existingUser = existingUsers.users.find(
        (u) => u.email === user.email,
      );

      if (existingUser) {
        // Update existing user
        results.push({
          email: user.email,
          status: "exists",
          message: "User already exists",
        });
        continue;
      }

      // Create user in auth.users
      const { data: authUser, error: authError } =
        await supabaseAdmin.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: {
            full_name: user.full_name,
          },
        });

      if (authError) {
        results.push({
          email: user.email,
          status: "error",
          message: authError.message,
        });
        continue;
      }

      // Create user in public.users
      const { error: profileError } = await supabaseAdmin.from("users").insert({
        id: authUser.user.id,
        email: user.email,
        full_name: user.full_name,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
        role_id: roleMap[user.role],
      });

      if (profileError) {
        results.push({
          email: user.email,
          status: "error",
          message: profileError.message,
        });
        continue;
      }

      results.push({ email: user.email, status: "created" });
    }

    return new Response(JSON.stringify({ data: results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
