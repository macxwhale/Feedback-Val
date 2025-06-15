
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // This is a placeholder webhook.
  // The full logic for processing incoming SMS will be implemented next.
  console.log('SMS Webhook received a request');

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const webhookSecret = url.pathname.split('/').pop();
    
    if(!webhookSecret) {
      console.warn("Webhook called without secret.");
    } else {
      console.log(`Webhook called for secret: ${webhookSecret}`);
    }
    
    const body = await req.text(); // Africa's Talking sends form-urlencoded data
    console.log("Webhook payload:", body);

    // Placeholder USSD-style response for testing with Africa's Talking simulator
    const responsePayload = `CON Welcome to our feedback service.
1. Start Survey
2. Exit`;

    return new Response(responsePayload, {
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in handle-sms-webhook:', error);
    return new Response('An error occurred.', {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
    });
  }
})
