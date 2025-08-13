import requests
from bs4 import BeautifulSoup
import json
import time
import datetime

def scrape_mubasher_stock(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    stock_data = {}
    
    # استخراج البيانات الأساسية
    price_section = soup.find('div', class_='mi-stock-info')
    if price_section:
        price_span = price_section.find('span', class_='mi-price')
        if price_span:
            stock_data['price'] = price_span.text.strip()
        
        change_span = price_section.find('span', class_='mi-change')
        if change_span:
            stock_data['change'] = change_span.text.strip()
    
    # حجم التداول والقيمة السوقية
    stats_section = soup.find('div', class_='mi-stock-stats')
    if stats_section:
        stats = stats_section.find_all('div', class_='mi-stat-item')
        for stat in stats:
            label = stat.find('div', class_='mi-stat-label')
            value = stat.find('div', class_='mi-stat-value')
            if label and value:
                label_text = label.text.strip()
                value_text = value.text.strip()
                if 'حجم التداول' in label_text:
                    stock_data['volume'] = value_text
                elif 'القيمة السوقية' in label_text:
                    stock_data['market_cap'] = value_text
    
    # EPS و P/E
    ratios_section = soup.find('div', class_='mi-stock-ratios')
    if ratios_section:
        ratios = ratios_section.find_all('div', class_='mi-ratio-item')
        for ratio in ratios:
            label = ratio.find('div', class_='mi-ratio-label')
            value = ratio.find('div', class_='mi-ratio-value')
            if label and value:
                label_text = label.text.strip()
                value_text = value.text.strip()
                if 'ربحية السهم' in label_text:
                    stock_data['eps'] = value_text
                elif 'مضاعف الربحية' in label_text:
                    stock_data['pe'] = value_text
    
    return stock_data

def scrape_argaam_stock(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    stock_data = {}
    
    # استخراج البيانات الأساسية
    price_section = soup.find('div', class_='stock-price')
    if price_section:
        stock_data['price'] = price_section.text.strip()
    
    # استخراج البيانات المالية الأخرى
    financials_section = soup.find('div', class_='financial-indicators')
    if financials_section:
        indicators = financials_section.find_all('div', class_='indicator')
        for indicator in indicators:
            label = indicator.find('div', class_='label')
            value = indicator.find('div', class_='value')
            if label and value:
                label_text = label.text.strip()
                value_text = value.text.strip()
                if 'العائد على حقوق المساهمين' in label_text:
                    stock_data['roe'] = value_text
                elif 'القيمة الدفترية' in label_text:
                    stock_data['book_value'] = value_text
    
    return stock_data

def analyze_stock(data):
    analysis = {}
    
    # تحليل P/E
    try:
        pe = float(data.get('pe', 0))
        if pe > 0:
            if pe < 10:
                analysis['pe_analysis'] = "مضاعف ربحية منخفض - فرصة شراء"
                analysis['recommendation'] = "شراء"
            elif pe > 20:
                analysis['pe_analysis'] = "مضاعف ربحية مرتفع - قد يكون مبالغ في valuation"
                analysis['recommendation'] = "بيع"
            else:
                analysis['pe_analysis'] = "مضاعف ربحية معقول"
                analysis['recommendation'] = "احتفاظ"
    except:
        analysis['pe_analysis'] = "غير متوفر"
        analysis['recommendation'] = "محايد"
    
    # تحليل ROE
    try:
        roe = float(data.get('roe', 0))
        if roe > 15:
            analysis['roe_analysis'] = "عائد على حقوق الملكية ممتاز"
        elif roe > 10:
            analysis['roe_analysis'] = "عائد على حقوق الملكية جيد"
        else:
            analysis['roe_analysis'] = "عائد على حقوق الملكية ضعيف"
    except:
        analysis['roe_analysis'] = "غير متوفر"
    
    # حساب السعر المستهدف
    try:
        current_price = float(data.get('price', 0))
        eps = float(data.get('eps', 0))
        if eps > 0:
            target_price = eps * 15
            analysis['target_price'] = target_price
            analysis['target_return'] = ((target_price - current_price) / current_price) * 100
    except:
        analysis['target_price'] = None
        analysis['target_return'] = None
    
    return analysis

def calculate_technical_indicators(prices, volumes):
    if len(prices) < 14:
        return {}
    
    indicators = {}
    
    # حساب المتوسط المتحرك البسيط (SMA)
    sma_20 = sum(prices[-20:]) / min(20, len(prices))
    sma_50 = sum(prices[-50:]) / min(50, len(prices))
    indicators['sma_20'] = sma_20
    indicators['sma_50'] = sma_50
    
    # حساب RSI
    gains = []
    losses = []
    for i in range(1, len(prices)):
        change = prices[i] - prices[i-1]
        if change > 0:
            gains.append(change)
            losses.append(0)
        else:
            gains.append(0)
            losses.append(abs(change))
    
    avg_gain = sum(gains[-14:]) / 14
    avg_loss = sum(losses[-14:]) / 14
    rs = avg_gain / avg_loss if avg_loss != 0 else 0
    rsi = 100 - (100 / (1 + rs))
    indicators['rsi'] = rsi
    
    # حساب MACD
    ema_12 = prices[0]
    ema_26 = prices[0]
    for price in prices[1:]:
        ema_12 = (price * 2/13) + (ema_12 * 11/13)
        ema_26 = (price * 2/27) + (ema_26 * 25/27)
    macd = ema_12 - ema_26
    indicators['macd'] = macd
    
    return indicators

def main():
    # روابط الأسهم
    stocks = {
        'DEWA': {
            'mubasher': 'https://www.mubasher.info/markets/DFM/stocks/DEWA',
            'argaam': 'https://www.argaam.com/ae-ar/companies/dfm/dewa/overview'
        },
        'SALIK': {
            'mubasher': 'https://www.mubasher.info/markets/DFM/stocks/SALIK',
            'argaam': 'https://www.argaam.com/ae-ar/companies/dfm/salik/overview'
        },
        'TALABAT': {
            'mubasher': 'https://www.mubasher.info/markets/DFM/stocks/TALABAT',
            'argaam': 'https://www.argaam.com/ae-ar/companies/dfm/talabat/overview'
        },
        'NMDC': {
            'mubasher': 'https://www.mubasher.info/markets/ADN/stocks/NMDCENR',
            'argaam': 'https://www.argaam.com/ae-ar/companies/adn/nmdcenr/overview'
        }
    }
    
    # جمع البيانات لكل سهم
    all_data = {}
    for stock, urls in stocks.items():
        print(f"جاري جمع بيانات {stock}...")
        mubasher_data = scrape_mubasher_stock(urls['mubasher'])
        argaam_data = scrape_argaam_stock(urls['argaam'])
        
        # إضافة التحليل
        analysis = analyze_stock({**mubasher_data, **argaam_data})
        
        # بيانات تاريخية وهمية (للعرض فقط)
        historical_data = {
            'dates': ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05'],
            'prices': [2.5, 2.6, 2.7, 2.8, 2.75],
            'volumes': [15000000, 16000000, 14000000, 18000000, 17000000]
        }
        
        # حساب المؤشرات الفنية
        indicators = calculate_technical_indicators(historical_data['prices'], historical_data['volumes'])
        
        all_data[stock] = {
            **mubasher_data, 
            **argaam_data,
            'analysis': analysis,
            'historical': historical_data,
            'indicators': indicators
        }
        time.sleep(2)
    
    # إضافة وقت التحديث
    update_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    all_data['metadata'] = {
        'last_updated': update_time,
        'update_status': 'success'
    }
    
    # حفظ البيانات
    with open('public/stocks_data.json', 'w', encoding='utf-8') as f:
        json.dump(all_data, f, ensure_ascii=False, indent=4)
    
    print(f"تم تحديث البيانات بنجاح في: {update_time}")

if __name__ == "__main__":
    main()
