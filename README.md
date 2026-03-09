# Pre-work - *Memory Game*

**Memory Game** is a Light & Sound Memory game to apply for CodePath's SITE Program.

**Live Link:** https://abdoulousseini2028-droid.github.io/AbdoulRahim-Ousseini-Light-and-Sound-Game/

Submitted by: **Abdoul Rahim Ousseini**


## Outside Resources Used

- **MDN Web Docs** (developer.mozilla.org) — for understanding `setTimeout`, `classList` methods, and the Web Audio API
- **W3Schools** (w3schools.com) — for CSS pseudo-classes and the `alert()` function reference

## Challenges Encountered

One of the biggest challenges I encountered was getting the audio to play correctly during the computer's clue playback sequence. When I first implemented the game, the buttons would light up visually as expected, but no sound would play when the computer was demonstrating the pattern to the user. However, sound worked perfectly fine when I pressed the buttons myself.

After investigating the issue, I learned that modern web browsers have an autoplay policy that blocks audio from playing until the user has interacted with the page. Even though the user clicks Start to begin the game, the `AudioContext` still needed to be explicitly resumed before playing any tones. The problem was that `context.resume()` returns a JavaScript Promise, meaning it runs asynchronously. My original code called `context.resume()` but then immediately tried to schedule the clues without waiting for the audio context to fully resume, causing the first clue to sometimes play silently.

To fix this, I restructured the `playClueSequence` function to place all the clue-scheduling logic inside a `.then()` callback after `context.resume()`. This ensured that the `AudioContext` was fully active before any tones were attempted. This taught me an important lesson about asynchronous JavaScript and Promises — that some operations take time to complete, and code that depends on them must wait for them to finish rather than running immediately after.

A second related challenge was that clicking the Stop button mid-sequence would stop the game state but already-scheduled `setTimeout` calls would still fire, causing buttons to keep lighting up and sounds to keep playing even after the game was supposed to be over. I solved this by maintaining a `timeoutIds` array that tracked every scheduled timeout, and calling `clearTimeout` on all of them whenever the game stopped. This taught me the importance of managing side effects in JavaScript, especially when working with asynchronous operations.

## Questions About Web Development

Completing this project raised several interesting questions for me about web development. First, I'm curious about how to make web applications responsive so they work well on mobile devices and different screen sizes. My current game layout doesn't adapt well to smaller screens, and I'd like to understand CSS techniques more deeply to address this.

Second, I'm curious about how larger web applications manage their state. In this project I used simple global variables, but I imagine that approach becomes messy as applications grow. How do professional developers organize their data and application state in larger projects?

Third, I'd like to understand more about how the Web Audio API works. How do frequencies and oscillators actually produce sound, and what else is possible with it?

Finally, I'm curious about accessibility in web development. How do developers make games and interactive applications usable for people with visual or hearing impairments, and what are the standard tools and practices for this?

## What I Would Do With More Time

If I had a few more hours to work on this project, I would focus on three main improvements.

First, I would add difficulty levels. Currently the clue hold time is fixed at 1000 milliseconds. I would add Easy, Medium, and Hard modes that progressively shorten the `clueHoldTime` and `cluePauseTime`, making the sequence faster and harder to follow as the player advances.

Second, I would make the pattern randomly generated each game instead of using the fixed array `[2, 2, 4, 3, 2, 1, 2, 4]`. I would replace it with a function that uses `Math.random()` to generate a new 8-element pattern every time the Start button is pressed, making the game more replayable.

Third, I would improve the visual design and add a score or progress tracker on screen so players can see which turn they are on out of 8 without having to count themselves. Adding a small animation or visual feedback when the player wins or loses rather than just a plain alert box would also make the experience feel more engaging.

Thanks!!!

## Video Walkthrough
Losing:
[losing screen recording](https://www.loom.com/share/8571a44fa2424031969831bf1a511422)

Winning:
[winning screen recording](https://www.loom.com/share/77918e1784ed4ce2bd265d10f61669e8)

## Interview Recording URL Link

[My 5-minute Interview Recording](https://www.loom.com/share/6fa15e0e0df941fa837f9426d1f15ded)
