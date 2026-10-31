# Homepage day photo credits

This is source documentation for the nine user-selected homepage photographs, in chronological order. It is not shipped as a public page.

Delivery files are in `public/assets/day-photos-v1/`. The 2026-10-31 performance revision keeps the same nine photographs and approved crops, resizing the retained 1100 × 733 delivery images to 640 × 426 with Sharp Lanczos3 and WebP quality 74. Processing is limited to resizing and delivery compression; no additional crop, exposure, color, retouching, relighting, object edits or AI generation were applied. Original ICC profiles are preserved when supplied. The displayed ratio remains approximately 3:2.

The downloaded originals, machine-readable crop boxes, hashes and QA contact sheets are archived outside the deployment repository at `website-preview/app/qa/day-photos-v1/`. Originals were downloaded using curl with default TLS certificate verification.

The official Pexels and Unsplash license pages were reviewed on 2026-10-30. These are stock-photo licenses, not public-domain claims; the linked terms remain the authoritative reference.

| Time | Delivery file | Photographer | Source photo | License |
| --- | --- | --- | --- | --- |
| 00:30 | `00-sleep.webp` | Simeon Stoilov | [Pexels 19191287](https://www.pexels.com/photo/19191287/) | [Pexels License](https://www.pexels.com/license/) |
| 07:00 | `07-morning-rush.webp` | kittbui | [Pexels 27054248](https://www.pexels.com/photo/27054248/) | [Pexels License](https://www.pexels.com/license/) |
| 08:15 | `08-coffee.webp` | Angela Roma | [Pexels 7319192](https://www.pexels.com/photo/7319192/) | [Pexels License](https://www.pexels.com/license/) |
| 09:30 | `09-meeting.webp` | Jakub Zerdzicki | [Pexels 36755512](https://www.pexels.com/photo/modern-office-conference-room-with-empty-chairs-36755512/) | [Pexels License](https://www.pexels.com/license/) |
| 12:30 | `12-lunch.webp` | sheri silver | [Unsplash 1691201090878-1b9eab935bdd](https://unsplash.com/photos/two-plates-of-food-on-a-white-table-nmJRb8MPCLQ) | [Unsplash License](https://unsplash.com/license) |
| 15:30 | `15-work-reflection.webp` | Ketut Subiyanto | [Pexels 4559555](https://www.pexels.com/photo/4559555/) | [Pexels License](https://www.pexels.com/license/) |
| 18:30 | `18-exercise.webp` | MART PRODUCTION | [Pexels 8032758](https://www.pexels.com/photo/8032758/) | [Pexels License](https://www.pexels.com/license/) |
| 20:00 | `20-home-conversation.webp` | Ayşe Nur | [Pexels 15509825](https://www.pexels.com/photo/15509825/) | [Pexels License](https://www.pexels.com/license/) |
| 22:30 | `22-daily-reflection.webp` | betulnurakyurek | [Pexels 34640247](https://www.pexels.com/photo/34640247/) | [Pexels License](https://www.pexels.com/license/) |

## Crop notes

Coordinates below are `(left, top, right, bottom)` floating-point pixel boundaries in the EXIF-oriented original. They describe the approved crop used for the retained 1100 × 733 images. The current 640 × 426 performance files are resized from those cropped images without changing the selected region.

- **00:30 · `00-sleep.webp`** — original 2000 × 3000; crop `(0, 850, 2000, 2182.727273)`. Full original width; crop the middle/lower bedroom so the bedside lamp, pillow, headboard and upper bed remain together.
- **07:00 · `07-morning-rush.webp`** — original 3543 × 2397; crop `(0, 18.036818, 3543, 2378.963182)`. Near-full landscape frame; remove only the narrow top/bottom excess, retaining both doorway shoes and the diagonal sunlight.
- **08:15 · `08-coffee.webp`** — original 5040 × 3360; crop `(0, 0.763636, 5040, 3359.236364)`. Near-full landscape frame, retaining the entire takeaway cup, tabletop and plant context.
- **09:30 · `09-meeting.webp`** — original 3000 × 2000; crop `(0, 0.454545, 3000, 1999.545455)`. Near-full landscape frame, retaining the empty meeting-table row and chairs.
- **12:30 · `12-lunch.webp`** — original 1937 × 2583; crop `(0, 640, 1937, 1930.746364)`. Full original width with a middle crop; both plates/servings remain identifiable. The portrait original cannot fit both complete plate rims in a landscape frame.
- **15:30 · `15-work-reflection.webp`** — original 6000 × 4000; crop `(0, 0.909091, 6000, 3999.090909)`. Near-full landscape frame, retaining the laptop, orange notebook, pens and document stack.
- **18:30 · `18-exercise.webp`** — original 5857 × 3905; crop `(0, 1.054091, 5857, 3903.945909)`. Near-full landscape frame, retaining the mat, water bottle, jump rope and towel.
- **20:00 · `20-home-conversation.webp`** — original 3024 × 4032; crop `(0, 1600, 3024, 3615.083636)`. Full original width and lower portion; retain both teacups, their saucers and the round wooden tabletop, reducing blank fabric above.
- **22:30 · `22-daily-reflection.webp`** — original 5760 × 3840; crop `(0, 0.872727, 5760, 3839.127273)`. Near-full landscape frame, retaining the open handwritten journal, pencil, candle, book and floral context.

## Delivery integrity

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| `00-sleep.webp` | 13974 | `0d438f4c1083e1cfd74c69806668658e2b82ffa4d02cf9d17e1a3ccc23ce1185` |
| `07-morning-rush.webp` | 11356 | `fa586d3cb13e23ea4c7943051ca53a0297db5b4e60eedc0e1e338aef1578827b` |
| `08-coffee.webp` | 10222 | `373c96a3a54e3d420c48a7bcde1d6125edd921b338db1e666281736c4efac623` |
| `09-meeting.webp` | 14920 | `a8895818fc54e27d3a1f4b61da76ef6050408d174165294cd343a23cbaaf3253` |
| `12-lunch.webp` | 38388 | `ca51515c7ba74511b9088e379c566f46c936b64affcdb502cae4a03be186630e` |
| `15-work-reflection.webp` | 16894 | `c0c33b5129089d06c84e1e661f707d0208733e93eaaf1aa8f8fac865f820ce57` |
| `18-exercise.webp` | 13530 | `07b4b3e192fde29a4243dced80f6a39b3677b2529c43b9351990325e7a26683a` |
| `20-home-conversation.webp` | 18018 | `638364ffe47c4bf759745a1e235fc7af82bb5daaa1938c6408b4620ff509a553` |
| `22-daily-reflection.webp` | 33616 | `61d531d2dba2bb75ec6cda6fb60eb926e15b747e6273150e26fa3d987d69eea1` |
