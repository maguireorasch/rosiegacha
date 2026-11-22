import type { CapsuleColor, RosieCapsuleMessage } from '../types/gachapon';

export const CAPSULE_CATEGORIES: Record<
  CapsuleColor,
  {
    name: string;
    meaning: string;
    shellHex: string;
    shellDarkHex: string;
    glowHex: string;
    cardTint: string;
    textAccent: string;
  }
> = {
  pink: {
    name: 'Pink Capsule',
    meaning: 'Sweet reminders',
    shellHex: '#F74D94',
    shellDarkHex: '#C22869',
    glowHex: 'rgba(247, 77, 148, 0.58)',
    cardTint: '#FFF4F9',
    textAccent: '#B53B6D',
  },
  yellow: {
    name: 'Yellow Capsule',
    meaning: 'Happiness and encouragement',
    shellHex: '#F7C325',
    shellDarkHex: '#D19608',
    glowHex: 'rgba(247, 195, 37, 0.58)',
    cardTint: '#FFFDF2',
    textAccent: '#9E6E08',
  },
  blue: {
    name: 'Blue Capsule',
    meaning: 'Comfort and reassurance',
    shellHex: '#2B95E8',
    shellDarkHex: '#186CB0',
    glowHex: 'rgba(43, 149, 232, 0.55)',
    cardTint: '#F4FAFF',
    textAccent: '#1D6296',
  },
  purple: {
    name: 'Purple Capsule',
    meaning: 'Secret little thoughts',
    shellHex: '#8C56F5',
    shellDarkHex: '#6332C7',
    glowHex: 'rgba(140, 86, 245, 0.55)',
    cardTint: '#F9F5FF',
    textAccent: '#5C39A6',
  },
  white: {
    name: 'White Capsule',
    meaning: 'Random positive messages',
    shellHex: '#FFFFFF',
    shellDarkHex: '#E85A93',
    glowHex: 'rgba(232, 90, 147, 0.5)',
    cardTint: '#FFFCFD',
    textAccent: '#B53B6D',
  },
};

function fmt(id: number): string {
  return `${String(id).padStart(2, '0')}/50`;
}

