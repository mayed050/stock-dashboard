import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Arial',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 10,
    borderBottom: '2px solid #e5e7eb',
    paddingBottom: 5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  gridItem: {
    width: '50%',
    padding: 5,
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  analysisBox: {
    backgroundColor: '#f3f4f6',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  recommendation: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buy: { color: '#059669' },
  sell: { color: '#dc2626' },
  hold: { color: '#d97706' },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#9ca3af',
  },
});

const StockReportPDF = ({ stockData, symbol }) => {
  const analysis = stockData.analysis || {};
  const indicators = stockData.indicators || {};
  const currentDate = format(new Date(), 'dd MMMM yyyy', { locale: ar });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>تقرير تحليل السهم</Text>
          <Text style={styles.subtitle}>{symbol} - {currentDate}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>البيانات الأساسية</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>السعر الحالي</Text>
              <Text style={styles.value}>{stockData.price || 'N/A'}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>التغير</Text>
              <Text style={styles.value}>{stockData.change || 'N/A'}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>حجم التداول</Text>
              <Text style={styles.value}>{stockData.volume || 'N/A'}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>القيمة السوقية</Text>
              <Text style={styles.value}>{stockData.market_cap || 'N/A'}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>ربحية السهم (EPS)</Text>
              <Text style={styles.value}>{stockData.eps || 'N/A'}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>مضاعف الربحية (P/E)</Text>
              <Text style={styles.value}>{stockData.pe || 'N/A'}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>العائد على حقوق الملكية (ROE)</Text>
              <Text style={styles.value}>{stockData.roe || 'N/A'}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>القيمة الدفترية</Text>
              <Text style={styles.value}>{stockData.book_value || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {analysis.recommendation && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>التحليل والتوقعات</Text>
            <View style={styles.analysisBox}>
              <Text style={[styles.recommendation, 
                analysis.recommendation === 'شراء' ? styles.buy :
                analysis.recommendation === 'بيع' ? styles.sell : styles.hold
              ]}>
                التوصية: {analysis.recommendation}
              </Text>
              {analysis.target_price && (
                <Text style={styles.value}>
                  السعر المستهدف (3 أشهر): {analysis.target_price.toFixed(2)}
                </Text>
              )}
              {analysis.target_return && (
                <Text style={styles.value}>
                  العائد المتوقع: {analysis.target_return.toFixed(2)}%
                </Text>
              )}
              <Text style={{ fontSize: 12, marginTop: 5 }}>
                {analysis.pe_analysis}
              </Text>
              <Text style={{ fontSize: 12 }}>
                {analysis.roe_analysis}
              </Text>
            </View>
          </View>
        )}

        {indicators.rsi && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>المؤشرات الفنية</Text>
            <View style={styles.grid}>
              <View style={styles.gridItem}>
                <Text style={styles.label}>مؤشر القوة النسبية (RSI)</Text>
                <Text style={styles.value}>{indicators.rsi.toFixed(2)}</Text>
              </View>
              {indicators.sma_20 && (
                <View style={styles.gridItem}>
                  <Text style={styles.label}>المتوسط المتحرك (20 يوم)</Text>
                  <Text style={styles.value}>{indicators.sma_20.toFixed(2)}</Text>
                </View>
              )}
              {indicators.sma_50 && (
                <View style={styles.gridItem}>
                  <Text style={styles.label}>المتوسط المتحرك (50 يوم)</Text>
                  <Text style={styles.value}>{indicators.sma_50.toFixed(2)}</Text>
                </View>
              )}
              {indicators.macd && (
                <View style={styles.gridItem}>
                  <Text style={styles.label}>MACD</Text>
                  <Text style={styles.value}>{indicators.macd.toFixed(4)}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        <Text style={styles.footer}>
          تم إنشاء هذا التقرير بواسطة لوحة متابعة الأسهم - {currentDate}
        </Text>
      </Page>
    </Document>
  );
};

export default StockReportPDF;
