# In the News — Adding Cards

The In the News page renders cards dynamically from `newsCards.json`. New cards can be added without modifying the React component.

## How to Add a New Card

1. Add the image to `public/news/`.
2. Open `src/pages/NewsOurStories/newsCards.json`.
3. Add a new card object at the top of the JSON array.
4. Add the corresponding title and description keys to the supported language files under `src/common/i18n/locales/`.
5. Run the tests and verify the page.

## Example Card

```json
{
  "id": "example_event",
  "date": "11/17/2026",
  "titleKey": "EXAMPLE_EVENT_TITLE",
  "descriptionKey": "EXAMPLE_EVENT_DESC",
  "image": "/news/example.webp",
  "links": {
    "person": {
      "text": "Jensen Huang",
      "url": "https://www.linkedin.com/in/jenhsunhuang/"
    },
    "company": {
      "text": "NVIDIA",
      "url": "https://www.nvidia.com/"
    }
  }
}
```

## Translations and Hyperlinks

Add the title and description translations to each supported `news.json` file.

Example English translations:

```json
{
  "EXAMPLE_EVENT_TITLE": "Our CEO met <person/> from <company/>.",
  "EXAMPLE_EVENT_DESC": "A conversation with <person/> about technology and community impact."
}
```

The `<person/>` and `<company/>` placeholders insert the original names and clickable links defined in the JSON.

Translate the surrounding sentence while keeping placeholder names unchanged.

## Existing Cards

Existing cards use `titleLinks` for matching hyperlinks in translated text. This functionality remains supported.

New cards should use `links` with self-closing placeholders.

## Validation

Run all news-related tests:

```bash
CI=true npm test -- --watch=false --runInBand --runTestsByPath \
  src/pages/NewsOurStories/NewsOurStories.test.js \
  src/pages/NewsOurStories/newsLinks.test.jsx \
  src/pages/NewsOurStories/newsTranslations.test.js \
  src/pages/NewsOurStories/newsCards.test.js \
  src/pages/NewsOurStories/NewsLinkedText.test.jsx \
  src/pages/NewsOurStories/NewsPagination.test.jsx \
  src/pages/NewsOurStories/newsIntegration.test.jsx
```

## Notes

- Cards appear in the order listed in `newsCards.json`.
- New cards can be placed first without renumbering existing translation keys.
- Use unique card IDs and descriptive translation keys.
- Pagination automatically adjusts when cards are added or removed.
- The default page size is configured through `CARDS_PER_PAGE` in `NewsOurStories.jsx`.
- Pagination controls are hidden when there is only one page or fewer.
