# Homepage day photo credits

This is source documentation for the nine user-selected homepage photographs, in chronological order. It is not shipped as a public page.

Delivery files are in `public/assets/day-photos-v1/`. All nine are 1100 × 733 WebP files, quality 90, created with Pillow LANCZOS. Processing is limited to focal cropping, resizing and delivery compression. No exposure, color, retouching, relighting, object edits or AI generation were applied. Original ICC profiles are preserved when supplied. The output ratio is 1100:733, approximately 3:2.

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

Coordinates below are `(left, top, right, bottom)` floating-point pixel boundaries in the EXIF-oriented original. The region is sampled directly to the delivery dimensions in one resize step.

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
| `00-sleep.webp` | 80822 | `8440ff30dccd0e996c845568f648bc5cdabc60130c6c5d9d47d32d6aa7516626` |
| `07-morning-rush.webp` | 150866 | `8f9c4a28728fbff1a0fef9bf2a661494e45a91f8a7877c1bb4945ca09a5073d4` |
| `08-coffee.webp` | 59530 | `7fa5d76c57545f2b89fddbcdfcf723e9f35356a0b9cdd8fbe361060bb6674abc` |
| `09-meeting.webp` | 81648 | `6563d5ea2ea74a89fd3b6157d28c0265717e758ad58f1026e7db3a265953d7ce` |
| `12-lunch.webp` | 157976 | `a3e92d3127fa8563654d76bc7a9da1862a0095fd649e06f020aba97e26cd159a` |
| `15-work-reflection.webp` | 74566 | `992f638cec3d060ae17849bdb5a7cec2b7297e2bb4d995d6d2f926b802ce7bd1` |
| `18-exercise.webp` | 203176 | `e093888cb08cda1baaa012fea92e3158855d3ae86a1e13df7813ff43e5531977` |
| `20-home-conversation.webp` | 115558 | `ebb3108404af5aaed6cb7bb98fb2627c8ac56534a37804f8eddde82af7d6ecd4` |
| `22-daily-reflection.webp` | 148920 | `7f0edca0bc78de725e6ee4ba126e64213e113573cc9bfa5a0009e199fcbe70eb` |
