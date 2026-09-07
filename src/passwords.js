// @label: Show passwords
// @desc: Показывает пароли, скрытые звездочками
// @icon: show-password.svg

(function() {
    let old = document.getElementById('pwd-reveal-box');
    if (old) old.remove();

    let p = [], inputs = document.querySelectorAll('input[type="password"]');
    inputs.forEach(el => {
        if (el.value) p.push(el.value);
    });

    let d = document.createElement('div');
    d.id = 'pwd-reveal-box';
    d.style.cssText = 'position:fixed;top:15px;left:15px;z-index:2147483647;background:rgba(30,30,30,0.95);color:#fff;padding:15px;border-radius:6px;font-family:monospace;font-size:13px;box-shadow:0 4px 15px rgba(0,0,0,0.5);max-width:300px;word-break:break-all;user-select:text;border:1px solid #444;';

    if (p.length === 0) {
        d.textContent = 'Пароли не найдены';
        d.style.color = '#aaa';
        document.body.appendChild(d);
        setTimeout(() => d.remove(), 3000);
    } else {
        d.innerHTML = '<div style="margin-bottom:8px;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #444;padding-bottom:5px;">Найденные пароли</div>' + p.join('<br>');
        document.body.appendChild(d);
        let t = setTimeout(() => {
            if (d.parentElement) d.remove();
        }, 30000);
        setTimeout(() => {
            document.addEventListener('click', function h(e) {
                if (!d.contains(e.target)) {
                    d.remove();
                    document.removeEventListener('click', h);
                    clearTimeout(t);
                }
            });
        }, 100);
    }
})();