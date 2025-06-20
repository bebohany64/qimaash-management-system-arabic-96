
// تحذير: تخزين معلومات قاعدة البيانات في الكود غير آمن
// يُنصح بشدة باستخدام تكامل Supabase المدمج في Lovable

export interface DatabaseConfig {
  url: string;
  token: string;
}

// معلومات الاتصال - يجب نقلها إلى متغيرات البيئة في الإنتاج
export const dbConfig: DatabaseConfig = {
  url: "https://alkoa-alaaamla-bebo.aws-eu-west-1.turso.io",
  token: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTAzODEwMDUsImlkIjoiZjdhMjJlN2MtNDYwYS00YmVhLWE5NGQtNWFlYjNlZTdkOGMzIiwicmlkIjoiODk1MmRjMzMtZTBlNi00MTdlLWE4ZDEtNDllNjM1Mzk3N2IzIn0.YwaGzTMEFuufazVP2FWGbUEYFnzr_KNv9acog4TsDBN_kDRlHflI0wILhjpJGXfTV1sbTMa1RvGe4kJplaPABQ"
};

// Helper function to extract value from database response - محسنة
const extractValue = (dbValue: any): any => {
  // إذا كان القيمة null أو undefined
  if (dbValue === null || dbValue === undefined) {
    return null;
  }
  
  // إذا كان القيمة نص "null"
  if (dbValue === "null") {
    return null;
  }
  
  // إذا كان القيمة كائن يحتوي على خاصية value
  if (dbValue && typeof dbValue === 'object' && 'value' in dbValue) {
    return dbValue.value;
  }
  
  // إرجاع القيمة كما هي
  return dbValue;
};

// دالة أساسية للاتصال بقاعدة البيانات - محسنة
export const executeQuery = async (sql: string, params: any[] = []) => {
  try {
    console.log('Executing query:', sql, 'with params:', params);
    
    const response = await fetch(`${dbConfig.url}/v2/pipeline`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${dbConfig.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requests: [
          {
            type: "execute",
            stmt: {
              sql: sql,
              args: params.map(param => ({ type: "text", value: String(param) }))
            }
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HTTP error response:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    console.log('Raw database query result:', result);
    
    // التحقق من وجود خطأ في النتيجة
    if (result && result.results && result.results[0] && result.results[0].type === "error") {
      console.error('Database error:', result.results[0].error);
      throw new Error(`Database error: ${result.results[0].error.message}`);
    }
    
    // معالجة النتيجة لاستخراج القيم الفعلية - تحسين
    if (result && result.results && result.results[0] && result.results[0].response && result.results[0].response.result) {
      const queryResult = result.results[0].response.result;
      
      if (queryResult.rows && Array.isArray(queryResult.rows)) {
        const processedRows = queryResult.rows.map((row: any[]) => 
          row.map((cell: any) => {
            const extractedValue = extractValue(cell);
            console.log('Processing cell:', cell, 'extracted:', extractedValue);
            return extractedValue;
          })
        );
        result.results[0].response.result.rows = processedRows;
        console.log('Processed rows:', processedRows);
      }
    }
    
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// دالة لتحديث كمية المنتج عند الشراء - محسنة
export const updateProductQuantityOnPurchase = async (productName: string, purchasedQuantity: number) => {
  try {
    console.log('Updating product quantity for:', productName, 'with quantity:', purchasedQuantity);
    
    // البحث عن المنتج بالاسم أولاً
    const productResult = await executeQuery('SELECT id, previous_balance, total FROM products WHERE name = ?', [productName]);
    
    console.log('Product search result:', productResult);
    
    if (productResult?.results?.[0]?.response?.result?.rows?.length > 0) {
      const productRow = productResult.results[0].response.result.rows[0];
      const productId = parseInt(productRow[0]) || 0;
      const currentPreviousBalance = parseFloat(productRow[1]) || 0;
      const currentTotal = parseFloat(productRow[2]) || 0;
      
      // إضافة الكمية المشتراة إلى الرصيد السابق والإجمالي
      const newPreviousBalance = currentPreviousBalance + purchasedQuantity;
      const newTotal = currentTotal + purchasedQuantity;
      
      console.log('Updating product:', productId, 'Current:', {currentPreviousBalance, currentTotal}, 'New:', {newPreviousBalance, newTotal});
      
      // تحديث المنتج في قاعدة البيانات
      const updateResult = await executeQuery(
        'UPDATE products SET previous_balance = ?, total = ? WHERE id = ?',
        [newPreviousBalance, newTotal, productId]
      );
      
      console.log('Product update result:', updateResult);
      console.log('Product quantity updated successfully');
      return true;
    } else {
      console.log('Product not found:', productName);
      return false;
    }
  } catch (error) {
    console.error('Error updating product quantity:', error);
    throw error;
  }
};

// دوال إنشاء الجداول - محسنة بدون إضافة بيانات تجريبية
export const createTables = async () => {
  try {
    console.log('Starting table creation process...');
    
    // التحقق من وجود الجداول أولاً
    try {
      const tablesCheck = await executeQuery(`
        SELECT name FROM sqlite_master WHERE type='table' AND name IN ('products', 'suppliers', 'purchases')
      `);
      console.log('Existing tables check:', tablesCheck);
    } catch (error) {
      console.log('Error checking existing tables (this is normal for first run):', error);
    }

    // حذف الجداول القديمة إذا كانت موجودة (بترتيب عكسي للمراجع)
    console.log('Dropping old tables if they exist...');
    try {
      await executeQuery(`DROP TABLE IF EXISTS purchases`);
      await executeQuery(`DROP TABLE IF EXISTS products`);
      await executeQuery(`DROP TABLE IF EXISTS suppliers`);
    } catch (error) {
      console.log('Error dropping tables (this is normal):', error);
    }

    // إنشاء جدول الموردين أولاً
    console.log('Creating suppliers table...');
    const createSuppliersTable = `
      CREATE TABLE suppliers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        contact_person TEXT NOT NULL,
        notes TEXT DEFAULT '',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await executeQuery(createSuppliersTable);
    console.log('Suppliers table created successfully');

    // إنشاء جدول المنتجات
    console.log('Creating products table...');
    const createProductsTable = `
      CREATE TABLE products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        category TEXT NOT NULL,
        custom_category TEXT DEFAULT '',
        unit TEXT NOT NULL,
        price REAL NOT NULL DEFAULT 0,
        previous_balance REAL NOT NULL DEFAULT 0,
        outgoing REAL NOT NULL DEFAULT 0,
        total REAL NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await executeQuery(createProductsTable);
    console.log('Products table created successfully');

    // إنشاء جدول المشتريات
    console.log('Creating purchases table...');
    const createPurchasesTable = `
      CREATE TABLE purchases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        supplier_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        notes TEXT DEFAULT '',
        product_name TEXT NOT NULL,
        quantity REAL NOT NULL,
        price REAL NOT NULL,
        total REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
      )
    `;
    await executeQuery(createPurchasesTable);
    console.log('Purchases table created successfully');

    console.log('All tables created successfully - no sample data added');
    
  } catch (error) {
    console.error('Error in table creation process:', error);
    throw error;
  }
};

// تشغيل إنشاء الجداول عند تحميل التطبيق
createTables().catch(error => {
  console.error('Failed to initialize database:', error);
});
