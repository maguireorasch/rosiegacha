# ROSIE.EXE — A Little Pixel World Made Just for You ♡

An interactive retro 8-bit/16-bit pink pixel-art adventure game, Pokémon-inspired 3D collectible trading card binder, arcade mini-game suite, and personalized digital gift experience crafted for **Hannalle Dewyrose (ROSIE-001)**.

## Features
- **Retro Boot Sequence (`BootScreen`)**: Classic computer terminal cartridge loader with skip support.
- **Title Screen (`OpeningScreen`)**: Haunted pink mansion, adventure van, twinkling pixel stars, and chiptune soundtrack toggle.
- **Character Select (`CharacterSelectScreen`)**: 5 pixel heroes (`Rosie`, `Pixel Cat`, `Mystery Girl`, `Little Ghost`, `Star Girl`) with RPG stats & special skills.
- **Player ID Card (`PlayerIdModal`)**: Official `ROSIE-001` identification window with downloadable PNG export (`ROSIE-001-ID-CARD.png`).
- **Interactive Pink Pixel World (`PixelWorldScreen`)**: Walkable 2D map with WASD, Arrow keys, touch D-Pad, click-to-move, and 9 interactive landmarks.
- **Holographic 3D Collectible Cards (`CardCollectionScreen` & `TradingCardItem`)**: 8 collectible cards (`001/008` to `008/008`) with smooth 180° 3D flips, non-mirrored back designs, Mystery Pack opener, and full detail modal.
- **Pink Retro Mailbox (`MailboxScreen`)**: 6 interactive envelopes with typewriter dialogue notes.
- **Pink RPG Monster Battle (`MonsterBattleScreen`)**: Turn-based battles against 5 pixel monsters (`Slime King` to `Dark Forest Guardian`) with Attack, Special, Defend, Heal, and card rewards.
- **Pink Pixel Arcade (`ArcadeGamesScreen`)**: 4 playable mini-games — Tic Tac Toe (vs AI & 2-Player), Catch the Stars, 4x4 Memory Match, and How Well Do You Know Rosie Quiz.
- **Secret Room & Final Sunset Celebration (`SecretRoomScreen` & `FinalSunsetScreen`)**: Quest checklist unlocking `Card 008` and an interactive pixel fireworks sunset celebration.
- **Persistent Progress & 8-Bit Chiptune Audio**: Automatic `localStorage` saving, 6 unlockable achievements, and Web Audio API synthesized retro music & sound effects.

## Local Development

```bash
npm install
npm run dev
```

Runs on `http://localhost:3000`.
