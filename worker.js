// Cloudflare Worker para proteger la API Key de Groq
export default {
  async fetch(request, env) {
    // Configurar CORS para permitir requests desde tu dominio
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*', // Cambia '*' por tu dominio en producción
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Manejar preflight request
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Solo aceptar POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405,
        headers: corsHeaders 
      });
    }

    try {
      // Obtener el body del request
      const body = await request.json();

      // Llamar a la API de Groq con la key segura desde las variables de entorno
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.GROQ_API_KEY}` // La key está en las variables de entorno
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      // Retornar la respuesta de Groq
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });

    } catch (error) {
      return new Response(JSON.stringify({ 
        error: { message: 'Error en el servidor' } 
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }
};
