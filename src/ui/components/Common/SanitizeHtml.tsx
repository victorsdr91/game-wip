import sanitizeHtml from 'sanitize-html';

const defaultOptions = {
  allowedTags: [ 'b', 'i', 'em', 'strong', 'a', 'span' ],
  allowedAttributes: {
    'a': [ 'href' ],
    'span': ['style']
  },
};

const sanitize = (dirty, options) => ({
  __html: sanitizeHtml(
    dirty, 
    { ...defaultOptions, ...options },
  )
});

interface SanitizeHTMLProps {
    html: any;
    options?: object;
}

export const SanitizeHTML = ({ html, options = {} }: SanitizeHTMLProps) => (
  <div dangerouslySetInnerHTML={sanitize(html, options)} />
);