export const ROSIE_50_MESSAGES: RosieCapsuleMessage[] = [
  // Category A — Little Reminders (Pink)
  { id: 1, numberLabel: fmt(1), categoryLabel: 'Little Reminders', color: 'pink', message: "Hey Rosie, don't forget to take care of yourself today." },
  { id: 2, numberLabel: fmt(2), categoryLabel: 'Little Reminders', color: 'pink', message: 'You deserve good things, even on ordinary days.' },
  { id: 3, numberLabel: fmt(3), categoryLabel: 'Little Reminders', color: 'pink', message: 'Please remember to drink enough water today!' },
  { id: 4, numberLabel: fmt(4), categoryLabel: 'Little Reminders', color: 'pink', message: "It's okay to take a break when things get overwhelming." },
  { id: 5, numberLabel: fmt(5), categoryLabel: 'Little Reminders', color: 'pink', message: "You don't have to be productive every single day." },
  { id: 6, numberLabel: fmt(6), categoryLabel: 'Little Reminders', color: 'pink', message: "Don't forget that your feelings matter too." },
  { id: 7, numberLabel: fmt(7), categoryLabel: 'Little Reminders', color: 'pink', message: 'Eat something nice today, okay?' },
  { id: 8, numberLabel: fmt(8), categoryLabel: 'Little Reminders', color: 'pink', message: 'You are allowed to have slow days.' },
  { id: 9, numberLabel: fmt(9), categoryLabel: 'Little Reminders', color: 'pink', message: 'Remember to get enough sleep, Rosie.' },
  { id: 10, numberLabel: fmt(10), categoryLabel: 'Little Reminders', color: 'pink', message: 'Be a little kinder to yourself today.' },

  // Category B — You're Doing Great (Yellow)
  { id: 11, numberLabel: fmt(11), categoryLabel: "You're Doing Great", color: 'yellow', message: "I'm proud of you for making it this far." },
  { id: 12, numberLabel: fmt(12), categoryLabel: "You're Doing Great", color: 'yellow', message: "You're doing better than you think." },
  { id: 13, numberLabel: fmt(13), categoryLabel: "You're Doing Great", color: 'yellow', message: 'Even your smallest progress deserves appreciation.' },
  { id: 14, numberLabel: fmt(14), categoryLabel: "You're Doing Great", color: 'yellow', message: "You don't need to have everything figured out right now." },
  { id: 15, numberLabel: fmt(15), categoryLabel: "You're Doing Great", color: 'yellow', message: 'Keep going at your own pace.' },
  { id: 16, numberLabel: fmt(16), categoryLabel: "You're Doing Great", color: 'yellow', message: "You're stronger than the difficult days you face." },
  { id: 17, numberLabel: fmt(17), categoryLabel: "You're Doing Great", color: 'yellow', message: "Don't underestimate how far you've come." },
  { id: 18, numberLabel: fmt(18), categoryLabel: "You're Doing Great", color: 'yellow', message: 'You can always start again tomorrow.' },
  { id: 19, numberLabel: fmt(19), categoryLabel: "You're Doing Great", color: 'yellow', message: 'One little step is still progress.' },
  { id: 20, numberLabel: fmt(20), categoryLabel: "You're Doing Great", color: 'yellow', message: 'I hope you never forget how capable you are.' },

  // Category C — Happiness Capsules (White)
  { id: 21, numberLabel: fmt(21), categoryLabel: 'Happiness Capsules', color: 'white', message: 'I hope something unexpectedly wonderful happens to you today.' },
  { id: 22, numberLabel: fmt(22), categoryLabel: 'Happiness Capsules', color: 'white', message: 'May your favorite song find you at the perfect moment.' },
  { id: 23, numberLabel: fmt(23), categoryLabel: 'Happiness Capsules', color: 'white', message: 'I hope you get to eat your favorite food soon.' },
  { id: 24, numberLabel: fmt(24), categoryLabel: 'Happiness Capsules', color: 'white', message: "Here's a little reminder to smile today." },
  { id: 25, numberLabel: fmt(25), categoryLabel: 'Happiness Capsules', color: 'white', message: 'You deserve random moments of happiness.' },
  { id: 26, numberLabel: fmt(26), categoryLabel: 'Happiness Capsules', color: 'white', message: 'I hope your day is filled with tiny beautiful things.' },
  { id: 27, numberLabel: fmt(27), categoryLabel: 'Happiness Capsules', color: 'white', message: 'May you always find reasons to laugh.' },
  { id: 28, numberLabel: fmt(28), categoryLabel: 'Happiness Capsules', color: 'white', message: 'I hope you receive a message that makes you smile.' },
  { id: 29, numberLabel: fmt(29), categoryLabel: 'Happiness Capsules', color: 'white', message: "Don't forget to enjoy the little things." },
  { id: 30, numberLabel: fmt(30), categoryLabel: 'Happiness Capsules', color: 'white', message: 'Sending you a pocket-sized dose of happiness!' },

  // Category D — Comfort Capsules (Blue)
  { id: 31, numberLabel: fmt(31), categoryLabel: 'Comfort Capsules', color: 'blue', message: 'If today feels difficult, please remember that it will pass.' },
  { id: 32, numberLabel: fmt(32), categoryLabel: 'Comfort Capsules', color: 'blue', message: "You don't have to pretend to be okay all the time." },
  { id: 33, numberLabel: fmt(33), categoryLabel: 'Comfort Capsules', color: 'blue', message: "It's okay if things don't go according to plan." },
  { id: 34, numberLabel: fmt(34), categoryLabel: 'Comfort Capsules', color: 'blue', message: "Take a deep breath. You've got this." },
  { id: 35, numberLabel: fmt(35), categoryLabel: 'Comfort Capsules', color: 'blue', message: 'You deserve rest without feeling guilty.' },
  { id: 36, numberLabel: fmt(36), categoryLabel: 'Comfort Capsules', color: 'blue', message: 'Never be too hard on yourself.' },
  { id: 37, numberLabel: fmt(37), categoryLabel: 'Comfort Capsules', color: 'blue', message: 'Tomorrow is another chance to make things better.' },
  { id: 38, numberLabel: fmt(38), categoryLabel: 'Comfort Capsules', color: 'blue', message: "It's okay to ask for help when you need it." },
  { id: 39, numberLabel: fmt(39), categoryLabel: 'Comfort Capsules', color: 'blue', message: 'You are never defined by your bad days.' },
  { id: 40, numberLabel: fmt(40), categoryLabel: 'Comfort Capsules', color: 'blue', message: 'I hope you always find a safe place to rest your heart.' },

  // Category E — Special Messages From Deloniel (Purple)
  { id: 41, numberLabel: fmt(41), categoryLabel: 'Special Messages From Deloniel', color: 'purple', message: 'Just a little reminder that someone is cheering for you.' },
  { id: 42, numberLabel: fmt(42), categoryLabel: 'Special Messages From Deloniel', color: 'purple', message: 'I hope life treats you gently, Rosie.' },
  { id: 43, numberLabel: fmt(43), categoryLabel: 'Special Messages From Deloniel', color: 'purple', message: 'You make the world a little more interesting just by being you.' },
  { id: 44, numberLabel: fmt(44), categoryLabel: 'Special Messages From Deloniel', color: 'purple', message: "Don't forget how special your existence is." },
  { id: 45, numberLabel: fmt(45), categoryLabel: 'Special Messages From Deloniel', color: 'purple', message: 'If you ever doubt yourself, read this capsule again.' },
  { id: 46, numberLabel: fmt(46), categoryLabel: 'Special Messages From Deloniel', color: 'purple', message: 'This little machine was made to make you smile.' },
  { id: 47, numberLabel: fmt(47), categoryLabel: 'Special Messages From Deloniel', color: 'purple', message: "I hope you achieve all the things you've been dreaming about." },
  { id: 48, numberLabel: fmt(48), categoryLabel: 'Special Messages From Deloniel', color: 'purple', message: 'No matter how busy life gets, remember to make time for yourself.' },
  { id: 49, numberLabel: fmt(49), categoryLabel: 'Special Messages From Deloniel', color: 'purple', message: "Here's your daily reminder that you deserve happiness." },
  { id: 50, numberLabel: fmt(50), categoryLabel: 'Special Messages From Deloniel', color: 'purple', message: 'And finally, Rosie, never forget to keep being wonderfully you.' },
];

