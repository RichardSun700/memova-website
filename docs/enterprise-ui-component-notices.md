# Enterprise UI component provenance

Date: 2026-11-10. Local demonstration only; no paid templates purchased, no MCP installed, no deployment.

## Magic UI Animated Beam

- Official documentation: https://magicui.design/docs/components/animated-beam
- Official registry source read: https://magicui.design/r/animated-beam.json
- License: https://github.com/magicuidesign/magicui/blob/main/LICENSE.md
- Adaptation: `client/src/components/enterprise/AnimatedBeam.tsx`. Retains the ref/ResizeObserver geometry and animated gradient approach. Adds responsive cubic paths, explicit pause, reduced-motion support and existing `framer-motion` imports. Omits unused upstream options.

MIT License

Copyright (c) Magic UI

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Aceternity UI Timeline

- Official component: https://ui.aceternity.com/components/timeline
- Official registry source read: https://ui.aceternity.com/registry/timeline.json
- Free component tier: https://ui.aceternity.com/pricing
- Published license: https://ui.aceternity.com/licence
- Adaptation: `client/src/components/enterprise/WorkflowTimeline.tsx`. Uses the scroll-progress rail and sticky stage-heading pattern, adapted to Memova's data lifecycle and existing Motion dependency. Replaces the sample content, CSS, height measurement and purple gradient; adds responsive layout and reduced-motion support.

The published license allows modified end products but prohibits redistribution as a component/template product. It is not labeled MIT here. The license page is framed around Pro items; only the publicly available Timeline component was consulted, not a Pro block or template. Recheck the applicable component terms before public release; this task does not authorize publication or a license purchase.

## Layout reference

- User-selected Zaro reference: https://land-book.com/websites/100967-zaro-make-your-company-ai-ready
- Reference screenshot was inspected for the centered hierarchy, open canvas, source cards and company-context narrative. No Zaro copy, logos, proprietary artwork or page code is included in the app.
- Memova brand assets remain the existing local `/brand/` assets. Brand tokens follow `homepage-watch/src/styles.css`.
- No new npm dependency, remote runtime widget, external font or third-party data service is added by this demonstration.
