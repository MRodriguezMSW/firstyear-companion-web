// Shared data and helpers for onboarding screens

export const COMPANION_IDENTITIES = [
  {
    id: "female",
    label: "She / Her",
    icon: "🌸",
    desc: "A warm, feminine presence",
    pronouns: "she/her",
    names: ["Nova", "Luna", "Sage", "Iris", "Alma"],
    avatars: [
      { emoji: "🌙", name: "Moon" },
      { emoji: "🌸", name: "Blossom" },
      { emoji: "⭐", name: "Star" },
      { emoji: "🪷", name: "Lotus" },
      { emoji: "🌺", name: "Hibiscus" },
      { emoji: "✨", name: "Spark" },
    ],
  },
  {
    id: "male",
    label: "He / Him",
    icon: "🌊",
    desc: "A steady, grounded presence",
    pronouns: "he/him",
    names: ["Kai", "River", "Remy", "Sol", "Arlo"],
    avatars: [
      { emoji: "🌞", name: "Sun" },
      { emoji: "🌋", name: "Mountain" },
      { emoji: "⚡", name: "Lightning" },
      { emoji: "🪨", name: "Stone" },
      { emoji: "🌊", name: "Wave" },
      { emoji: "🌲", name: "Pine" },
    ],
  },
  {
    id: "neutral",
    label: "They / Them",
    icon: "🌈",
    desc: "An open, fluid presence",
    pronouns: "they/them",
    names: ["Quinn", "Ember", "Sage", "River", "Lux"],
    avatars: [
      { emoji: "🌈", name: "Rainbow" },
      { emoji: "✨", name: "Spark" },
      { emoji: "🌌", name: "Galaxy" },
      { emoji: "🌀", name: "Spiral" },
      { emoji: "💫", name: "Dizzy" },
      { emoji: "🔮", name: "Orb" },
    ],
  },
] as const;

export const AVATAR_CATEGORIES = [
  {
    id: "animals",
    label: "Animals",
    icon: "🐾",
    avatars: [
      { emoji: "🦊", name: "Fox",       desc: "Curious & clever"    },
      { emoji: "🐨", name: "Koala",     desc: "Calm & gentle"       },
      { emoji: "🦉", name: "Owl",       desc: "Wise & watchful"     },
      { emoji: "🐱", name: "Cat",       desc: "Independent & warm"  },
      { emoji: "🐻", name: "Bear",      desc: "Strong & grounding"  },
      { emoji: "🐢", name: "Turtle",    desc: "Steady & patient"    },
      { emoji: "🦌", name: "Deer",      desc: "Gentle & present"    },
      { emoji: "🐧", name: "Penguin",   desc: "Loyal & steady"      },
      { emoji: "🐬", name: "Dolphin",   desc: "Playful & free"      },
      { emoji: "🦋", name: "Butterfly", desc: "Change & growth"     },
      { emoji: "🐼", name: "Panda",     desc: "Peaceful & rare"     },
      { emoji: "🦁", name: "Lion",      desc: "Brave & fierce"      },
      { emoji: "🐘", name: "Elephant",  desc: "Memory & strength"   },
      { emoji: "🦜", name: "Parrot",    desc: "Voice & color"       },
      { emoji: "🐿️", name: "Squirrel", desc: "Nimble & prepared"   },
    ],
  },
  {
    id: "nature",
    label: "Nature",
    icon: "🌿",
    avatars: [
      { emoji: "🌿", name: "Fern",      desc: "Quiet & resilient"   },
      { emoji: "🌸", name: "Blossom",   desc: "Soft & hopeful"      },
      { emoji: "🍃", name: "Leaf",      desc: "Carried by the wind" },
      { emoji: "🌊", name: "Wave",      desc: "Fluid & powerful"    },
      { emoji: "🌲", name: "Pine",      desc: "Rooted & tall"       },
      { emoji: "🌻", name: "Sunflower", desc: "Facing the light"    },
      { emoji: "🍂", name: "Maple",     desc: "Letting go"          },
      { emoji: "🌾", name: "Wheat",     desc: "Humble & nourishing" },
      { emoji: "🪨", name: "Stone",     desc: "Solid & enduring"    },
      { emoji: "🌺", name: "Hibiscus",  desc: "Vibrant & brave"     },
      { emoji: "🍀", name: "Clover",    desc: "Lucky & small"       },
      { emoji: "🌵", name: "Cactus",    desc: "Survives anything"   },
      { emoji: "🪷", name: "Lotus",     desc: "Rising from mud"     },
      { emoji: "🌙", name: "Crescent",  desc: "Soft night light"    },
      { emoji: "🌋", name: "Mountain",  desc: "Immovable & grand"   },
    ],
  },
  {
    id: "celestial",
    label: "Celestial",
    icon: "✨",
    avatars: [
      { emoji: "✨", name: "Spark",         desc: "Brief & brilliant"    },
      { emoji: "⭐", name: "Star",          desc: "Distant & constant"   },
      { emoji: "🌅", name: "Dawn",          desc: "New beginnings"       },
      { emoji: "🌈", name: "Rainbow",       desc: "After the storm"      },
      { emoji: "☁️", name: "Cloud",        desc: "Soft & drifting"      },
      { emoji: "🌤️", name: "Clearing",    desc: "Breaking through"     },
      { emoji: "🌠", name: "Shooting Star", desc: "Making a wish"       },
      { emoji: "🌌", name: "Galaxy",        desc: "Vast & wondering"     },
      { emoji: "🔮", name: "Orb",           desc: "Reflective & still"   },
      { emoji: "🌞", name: "Sun",           desc: "Warm & constant"      },
      { emoji: "💫", name: "Dizzy",         desc: "Spinning into place"  },
      { emoji: "🌓", name: "Half Moon",     desc: "Between two worlds"   },
      { emoji: "🪐", name: "Saturn",        desc: "Rings & mystery"      },
      { emoji: "⚡", name: "Lightning",     desc: "Sudden & electric"    },
      { emoji: "❄️", name: "Snowflake",    desc: "Unique & crystalline" },
    ],
  },
  {
    id: "emoji",
    label: "Emoji",
    icon: "😊",
    avatars: [
      { emoji: "😊", name: "Smile",    desc: "Warm & open"           },
      { emoji: "🥹", name: "Moved",    desc: "Tender & touched"      },
      { emoji: "😌", name: "Peaceful", desc: "Soft & settled"        },
      { emoji: "🤗", name: "Hugger",   desc: "Warm & welcoming"      },
      { emoji: "😎", name: "Cool",     desc: "Easy & confident"      },
      { emoji: "🧘", name: "Zen",      desc: "Still & centered"      },
      { emoji: "💪", name: "Strong",   desc: "Built for this"        },
      { emoji: "🎵", name: "Music",    desc: "Feeling the rhythm"    },
      { emoji: "📖", name: "Story",    desc: "Writing the next page" },
      { emoji: "🎨", name: "Creative", desc: "Making something new"  },
      { emoji: "🧸", name: "Comfort",  desc: "Safe & held"           },
      { emoji: "🌮", name: "Taco",     desc: "Just vibing"           },
      { emoji: "☕", name: "Coffee",   desc: "One day at a time"     },
      { emoji: "🎯", name: "Focused",  desc: "Eyes on the goal"      },
      { emoji: "🦄", name: "Unicorn",  desc: "One of a kind"         },
    ],
  },
  {
    id: "shapes",
    label: "Shapes",
    icon: "🎨",
    avatars: [
      { emoji: "💙", name: "Blue",    desc: "Calm & clear"          },
      { emoji: "💚", name: "Green",   desc: "Healing & alive"       },
      { emoji: "🧡", name: "Orange",  desc: "Warmth & energy"       },
      { emoji: "💜", name: "Purple",  desc: "Depth & mystery"       },
      { emoji: "🤍", name: "White",   desc: "Open & spacious"       },
      { emoji: "🌀", name: "Spiral",  desc: "Ever turning"          },
      { emoji: "🔷", name: "Diamond", desc: "Formed under pressure" },
      { emoji: "🫧", name: "Bubble",  desc: "Light & floating"      },
      { emoji: "🪬", name: "Shield",  desc: "Protected"             },
      { emoji: "🧩", name: "Piece",   desc: "Part of something"     },
      { emoji: "🎯", name: "Focus",   desc: "Clear & intentional"   },
      { emoji: "🪞", name: "Mirror",  desc: "Reflecting inward"     },
      { emoji: "🕊️", name: "Dove",   desc: "Peace & release"       },
      { emoji: "🧲", name: "Magnet",  desc: "Drawing things close"  },
      { emoji: "🫀", name: "Heart",   desc: "Beating & alive"       },
    ],
  },
];

