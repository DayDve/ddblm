// @label: unDisable element
// @desc: Принудительно включает неактивные элементы на странице
// @icon: selectunlock.svg

(function() {
    const H = '__FINAL_DIS_TOGGLE';
    const T = 'disabled';

    function U() {
        document.removeEventListener('click', window[H], true);
        document.body.style.cursor = 'default';
        delete window[H];
    }
    if (window[H]) {
        U();
        return;
    }

    function A(e) {
        e.preventDefault();
        e.stopPropagation();
        let el = e.target;
        let current = el;
        let targetElement = null;
        let found = false;
        let parent = el.parentElement;
        for (let i = 0; i < 5; i++) {
            if (!current || current === document.body) break;
            if (current.hasAttribute(T)) {
                targetElement = current;
                found = true;
                break;
            }
            current = current.parentElement;
        }
        if (!found && parent && parent.children) {
            for (let i = 0; i < parent.children.length; i++) {
                let child = parent.children[i];
                if (child.hasAttribute(T)) {
                    targetElement = child;
                    found = true;
                    break;
                }
            }
        }
        if (found) {
            targetElement.removeAttribute(T);
            targetElement.style.outline = '4px solid #FF4500';
            setTimeout(() => {
                targetElement.style.outline = 'none';
            }, 400);
        }
    }
    window[H] = A;
    document.body.style.cursor = 'crosshair';
    document.addEventListener('click', A, true);
})();