export const SECRET_BONUS_MESSAGES: string[] = [
  'Bonus secret note: Even on quiet, ordinary days, you bring warmth to the spaces you walk into, Rosie ♡',
  'Bonus secret note: Whenever you feel tired, pause for a sip of water and take three slow, gentle breaths.',
  'Bonus secret note: Somewhere out there, Deloniel hopes today gives you at least three tiny reasons to laugh!',
  'Bonus secret note: Your kindness and your little quirks make you one of a kind. Never dim them.',
  'Bonus secret note: A pocket-sized high five for getting through today — you did well, Hannalle Dewyrose ♡',
];

export const SECRET_LETTER_TEXT = `Dear Rosie,

If you've made it this far, I guess you've opened all the little surprises I've prepared for you.

I wanted to make something different, something that could remind you of the little things that sometimes get forgotten in the middle of busy days.

These 50 reminders might seem simple, but I hope each one brings you a little smile whenever you need it.

I hope you keep choosing yourself, celebrating your little victories, and believing in all the beautiful things waiting ahead of you.

You don't always have to be strong. You don't always have to be okay. Just remember to give yourself the same kindness you give to the people around you.

And whenever life gets a little too overwhelming, I hope you remember that there are still so many little reasons to smile.

Thank you for being you, Rosie.

This little machine, every capsule, and every word inside it were made especially for you.

With lots of appreciation,

Deloniel ♡`;

export function shuffleIds(ids: number[]): number[] {
  const copy = [...ids];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
