---
name: unlumen-ui
description: Install and integrate public unlumen UI components in React and Next.js applications through its shadcn-compatible registry. Use for polished animated interfaces, accessible interactions, component selection, and unlumen registry troubleshooting.
---

# unlumen UI

Use unlumen UI's public, MIT-licensed component registry to add polished animated React components. Documentation: https://ui.unlumen.com/docs

## Workflow

1. Confirm the project uses React/Next.js and Tailwind CSS.
2. Confirm `components.json` has the project paths and this registry:

```json
{
  "registries": {
    "@unlumen-ui": "https://ui.unlumen.com/r/{name}.json"
  }
}
```

3. Discover public components at `https://ui.unlumen.com/r/registry.json` or in the upstream `registry/` directory.
4. Install only components needed by the requested design:

```bash
npx shadcn@latest add @unlumen-ui/<component-name>
```

5. Review generated files and adapt imports to the project's aliases. Keep third-party registry components in the configured registry component directory.
6. Validate keyboard operation, visible focus, reduced-motion behavior, mobile overflow, types, lint, and production build.

## Pro components

Public registry items do not require a key. Pro components require `UNLUMEN_LICENSE_KEY` in `.env.local` and an Authorization header in `components.json`, as documented at https://ui.unlumen.com/docs/mcp. Never commit or request a license key unless the user explicitly owns Pro access; never place credentials in source control.

## Design guidance

- Use one prominent animated primitive per section; avoid distracting stacked effects.
- Preserve semantic controls and accessible labels.
- Respect `prefers-reduced-motion`.
- Prefer component props and `className` customization over rewriting component internals.
