# AI Study Portal

AI study outputs portal with Supabase authentication.

- Portal: https://taeu0102.github.io/ai-study-portal/
- Steal & Bomb: https://taeu0102.github.io/ai-study-portal/steal-bomb-game/
- ETF Board: https://taeu0102.github.io/ai-study-portal/etf-board/
- Portfolio City Seoul Reference: https://taeu0102.github.io/ai-study-portal/portfolio-city/seoul-reference/

## 2026-08-11 Portfolio City Seoul Map Correction

- Portfolio City: https://taeu0102.github.io/ai-study-portal/portfolio-city/
- Reworked the city backdrop around a clearer Seoul layout: Han River running east-west, northern mountains, Namsan north of the river, Yeouido-like island and bridges to the west, and a Jamsil-style landmark in the southeast.
- Updated the building art board backdrop to use the same Seoul-oriented river and city-axis composition.

## 2026-08-11 Portfolio City Seoul Reference

- Rebuilt the Seoul reference board with 100 images dated 2020 or later from Wikimedia Commons public-license metadata.
- Added visible year/date fields to the image board and a `year` column to the CSV metadata.
- Excluded pre-2020 titles/descriptions, aircraft event photos, non-Seoul satellite images, KOCIS/government Flickr restriction text entries, and unrelated indoor/detail shots during selection.

## 2026-08-11 Portfolio City Seoul Map Art

- Generated and applied a Seoul-inspired SLG map background from the 2020+ reference-board direction.
- Added `portfolio-city/assets/images/seoul-game-map-bg-v1.webp` and documented the generation direction for future Seoul-based building assets.
- Replaced the old CSS-only symbolic Seoul decorations with the generated map art and kept CSS time-of-day overlays for morning, noon, and sunset.

## 2026-08-11 Portfolio City Building Art Blend

- Retuned the in-app SVG building art to better match the generated Seoul map background.
- Reduced building saturation, stroke weight, label opacity, and tile-pad intensity so buildings read as part of the same SLG illustration layer.
- Kept the existing building SVG structure for future Seoul-based asset replacement.
