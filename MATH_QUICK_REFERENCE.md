# Math Formula Quick Reference Guide

Quick reference for writing mathematical formulas in your Jekyll blog.

---

## Basic Syntax

### Inline Math
```markdown
This is inline math: $f(x) = x^2$ in a sentence.
```

### Display Math
```markdown
This is display math:

$$
f(x) = \frac{a}{b} + \sum_{i=1}^{n} x_i
$$
```

---

## Common Patterns

### ✅ Correct Usage

| Type | Markdown | Renders As |
|------|----------|------------|
| Brackets | `$[a, b]$` | $[a, b]$ |
| Auto-size brackets | `$\left[\frac{a}{b}\right]$` | $\left[\frac{a}{b}\right]$ |
| Fractions | `$\frac{a}{b}$` | $\frac{a}{b}$ |
| Subscripts | `$x_1, x_2$` | $x_1, x_2$ |
| Superscripts | `$x^2, e^{-x}$` | $x^2, e^{-x}$ |
| Greek letters | `$\alpha, \beta, \theta$` | $\alpha, \beta, \theta$ |
| Vectors | `$\mathbf{v}, \mathbf{x}$` | $\mathbf{v}, \mathbf{x}$ |
| Degrees | `$90^\circ$` or `$90\degree$` | $90^\circ$ |
| Norms | `$\lVert x \rVert$` or `$\norm{x}$` | $\lVert x \rVert$ |
| Absolute value | `$\lvert x \rvert$` or `$\abs{x}$` | $\lvert x \rvert$ |

### ❌ Incorrect Usage (Don't Use)

| Wrong | Use Instead |
|-------|-------------|
| `$\lbrack a, b \rbrack$` | `$[a, b]$` |
| `$$x = 5$$` (inline) | `$x = 5$` |
| `$x = 5$` (in display) | `$$x = 5$$` |

---

## Advanced Features

### Matrices
```markdown
$$
\begin{bmatrix}
a & b \\
c & d
\end{bmatrix}
$$
```

### Aligned Equations
```markdown
$$
\begin{aligned}
f(x) &= x^2 + 2x + 1 \\
     &= (x + 1)^2
\end{aligned}
$$
```

### Cases
```markdown
$$
f(x) = \begin{cases}
x^2 & \text{if } x \geq 0 \\
-x^2 & \text{if } x < 0
\end{cases}
$$
```

### Sums and Integrals
```markdown
$$
\sum_{i=1}^{n} x_i = \int_{0}^{1} f(x) \, dx
$$
```

---

## Custom Macros Available

These shortcuts are available in your configuration:

| Macro | Usage | Result |
|-------|-------|--------|
| `\norm{x}` | `$\norm{x}$` | $\lVert x \rVert$ |
| `\abs{x}` | `$\abs{x}$` | $\lvert x \rvert$ |
| `\arccos` | `$\arccos(x)$` | $\operatorname{arccos}(x)$ |
| `\arcsin` | `$\arcsin(x)$` | $\operatorname{arcsin}(x)$ |
| `\arctan` | `$\arctan(x)$` | $\operatorname{arctan}(x)$ |
| `\argmax` | `$\argmax f(x)$` | $\operatorname{arg\,max} f(x)$ |
| `\argmin` | `$\argmin f(x)$` | $\operatorname{arg\,min} f(x)$ |
| `\degree` | `$90\degree$` | $90^\circ$ |

---

## Tips & Tricks

### 1. Escaping Special Characters
If you need literal `$` in text, escape it:
```markdown
The price is \$50.
```

### 2. Math in Headings
Works, but keep it simple:
```markdown
## Section about $f(x) = x^2$
```

### 3. Multi-line Display Math
Use `$$...$$` with blank lines:
```markdown
Some text here.

$$
f(x) = x^2
$$

More text here.
```

### 4. Spacing in Math
- No space: `$xy$` → $xy$
- With space: `$x \, y$` → $x \, y$
- Wide space: `$x \quad y$` → $x \quad y$

### 5. Text in Math Mode
```markdown
$f(x) = \text{constant}$
```

---

## Common Symbols

### Greek Letters
```
\alpha, \beta, \gamma, \delta, \epsilon, \zeta, \eta, \theta
\iota, \kappa, \lambda, \mu, \nu, \xi, \pi, \rho
\sigma, \tau, \upsilon, \phi, \chi, \psi, \omega
```

### Operators
```
\sum, \prod, \int, \oint, \bigcup, \bigcap
\lim, \sup, \inf, \max, \min
```

### Relations
```
=, \neq, <, >, \leq, \geq, \approx, \equiv
\in, \notin, \subset, \subseteq, \supset, \supseteq
```

### Logic
```
\land (AND), \lor (OR), \neg (NOT)
\forall, \exists, \nexists
\implies, \iff
```

### Arrows
```
\rightarrow, \leftarrow, \leftrightarrow
\Rightarrow, \Leftarrow, \Leftrightarrow
```

---

## Testing Your Math

### Local Testing
```bash
bundle exec jekyll serve
```
Then open: http://localhost:4000

### Browser Console
Check for MathJax:
```javascript
window.MathJax  // Should be defined
```

### Common Errors
1. **Formula not rendering**: Check for mismatched `$` delimiters
2. **Wrong brackets**: Use `[]` not `\lbrack\rbrack`
3. **Console errors**: Check browser developer tools
4. **Missing package**: Stick to standard LaTeX commands

---

## Resources

- MathJax Documentation: https://docs.mathjax.org/
- LaTeX Math Symbols: https://oeis.org/wiki/List_of_LaTeX_mathematical_symbols
- Your config: `_includes/head/custom.html`

---

*Quick Reference for skcKenneth.github.io*  
*Last Updated: November 22, 2025*

