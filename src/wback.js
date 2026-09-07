// @label: WBack Machine
// @desc: Меню для просмотра страницы в Web Archive
// @icon: wback_machine.svg

(function() {
    let old = document.getElementById('wb-menu-box');
    if (old) old.remove();

    let d = document.createElement('div');
    d.id = 'wb-menu-box';
    d.style.cssText = 'position:fixed;top:15px;left:15px;z-index:2147483647;background:rgba(30,30,30,0.95);color:#fff;padding:15px;border-radius:6px;font-family:monospace;font-size:13px;box-shadow:0 4px 15px rgba(0,0,0,0.5);border:1px solid #444;min-width:180px;text-align:center;';
    const url = window.location.href;
    d.innerHTML = '<div style="margin-bottom:10px;color:#aaa;font-weight:bold;border-bottom:1px solid #555;padding-bottom:5px;">Wayback Machine</div>';
    
    const btnStyle = 'display:block;width:100%;margin-bottom:8px;padding:8px 0;background:#444;color:#fff;text-decoration:none;border-radius:4px;transition:0.2s;border:1px solid #555;';
    
    const linkCal = document.createElement('a');
    linkCal.href = 'https://web.archive.org/web/*/' + url;
    linkCal.target = '_blank';
    linkCal.textContent = '📅 Календарь';
    linkCal.style.cssText = btnStyle;
    
    const linkLast = document.createElement('a');
    linkLast.href = 'https://web.archive.org/web/29990101000000/' + url;
    linkLast.target = '_blank';
    linkLast.textContent = '⌚ Последняя';
    linkLast.style.cssText = btnStyle;
    
    const linkSave = document.createElement('a');
    linkSave.href = 'https://web.archive.org/save/' + url;
    linkSave.target = '_blank';
    linkSave.textContent = '💾 Сохранить';
    linkSave.style.cssText = btnStyle;
    
    d.appendChild(linkCal);
    d.appendChild(linkLast);
    d.appendChild(linkSave);
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