# Blinkered dictionary: Russian

The Russian word list, and the evidence for every word in it.

Built by [`blinkered-attestation`](../blinkered-attestation). The rule, the evidence format and
the reasoning live there; what lives here is Russian.

## What is in this repository

```
sources.mjs        which collections attest Russian, and why those
attestations/      the evidence: every candidate, what saw it, and where
words.txt          what survived, in Blinkered's own format
dropped.tsv        what did not, and how close it came
SATURATION.md      what each family was worth, measured from the evidence
curve.json         the same curve, for the chart in blinkered-attestation
```

The evidence is a **directory** rather than one file because Russian's runs to 164 megabytes and
GitHub warns above fifty. Each of the five shards is a complete, independently valid evidence
file with its own header and digest.

`.cache/` holds the downloaded collections and is not tracked. Everything here is regenerable
with `pnpm build`.

## Where the words come from

Candidates come from Blinkered's current Russian list — 424,352 of them, the third largest in the
set. Six collections in four families answer them:

| family | collections | register |
| --- | --- | --- |
| Wikimedia | Russian Wikipedia, Russian Wikisource | encyclopedic prose; digitised older texts |
| Leipzig | `rus_news_2024_1M`, `rus_news_2023_1M` | modern news |
| Tatoeba | Russian sentences | contemporary, conversational |
| Common Crawl | FineWeb-2 Russian | the crawled web |

Four families, and that is the thing to fix rather than the thing to celebrate. Six collections
sounds ample and is not: two Wikimedia projects are one organization's opinion about what Russian
is, and two Leipzig packages are one crawler run twice.

## Where the returns stop — they have not

[`SATURATION.md`](SATURATION.md) has the curve:

```
  1  commoncrawl        0   0.0%
  2  wikimedia          0   0.0%
  3  leipzig      173,653  40.9%  +173,653
  4  tatoeba      210,392  49.6%   +36,739
```

The fourth family added thirty-six thousand words. That is not a curve flattening out, it is a
curve cut off: Russian ran out of families before it ran out of gains, which is exactly the
signal that says keep going. Twenty Russian publishers are listed in `sources.mjs` under
`DOMAINS` and have not been harvested yet. Korean went from 6.8% to 45.4% on the same move.

So 49.6% is a floor, not a finding.

## Reading the result

**The keep rate is not the check. The drop list is.** Russian's candidate list is enormous
because Russian inflects heavily, and a large share of what dropped will be case and aspect forms
that no corpus outside a dictionary attests. That is the rule working. But only somebody who
reads Russian can tell that from a missing collection, and `dropped.tsv` is sorted to make it
easy: three-family near misses first, then two, then one, then the words nothing saw.

## Rebuilding

```sh
pnpm install
pnpm build       # writes the evidence, words.txt, dropped.tsv
pnpm conform     # checks that words.txt says only what the evidence supports
pnpm saturation  # re-measures what each family was worth
pnpm verify --sample 10      # fetches cited pages and checks they hold the word
pnpm harvest 250 # fetches pages from the publishers in DOMAINS
```

A change here is not finished until the roll-up in `blinkered-attestation` is regenerated —
`pnpm roll` there. That is
[the rule](../blinkered-attestation/README.md#the-rule-for-changing-a-language), and it exists
because a summary nobody can trust is worse than no summary.

## Before this ships

The common-tier cut in `sources.mjs` is carried over from Blinkered's calibration against the
**old** list, and has to be re-measured before this reaches the game. Skipping it is a silent
fault rather than a loud one: the word floor ends up above what any board can reach, every draw
is rejected, and the generator plays its best failed attempt while reporting failure.

## Licensing

Three kinds of thing live here and they do not share terms. The distinction is the
project: a licence that claimed more than we can support would undo the argument the
evidence is here to make. [NOTICE](NOTICE) is the authority; this is the summary.

| | terms | what |
| --- | --- | --- |
| **Code and docs** | [Apache-2.0](LICENSE) | `build.mjs`, `sources.mjs`, `harvest.mjs`, `conform.mjs`, `saturation.mjs`, and the Markdown |
| **The list and its evidence** | [CC0-1.0](https://creativecommons.org/publicdomain/zero/1.0/) | `words.txt`, `attestations/*.tsv`, `status.json`, `SATURATION.md`, `COLLECTIONS.md`, `searched.tsv` |
| **The words we could not prove** | `BSD-3-Clause` | `dropped.tsv` — **not ours to license** |

**Why the list is CC0.** A word ships because three independent collections of text were
found to contain it. The record of which collections, and where in them, is a statement
of fact about those texts rather than a copy of them, and nothing a licence governs was
taken from the dictionary that proposed the candidates. To the extent any right subsists
in the compilation, it is waived.

**Why `dropped.tsv` is not.** Every other file here rests on evidence we gathered. That
one does not: it is the candidates that failed, and a candidate that failed is a word we
have nothing to say about except that somebody's dictionary proposed it. That makes the
file a subset of that dictionary and it carries that dictionary's terms — here
`BSD-3-Clause`. See
[`blinkered-attestation/candidates/ru/LICENSE`](https://github.com/blinkered/blinkered-attestation/blob/main/candidates/ru/LICENSE).
