import PropTypes from "prop-types";
import { Trans } from "react-i18next";

export default function NewsLinkedText({ translationKey, links = {} }) {
  const components = Object.fromEntries(
    Object.entries(links).map(([name, link]) => [
      name,
      <a
        key={name}
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="news-name-link"
      >
        {link.text}
      </a>,
    ]),
  );

  return (
    <Trans
      ns="news"
      i18nKey={translationKey}
      components={components}
      shouldUnescape={false}
    />
  );
}

NewsLinkedText.propTypes = {
  translationKey: PropTypes.string.isRequired,
  links: PropTypes.objectOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  ),
};
