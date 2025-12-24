import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DemoUser {
  email: string;
  password: string;
  fullName: string;
  role: 'user' | 'admin' | 'finance' | 'boss' | 'maintainer';
  department: 'kitchen' | 'front_of_house' | 'management' | 'finance' | 'it';
  position: string;
}

const demoUsers: DemoUser[] = [
  {
    email: 'user@mallar.com',
    password: 'password123',
    fullName: 'Ahmad Waiter',
    role: 'user',
    department: 'front_of_house',
    position: 'Waiter',
  },
  {
    email: 'admin@mallar.com',
    password: 'password123',
    fullName: 'Sarah HR Manager',
    role: 'admin',
    department: 'management',
    position: 'HR Manager',
  },
  {
    email: 'finance@mallar.com',
    password: 'password123',
    fullName: 'David Finance',
    role: 'finance',
    department: 'finance',
    position: 'Finance Manager',
  },
  {
    email: 'boss@mallar.com',
    password: 'password123',
    fullName: 'Tan Sri Owner',
    role: 'boss',
    department: 'management',
    position: 'CEO',
  },
  {
    email: 'maintainer@mallar.com',
    password: 'password123',
    fullName: 'Tech Admin',
    role: 'maintainer',
    department: 'it',
    position: 'System Administrator',
  },
];

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting demo user seeding...');

    // Create admin client with service role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const results: { email: string; status: string; error?: string }[] = [];

    for (const demoUser of demoUsers) {
      console.log(`Processing user: ${demoUser.email}`);

      try {
        // Check if user already exists
        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = existingUsers?.users?.find(u => u.email === demoUser.email);

        let userId: string;

        if (existingUser) {
          console.log(`User ${demoUser.email} already exists, updating role...`);
          userId = existingUser.id;
          results.push({ email: demoUser.email, status: 'exists, updating role' });
        } else {
          // Create new user
          const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: demoUser.email,
            password: demoUser.password,
            email_confirm: true,
            user_metadata: {
              full_name: demoUser.fullName,
            },
          });

          if (createError) {
            console.error(`Error creating user ${demoUser.email}:`, createError);
            results.push({ email: demoUser.email, status: 'error', error: createError.message });
            continue;
          }

          userId = newUser.user.id;
          console.log(`Created user ${demoUser.email} with ID: ${userId}`);
          results.push({ email: demoUser.email, status: 'created' });
        }

        // Update role (upsert to handle both new and existing)
        const { error: roleError } = await supabaseAdmin
          .from('user_roles')
          .upsert(
            { user_id: userId, role: demoUser.role },
            { onConflict: 'user_id,role' }
          );

        if (roleError) {
          console.error(`Error updating role for ${demoUser.email}:`, roleError);
          // Try delete then insert approach
          await supabaseAdmin.from('user_roles').delete().eq('user_id', userId);
          await supabaseAdmin.from('user_roles').insert({ user_id: userId, role: demoUser.role });
        }

        // Update profile
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .update({
            full_name: demoUser.fullName,
            department: demoUser.department,
            position: demoUser.position,
            salary: demoUser.role === 'boss' ? 15000 : demoUser.role === 'admin' ? 8000 : 3500,
          })
          .eq('user_id', userId);

        if (profileError) {
          console.error(`Error updating profile for ${demoUser.email}:`, profileError);
        }

      } catch (userError) {
        console.error(`Error processing user ${demoUser.email}:`, userError);
        results.push({ 
          email: demoUser.email, 
          status: 'error', 
          error: userError instanceof Error ? userError.message : 'Unknown error' 
        });
      }
    }

    console.log('Demo user seeding completed:', results);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Demo users seeded successfully',
        results 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in seed-demo-users:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
