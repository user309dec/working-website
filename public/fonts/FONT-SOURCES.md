# Portfolio fonts

All font files are self-hosted. No visitor requests to Google Fonts or another font CDN are needed.

- **English: Source Serif 4** (Adobe / Google Fonts), normal 400, 500, 600 and italic 400. The Latin WOFF2 files are copied unchanged from `@fontsource/source-serif-4` 5.3.1.
- **Chinese: LXGW WenKai / 霞鹜文楷**, normal 400 and bold 700, from `@fontsource/lxgw-wenkai` 5.3.0. The package names its Regular source file `500`, but the font's own OS/2 table correctly identifies it as weight 400. This site's CSS uses its actual weight.
- **Japanese: Klee One** (Fontworks), normal 400 and semibold 600, from `@fontsource/klee-one` 5.3.1. Klee One is the Japanese typeface on which LXGW WenKai is based, so the two languages have a related, restrained Kai-style appearance.

Each package was downloaded over verified HTTPS from the npm registry and verified against its published SHA512 integrity value before use. Versioned package URLs, checksums, source filenames, generated file sizes, and generated file SHA256 hashes are in `font-manifest.json`. Complete SIL Open Font License 1.1 notices are included in the three `*-LICENSE.txt` files. The Latin CSS face is selected by its exact source filename; its mask includes printable ASCII and every combining accent present in the file. The regeneration helper checks both conditions.

The CJK files are subset to the non-Latin characters in the static pages and their source translations. Their CSS declares only those supported Unicode codepoints, allowing later, newly added characters to fall back correctly instead of displaying a missing-glyph box. English runs use Source Serif 4. Japanese uses WenKai as a fallback for the simplified Chinese character `圳` in Shenzhen, which Klee One does not contain.

## Updating text

When Chinese or Japanese text changes, regenerate these assets with the included `regenerate-fonts.py`. It reads all three pages and the rendering/translation source files. Source archives are pinned and integrity-checked; the build and the deployed site require no Python or npm font packages.

From the repository root, with Python 3.12 or newer:

```sh
python -m venv /tmp/linus-font-tools
/tmp/linus-font-tools/bin/python -m pip install 'fonttools==4.61.1' 'brotli==1.2.0'
/tmp/linus-font-tools/bin/python public/fonts/regenerate-fonts.py
npm run build
```

Source packages are cached in `/tmp/linus-font-source-cache` by default; pass a different cache directory as the script's first argument if needed. The script keeps TLS verification enabled and verifies every archive before extraction. It changes only generated files inside `public/fonts`.
