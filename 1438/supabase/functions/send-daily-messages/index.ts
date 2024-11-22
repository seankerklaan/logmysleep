import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from '@supabase/supabase-js';
import { dailyMessages } from '../../../src/data/dailyMessages.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get all active users in the challenge
    const { data: activeUsers, error: userError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('status', 'active')
      .eq('settings->smsReminders', true);

    if (userError) throw userError;

    const twilioClient = {
      accountSid: Deno.env.get('TWILIO_ACCOUNT_SID'),
      authToken: Deno.env.get('TWILIO_AUTH_TOKEN'),
      phoneNumber: Deno.env.get('TWILIO_PHONE_NUMBER'),
    };

    for (const user of activeUsers) {
      if (!user.phone) continue;

      // Get user's challenge progress
      const { data: progress } = await supabaseClient
        .from('sleep_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      const currentDay = progress?.[0]?.day || 1;
      if (currentDay > 14) continue;

      const message = dailyMessages[currentDay - 1];
      if (!message) continue;

      // Send SMS via Twilio
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${twilioClient.accountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`${twilioClient.accountSid}:${twilioClient.authToken}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            To: user.phone,
            From: twilioClient.phoneNumber,
            Body: message.message,
          }),
        }
      );

      if (!response.ok) {
        console.error(`Failed to send SMS to ${user.phone}`);
        continue;
      }

      // Award badge
      await supabaseClient
        .from('user_badges')
        .upsert({
          user_id: user.id,
          badge_name: message.badge.name,
          badge_description: message.badge.description,
          badge_icon: message.badge.icon,
          day_earned: currentDay,
          earned_at: new Date().toISOString(),
        });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});