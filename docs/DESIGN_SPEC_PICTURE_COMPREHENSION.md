# Design Specification: Picture Comprehension Game ("Spyglass Explorer")

## 1. Game Overview
*   **Title:** Spyglass Explorer
*   **Target Audience:** Grade 3-5 Students
*   **Objective:** Enhance visual attention, detail recall, and inferential reasoning based on visual cues.
*   **Core Loop:**
    1.  **Observation Phase:** The player views a detailed scene. In higher difficulties, they use a "spyglass" (cursor hover) to reveal parts of the scene.
    2.  **Question Phase:** The player answers questions about the scene. Questions can be direct recall ("What color was the cat?") or inference ("What season is it?").

## 2. Creative Concept
Instead of a static image, the game simulates a **detective's observation mission**.
*   **Theme:** "Mission: Observe." The user is a scout or detective.
*   **Visual Hook:** The "Spyglass Effect".
    *   *Easy Mode:* Full image is visible.
    *   *Hard Mode:* The image is covered by a "fog" (overlay). Moving the mouse/touch creates a clear circle (the spyglass) that reveals the image underneath. This forces active, intentional scanning.

## 3. Technical Architecture

### 3.1 Data Structure
We will utilize the existing `ENGLISH_GOOGLE_SHEET_DATA.csv`.

*   **Game ID:** `spyglass-explorer`
*   **Schema extensions:**
    *   `text1`: **Scene Description** (e.g., "A busy park on a sunny day").
    *   `text2`: **Hidden Details** (Optional - text used for accessibility or hints).
    *   `image_url`: Key field. Can be an external URL or our custom dynamic format: `dynamic:scene:[SCENE_TYPE]:[COMPLEXITY]`.
    *   `hint`: Text hint describing where to look (e.g., "Look near the fountain").

**Example Row:**
```csv
game_type,text1,image_url,question,answer,option1...,difficulty,hint
spyglass-explorer,The City Park,dynamic:scene:park:complex,How many dogs are playing?,Two,One,Two,Three,Medium,Check near the bench!
```

### 3.2 Component Architecture

#### A. New Component: `SpyglassRenderer.tsx`
*   **Props:** `imageUrl`, `difficulty`
*   **Functionality:**
    *   Renders the image.
    *   **Overlay Layer:** A black/dark container with `opacity: 0.9`.
    *   **Masking:** Uses CSS `mask-image` or a `radial-gradient` tracking mouse coordinates to create the transparent hole.
    *   **Touch Support:** `onTouchMove` to update coordinates.

#### B. Dynamic Image Generation (`SheetBasedGame.tsx`)
Extend `DynamicImageRenderer` to generate complex SVG scenes so we don't rely on external URLs (which might break).
*   **Format:** `dynamic:scene:[TYPE]`
*   **Scene Types:**
    *   `park`: Green background, tree elements, bench elements, sun.
    *   `classroom`: Blackboard, desks, books.
    *   `beach`: Sand, ocean, umbrella, ball.
*   **Implementation:** Compose existing SVG shapes (circles, rects) into recognizable patterns.
    *   *Tree:* Brown rect (trunk) + 3 Green circles (foliage).
    *   *Ball:* Circle with stripes.

### 3.3 Game Flow Implementation (`SheetBasedGame.tsx`)

1.  **Phase 1: Observation (Timer: 10-30s)**
    *   Show only the `SpyglassRenderer`.
    *   Hide the question.
    *   Show a countdown: "Memorize the scene! 00:15".
    *   *Constraint:* User cannot answer yet.

2.  **Phase 2: Recall (Active)**
    *   **Easy/Medium:** Image remains visible (maybe removes Spyglass effect). User answers questions.
    *   **Hard:** Image **disappears** (or blurs heavily). User must answer from memory.
    *   **Hint:** Clicking "Hint" temporarily flashes the image back for 3 seconds.

## 4. Implementation Work Instructions (For AI Developer)

### Step 1: Data Preparation
1.  Open `public/ENGLISH_GOOGLE_SHEET_DATA.csv`.
2.  Add 3-5 rows for `spyglass-explorer`.
3.  Use `image_url` values like:
    *   `dynamic:scene:park`
    *   `dynamic:scene:beach`
    *   `dynamic:scene:room`

### Step 2: SVG Scene Generator
1.  Modify `DynamicImageRenderer` in `SheetBasedGame.tsx`.
2.  Add a case for `scene`.
3.  Create helper functions to render composite objects:
    *   `renderTree(x, y)`
    *   `renderBench(x, y)`
    *   `renderSun(x, y)`
4.  **Crucial:** Ensure the generated scene is **deterministic** based on a seed or consistent logic so it doesn't change between re-renders.

### Step 3: Spyglass Component
1.  Create `src/components/features/SpyglassImage.tsx`.
2.  Use a simple `div` with a background image.
3.  Overlay a `div` with `background: radial-gradient(...)` controlled by mouse X/Y state.
4.  Add a "Reveal" button for accessibility (toggle spyglass off).

### Step 4: Integration
1.  In `SheetBasedGame.tsx`, add logic for `gameId === 'spyglass-explorer'`.
2.  Implement the **Phase Timer** logic (Observation vs Question).
3.  Pass the `image_url` to the `SpyglassImage` component.

### Step 5: Verification
1.  Test "Easy" mode: Image stays visible.
2.  Test "Hard" mode: Image disappears after timer.
3.  Test Hint: Image reappears briefly.
