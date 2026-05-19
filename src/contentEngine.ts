export type PlatformKey = 'instagram' | 'tiktok' | 'linkedin' | 'twitter';

export interface PlanInput {
  clientName: string;
  industry: string;
  audience: string;
  tone: string;
  goal: string;
  platforms: PlatformKey[];
  postsPerWeek: number;
}

export interface PostPlan {
  type: string;
  theme: string;
  idea: string;
  captionPrompt: string;
  cta?: string;
}

export interface PlatformPlan {
  platform: PlatformKey;
  label: string;
  posts: PostPlan[];
}

export interface GeneratedPlan {
  summary: string;
  platforms: PlatformPlan[];
}

const platformLabels: Record<PlatformKey, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
  twitter: 'Twitter / X',
};

const basePostPatterns: { type: string; theme: string }[] = [
  { type: 'Educational carousel / thread', theme: 'Teach a key concept or framework' },
  { type: 'Behind-the-scenes / story', theme: 'Humanise the brand with a real story' },
  { type: 'Social proof', theme: 'Client results, testimonials, or case studies' },
  { type: 'Myth-busting', theme: 'Address common objections or misconceptions' },
  { type: 'Lead magnet / CTA', theme: 'Drive people towards a next step' },
  { type: 'Short-form tip', theme: 'Quick, snackable insight or hack' },
];

function buildCaptionPrompt(
  input: PlanInput,
  platform: PlatformKey,
  pattern: { type: string; theme: string },
): string {
  const base = `Write a ${pattern.type.toLowerCase()} for ${input.clientName}, a brand in the ${input.industry} space.`;

  const audiencePart = ` The ideal audience is ${input.audience}.`;
  const goalPart = ` The main goal is: ${input.goal}.`;
  const tonePart = ` Use a tone that is ${input.tone}.`;

  const platformExtras: Record<PlatformKey, string> = {
    instagram:
      ' Optimise for Instagram: strong hook in the first line, short paragraphs, and line breaks. Include 3–5 relevant hashtags at the end.',
    tiktok:
      ' Optimise for TikTok: this is a short video script. Open with a bold hook in the first 2 seconds, keep sentences punchy, and end with a clear spoken call to action.',
    linkedin:
      ' Optimise for LinkedIn: write as a concise but thoughtful post. Strong first line, clear structure with line breaks, and focus on insight rather than hype.',
    twitter:
      ' Optimise for Twitter / X: write this as a concise tweet (or short thread if needed). Prioritise clarity and scannability over long explanations.',
  };

  const themePart = ` Center the content around this angle: "${pattern.theme}".`;

  return `${base}${audiencePart}${goalPart}${themePart}${tonePart}${platformExtras[platform]}`;
}

function buildCta(goal: string): string {
  if (!goal) return '';

  const lower = goal.toLowerCase();
  if (lower.includes('enquiry') || lower.includes('book') || lower.includes('call')) {
    return 'Invite people to DM or click the link to book a call or ask a question.';
  }
  if (lower.includes('newsletter') || lower.includes('email')) {
    return 'Encourage people to join the email list for deeper, exclusive content.';
  }
  if (lower.includes('awareness') || lower.includes('engagement')) {
    return 'Ask people to save the post, share it with someone who needs it, or comment with their situation.';
  }
  if (lower.includes('sales') || lower.includes('buy') || lower.includes('customers')) {
    return 'Include a gentle but clear nudge to check out the offer and explain who it is perfect for.';
  }
  return 'Use a clear but low-pressure call to action that matches the brand and post type.';
}

export function generateContentPlan(input: PlanInput): GeneratedPlan {
  const effectivePlatforms = input.platforms.length ? input.platforms : (['instagram'] as PlatformKey[]);
  const postsPerPlatform = Math.max(1, Math.min(14, input.postsPerWeek || 3));

  const platforms: PlatformPlan[] = effectivePlatforms.map((platform) => {
    const posts: PostPlan[] = [];
    const cta = buildCta(input.goal);

    for (let i = 0; i < postsPerPlatform; i += 1) {
      const pattern = basePostPatterns[i % basePostPatterns.length];

      posts.push({
        type: pattern.type,
        theme: pattern.theme,
        idea: `Angle this post specifically for ${input.audience || 'your ideal audience'} within the ${input.industry} space, making it feel tailored to ${input.clientName}.`,
        captionPrompt: buildCaptionPrompt(input, platform, pattern),
        cta: cta || undefined,
      });
    }

    return {
      platform,
      label: platformLabels[platform],
      posts,
    };
  });

  const summary = `Weekly plan for ${input.clientName} across ${effectivePlatforms
    .map((p) => platformLabels[p])
    .join(', ')}. The focus is to "${input.goal}" while speaking to ${input.audience ||
    'the ideal audience'} in a ${input.tone} voice. Use the prompts below directly in your AI tool, or as a brief when writing manually.`;

  return { summary, platforms };
}