export type CompanionId = "female" | "male" | "neutral";

export interface UserAvatar {
  emoji: string;
  name: string;
  desc: string;
}

export interface CompanionAvatar {
  emoji: string;
  name: string;
}

export interface FycProfile {
  companion: {
    name: string;
    id: CompanionId;
    pronouns: string;
    avatar: CompanionAvatar;
  };
  userAvatar: UserAvatar;
}

export interface OnboardingContext {
  name: string | null;
  pronoun: string | null;
  diagnosisDate: string | null;
  daysSinceDiagnosis: number | null;
  diagnosisRange: string | null;
  onMedication: string | null;
  hasProvider: string | null;
  needsProviderHelp: boolean;
  wantsMedsIntro: boolean;
  theme?: string;
  emotionalIntensity: number;
  emotions: string[];
  note: string | null;
  userAvatar: UserAvatar | null;
  companion: FycProfile["companion"];
}

export function daysSince(dateStr: string): number | null {
  if (!dateStr) return null;
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff : null;
}

export function diagnosisContext(days: number | null) {
  if (days === null) return null;
  if (days <= 14)  return { label: "Very recent",          note: `Just ${days} day${days === 1 ? "" : "s"} ago — this is still very new.`, color: "#e8a87c" };
  if (days <= 90)  return { label: "Early adjustment",     note: `${Math.floor(days / 7)} weeks in — still the early chapter.`,           color: "#c4956a" };
  if (days <= 365) return { label: "First year",           note: `About ${Math.floor(days / 30)} months in.`,                             color: "#8ecfbe" };
  return               { label: "Beyond the first year",   note: `${Math.floor(days / 365)} year${days >= 730 ? "s" : ""} since diagnosis.`, color: "#8ecfbe" };
}

export function intensityLabel(v: number): string {
  if (v <= 2) return "Calm";
  if (v <= 4) return "Mild";
  if (v <= 6) return "Moderate";
  if (v <= 8) return "High";
  return "Intense";
}
