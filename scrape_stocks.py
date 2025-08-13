#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Scrape UAE stocks and emit a unified JSON at public/stocks_data.json

Usage:
  python scrape_stocks.py --symbols DEWA SALIK NMDC --out public/stocks_data.json

Notes:
- استبدل الدوال الوهمية بمصادر بياناتك الفعلية (واجهات مزوّد السوق أو مزوّد طرف ثالث)
- يحافظ على بنية متوافقة مع واجهة الويب.
"""
import argparse, json, datetime as dt, random
from typing import List, Dict

# مثال لجلب بيانات (وهمي). استبدله بمصدر حقيقي.
def fetch_symbol(symbol: str) -> Dict:
  today = dt.datetime.utcnow().date()
  history = []
  price = round(2 + random.random() * 3, 3)
  for i in range(30, 0, -1):
    d = today - dt.timedelta(days=i)
    o = round(price * (0.98 + random.random()*0.04), 3)
    c = round(price * (0.98 + random.random()*0.04), 3)
    h = max(o, c) + round(random.random()*0.05, 3)
    l = min(o, c) - round(random.random()*0.05, 3)
    history.append({
      "date": d.isoformat(),
      "open": float(o), "high": float(h), "low": float(l), "close": float(c)
    })
  return {
    "symbol": symbol.upper(),
    "last": float(price),
    "volume": int(random.randint(100000, 3000000)),
    "last_update": dt.datetime.utcnow().replace(microsecond=0).isoformat() + 'Z',
    "history": history,
    "pe": round(random.uniform(10, 22), 1),
    "roe": round(random.uniform(8, 20), 1),
    "eps": round(random.uniform(0.05, 0.4), 2),
  }

def main(symbols: List[str], out: str):
  bundle = [fetch_symbol(sym) for sym in symbols]
  with open(out, 'w', encoding='utf-8') as f:
    json.dump(bundle, f, ensure_ascii=False, indent=2)
  print(f"Wrote {len(bundle)} symbols to {out}")

if __name__ == '__main__':
  ap = argparse.ArgumentParser()
  ap.add_argument('--symbols', nargs='+', required=True)
  ap.add_argument('--out', default='public/stocks_data.json')
  args = ap.parse_args()
  main(args.symbols, args.out)
