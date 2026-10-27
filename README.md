# ✨ Happy Birthday - Cosmic Celebration Web Experience

An ultra-aesthetic, interactive birthday website inspired by your screenshot, featuring a deep cosmic starry night theme, glowing neon portrait frame, synthesized music box melody, interactive cake with blowable candles, unwrappable gift box with a letter, popping balloons, and grand finale fireworks!

---

## 🌟 Features Included

1. **Scene 1: Cosmic Intro (Exact Match to Your Image)**
   - Glowing neon gradient photo frame with pulse effect and light shimmer.
   - The exact heartfelt quote from your picture:
     > *"Tonight isn't ordinary.  
     > The stars are glowing softer,  
     > the moon feels warmer,  
     > and the universe is quietly celebrating  
     > someone truly special. ✨"*
   - Smooth "Scroll or Tap to explore" invitation.

2. **Built-in Celestial Music Box (Web Audio API)**
   - Soft, nostalgic chime rendition of the "Happy Birthday" melody.
   - **Zero external dependencies or MP3 loading issues**: Works 100% offline and in all modern browsers.
   - Interactive play/pause toggle pill at bottom right with animated music equalizer bars.

3. **Floating & Interactive Balloons**
   - Soft pastel balloons floating up through the starry cosmos.
   - **Pop-able**: Click or tap any balloon to pop it with realistic sound effects and micro-confetti bursts!

4. **Scene 2: Appreciation Flip Cards**
   - 3D interactive flip cards revealing personalized blessings ("Your Bright Light", "Your Endless Strength", "Endless Possibilities").

5. **Scene 3: Interactive 3D Birthday Cake**
   - Flickering candle flames.
   - Tap the candles or the "Blow Out The Candles" button to blow them out.
   - Realistic smoke puff animations, whoosh sound effect, golden "WISH GRANTED!" reveal, and celebratory confetti cannon.

6. **Scene 4: Unwrappable 3D Gift Box**
   - Tap to open the ribbon-tied gift box.
   - Lid pops open, bow bounces, gold confetti erupts, and reveals an elegant vintage parchment letter.

7. **Scene 5: Grand Finale Fireworks Show**
   - Sparkling crown and typography.
   - Tap or click anywhere on screen to launch vibrant radial fireworks!
   - Shower confetti and replay buttons.

8. **In-Browser Personalizer (Customize Button)**
   - Click **"Personalize"** at top right to easily change:
     - Recipient Name
     - Intro Poem / Quote
     - Portrait Photo (upload any image directly from your computer or phone)
     - Birthday Letter Message
     - Sender Signature
   - Saves directly to your browser's local storage.

---

## 🚀 How to Open & Run

### Method 1: Direct File Opening
Double-click `index.html` or drag it into any web browser (Chrome, Edge, Safari, Firefox).

### Method 2: Local Web Server (Node.js)
Open PowerShell or Terminal in this folder and run:
```powershell
npx serve -l 3000
```
Then open `http://localhost:3000` in your browser.

---

## 📁 File Structure

```text
day/
├── index.html                  # Main responsive single-page web app
├── style.css                   # Cosmic aesthetic styles, neon glow, and animations
├── script.js                   # Audio synthesis, canvas stars, fireworks, and interaction logic
├── README.md                   # Instructions and feature overview
└── assets/
    ├── birthday_person.png     # Extracted portrait from your uploaded photo
    └── original_card.png       # Original screenshot reference
```
