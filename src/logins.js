// @label: Search logins/passwords
// @desc: Ищет логины для сайта на BugMeNot и Google
// @icon: bugmenot.svg

(function() {
    let old = document.getElementById('bmn-menu-box');
    if (old) old.remove();

    const host = window.location.hostname.replace(/^www\./, '');
    const bmnUrl = 'https://bugmenot.com/view/' + encodeURIComponent(host);
    const googUrl = 'https://www.google.com/search?q=site:' + encodeURIComponent(host) + '+login+password';

    let d = document.createElement('div');
    d.id = 'bmn-menu-box';
    d.style.cssText = 'position:fixed;top:15px;left:15px;z-index:2147483647;background:rgba(30,30,30,0.95);color:#fff;padding:15px;border-radius:6px;font-family:monospace;font-size:13px;box-shadow:0 4px 15px rgba(0,0,0,0.5);border:1px solid #444;min-width:180px;text-align:center;';
    d.innerHTML = `<div style="margin-bottom:5px;color:#aaa;font-weight:bold;">Поиск паролей</div><div style="margin-bottom:10px;color:#666;font-size:10px;border-bottom:1px solid #444;padding-bottom:5px;">${host}</div>`;
    
    const btnStyle = 'display:block;width:100%;margin-bottom:8px;padding:8px 0;background:#444;color:#fff;text-decoration:none;border-radius:4px;transition:0.2s;border:1px solid #555;';
    
    const linkBmn = document.createElement('a');
    linkBmn.href = bmnUrl;
    linkBmn.target = '_blank';
    linkBmn.textContent = '🐞 BugMeNot';
    linkBmn.style.cssText = btnStyle;
    
    const linkGoog = document.createElement('a');
    linkGoog.href = googUrl;
    linkGoog.target = '_blank';
    linkGoog.textContent = '🔍 Google';
    linkGoog.style.cssText = btnStyle;
    
    d.appendChild(linkBmn);
    d.appendChild(linkGoog);
    document.body.appendChild(d);
    
    setTimeout(() => {
        document.addEventListener('click', function h(e) {
            if (!d.contains(e.target)) {
                d.remove();
                document.removeEventListener('click', h);
            }
        });
    }, 200);
})();