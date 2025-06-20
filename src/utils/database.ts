
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

// Helper function to extract value from database response
const extractValue = (dbValue: any): any => {
  if (dbValue && typeof dbValue === 'object' && 'value' in dbValue) {
    return dbValue.value;
  }
  return dbValue;
};

// دالة أساسية للاتصال بقاعدة البيانات
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
    
    // Process the result to extract actual values
    if (result && result.results && result.results[0] && result.results[0].response && result.results[0].response.result) {
      const queryResult = result.results[0].response.result;
      
      if (queryResult.rows) {
        const processedRows = queryResult.rows.map((row: any[]) => 
          row.map((cell: any) => extractValue(cell))
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

// دالة لتحديث كمية المنتج عند الشراء
export const updateProductQuantityOnPurchase = async (productName: string, purchasedQuantity: number) => {
  try {
    console.log('Updating product quantity for:', productName, 'with quantity:', purchasedQuantity);
    
    // البحث عن المنتج بالاسم
    const productResult = await executeQuery('SELECT id, previous_balance, total FROM products WHERE name = ?', [productName]);
    
    if (productResult?.results?.[0]?.response?.result?.rows?.length > 0) {
      const productRow = productResult.results[0].response.result.rows[0];
      const productId = parseInt(productRow[0]);
      const currentPreviousBalance = parseFloat(productRow[1]) || 0;
      const currentTotal = parseFloat(productRow[2]) || 0;
      
      // إضافة الكمية المشتراة إلى الرصيد السابق والإجمالي
      const newPreviousBalance = currentPreviousBalance + purchasedQuantity;
      const newTotal = currentTotal + purchasedQuantity;
      
      console.log('Updating product:', productId, 'New balance:', newPreviousBalance, 'New total:', newTotal);
      
      // تحديث المنتج في قاعدة البيانات
      await executeQuery(
        'UPDATE products SET previous_balance = ?, total = ? WHERE id = ?',
        [newPreviousBalance, newTotal, productId]
      );
      
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

// دوال إنشاء الجداول بطريقة متسلسلة
export const createTables = async () => {
  try {
    console.log('Starting table creation process...');
    
    // أولاً، احذف الجداول القديمة إذا كانت موجودة
    console.log('Dropping old tables if they exist...');
    await executeQuery(`DROP TABLE IF EXISTS purchases`);
    await executeQuery(`DROP TABLE IF EXISTS products`);
    await executeQuery(`DROP TABLE IF EXISTS suppliers`);

    // إنشاء جدول المنتجات
    console.log('Creating products table...');
    const createProductsTable = `
      CREATE TABLE products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        custom_category TEXT,
        unit TEXT NOT NULL,
        price REAL NOT NULL DEFAULT 0,
        previous_balance REAL NOT NULL DEFAULT 0,
        outgoing REAL NOT NULL DEFAULT 0,
        total REAL NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await executeQuery(createProductsTable);

    // إنشاء جدول الموردين
    console.log('Creating suppliers table...');
    const createSuppliersTable = `
      CREATE TABLE suppliers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        contact_person TEXT NOT NULL,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await executeQuery(createSuppliersTable);

    // إنشاء جدول المشتريات
    console.log('Creating purchases table...');
    const createPurchasesTable = `
      CREATE TABLE purchases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        supplier_id INTEGER,
        date TEXT NOT NULL,
        notes TEXT,
        product_name TEXT NOT NULL,
        quantity REAL NOT NULL,
        price REAL NOT NULL,
        total REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
      )
    `;
    await executeQuery(createPurchasesTable);

    console.log('All tables created successfully');
    
    // إضافة بعض البيانات التجريبية للاختبار
    console.log('Adding sample data...');
    
    // إضافة مورد تجريبي
    await executeQuery(
      'INSERT INTO suppliers (name, contact_person, notes) VALUES (?, ?, ?)',
      ['مورد تجريبي', 'أحمد محمد', 'مورد للاختبار']
    );
    
    // إضافة منتج تجريبي
    await executeQuery(
      'INSERT INTO products (name, category, unit, price, previous_balance, outgoing, total) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['قماش قطني', 'أقمشة', 'متر', 25.50, 100, 0, 100]
    );
    
    console.log('Sample data added successfully');
    
  } catch (error) {
    console.error('Error in table creation process:', error);
    throw error;
  }
};

// تشغيل إنشاء الجداول عند تحميل التطبيق
createTables().catch(error => {
  console.error('Failed to initialize database:', error);
});
