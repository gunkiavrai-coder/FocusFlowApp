import Anthropic from "npm:@anthropic-ai/sdk";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const vibeDescriptions: Record<number, string> = {
  1: "complètement épuisé, énergie minimale",
  2: "fatigué, énergie basse",
  3: "état neutre, énergie moyenne",
  4: "en forme, bonne énergie",
  5: "au top, énergie maximale",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { vibeLevel, tasks, context } = await req.json();

    if (!tasks || tasks.length === 0) {
      return new Response(
        JSON.stringify({ error: "Aucune tâche à planifier" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const client = new Anthropic({
      apiKey: Deno.env.get("ANTHROPIC_API_KEY")!,
    });

    const taskList = tasks
      .map(
        (t: { id: string; title: string; description?: string; energyCost?: number }, i: number) =>
          `${i + 1}. [ID: ${t.id}] ${t.title}${t.description ? ` — ${t.description}` : ""}${t.energyCost ? ` (énergie requise: ${t.energyCost}/5)` : ""}`
      )
      .join("\n");

    const prompt = `Tu es un expert en productivité pour freelances, spécialisé dans la méthode Deep Work de Cal Newport.

L'utilisateur a ${tasks.length} tâche(s) à planifier aujourd'hui.
Niveau d'énergie actuel : ${vibeLevel}/5 (${vibeDescriptions[vibeLevel] ?? "inconnu"}).
${context ? `Contexte : ${context}` : ""}

Tâches :
${taskList}

Génère un planning optimal en JSON strict avec cette structure :
{
  "deepWork": ["id1", "id2"],
  "shallowWork": ["id3"],
  "schedule": [
    {
      "taskId": "uuid-ou-break",
      "startTime": "09:00",
      "duration": 90,
      "type": "deep"
    }
  ],
  "advice": "Un conseil court et actionnable adapté au niveau d'énergie"
}

Règles absolues :
- Énergie 1-2 : commence par shallow work, max 1 session deep de 45min, beaucoup de pauses
- Énergie 3 : équilibre shallow puis deep, sessions de 60-90min
- Énergie 4-5 : deep work en premier (9h-13h), sessions de 90-120min, shallow l'après-midi
- Insère une pause de 15min (type "break", taskId "break") toutes les 90min de travail intense
- Horaires réalistes entre 9h et 18h
- Réponds UNIQUEMENT avec le JSON valide, aucun texte autour`;

    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type");

    const planOutput = JSON.parse(content.text);

    return new Response(JSON.stringify(planOutput), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
