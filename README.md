# Stock Dashboard (Next.js + Tailwind + Plotly)

لوحة متابعة أسهم مع صفحات ديناميكية لكل رمز، مؤشرات فنية، إدارة محفظة، وتوليد تقرير PDF.

## البدء
```bash
npm install
npm run dev
```

تتوفر بيانات تجريبية في `public/stocks_data.json`. لتحديث البيانات تلقائيًا:
1. حدث أو أكمل **رموز الأسهم** في `.github/workflows/update_data.yml` وواجهة `scrape_stocks.py`.
2. فعّل GitHub Actions (الجدولة تضبط على 08:00 UTC = 12:00 UAE).

## النشر على GitHub Pages
- استخدم **Static Export** أو استضافة على Vercel/Netlify.
- للتصدير الثابت: أضف سكربت `next export` واضبط `output: 'export'` في `next.config.js` إذا رغبت.

## ملاحظات
- المؤشرات الفنية (SMA/RSI) لأغراض العرض. تأكد من صحة الصيغ والبيانات الحقيقية عند الربط بمزوّدي البيانات.
- بإمكانك توسيع `PortfolioContext` لتخزين بيانات في LocalStorage أو قاعدة بيانات.
