
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
    console.log('Database query result:', result);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// دوال إنشاء الجداول
export const createTables = async () => {
  const createProductsTable = `
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      custom_category TEXT,
      unit TEXT NOT NULL,
      price REAL NOT NULL,
      previous_balance REAL NOT NULL,
      outgoing REAL NOT NULL,
      total REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createSuppliersTable = `
    CREATE TABLE IF NOT EXISTS suppliers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      contact_person TEXT NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createPurchasesTable = `
    CREATE TABLE IF NOT EXISTS purchases (
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

  try {
    await executeQuery(createProductsTable);
    await executeQuery(createSuppliersTable);
    await executeQuery(createPurchasesTable);
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

// يتم تشغيل إنشاء الجداول عند تحميل التطبيق
createTables();
