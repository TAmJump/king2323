#!/usr/bin/env python3
"""
commerce.html 入力支援スクリプト
================================
特商法ページの placeholder を対話的に埋めます。

使い方:
  $ python3 scripts/fill_commerce.py
  
  運営責任者氏名 (例: 山田太郎):  山田太郎
  登記住所 (例: 東京都渋谷区...):  東京都渋谷区神宮前1-2-3
  電話番号 (例: 03-1234-5678) [Enter で「請求時開示」]:
  メールアドレス [Enter で support@king2323.tamjump.com]:
  
  → commerce.html 更新完了。
"""
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
COMMERCE = REPO / 'commerce.html'

def ask(prompt, default=None):
    val = input(prompt).strip()
    return val or (default or '')

def main():
    if not COMMERCE.exists():
        print(f"ERROR: commerce.html not found at {COMMERCE}", file=sys.stderr)
        sys.exit(1)

    print("特商法ページ — 入力支援")
    print("=" * 50)

    name  = ask("運営責任者氏名 (例: 山田太郎): ")
    if not name:
        print("ERROR: 運営責任者氏名は必須です。", file=sys.stderr)
        sys.exit(1)

    addr_default = "ご請求があった場合、遅滞なく開示いたします。"
    addr  = ask(f"所在地全文 [Enter で「{addr_default}」]: ", addr_default)

    phone_default = "ご請求があった場合、遅滞なく開示いたします。お問い合わせは下記メールにてお願いいたします。"
    phone = ask(f"電話番号 [Enter で請求時開示文]: ", phone_default)

    mail_default = "support@king2323.tamjump.com"
    mail  = ask(f"メールアドレス [Enter で {mail_default}]: ", mail_default)

    src = COMMERCE.read_text()
    src = src.replace('[氏名 — 公開前に記入]', name)
    # The 所在地 line includes [登記住所 — 内部記入]; replace the WHOLE TD
    src = re.sub(
        r'<tr><th>所在地</th><td>.*?</td></tr>',
        f'<tr><th>所在地</th><td>{addr}</td></tr>',
        src, count=1
    )
    src = re.sub(
        r'<tr><th>電話番号</th><td>.*?</td></tr>',
        f'<tr><th>電話番号</th><td>{phone}</td></tr>',
        src, count=1
    )
    src = re.sub(
        r'<tr><th>メールアドレス</th><td>.*?</td></tr>',
        f'<tr><th>メールアドレス</th><td>{mail}</td></tr>',
        src, count=1
    )

    COMMERCE.write_text(src)
    print()
    print("✓ commerce.html を更新しました。")
    print("  - 運営責任者: " + name)
    print("  - 所在地: " + (addr[:60] + ('...' if len(addr)>60 else '')))
    print("  - 電話: " + (phone[:60] + ('...' if len(phone)>60 else '')))
    print("  - メール: " + mail)
    print()
    print("次のコマンドで埋まったか確認:")
    print("  grep -A1 '運営責任者\\|所在地\\|電話\\|メール' commerce.html | head -16")

if __name__ == '__main__':
    main()
