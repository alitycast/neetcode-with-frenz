export type AccentColor = 'blush' | 'lavender' | 'mint' | 'butter'

const ACCENTS: AccentColor[] = ['blush', 'lavender', 'mint', 'butter']

export function getParticipantAccent(index: number): AccentColor {
  return ACCENTS[index % ACCENTS.length]
}

export const accentClasses: Record<
  AccentColor,
  { bar: string; text: string; dot: string; ring: string }
> = {
  blush: {
    bar: 'bg-blush',
    text: 'text-blush',
    dot: 'bg-blush',
    ring: 'ring-blush/50',
  },
  lavender: {
    bar: 'bg-lavender',
    text: 'text-lavender',
    dot: 'bg-lavender',
    ring: 'ring-lavender/50',
  },
  mint: {
    bar: 'bg-mint',
    text: 'text-mint',
    dot: 'bg-mint',
    ring: 'ring-mint/50',
  },
  butter: {
    bar: 'bg-butter',
    text: 'text-butter',
    dot: 'bg-butter',
    ring: 'ring-butter/50',
  },
}
