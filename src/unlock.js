// @label: unlock right click
// @desc: Снимает запрет на выделение и правый клик
// @icon: enable-rightclick.svg

(function() {
    let old = document.getElementById('unlock-warn-box');
    if (old) old.remove();

    let blocksFound = false;
    const style = window.getComputedStyle(document.body);
    if (style.userSelect === 'none' || style.webkitUserSelect === 'none') blocksFound = true;
    if (document.oncontextmenu !== null || document.body.getAttribute('oncontextmenu')) blocksFound = true;

    const enableRightClick = () => {
        const events = ['contextmenu', 'selectstart', 'dragstart', 'mousedown', 'copy', 'cut', 'paste'];
        events.forEach(name => {
            document['on' + name] = null;
            document.body['on' + name] = null;
            document.addEventListener(name, (e) => {
                e.stopPropagation();
            }, true);
        });
        const s = document.createElement('style');
        s.innerHTML = '*{user-select:text!important;-webkit-user-select:text!important;user-drag:auto!important;}';
        document.body.appendChild(s);
    };

    try {
        enableRightClick();
        let d = document.createElement('div');
        d.id = 'unlock-warn-box';
        d.style.cssText = 'position:fixed;top:15px;left:15px;z-index:2147483647;background:rgba(30,30,30,0.95);color:#fff;padding:15px;border-radius:6px;font-family:monospace;font-size:13px;box-shadow:0 4px 15px rgba(0,0,0,0.5);border:1px solid #444;text-align:left;cursor:pointer;min-width:180px;';
        
        if (blocksFound) {
            d.innerHTML = '<div style="color:#4f9;font-weight:bold;margin-bottom:5px;">🔓 Успешно</div><div>Блокировки найдены<br>и удалены.</div>';
        } else {
            d.innerHTML = '<div style="color:#aaa;font-weight:bold;margin-bottom:5px;">🕊️ Чисто</div><div>Явных блокировок нет.<br><span style="font-size:10px;color:#666;">(Профилактика проведена)</span></div>';
        }
        
        document.body.appendChild(d);
        const remove = () => {
            d.style.transition = "opacity 0.5s";
            d.style.opacity = "0";
            setTimeout(() => {
                if (d.parentElement) d.remove();
            }, 500);
        };
        setTimeout(remove, 2500);
        d.onclick = remove;
    } catch (e) {
        console.error(e);
    }
})();