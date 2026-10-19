import { renderPage } from './render.js';
import { locales, htmlLanguages, translations } from './translations.js';

// Separate static language pages mirror the reference site's navigation.
// Keep the earlier ?lang= links working as well.
const siteRoot = new URL('../', import.meta.url);
const relativePath = location.pathname.slice(siteRoot.pathname.length);
const pathLanguage = relativePath.split('/')[0];
const requested = new URL(location.href).searchParams.get('lang');
const language = locales.includes(requested) ? requested : locales.includes(pathLanguage) ? pathLanguage : 'en';
// A legacy query can change the document path before the browser requests its icon.
document.querySelector('link[rel="icon"]').href = new URL('public/favicon.svg', siteRoot).href;
if (locales.includes(requested)) {
  const target = new URL(language === 'en' ? './' : `${language}/`, siteRoot);
  const params = new URL(location.href).searchParams;
  params.delete('lang');
  target.search = params.toString();
  target.hash = location.hash;
  history.replaceState(history.state, '', target);
}
document.documentElement.lang = htmlLanguages[language];
document.documentElement.classList.toggle('compact', language === 'en');
document.title = 'Linus Liu';
document.querySelector('meta[name="description"]').content = translations[language].description;
document.querySelector('meta[property="og:description"]').content = translations[language].description;
document.querySelector('#app').innerHTML = renderPage(language, siteRoot.pathname);
// A deep link can arrive before the module has rendered its target.
if (location.hash) {
  let fragment = location.hash.slice(1);
  try { fragment = decodeURIComponent(fragment); } catch { /* Keep malformed fragments inert. */ }
  const target = document.getElementById(fragment);
  if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: 'instant' }));
}
