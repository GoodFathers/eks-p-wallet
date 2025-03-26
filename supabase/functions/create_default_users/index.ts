// This function creates default users for each role

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_KEY") || "";

interface Role {
  id: string;
  name: string;
}

interface CreateUserPayload {
  email: string;
  password: string;
  full_name: string;
  role: string;
}

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    // Create Supabase client
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    // Get roles from database
    const { data: roles, error: rolesError } = await supabaseAdmin
      .from("roles")
      .select("id, name");

    if (rolesError) throw rolesError;

    // Create default users for each role
    const defaultUsers: CreateUserPayload[] = [
      {
        email: "superadmin@example.com",
        password: "SuperAdmin123!",
        full_name: "Super Administrator",
        role: "super_admin",
      },
      {
        email: "admin@example.com",
        password: "Admin123!",
        full_name: "Administrator",
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

    for (const user of defaultUsers) {
      // Find role ID
      const role = roles.find((r: Role) => r.name === user.role);
      if (!role) {
        results.push({
          email: user.email,
          status: "error",
          message: `Role ${user.role} not found`,
        });
        continue;
      }

      // Check if user already exists
      const { data: existingUsers } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("email", user.email);

      if (existingUsers && existingUsers.length > 0) {
        results.push({
          email: user.email,
          status: "skipped",
          message: "User already exists",
        });
        continue;
      }

      // Create user in auth.users
      const { data: authUser, error: createUserError } =
        await supabaseAdmin.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: {
            full_name: user.full_name,
          },
        });

      if (createUserError) {
        results.push({
          email: user.email,
          status: "error",
          message: createUserError.message,
        });
        continue;
      }

      // Create user in public.users with role
      if (authUser.user) {
        const { error: insertError } = await supabaseAdmin
          .from("users")
          .insert({
            id: authUser.user.id,
            email: user.email,
            full_name: user.full_name,
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
            role_id: role.id,
          });

        if (insertError) {
          results.push({
            email: user.email,
            status: "error",
            message: insertError.message,
          });
          continue;
        }

        results.push({
          email: user.email,
          status: "success",
          message: "User created successfully",
        });
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        status: 400,
      },
    );
  }
});

// Helper function to create Supabase client
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";
