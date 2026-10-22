import type { Post } from "@/lib/posts";

export interface TopicSuggestion {
  category: string;
  topic: string;
  tags: string[];
  accent: string;
}

export const TOPIC_PRESETS: TopicSuggestion[] = [
  {
    category: "Android / Kotlin",
    topic: "Building Resilient Offline-First Mobile Architectures with Kotlin Coroutines and Room",
    tags: ["Android", "Kotlin", "Room DB", "Coroutines", "Offline-First"],
    accent: "#38bdf8",
  },
  {
    category: "Flutter / Architecture",
    topic: "Architecting Large-Scale Flutter Applications with Clean Architecture and BLoC",
    tags: ["Flutter", "Dart", "BLoC", "Clean Architecture", "State Management"],
    accent: "#22d3ee",
  },
  {
    category: "Mobile AI & Productivity",
    topic: "Practical On-Device AI in Android: Integrating Small Language Models with LiteRT and MediaPipe",
    tags: ["Android", "AI", "LiteRT", "MediaPipe", "On-Device ML"],
    accent: "#e1ff00",
  },
  {
    category: "Android / Jetpack Compose",
    topic: "Mastering SubcomposeLayout and Custom Layout Modifiers in Jetpack Compose",
    tags: ["Android", "Jetpack Compose", "UI Architecture", "Kotlin", "Performance"],
    accent: "#10b981",
  },
  {
    category: "Flutter / Dart",
    topic: "Dart 3 in Production: Leveraging Sealed Classes, Pattern Matching, and Records for Bulletproof State",
    tags: ["Dart", "Flutter", "Type Safety", "Functional Programming", "Records"],
    accent: "#818cf8",
  },
  {
    category: "Networking & Resiliency",
    topic: "Advanced Retrofit and Ktor Patterns: Token Refresh, Retry Interceptors, and Flow Streaming",
    tags: ["Android", "Retrofit", "Ktor", "Networking", "REST APIs"],
    accent: "#f59e0b",
  },
  {
    category: "Performance & Profiling",
    topic: "Hunting Frame Drops: Practical Android Performance Profiling with Perfetto and Baseline Profiles",
    tags: ["Android", "Performance", "Perfetto", "Systrace", "Jank Profiling"],
    accent: "#ec4899",
  },
  {
    category: "Hardware & POS Integration",
    topic: "Architecting Kiosk and POS Integrations in Android: Bluetooth Thermal Printers and Lock Task Mode",
    tags: ["Android", "POS", "Hardware", "Bluetooth", "Kiosk Mode"],
    accent: "#06b6d4",
  },
  {
    category: "Testing & CI/CD",
    topic: "Automating Mobile Regression: Unit, Integration, and Maestro E2E Flows in GitHub Actions",
    tags: ["Testing", "Android", "Flutter", "CI/CD", "Maestro"],
    accent: "#a855f7",
  },
];

export async function generateArticleWithGemini({
  apiKey,
  topic,
  category,
  accent,
  existingSlugs = [],
}: {
  apiKey: string;
  topic: string;
  category: string;
  accent: string;
  existingSlugs?: string[];
}): Promise<Post> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey.trim()}`;

  const systemInstruction = `You are Jash Garach, a senior Android & Flutter engineer with 5+ years of production experience building high-performance mobile apps for consumer and enterprise/hospitality products.
Your writing style is calm, technical, practical, and grounded in real-world software engineering. Avoid marketing hype, buzzword stuffing, or generic filler. Always provide real, correct code snippets (in Kotlin or Dart) with clear explanations of edge cases and architectural trade-offs.

Output strictly valid JSON matching this schema:
{
  "slug": "url-friendly-slug-max-50-chars",
  "title": "Engaging, practical technical title",
  "description": "1-2 sentence compelling summary for developers",
  "category": "${category}",
  "tags": ["Tag1", "Tag2", "Tag3", "Tag4"],
  "accent": "${accent}",
  "readingTime": "5 min read",
  "blocks": [
    { "type": "paragraph", "text": "..." },
    { "type": "heading", "text": "..." },
    { "type": "code", "language": "kotlin or dart", "code": "..." },
    { "type": "list", "items": ["...", "..."] },
    { "type": "quote", "text": "..." }
  ],
  "references": [
    { "label": "Official Documentation", "href": "https://developer.android.com or https://docs.flutter.dev" }
  ]
}`;

  const userPrompt = `Topic to write about: "${topic}"
Category: "${category}"
Requirements:
- Insightful intro explaining why this matters in production.
- At least 2-3 substantive technical sections with clear headings.
- Real, well-formatted code examples (using Kotlin or Dart).
- A list of best practices and trade-offs.
- A concise, thoughtful concluding takeaway.
- 2 to 4 credible references to official documentation.
Existing slugs to avoid: ${existingSlugs.join(", ")}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemInstruction}\n\n${userPrompt}` }],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API error (HTTP ${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textResponse) {
    throw new Error("Gemini API returned an empty response");
  }

  const parsed = JSON.parse(textResponse);

  const now = new Date();
  const isoDate = now.toISOString().split("T")[0];
  const publishedLabel = now.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Generate cover image via Pollinations AI or SVG fallback
  const cleanTitle = encodeURIComponent(parsed.title.slice(0, 80));
  const coverUrl = `https://image.pollinations.ai/prompt/editorial%20minimal%20dark%20tech%20illustration%20for%20${cleanTitle}%20with%20neon%20accents%2016:9?width=1280&height=720&nologo=true&seed=42`;

  const finalPost: Post = {
    slug: parsed.slug || topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 50),
    title: parsed.title,
    description: parsed.description,
    date: isoDate,
    publishedLabel,
    readingTime: parsed.readingTime || "5 min read",
    category: parsed.category || category,
    tags: Array.isArray(parsed.tags) ? parsed.tags : ["Android", "Flutter"],
    accent: parsed.accent || accent,
    coverImage: {
      src: coverUrl,
      alt: `${parsed.title} cover illustration`,
      caption: parsed.description,
    },
    blocks: parsed.blocks || [],
    references: parsed.references || [],
  };

  return finalPost;
}
