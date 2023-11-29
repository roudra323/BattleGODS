# BattleGods

## Overview

AVAXGods is a blockchain-based game where players can register, create battle cards (Gods), and engage in battles with other players. The game involves strategic decision-making, as players choose attack or defense moves during battles. The goal is to defeat opponents and emerge victorious in battles.

## Getting Started

1. **Register as a Player:**
   - To participate in AVAXGods, players need to register with a unique player name. This is done by calling the `registerPlayer` function, providing a player name.

2. **Create a Battle Card (God):**
   - After registration, players can create a unique battle card (God) using the `createRandomGameToken` function. Each battle card has random attack and defense strengths.

3. **Initiate a Battle:**
   - Players can initiate battles by calling the `createBattle` function, providing a unique battle name. Once a battle is created, other players can join the battle.

4. **Join a Battle:**
   - To join a battle, use the `joinBattle` function, providing the name of the battle. Players need to wait for another player to join the same battle.

## Battle Mechanics

1. **Make Moves:**
   - During a battle, players take turns making moves. Moves can be either an attack (1) or a defense (2). Players need sufficient mana for attacking.

2. **Battle Resolution:**
   - After both players make their moves, the battle is resolved. The game calculates the damage based on the moves and the battle card strengths. The player with the most strategic moves and better battle card strengths wins.

3. **Winning and Losing:**
   - The battle ends when a player's health reaches zero. The winner gains rewards, and the loser's battle card strengths may be adjusted for the next battle.

4. **End Battle:**
   - Players can end a battle prematurely by calling the `quitBattle` function, which declares the other player as the winner.

## Additional Features

1. **Player Stats:**
   - Players have health and mana stats. Health indicates the player's ability to sustain attacks, while mana is used for making attacks.

2. **Randomization:**
   - The game incorporates randomness in generating battle card strengths and selecting attack or defense moves.

3. **Token Management:**
   - Players can manage their battle cards (Gods) and track their progress using the provided functions like `getPlayer`, `getAllPlayers`, `getPlayerToken`, and `getAllPlayerTokens`.

4. **Events:**
   - The game emits events such as `NewPlayer`, `NewBattle`, `BattleEnded`, `BattleMove`, `NewGameToken`, and `RoundEnded` to provide information about player actions and game state changes.

## Winning and Rewards

- Players accumulate victories and improve their battle cards over time. Winning battles increases a player's ranking and may provide additional rewards.

## Note

- Ensure you have sufficient AVAX (Avalanche) to execute transactions on the Avalanche C-Chain.

**Good luck, and may the Gods favor you in battle!**
