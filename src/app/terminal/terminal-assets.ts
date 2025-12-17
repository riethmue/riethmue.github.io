/**
 * ASCII art banners for terminal component
 */
export const ASCII_MINI = [
  '                      _     ',
  '                     | |    ',
  '  ___  __ _ _ __ __ _| |__  ',
  " / __|/ _` | '__/ _` | '_ \\ ",
  ' \\__ \\ (_| | | | (_| | | | |',
  ' |___/\\__,_|_|  \\__,_|_| |_|',
  '                            ',
  '                            ',
];

export const ASCII_BIG = [
  ' ░▒▓███████▓▒░░▒▓██████▓▒░░▒▓███████▓▒░ ░▒▓██████▓▒░░▒▓█▓▒░░▒▓█▓▒░ ',
  '░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ ',
  '░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ ',
  ' ░▒▓██████▓▒░░▒▓████████▓▒░▒▓███████▓▒░░▒▓████████▓▒░▒▓████████▓▒░ ',
  '       ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ ',
  '       ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ ',
  '░▒▓███████▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ ',
  '                                                                   ',
];

/**
 * Fortune cookie messages for terminal
 */
export const FORTUNES = [
  "💡 Code is like humor. When you have to explain it, it's bad.",
  "🚀 There is no cloud. just someone else's computer.",
  '👾 The cake is a lie!',
  '🔮 42.',
  '💀 Kein Backup. Kein Mitleid.',
];

/**
 * Easter egg commands and their outputs
 */
export interface EasterEgg {
  command: string;
  output: string[];
}

export const EASTER_EGGS: EasterEgg[] = [
  {
    command: 'jil',
    output: [
      '',
      '╔═══════════════════════════════════╗',
      '║                                   ║',
      '║          I love you <3            ║',
      '║                                   ║',
      '╚═══════════════════════════════════╝',
      '',
    ],
  },
  {
    command: 'wolf',
    output: [
      '',
      '        ,     ,',
      '       /(.-""-.)\\',
      '   |\\  \\/      \\/  /|',
      '   | \\ / =.  .= \\ / |',
      '   \\( \\   o\\/o   / )/',
      "    \\_, '-/  \\-' ,_/",
      '      /   \\__/   \\',
      '      \\ \\__/\\__/ /',
      '    ___\\ \\|--|/ /___',
      '  /`    \\      /    `\\',
      " /       '----'       \\",
      '',
      'Trust your instincts! 🐺',
      '',
    ],
  },
  {
    command: 'hack',
    output: [
      '',
      'Access Granted...',
      'Initializing...',
      '[████████████████████] 100%',
      '',
      'Welcome, Neo.',
      'The Matrix has you.',
      '',
    ],
  },
  {
    command: 'sudo',
    output: [
      '',
      'sarah is not in the sudoers file.',
      'This incident will be reported.',
      '',
    ],
  },
  {
    command: 'coffee',
    output: [
      '',
      '      ( (',
      '       ) )',
      '    ..........',
      '    |       |]',
      '    \\       /',
      "     `-----'",
      '',
      'Refueling... ☕',
      '',
    ],
  },
  {
    command: 'matrix',
    output: [
      'Wake up, Sarah...',
      'The Matrix has you...',
      'Follow the white rabbit. 🐰',
    ],
  },
  {
    command: 'konami',
    output: [
      '',
      '▲ ▲ ▼ ▼ ◄ ► ◄ ► B A',
      '',
      '🎮 You unlocked 30 extra lives!',
      '(just kidding, this is a website)',
      '',
    ],
  },
];
