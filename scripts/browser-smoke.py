#!/usr/bin/env python3
"""Exercise the site with preinstalled Playwright and Chromium; no downloads.

Run the website, then python3 scripts/browser-smoke.py. PORTFOLIO_BASE_URL
(default http://127.0.0.1:3000), CHROMIUM_PATH, and PORTFOLIO_ARTIFACT_DIR
(default /tmp/linus-site-browser) support alternate servers and output paths.
"""
import json
import os
import re
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import expect, sync_playwright

BASE_URL = os.environ.get('PORTFOLIO_BASE_URL', 'http://127.0.0.1:3000').rstrip('/')
ARTIFACTS = Path(os.environ.get('PORTFOLIO_ARTIFACT_DIR', '/tmp/linus-site-browser'))
LOCALES = {
    'en': ('/', 'en', 'Background'),
    'zh': ('/zh/', 'zh-CN', '个人背景'),
    'ja': ('/ja/', 'ja', '経歴'),
}
SECTIONS = ['background', 'projects', 'insights', 'research', 'writing', 'contact']


def assert_locale(page, locale):
    expect(page.locator('html')).to_have_attribute('lang', LOCALES[locale][1])
    expect(page.locator('.masthead h1')).to_have_text(re.compile(r'Linus\s*Liu'))
    expect(page.locator('#background > h2')).to_have_text(LOCALES[locale][2])
    assert re.fullmatch(r'Linus\s*Liu', page.title()), page.title()
    assert page.locator('html').evaluate("el => el.classList.contains('compact')") == (locale == 'en')
    assert sorted(page.locator('[data-lang]').evaluate_all('els => els.map(el => el.dataset.lang)')) == sorted(set(LOCALES) - {locale})


def assert_no_overflow(page):
    dimensions = page.evaluate('''() => ({
      width: innerWidth, scroll: document.documentElement.scrollWidth,
      offenders: [...document.querySelectorAll('main *')].filter(el => {
        const r = el.getBoundingClientRect(); return r.width && (r.right > innerWidth + 1 || r.left < -1);
      }).slice(0, 5).map(el => ({tag:el.tagName, class:el.className, text:el.textContent.slice(0,60)}))
    })''')
    assert dimensions['scroll'] <= dimensions['width'] + 1, dimensions


def assert_reference_geometry(page, width, locale):
    """Measurements from live donyang.me CSS on 2026-10-19.

    Check layout independently of text length or remote font availability.
    Main is a 680px content box with padding outside it; CJK mobile rems
    shrink to 15px while its body text remains at 16px.
    """
    geometry = page.evaluate('''() => {
      const box = selector => {
        const e=document.querySelector(selector), s=getComputedStyle(e), r=e.getBoundingClientRect();
        return {x:r.x,y:r.y,width:r.width,height:r.height,fontSize:parseFloat(s.fontSize),
          fontFamily:s.fontFamily,paddingTop:parseFloat(s.paddingTop),paddingLeft:parseFloat(s.paddingLeft),
          marginBottom:parseFloat(s.marginBottom),gap:parseFloat(s.gap),direction:s.flexDirection,
          borderBottom:s.borderBottom,background:s.backgroundColor};
      };
      return {root:box('html'),body:box('body'),main:box('main'),header:box('.masthead'),
        name:box('h1'),portrait:box('.masthead-portrait'),nav:box('.masthead nav'),
        h2:box('section > h2'),entry:box('.entry-head')};
    }''')
    mobile = width <= 600
    rem = 15 if locale == 'en' or mobile else 16
    padding_x = (1.25 if mobile else 1.75) * rem
    main_width = min(width, 680 + 2 * padding_x)

    def near(actual, expected, label):
        assert abs(actual - expected) < 0.11, f'{label}: {actual} != {expected}'

    near(geometry['root']['fontSize'], rem, 'root font size')
    near(geometry['main']['width'], main_width, 'main outer width')
    near(geometry['main']['x'], (width - main_width) / 2, 'centered main')
    near(geometry['main']['paddingTop'], (3.5 if mobile else 5.5) * rem, 'top padding')
    near(geometry['main']['paddingLeft'], padding_x, 'side padding')
    near(geometry['header']['width'], main_width - padding_x * 2, '680px content box')
    near(geometry['header']['gap'], (1.25 if mobile else 2.5) * rem, 'header gap')
    near(geometry['header']['marginBottom'], (3.5 if mobile else 5) * rem, 'header spacing')
    near(geometry['name']['fontSize'], (1.75 if mobile else 2) * rem, 'name font size')
    near(geometry['portrait']['width'], 80 if mobile else 120, 'portrait width')
    near(geometry['portrait']['height'], 100 if mobile else 150, 'portrait height')
    near(geometry['h2']['fontSize'], (1.25 if mobile else 1.375) * rem, 'section font size')
    near(geometry['nav']['gap'], .35 * rem, 'nav gap')
    near(geometry['nav']['paddingLeft'], 1.25 * rem, 'nav padding')
    assert geometry['nav']['direction'] == 'column'
    assert geometry['entry']['direction'] == ('column' if mobile else 'row')
    assert geometry['body']['background'] == 'rgb(250, 250, 250)'
    assert geometry['h2']['borderBottom'] == '1px solid rgb(229, 229, 229)'
    assert geometry['body']['fontFamily'].startswith('Inter')
    (ARTIFACTS / f'geometry-{locale}-{width}.json').write_text(json.dumps(geometry, indent=2))


