# dsh-marktext

A **WYSIWYG Markdown editor** for the DeepSeek Harness right sidebar, built on MarkText's muya engine.

Inline math like $E = mc^2$, and a display block:

$$
\int_0^1 x^2 \, dx = \frac{1}{3}
$$

| Feature | Status |
| --- | --- |
| KaTeX | ✅ |
| Tables | ✅ |
| Version guard | ✅ |

```ts
const editor = new Muya(el, { markdown })
editor.init()
```

> Saves go through `ctx.fs` with a version guard — a stale write is rejected, never overwritten.

- [x] Open any `.md` from the sidebar
- [ ] Your next idea
