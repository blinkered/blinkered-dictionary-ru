/**
 * The collections that attest Russian, and where each comes from.
 *
 * The only language-specific file in this repository. How to read a collection lives in
 * `@blinkered/attestation`; what lives here is which collections, and why those.
 *
 * Chosen for **family** as much as for volume. Three collections gathered by one organization
 * are one opinion, so what matters is how many genuinely separate gatherers a word can be found
 * by: a wiki, a newspaper crawler, a shelf of books, a sentence bank, a translation, the crawled
 * web, and any site we fetch ourselves.
 */

import { createReadStream, existsSync, readFileSync, readdirSync } from 'node:fs'
import { createInterface } from 'node:readline'
import {
  fileDocuments,
  fineweb2Documents,
  gutenbergBody,
  harvestDocuments,
  leipzigLocators,
  leipzigSentences,
  tatoebaDocuments,
  verseDocuments,
  wikiDocuments,
} from '@blinkered/attestation'

export const LANGUAGE = 'ru'

const CACHE = new URL('.cache/raw/', import.meta.url).pathname

/** A Leipzig package, with its sentence-to-URL index resolved up front. */
function leipzig(pkg) {
  const base = `${CACHE}${pkg}/${pkg}`
  const locators = leipzigLocators(
    readFileSync(`${base}-inv_so.txt`, 'utf8'),
    readFileSync(`${base}-sources.txt`, 'utf8'),
  )
  const lines = createInterface({
    input: createReadStream(`${base}-sentences.txt`),
    crlfDelay: Infinity,
  })
  return leipzigSentences(lines, locators)
}

/** A directory of Gutenberg texts, each named by its permanent ebook number. */
function gutenberg(dir) {
  const at = `${CACHE}${dir}`
  const books = readdirSync(at)
    .filter((file) => file.endsWith('.txt'))
    .map((file) => ({ locator: file.replace('.txt', ''), path: `${at}/${file}` }))
  return fileDocuments(books, async (path) => gutenbergBody(readFileSync(path, 'utf8')))
}

export const SOURCES = [
  {
    id: 'wiki:ru',
    what: 'Russian Wikipedia — modern encyclopedic prose',
    needs: `${CACHE}ruwiki.xml.bz2`,
    documents: () => wikiDocuments(`${CACHE}ruwiki.xml.bz2`),
  },
  {
    id: 'wikisource:ru',
    what: 'Wikisource — same Wikimedia family, so it corroborates rather than counts',
    needs: `${CACHE}ruwikisource.xml.bz2`,
    documents: () => wikiDocuments(`${CACHE}ruwikisource.xml.bz2`),
  },
  {
    id: 'lz:rus_news_2024_1M',
    what: 'Leipzig rus_news_2024_1M — modern news, cited by the page each sentence came from',
    needs: `${CACHE}rus_news_2024_1M`,
    documents: () => leipzig('rus_news_2024_1M'),
  },
  {
    id: 'lz:rus_news_2023_1M',
    what: 'Leipzig rus_news_2023_1M — modern news, cited by the page each sentence came from',
    needs: `${CACHE}rus_news_2023_1M`,
    documents: () => leipzig('rus_news_2023_1M'),
  },
  {
    id: 'tat',
    from: 'https://downloads.tatoeba.org/exports/per_language/rus/rus_sentences.tsv.bz2',
    what: 'Tatoeba — contemporary, conversational',
    needs: `${CACHE}rus_sentences.tsv`,
    documents: () => tatoebaDocuments(`${CACHE}rus_sentences.tsv`),
  },
  {
    id: 'fw2',
    // Where it came from, so a half-finished download is caught before it is read.
    from: 'https://huggingface.co/datasets/HuggingFaceFW/fineweb-2/resolve/main/data/rus_Cyrl/train/000_00000.parquet',
    what: 'FineWeb-2 — the crawled web, each document citing its own URL',
    needs: `${CACHE}fineweb2-rus.parquet`,
    documents: () => fineweb2Documents(`${CACHE}fineweb2-rus.parquet`),
  },
].filter((source) => {
  // A collection that has not been downloaded is skipped with a warning rather than crashing
  // the build, and which collections a language actually has is a fact worth seeing in the log.
  // Checked by path rather than by calling `documents()`: these are lazy generators, so calling
  // one proves nothing and calling it twice would open the file twice.
  if (existsSync(source.needs)) return true
  process.stderr.write(`  (skipping ${source.id}: ${source.needs} is not in .cache/raw)\n`)
  return false
})

/**
 * Pages fetched by searching for words the collections missed, one family per domain.
 *
 * Absent until a harvest has been run; see the repository README.
 */
export const HARVEST = existsSync(new URL('searched.tsv', import.meta.url).pathname)
  ? () => harvestDocuments(new URL('searched.tsv', import.meta.url).pathname)
  : undefined

/** Russian publishers, each its own family. */
export const DOMAINS = [
  // Books and literary journals, a register the news domains above never reach
  'lib.ru', 'ilibrary.ru', 'rvb.ru', 'feb-web.ru', 'magazines.gorky.media',
  'gorky.media', 'polka.academy', 'prochtenie.org',
  'ria.ru', 'tass.ru', 'kommersant.ru', 'vedomosti.ru', 'rbc.ru', 'lenta.ru',
  'gazeta.ru', 'iz.ru', 'rg.ru', 'interfax.ru', 'fontanka.ru', 'meduza.io',
  'novayagazeta.eu', 'republic.ru', 'habr.com', '3dnews.ru', 'cnews.ru',
  'championat.com', 'sports.ru', 'afisha.ru',
]

/** Carried over from Blinkered's calibration; must be re-measured before anything ships. */
export const COMMON_CUT = 18095