def main():
    ARTIFACTS.mkdir(parents=True, exist_ok=True)
    failures, browser_errors, external_requests = [], [], []
    passed = 0

    def run(name, operation):
        nonlocal passed
        try:
            operation()
            passed += 1
            print(f'PASS {name}', flush=True)
        except Exception as error:
            failures.append((name, str(error)))
            print(f'FAIL {name}: {error}', flush=True)

    def monitor(page):
        page.on('pageerror', lambda error: browser_errors.append(str(error)))
        page.on('console', lambda message: browser_errors.append(message.text) if message.type == 'error' else None)
        page.on('response', lambda response: browser_errors.append(f'HTTP {response.status}: {response.url}')
                if response.status >= 400 else None)
        page.on('request', lambda request: external_requests.append(request.url)
                if urlparse(request.url).netloc != urlparse(BASE_URL).netloc else None)

    def visit(page, locale):
        response = page.goto(f'{BASE_URL}{LOCALES[locale][0]}')
        assert response.status == 200, response.status
        expect(page.locator('#contact')).to_be_attached()
        page.evaluate('document.fonts.ready')
        assert_locale(page, locale)

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH', '/usr/bin/chromium'),
                                    headless=True, args=['--no-sandbox', '--disable-dev-shm-usage'])
        context = browser.new_context(locale='en-US', color_scheme='light', reduced_motion='reduce')
        page = context.new_page()
        page.set_default_timeout(7000)
        monitor(page)
        for width in [320, 390, 760, 1440]:
            for locale in LOCALES:
                def responsive_check(width=width, locale=locale):
                    page.set_viewport_size({'width':width, 'height':1000})
                    visit(page, locale)
                    assert_no_overflow(page)
                    assert_reference_geometry(page, width, locale)
                    assert page.locator('.masthead-portrait').evaluate('el => el.complete && el.naturalWidth > 0')
                    if (width, locale) in [(1440,'en'),(1440,'zh'),(1440,'ja'),(390,'zh'),(390,'ja'),(320,'en')]:
                        page.screenshot(path=str(ARTIFACTS / f'home-{locale}-{width}.png'), full_page=True)
                        if width == 1440:
                            page.screenshot(path=str(ARTIFACTS / f'viewport-{locale}-{width}.png'))
                run(f'reference geometry and overflow: {width}px / {locale}', responsive_check)

        def language_navigation():
            visit(page, 'en')
            for locale in ['zh', 'ja', 'en']:
                link = page.locator(f'[data-lang="{locale}"]')
                expect(link).to_have_attribute('hreflang', LOCALES[locale][1])
                link.focus()
                link.press('Enter')
                assert_locale(page, locale)
                assert urlparse(page.url).path == LOCALES[locale][0]
            page.go_back()
            assert_locale(page, 'ja')
            page.go_back()
            assert_locale(page, 'zh')
            page.go_forward()
            assert_locale(page, 'ja')
            page.reload()
            assert_locale(page, 'ja')
            page.goto(f'{BASE_URL}/?lang=zh&keep=1#research')
            assert_locale(page, 'zh')
            assert urlparse(page.url).path == '/zh/'
            assert urlparse(page.url).query == 'keep=1'
            assert urlparse(page.url).fragment == 'research'
            expect(page.locator('#research > h2')).to_be_in_viewport()
            page.goto(f'{BASE_URL}/?lang=unsupported')
            assert_locale(page, 'en')
            page.goto(f'{BASE_URL}/#%')
            assert_locale(page, 'en')
        run('keyboard language links, history, reload, legacy URL compatibility', language_navigation)

        for locale in LOCALES:
            def navigation(locale=locale):
                visit(page, locale)
                assert page.locator('.masthead nav a').evaluate_all("els => els.map(el => el.getAttribute('href'))") == [f'#{name}' for name in SECTIONS]
                for section in SECTIONS:
                    page.locator(f'.masthead nav a[href="#{section}"]').click()
                    expect(page).to_have_url(re.compile(f'#{section}$'))
                    expect(page.locator(f'#{section} > h2')).to_be_in_viewport()
            run(f'all six section anchors / {locale}', navigation)

        def resume_content():
            visit(page, 'en')
            for selector, count in [('#background .entry',8),('#projects [data-project]',3),('#research [data-research]',3),('#insights .list > li',2),('#writing .list > li',3)]:
                expect(page.locator(selector)).to_have_count(count)
            expect(page.locator('[data-entry="rice-education"]')).to_contain_text('Rice University')
            expect(page.locator('[data-entry="google-deepmind"]')).to_contain_text('Research Extern')
            expect(page.locator('[data-research="md-anderson"]')).to_contain_text('in development')
            expect(page.locator('[data-project="rice-quant-fund"]')).to_contain_text('In progress')
            expect(page.locator('[data-project="game2learn"] a')).to_have_attribute('href', 'https://github.com/user309dec/GameToLearn-G2L-AI-Final')
            expect(page.locator('#background')).to_contain_text('Controlled experiments')
            expect(page.locator('#background')).to_contain_text('hybrid retrieval')
            assert not re.search(r'Dong Yang|Architect Partners|Wharton|donyang', page.locator('body').inner_text(), re.I)
            assert page.locator('a[href^="tel:"]').count() == 0
            assert page.locator('#contact a[href^="mailto:"]').count() == 1
            expect(page.locator('#contact a[href*="linkedin.com"]')).to_have_attribute('href', 'https://www.linkedin.com/in/linus-liu-10293a324')
            expect(page.locator('#contact a[href*="github.com"]')).to_have_attribute('href', 'https://github.com/user309dec')
            assert page.locator('.masthead-portrait').get_attribute('alt').endswith('portrait placeholder')
        run('resume facts, ongoing statuses, real links, identity replacement', resume_content)

        def pdfs():
            visit(page, 'ja')
            links = page.locator('.pdf-link a')
            expect(links).to_have_count(2)
            for link in links.all():
                url = link.get_attribute('href')
                response = context.request.get(f'{BASE_URL}{url}' if url.startswith('/') else url)
                assert response.status == 200, response.status
                assert response.headers['content-type'] == 'application/pdf'
                data = response.body()
                assert data.startswith(b'%PDF-') and len(data) > 1000
        run('both original resume PDF links resolve to real PDF files', pdfs)

        for locale in LOCALES:
            def no_javascript(locale=locale):
                isolated = browser.new_context(java_script_enabled=False, viewport={'width':390,'height':1000})
                local_page = isolated.new_page()
                local_page.set_default_timeout(7000)
                monitor(local_page)
                try:
                    response = local_page.goto(f'{BASE_URL}{LOCALES[locale][0]}')
                    assert response.status == 200
                    expect(local_page.locator('html')).to_have_attribute('lang', LOCALES[locale][1])
                    expect(local_page.locator('.masthead h1')).to_have_text(re.compile(r'Linus\s*Liu'))
                    expect(local_page.locator('#background > h2')).to_have_text(LOCALES[locale][2])
                    expect(local_page.locator('#projects [data-project]')).to_have_count(3)
                    expect(local_page.locator('.pdf-link a')).to_have_count(2)
                    local_page.locator('.masthead nav a[href="#contact"]').click()
                    expect(local_page.locator('#contact h2')).to_be_in_viewport()
                    target = 'zh' if locale == 'en' else 'en'
                    language_link = local_page.locator(f'[data-lang="{target}"]')
                    language_link.focus()
                    language_link.press('Enter')
                    expect(local_page.locator('html')).to_have_attribute('lang', LOCALES[target][1])
                finally:
                    isolated.close()
            run(f'static content and navigation without JavaScript / {locale}', no_javascript)

        def fonts_and_print():
            visit(page, 'en')
            loaded = page.evaluate("[...document.fonts].filter(f => f.family === 'Inter' && f.status === 'loaded').map(f => ({weight:f.weight,style:f.style}))")
            assert {f['weight'] for f in loaded if f['style'] == 'normal'} >= {'400','500','600'}, loaded
            (ARTIFACTS / 'loaded-fonts.json').write_text(json.dumps(loaded, indent=2))
            page.emulate_media(media='print')
            expect(page.locator('.masthead h1')).to_be_visible()
            expect(page.locator('#research')).to_be_visible()
            page.pdf(path=str(ARTIFACTS / 'linus-profile-print.pdf'), format='A4', print_background=True)
            assert (ARTIFACTS / 'linus-profile-print.pdf').read_bytes().startswith(b'%PDF-')
            page.emulate_media(media='screen')
        run('self-hosted Inter weights loaded and printable profile PDF', fonts_and_print)

        def disabled_storage():
            isolated = browser.new_context()
            isolated.add_init_script("""
              Storage.prototype.getItem = function () { throw new DOMException('Disabled', 'SecurityError'); };
              Storage.prototype.setItem = function () { throw new DOMException('Disabled', 'SecurityError'); };
            """)
            local_page = isolated.new_page()
            monitor(local_page)
            try:
                visit(local_page, 'ja')
                local_page.locator('[data-lang="zh"]').click()
                assert_locale(local_page, 'zh')
            finally:
                isolated.close()
        run('storage-disabled browser supports normal navigation', disabled_storage)
        run('zero external network requests or analytics', lambda: assert_empty(external_requests))
        run('zero browser console or uncaught errors', lambda: assert_empty(browser_errors))
        context.close()
        browser.close()
    print(f'\n{passed} checks passed; {len(failures)} failed.')
    print(f'Artifacts: {ARTIFACTS}')
    if failures:
        raise SystemExit(1)


def assert_empty(values):
    assert not values, values


if __name__ == '__main__':
    main()
