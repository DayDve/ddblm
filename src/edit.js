// @label: Edit mode
// @desc: Включает designMode для редактирования текста на странице
// @icon: edit_mode.svg

(function() {
    let notif = document.getElementById('edit-mode-box');
    if (notif) notif.remove();
    let indicator = document.getElementById('edit-mode-indicator');
    const isEditing = document.designMode === 'on';

    const showNotif = (title, color, text, borderColor) => {
        let d = document.createElement('div');
        d.id = 'edit-mode-box';
        d.style.cssText = `position:fixed;top:15px;left:15px;z-index:2147483647;background:rgba(30,30,30,0.95);color:#fff;padding:15px;border-radius:6px;font-family:monospace;font-size:13px;box-shadow:0 4px 15px rgba(0,0,0,0.5);border:1px solid ${borderColor};text-align:left;cursor:pointer;min-width:160px;`;
        d.innerHTML = `<div style="color:${color};font-weight:bold;margin-bottom:5px;">${title}</div><div>${text}</div>`;
        document.body.appendChild(d);
        const remove = () => {
            d.style.transition = "opacity 0.5s";
            d.style.opacity = "0";
            setTimeout(() => {
                if (d.parentElement) d.remove();
            }, 500);
        };
        setTimeout(remove, 2000);
        d.onclick = remove;
    };

    if (isEditing) {
        document.designMode = 'off';
        if (indicator) indicator.remove();
        showNotif('🔒 Edit Mode: OFF', '#f55', 'Редактирование<br>завершено.', '#444');
    } else {
        document.designMode = 'on';
        indicator = document.createElement('div');
        indicator.id = 'edit-mode-indicator';
        indicator.innerHTML = '<div>● EDIT MODE</div><div style="font-size:9px;font-weight:normal;opacity:0.8;margin-top:2px;">(Жми закладку для выхода)</div>';
        indicator.style.cssText = 'position:fixed;top:10px;right:10px;z-index:2147483647;background:#d00;color:#fff;padding:6px 10px;border-radius:4px;font-family:sans-serif;font-size:11px;font-weight:bold;box-shadow:0 2px 5px rgba(0,0,0,0.3);letter-spacing:0.5px;cursor:help;transition:opacity 0.3s;text-align:right;';
        indicator.onmouseenter = () => indicator.style.opacity = '0';
        indicator.onmouseleave = () => indicator.style.opacity = '1';
        document.body.appendChild(indicator);
        showNotif('✏️ Edit Mode: ON', '#4f9', 'Теперь можно менять<br>текст на странице.', '#4f9');
    }
})();