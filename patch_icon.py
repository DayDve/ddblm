#!/usr/bin/env python3
"""
patch_icon.py — Патчер SVG-иконок для Firefox под оформление (светлая/тёмная тема) и Inkscape.

Что делает:
1. Задает на корневом <svg> размеры 24x24 и viewBox="0 0 24 24".
2. Внедряет блок <style> с адаптацией под тему:
   - В светлой теме: чёрная заливка/обводка (или context-fill, если задан родительским интерфейсом).
   - В тёмной теме (@media prefers-color-scheme: dark): белая заливка/обводка (или context-fill).
   - Поддерживает Inkscape (корректно отображает иконку, не обнуляя прозрачность).
3. Удаляет жестко заданные заливки (#fff, #ffffff, white, #000 и т.д.), сохраняя прозрачные (fill="none").
4. Удаляет жестко заданные цвета обводки (stroke="..."), оставляя stroke="" для селектора [stroke].
5. Очищает временные инлайн-стили заливок и прозрачностей из Inkscape.

Использование:
  ./scratch/patch_icon.py icon.svg
  ./scratch/patch_icon.py bookmarklets/icons/*.svg
  ./scratch/patch_icon.py --size 24 icon.svg
"""

import argparse
import re
import sys
from pathlib import Path

COLOR_RE = re.compile(
    r'(#fff(?:fff)?|#000(?:000)?|white|black|rgb\s*\(\s*(?:255|0)\s*,\s*(?:255|0)\s*,\s*(?:255|0)\s*\))',
    re.IGNORECASE
)

STYLE_BLOCK_TEMPLATE = """<style>
path:not([stroke]), circle, rect, polygon {
  fill: context-fill black;
}
path[stroke] {
  fill: none;
  stroke: context-fill black;
}
line, [stroke] {
  stroke: context-fill black;
}
@media (prefers-color-scheme: dark) {
  path:not([stroke]), circle, rect, polygon {
    fill: context-fill white;
  }
  path[stroke] {
    fill: none;
    stroke: context-fill white;
  }
  line, [stroke] {
    stroke: context-fill white;
  }
}
</style>"""


