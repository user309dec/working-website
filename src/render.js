import { profile, projects, researchExperiences, appliedExperiences, honors, skills } from './profile.js';
import { locales, languageNames, htmlLanguages, translations } from './translations.js';

export function escape(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

export function renderPage(language = 'en', base = './') {
  const lang = locales.includes(language) ? language : 'en';
  const t = (key) => translations[lang][key];
  const local = (value) => typeof value === 'string' ? value : value?.[lang] ?? value?.en ?? '';
  const sections = ['background', 'projects', 'insights', 'research', 'writing', 'contact'];
  const software = projects.filter((project) => project.kind === 'software');
  const meta = (entry) => `<div class="entry-meta"><span class="date">${escape(local(entry.periodLabel ?? entry.period))}</span>${entry.location ? `<span class="location">${escape(local(entry.location))}</span>` : ''}</div>`;
  const entry = (item, education = false, brief = false) => `<article class="entry"${item.id ? ` data-entry="${escape(item.id)}"` : ''}><div class="entry-head"><div class="entry-head-left"><h4>${education ? `<a href="https://www.rice.edu/">${escape(local(item.organization))}</a>` : escape(local(item.organization))}</h4><p class="${education ? 'subtitle' : 'role'}">${escape(local(item.title ?? item.role))}</p></div>${meta(item)}</div>${!brief && item.description ? `<p>${escape(local(item.summary ?? item.description))}</p>` : ''}</article>`;
  const itemTitle = (item) => item.url ? `<a href="${escape(item.url)}" class="item-title">${escape(local(item.title))}</a>` : `<span class="item-title">${escape(local(item.title))}</span>`;
  const resumeLink = (kind) => `${base}public/resumes/Linus_Liu_${kind}_Resume.pdf`;
  const researchNames = {
    'md-anderson': { en: 'Computational Pathology & Latent World Models', zh: '计算病理学与潜在世界模型', ja: '計算病理学と潜在世界モデル' },
    'google-deepmind': { en: 'LLM Self-Evolving Memory', zh: '大语言模型自演化记忆', ja: '大規模言語モデルの自己進化型メモリ' },
    'rice-research': { en: 'Biosignal Gesture Recognition', zh: '生物信号手势识别', ja: '生体信号によるジェスチャー認識' },
  };

  return `<a class="skip-link" href="#background">${t('skip')}</a><main id="main">
<header class="masthead">
  <div class="masthead-text">
    <h1>${escape(local(profile.name))}</h1>
    <p class="tagline"><em>${t('tagline')}</em></p>
    <p class="masthead-download">${locales.filter((code) => code !== lang).map((code) => `<a href="${base}${code === 'en' ? '' : `${code}/`}" lang="${htmlLanguages[code]}" hreflang="${htmlLanguages[code]}" data-lang="${code}">${languageNames[code]}</a>`).join(' &nbsp;·&nbsp; ')}</p>
    <nav aria-label="${t('navigation')}">${sections.map((key) => `<a href="#${key}">${t(key)}</a>`).join('\n      ')}</nav>
  </div>
  <img class="masthead-portrait" src="${escape(profile.portrait ? `${base}${profile.portrait}` : `${base}public/portrait.svg`)}" alt="${escape(profile.portrait ? local(profile.name) : t('initials'))}" width="120" height="150">
</header>

<section id="background">
  <h2>${t('background')}</h2>
  <h3 class="section-label">${t('education')}</h3>
  ${profile.education.map((item) => entry(item, true)).join('\n')}
  <h3 class="section-label">${t('experience')}</h3>
  ${profile.experience.map((item) => entry(item)).join('\n')}
  <h3 class="section-label">${t('extracurricular')}</h3>
  ${software.filter((project) => ['rice-quant-fund', 'game2learn'].includes(project.id)).map((project) => entry({ ...project, title: project.role }, false, true)).join('\n')}
  <h3 class="section-label">${t('skills')}</h3>
  ${skills.map((group) => `<p>${escape(local(group.title))}: ${escape(group.items.join(', '))}${group.description ? `${group.items.length ? ' — ' : ''}${escape(local(group.description))}` : ''}${group.note ? ` — ${escape(local(group.note))}` : ''}</p>`).join('\n')}
  <p class="pdf-link"><a href="${resumeLink('Applied_AI')}">${t('appliedResume')} [PDF]</a> &nbsp;·&nbsp; <a href="${resumeLink('Research')}">${t('researchResume')} [PDF]</a></p>
</section>

<section id="projects">
  <h2>${t('projects')}</h2>
  <ul class="list">${software.map((project) => `<li data-project="${escape(project.id)}">${itemTitle(project)} <span class="date">${escape(local(project.periodLabel ?? project.period))}</span><p class="note"><em>${escape(local(project.description))}${project.status ? ` ${escape(local(project.status))}.` : ''}</em></p></li>`).join('\n')}</ul>
</section>

<section id="insights">
  <h2>${t('insights')}</h2>
  <p class="section-intro">${t('insightsIntro')}</p>
  <ul class="list">${appliedExperiences.map((item) => `<li><span class="item-title">${escape(local(item.organization))} — ${escape(local(item.title))}</span> <span class="date">${escape(local(item.periodLabel ?? item.period))}</span>${local(item.bullets).map((bullet) => `<p class="note"><em>${escape(bullet)}</em></p>`).join('')}</li>`).join('\n')}</ul>
</section>

<section id="research">
  <h2>${t('research')}</h2>
  <p class="section-intro">${t('researchInterests')}</p>
  <ul class="list">${researchExperiences.map((item) => `<li data-research="${escape(item.id)}"><span class="item-title">${escape(local(researchNames[item.id] ?? item.title))}</span> <span class="date">${escape(local(item.periodLabel ?? item.period))}</span><p class="note"><em>${escape(local(item.organization))}. ${escape(local(item.description))}</em></p></li>`).join('\n')}</ul>
</section>

<section id="writing">
  <h2>${t('writing')}</h2>
  <ul class="list">${honors.map((honor) => `<li><span class="item-title">${escape(local(honor.title))}</span> <span class="date">${escape(honor.year)}</span></li>`).join('\n')}</ul>
</section>

<section id="contact">
  <h2>${t('contact')}</h2>
  <p>Email: <a href="mailto:${escape(profile.email)}">${escape(profile.email)}</a></p>
  <p>LinkedIn: <a href="${escape(profile.linkedin)}">${escape(profile.linkedin.replace(/^https?:\/\/(www\.)?/, ''))}</a></p>
  <p>GitHub: <a href="${escape(profile.github)}">${escape(profile.github.replace(/^https?:\/\//, ''))}</a></p>
</section>

<footer><p>&copy; ${escape(local(profile.name))}</p></footer>
</main>`;
}

export function createDocument(language = 'en', base = './') {
  const lang = locales.includes(language) ? language : 'en';
  const message = translations[lang];
  return `<!DOCTYPE html>
<html lang="${htmlLanguages[lang]}"${lang === 'en' ? ' class="compact"' : ''}>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Linus Liu</title>
<meta name="description" content="${escape(message.description)}">
<meta property="og:type" content="website">
<meta property="og:title" content="Linus Liu">
<meta property="og:description" content="${escape(message.description)}">
<link rel="icon" type="image/svg+xml" href="${base}public/favicon.svg">
<link rel="stylesheet" href="${base}src/styles.css">
<script type="module" src="${base}src/app.js"></script>
</head>
<body><div id="app">${renderPage(lang, base)}</div></body>
</html>\n`;
}
