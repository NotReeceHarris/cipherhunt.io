# CipherHunt — Solver's Guide

You have one thing: a string of characters. This guide tells you what to do with it.

---

## What you already know

Before you touch the ciphertext, three facts are yours for free:

**The plaintext is always exactly five English words** — separated by single spaces, no digits, no punctuation, no uppercase. Every character is in the set `[a-z ]`.

**The output is printable ASCII.** Whatever encoding is used maps cleanly to readable characters.

**There may or may not be a key.** Some ciphers are keyless — the transformation is fixed, and recovering the algorithm is enough. Others require both the algorithm and a key. You won't be told which upfront; that's part of the puzzle.

Everything else — whether spaces survive into the ciphertext, whether the length changes — depends on how that specific cipher works. Observe it, don't assume it.

---

## First steps — always do these

### 1. Check length and spaces

Does the ciphertext have the same number of characters as you'd expect? Are there visible spaces, and if so, do they line up with natural word boundaries?

If spaces are preserved, word lengths are a direct clue. If they're not — or if the total length has changed — the cipher likely includes a [transposition step](https://en.wikipedia.org/wiki/Transposition_cipher) or multi-character encoding, and you need to account for that before any word-level analysis.

### 2. Identify the character set

The output encoding directly hints at the transformation applied:

- **All lowercase letters** → likely a [letter-based substitution or shift cipher](https://en.wikipedia.org/wiki/Substitution_cipher)
- **Mixed uppercase** → alphabet was expanded, or case was used as part of encoding
- **Digits and symbols** → a numeric or modular mapping was used, or the output was remapped into a wider character range (see [ASCII encoding](https://en.wikipedia.org/wiki/ASCII))

### 3. Run frequency analysis

Do any characters appear far more often than others? In English plaintext, `e`, `t`, `a`, `o` dominate. If the ciphertext frequency distribution looks English-shaped, the substitution is [monoalphabetic](https://en.wikipedia.org/wiki/Substitution_cipher#Simple_substitution). If it looks flat, something position-dependent is going on. A full primer on frequency analysis is available at [dcode.fr — frequency analysis](https://www.dcode.fr/frequency-analysis).

### 4. Look for structural patterns

Does a word have repeated characters in a pattern like `ABBA` or `ABCC`? These structural fingerprints survive many substitution ciphers and help identify specific words before you've cracked the key.

---

## By difficulty

### Daily — solve within a day

The transformation is shallow: at most two steps, usually one. The key space is small enough to brute-force once you identify the cipher type.

**Approach:**

1. Start with frequency analysis. If one character is clearly dominant, it's probably `e` or space.
2. Try a [Caesar shift](https://en.wikipedia.org/wiki/Caesar_cipher) first — shift every letter by a fixed amount and see if words appear. All 25 offsets can be tested at [dcode.fr — Caesar cipher](https://www.dcode.fr/caesar-cipher).
3. If a single shift doesn't work, try a [Vigenère-style approach](https://en.wikipedia.org/wiki/Vigen%C3%A8re_cipher): the key repeats, so every Nth character is shifted by the same amount. Find the key length using the [Kasiski test](https://en.wikipedia.org/wiki/Kasiski_examination) or [index of coincidence](https://en.wikipedia.org/wiki/Index_of_coincidence).
4. If positions seem shuffled rather than substituted, consider whether reversing words, or reading columns instead of rows, produces something coherent — these are hallmarks of a [rail fence](https://www.dcode.fr/rail-fence-cipher) or [columnar transposition](https://en.wikipedia.org/wiki/Transposition_cipher#Columnar_transposition).
5. Keys can be brute-forced if you know their format — try small integers (0–25) or short words.

### Weekly — solve in a few days

Two or three transformations are layered. The key is position-dependent — the same key character produces different shifts at different positions.

**Approach:**

1. Single-character frequency analysis won't crack it directly. Instead, use the [index of coincidence (IoC)](https://en.wikipedia.org/wiki/Index_of_coincidence): an IoC close to English (~0.065) means monoalphabetic underneath; near random (~0.038) means [polyalphabetic or position-dependent](https://en.wikipedia.org/wiki/Polyalphabetic_cipher).
2. Try to isolate one transformation at a time. If a transposition happened, look for anagram relationships between word-length groups.
3. Group characters by position modulo N. If grouping by N makes frequency distributions look English-shaped, N is likely related to the key length — this is the core of [Friedman's IoC technique](https://en.wikipedia.org/wiki/William_F._Friedman).
4. Use known-plaintext attacks: guess common short words and their positions to anchor your analysis. The [Vigenère solver at dcode.fr](https://www.dcode.fr/vigenere-cipher) supports partial known-plaintext.

### Monthly — solve over weeks

Three layers: key expansion, per-character substitution, and structural rearrangement. The key schedule is derived from the full key, making it sensitive to every character. Output often spans a wider character range.

**Approach:**

1. The [transposition layer](https://en.wikipedia.org/wiki/Transposition_cipher) means characters are in the wrong order *and* the wrong value. This defeats word-level analysis until you reverse the rearrangement first.
2. Look for **block structure**: repeating patterns at fixed intervals hint at the block size used in the transposition. Try grouping characters into blocks of N and see if rearranging within blocks produces something more English-shaped. [CyberChef](https://gchq.github.io/CyberChef/) is excellent for testing rearrangement hypotheses visually.
3. The substitution layer is position-dependent, so frequency analysis across the whole text is unlikely to help. Focus on recovering the transposition before tackling substitution — it's the outer layer.
4. If you can guess a single word at a known position, use it to extract key schedule values at those positions and extrapolate the key expansion function. This is a form of [known-plaintext attack](https://en.wikipedia.org/wiki/Known-plaintext_attack).
5. These ciphers require structural reverse-engineering before key recovery. Map out what the algorithm must look like before you try to crack the key.

---

## Tools

| Tool | Best for |
|---|---|
| [quipqiup.com](https://quipqiup.com) | Fast monoalphabetic substitution solving |
| [dcode.fr](https://www.dcode.fr/cipher-identifier) | Cipher identification and classical cipher solvers |
| [CyberChef](https://gchq.github.io/CyberChef/) | Chaining transformations and inspecting intermediate results |
| [Python](https://www.python.org) | Scripting frequency distributions, IoC tests, brute-force over small key spaces |
| [Cryptogram Solver — quipqiup](https://quipqiup.com) | Automated substitution breaking |
| [Practical Cryptography](http://practicalcryptography.com/cryptanalysis/) | Reference guide for classical cipher cryptanalysis techniques |

---

## The meta-rule

Each cipher is designed to feel novel. Don't assume you know what it is after one glance — **observe first, hypothesise second, test third.** The right question is always:

> *What property of the ciphertext tells me what the first transformation was?*