def patch_svg_content(content: str, size: int = 24) -> str:
    # 1. Поиск открывающего тега <svg ...>
    svg_tag_match = re.search(r'(<svg\b[^>]*>)', content, re.IGNORECASE | re.DOTALL)
    if not svg_tag_match:
        return content

    svg_tag = svg_tag_match.group(1)

    # 2. Очищаем старые fill и fill-opacity на корневом <svg>
    # (чтобы Inkscape не обнулял видимость из-за context-fill/context-fill-opacity)
    new_svg_tag = re.sub(r'\s*\bfill="[^"]*"', '', svg_tag)
    new_svg_tag = re.sub(r'\s*\bfill-opacity="[^"]*"', '', new_svg_tag)

    # width & height
    if re.search(r'\bwidth="[^"]*"', new_svg_tag):
        new_svg_tag = re.sub(r'\bwidth="[^"]*"', f'width="{size}"', new_svg_tag)
    else:
        new_svg_tag = new_svg_tag[:-1] + f' width="{size}">'

    if re.search(r'\bheight="[^"]*"', new_svg_tag):
        new_svg_tag = re.sub(r'\bheight="[^"]*"', f'height="{size}"', new_svg_tag)
    else:
        new_svg_tag = new_svg_tag[:-1] + f' height="{size}">'

    # viewBox
    if re.search(r'\bviewBox="[^"]*"', new_svg_tag, re.IGNORECASE):
        new_svg_tag = re.sub(r'\bviewBox="[^"]*"', f'viewBox="0 0 {size} {size}"', new_svg_tag, flags=re.IGNORECASE)
    else:
        new_svg_tag = new_svg_tag[:-1] + f' viewBox="0 0 {size} {size}">'

    content = content[:svg_tag_match.start()] + new_svg_tag + content[svg_tag_match.end():]

    # 3. Удаляем старые теги <style>...</style>
    content = re.sub(r'\s*<style\b[^>]*>.*?</style>', '', content, flags=re.DOTALL)

    # 4. Вставляем новый блок <style> сразу после открывающего <svg ...>
    svg_tag_match2 = re.search(r'(<svg\b[^>]*>)', content, re.IGNORECASE | re.DOTALL)
    if svg_tag_match2:
        end_pos = svg_tag_match2.end()
        content = content[:end_pos] + '\n' + STYLE_BLOCK_TEMPLATE + content[end_pos:]

    # 5. Замена жестко заданных цветов в атрибутах и style="..."
    # 5.1. Атрибут fill="..."
    def clean_fill_attr(match):
        val = match.group(1).strip()
        if val.lower() == 'none':
            return match.group(0)
        if COLOR_RE.search(val) or val.startswith('context-fill') or val == 'currentColor':
            return ''
        return match.group(0)

    content = re.sub(r'\s*\bfill="([^"]*)"', clean_fill_attr, content)

    # 5.2. Атрибут stroke="..."
    def clean_stroke_attr(match):
        val = match.group(1).strip()
        if val.lower() == 'none':
            return match.group(0)
        # Оставляем stroke="" как маркер для селектора [stroke]
        return ' stroke=""'

    content = re.sub(r'\s*\bstroke="([^"]*)"(?:\s*stroke-opacity="[^"]*")?', clean_stroke_attr, content)

    # 5.3. Внутри style="..."
    def clean_style_attr(match):
        style_body = match.group(1)
        declarations = [d.strip() for d in style_body.split(';') if d.strip()]
        new_decls = []

        for decl in declarations:
            if ':' not in decl:
                continue
            prop, val = [x.strip() for x in decl.split(':', 1)]
            prop_l = prop.lower()
            val_l = val.lower()

            if prop_l == 'fill':
                if val_l == 'none':
                    new_decls.append(f"{prop}:{val}")
                elif COLOR_RE.search(val) or val_l.startswith('context-fill') or val_l == 'currentcolor':
                    continue
                else:
                    new_decls.append(f"{prop}:{val}")
                continue

            if prop_l == 'stroke':
                if val_l == 'none':
                    new_decls.append(f"{prop}:{val}")
                else:
                    # stroke управляется через селектор в <style>
                    continue

            if prop_l in ('opacity', 'fill-opacity', 'stroke-opacity'):
                if val_l.startswith('context-') or val_l in ('1', '1.0', '100%'):
                    continue
                if re.match(r'^0\.\d+$', val):
                    continue

            new_decls.append(f"{prop}:{val}")

        if not new_decls:
            return ''
        return f' style="{";".join(new_decls)}"'

    content = re.sub(r'\s*\bstyle="([^"]*)"', clean_style_attr, content)
    content = re.sub(r'\s*\bstyle=""', '', content)

    return content


def process_file(file_path: Path, size: int = 24, dry_run: bool = False):
    if not file_path.is_file():
        print(f"[SKIP] {file_path}: файл не найден", file=sys.stderr)
        return

    try:
        content = file_path.read_text(encoding='utf-8')
    except Exception as e:
        print(f"[ERR]  {file_path}: ошибка чтения: {e}", file=sys.stderr)
        return

    patched = patch_svg_content(content, size=size)

    if content == patched:
        print(f"[OK]   {file_path}: актуален (изменений не требуется)")
        return

    if dry_run:
        print(f"[DRY]  {file_path}: готов к патчу")
    else:
        file_path.write_text(patched, encoding='utf-8')
        print(f"[DONE] {file_path}: успешно пропатчен")


def main():
    parser = argparse.ArgumentParser(
        description="Патчер SVG-иконок из Inkscape для Firefox (авто-адаптация под светлую/тёмную тему)"
    )
    parser.add_argument("files", nargs="+", help="Пути к SVG-файлам")
    parser.add_argument("--size", type=int, default=24, help="Размер иконки / viewBox (по умолчанию 24)")
    parser.add_argument("--dry-run", action="store_true", help="Только проверить без изменения файлов")

    args = parser.parse_args()

    for pattern in args.files:
        p = Path(pattern)
        if p.is_file():
            process_file(p, size=args.size, dry_run=args.dry_run)
        else:
            matches = list(Path('.').glob(pattern)) if '*' in pattern else [p]
            for m in matches:
                process_file(m, size=args.size, dry_run=args.dry_run)


if __name__ == "__main__":
    main()
