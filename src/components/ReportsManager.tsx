
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, BarChart3, Download, Package, Users, ShoppingCart } from "lucide-react";
import { executeQuery } from '@/utils/database';

interface ReportData {
  totalProducts: number;
  totalSuppliers: number;
  totalPurchases: number;
  totalInventoryValue: number;
  lowStockProducts: any[];
  recentPurchases: any[];
  categoryBreakdown: any[];
}

const ReportsManager = () => {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [reportData, setReportData] = useState<ReportData>({
    totalProducts: 0,
    totalSuppliers: 0,
    totalPurchases: 0,
    totalInventoryValue: 0,
    lowStockProducts: [],
    recentPurchases: [],
    categoryBreakdown: []
  });
  const [isLoading, setIsLoading] = useState(false);

  const loadReportData = async () => {
    try {
      setIsLoading(true);
      
      // Get total products with updated inventory value calculation
      const productsResult = await executeQuery('SELECT COUNT(*) as count, SUM(total * price) as total_value FROM products');
      const totalProducts = productsResult?.results?.[0]?.response?.result?.rows?.[0]?.[0] || 0;
      const totalInventoryValue = productsResult?.results?.[0]?.response?.result?.rows?.[0]?.[1] || 0;
      
      // Get total suppliers
      const suppliersResult = await executeQuery('SELECT COUNT(*) as count FROM suppliers');
      const totalSuppliers = suppliersResult?.results?.[0]?.response?.result?.rows?.[0]?.[0] || 0;
      
      // Get total purchases with sum of purchase amounts
      const purchasesResult = await executeQuery('SELECT COUNT(*) as count, SUM(total) as total_amount FROM purchases');
      const totalPurchases = purchasesResult?.results?.[0]?.response?.result?.rows?.[0]?.[0] || 0;
      const totalPurchaseAmount = purchasesResult?.results?.[0]?.response?.result?.rows?.[0]?.[1] || 0;
      
      // Get low stock products (total < 10)
      const lowStockResult = await executeQuery('SELECT name, total, unit FROM products WHERE total < 10 ORDER BY total ASC');
      const lowStockProducts = lowStockResult?.results?.[0]?.response?.result?.rows?.map((row: any) => ({
        name: String(row[0] || ""),
        total: parseInt(row[1] || 0),
        unit: String(row[2] || "")
      })) || [];
      
      // Get recent purchases with updated data
      const recentPurchasesResult = await executeQuery(`
        SELECT p.product_name, p.quantity, p.price, p.total, p.date, s.name as supplier_name
        FROM purchases p
        LEFT JOIN suppliers s ON p.supplier_id = s.id
        ORDER BY p.created_at DESC
        LIMIT 10
      `);
      const recentPurchases = recentPurchasesResult?.results?.[0]?.response?.result?.rows?.map((row: any) => ({
        productName: String(row[0] || ""),
        quantity: parseFloat(row[1] || 0),
        price: parseFloat(row[2] || 0),
        total: parseFloat(row[3] || 0),
        date: String(row[4] || ""),
        supplierName: String(row[5] || "")
      })) || [];
      
      // Get category breakdown with updated calculations
      const categoryResult = await executeQuery(`
        SELECT category, COUNT(*) as count, SUM(total * price) as value, SUM(total) as total_quantity
        FROM products
        GROUP BY category
        ORDER BY count DESC
      `);
      const categoryBreakdown = categoryResult?.results?.[0]?.response?.result?.rows?.map((row: any) => ({
        category: String(row[0] || ""),
        count: parseInt(row[1] || 0),
        value: parseFloat(row[2] || 0),
        totalQuantity: parseFloat(row[3] || 0)
      })) || [];
      
      setReportData({
        totalProducts: parseInt(totalProducts) || 0,
        totalSuppliers: parseInt(totalSuppliers) || 0,
        totalPurchases: parseInt(totalPurchases) || 0,
        totalInventoryValue: parseFloat(totalInventoryValue) || 0,
        lowStockProducts,
        recentPurchases,
        categoryBreakdown
      });
      
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, []);

  const handleUpdateReport = () => {
    loadReportData();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <FileText className="h-5 w-5" />
            التقارير والإحصائيات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="dateFrom" className="text-gray-300">من تاريخ</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="dateTo" className="text-gray-300">إلى تاريخ</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="category" className="text-gray-300">الفئة</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="الكل">جميع الفئات</SelectItem>
                  <SelectItem value="أقمشة">أقمشة</SelectItem>
                  <SelectItem value="خيوط">خيوط</SelectItem>
                  <SelectItem value="اكسسوارات">اكسسوارات</SelectItem>
                  <SelectItem value="منتجات نهائية">منتجات نهائية</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleUpdateReport}
                disabled={isLoading}
              >
                <BarChart3 className="h-4 w-4 ml-2" />
                {isLoading ? "جاري التحديث..." : "تحديث التقرير"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700">
          <TabsTrigger value="summary" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300">ملخص عام</TabsTrigger>
          <TabsTrigger value="inventory" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300">تقرير المخزون</TabsTrigger>
          <TabsTrigger value="financial" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300">التقرير المالي</TabsTrigger>
        </TabsList>

        {/* Summary Report */}
        <TabsContent value="summary" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gray-800 border-gray-700 hover:shadow-lg transition-shadow animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Package className="h-5 w-5 text-blue-400" />
                  إجمالي المنتجات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">{reportData.totalProducts}</div>
                <div className="text-sm text-gray-400">منتج</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700 hover:shadow-lg transition-shadow animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Users className="h-5 w-5 text-green-400" />
                  الموردين
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">{reportData.totalSuppliers}</div>
                <div className="text-sm text-gray-400">مورد</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700 hover:shadow-lg transition-shadow animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <ShoppingCart className="h-5 w-5 text-purple-400" />
                  المشتريات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400">{reportData.totalPurchases}</div>
                <div className="text-sm text-gray-400">عملية شراء</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700 hover:shadow-lg transition-shadow animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BarChart3 className="h-5 w-5 text-orange-400" />
                  قيمة المخزون المحدثة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-400">{reportData.totalInventoryValue.toFixed(2)}</div>
                <div className="text-sm text-gray-400">جنيه مصري</div>
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown with enhanced data */}
          {reportData.categoryBreakdown.length > 0 && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">توزيع المنتجات حسب الفئة (محدث)</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-600">
                      <TableHead className="text-white">الفئة</TableHead>
                      <TableHead className="text-white">عدد المنتجات</TableHead>
                      <TableHead className="text-white">إجمالي الكمية</TableHead>
                      <TableHead className="text-white">القيمة الإجمالية</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.categoryBreakdown.map((item, index) => (
                      <TableRow key={index} className="border-gray-600">
                        <TableCell className="text-white">{item.category}</TableCell>
                        <TableCell className="text-blue-400">{item.count}</TableCell>
                        <TableCell className="text-yellow-400">{item.totalQuantity || 0}</TableCell>
                        <TableCell className="text-green-400">{item.value.toFixed(2)} ج.م</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Inventory Report */}
        <TabsContent value="inventory" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                تقرير المخزون المحدث
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Download className="h-4 w-4" />
                  تصدير
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reportData.lowStockProducts.length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold text-red-400 mb-4">منتجات منخفضة المخزون</h3>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-600">
                        <TableHead className="text-white">اسم المنتج</TableHead>
                        <TableHead className="text-white">الكمية المتاحة</TableHead>
                        <TableHead className="text-white">الوحدة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.lowStockProducts.map((product, index) => (
                        <TableRow key={index} className="border-gray-600">
                          <TableCell className="text-white">{product.name}</TableCell>
                          <TableCell className="text-red-400">{product.total}</TableCell>
                          <TableCell className="text-gray-300">{product.unit}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 mx-auto mb-4 text-gray-500" />
                  <p className="text-gray-400 text-lg">
                    جميع المنتجات في مستوى مخزون جيد
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Report */}
        <TabsContent value="financial" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                التقرير المالي - المشتريات الأخيرة (مع تحديث المخزون)
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Download className="h-4 w-4" />
                  تصدير
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reportData.recentPurchases.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-600">
                      <TableHead className="text-white">المنتج</TableHead>
                      <TableHead className="text-white">المورد</TableHead>
                      <TableHead className="text-white">الكمية المشتراة</TableHead>
                      <TableHead className="text-white">السعر</TableHead>
                      <TableHead className="text-white">الإجمالي</TableHead>
                      <TableHead className="text-white">التاريخ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.recentPurchases.map((purchase, index) => (
                      <TableRow key={index} className="border-gray-600">
                        <TableCell className="text-white">{purchase.productName}</TableCell>
                        <TableCell className="text-blue-400">{purchase.supplierName}</TableCell>
                        <TableCell className="text-yellow-400">{purchase.quantity}</TableCell>
                        <TableCell className="text-gray-300">{purchase.price.toFixed(2)} ج.م</TableCell>
                        <TableCell className="text-green-400">{purchase.total.toFixed(2)} ج.م</TableCell>
                        <TableCell className="text-gray-300">{purchase.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-500" />
                  <p className="text-gray-400 text-lg">
                    لا توجد مشتريات مسجلة حالياً
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsManager;
