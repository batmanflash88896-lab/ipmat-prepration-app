---
name: neobrutalism-ui
description: Build and customize bold neobrutalist React interfaces using the neobrutalism.dev shadcn-compatible component registry. Use for high-contrast cards, buttons, forms, dashboards, and playful educational app interfaces.
---

# Neobrutalism UI

Use the public Neobrutalism component library for bold React and Tailwind interfaces. Documentation: https://www.neobrutalism.dev/docs

## Workflow

1. Confirm React/Next.js, Tailwind CSS, and a valid `components.json` configuration.
2. Discover components at `https://neobrutalism.dev/r/registry.json` and review the component's documentation before installation.
3. Install by full registry URL:

```bash
npx shadcn@latest add https://neobrutalism.dev/r/<component-name>.json
```

If a namespace is configured, this equivalent is available:

```bash
npx shadcn@latest add @neobrutalism/<component-name>
```

4. Keep installed registry files separate from the application's existing shared UI modules.
5. Customize with the project's color tokens while preserving the visual language: thick borders, offset hard shadows, high contrast, clear hierarchy, and restrained use of playful rotations.
6. Run type-check/build and test focus, keyboard interaction, contrast, mobile layout, and disabled states.

## IPMAT app guidance

Use neobrutalism selectively for action cards, daily challenges, streak badges, quiz choices, and score summaries. Keep long reading passages and dense analytics calmer for readability. Animation must not make timed tests harder to use.
