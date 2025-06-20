import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, BarChart3, Package, Users, ShoppingCart } from "lucide-react";
import { executeQuery } from '@/utils/database';
import { useToast } from "@/hooks/use-toast";

interface ReportData {
  totalProducts: number;
  totalSuppliers: number;
  totalPurchases: number;
  totalValue: number;
  productReports: any[];
  purchaseReports: any[];
  supplierReports: any[];
}

const ReportsManager = () => {
  const { toast } = useToast();
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [reportType, setReportType] = useState("شامل");
  const [reportData, setReportData] = useState<ReportData>({
    totalProducts: 0,
    totalSuppliers: 0,
    totalPurchases: 0,
    totalValue: 0,
    productReports: [],
    purchaseReports: [],
    supplierReports: []
  });
  const [isLoading, setIsLoading] = useState(false);

  // تحميل التقارير مع معالجة محسنة للأخطاء
  const loadReportData = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Starting report data loading...');

      // تحميل إحصائيات أساسية بطريقة آمنة
      const [productsCount, suppliersCount, purchasesData] = await Promise.allSettled([
        executeQuery('SELECT COUNT(*) as count FROM products'),
        executeQuery('SELECT COUNT(*) as count FROM suppliers'),
        executeQuery('SELECT COUNT(*), COALESCE(SUM(total), 0) FROM purchases')
      ]);

      let totalProducts = 0;
      let totalSuppliers = 0;
      let totalPurchases = 0;
      let totalValue = 0;

      // معالجة نتائج العد مع console.log مفصل
      if (productsCount.status === 'fulfilled' && productsCount.value?.results?.[0]?.response?.result?.rows?.[0]) {
        const productRow = productsCount.value.results[0].response.result.rows[0];
        totalProducts = parseInt(String(productRow[0])) || 0;
        console.log('✅ Products count loaded:', totalProducts);
      } else {
        console.log('⚠️ Failed to load products count:', productsCount);
      }

      if (suppliersCount.status === 'fulfilled' && suppliersCount.value?.results?.[0]?.response?.result?.rows?.[0]) {
        const supplierRow = suppliersCount.value.results[0].response.result.rows[0];
        totalSuppliers = parseInt(String(supplierRow[0])) || 0;
        console.log('✅ Suppliers count loaded:', totalSuppliers);
      } else {
        console.log('⚠️ Failed to load suppliers count:', suppliersCount);
      }

      if (purchasesData.status === 'fulfilled' && purchasesData.value?.results?.[0]?.response?.result?.rows?.[0]) {
        const purchaseRow = purchasesData.value.results[0].response.result.rows[0];
        totalPurchases = parseInt(String(purchaseRow[0])) || 0;
        totalValue = parseFloat(String(purchaseRow[1])) || 0;
        console.log('✅ Purchases data loaded:', { totalPurchases, totalValue });
      } else {
        console.log('⚠️ Failed to load purchases data:', purchasesData);
      }

      // تحميل البيانات التفصيلية
      const [productDetails, purchaseDetails, supplierDetails] = await Promise.allSettled([
        executeQuery('SELECT name, category, COALESCE(total, 0), COALESCE(price, 0) FROM products ORDER BY total DESC LIMIT 10'),
        executeQuery('SELECT product_name, quantity, price, total, date FROM purchases ORDER BY date DESC LIMIT 10'),
        executeQuery('SELECT name, contact_person FROM suppliers ORDER BY name LIMIT 10')
      ]);

      // معالجة تقارير المنتجات
      let productReports: any[] = [];
      if (productDetails.status === 'fulfilled' && productDetails.value?.results?.[0]?.response?.result?.rows) {
        productReports = productDetails.value.results[0].response.result.rows.map((row: any[]) => ({
          name: String(row[0] || "غير محدد"),
          category: String(row[1] || "غير محدد"),
          quantity: parseFloat(String(row[2])) || 0,
          price: parseFloat(String(row[3])) || 0,
          totalValue: (parseFloat(String(row[2])) || 0) * (parseFloat(String(row[3])) || 0)
        }));
        console.log('✅ Product reports loaded:', productReports.length);
      }

      // معالجة تقارير المشتريات
      let purchaseReports: any[] = [];
      if (purchaseDetails.status === 'fulfilled' && purchaseDetails.value?.results?.[0]?.response?.result?.rows) {
        purchaseReports = purchaseDetails.value.results[0].response.result.rows.map((row: any[]) => ({
          productName: String(row[0] || "غير محدد"),
          quantity: parseFloat(String(row[1])) || 0,
          unitPrice: parseFloat(String(row[2])) || 0,
          totalAmount: parseFloat(String(row[3])) || 0,
          date: String(row[4] || "")
        }));
        console.log('✅ Purchase reports loaded:', purchaseReports.length);
      }

      // معالجة تقارير الموردين
      let supplierReports: any[] = [];
      if (supplierDetails.status === 'fulfilled' && supplierDetails.value?.results?.[0]?.response?.result?.rows) {
        supplierReports = supplierDetails.value.results[0].response.result.rows.map((row: any[]) => ({
          name: String(row[0] || "غير محدد"),
          contactPerson: String(row[1] || "غير محدد")
        }));
        console.log('✅ Supplier reports loaded:', supplierReports.length);
      }

      // تحديث الحالة
      setReportData({
        totalProducts,
        totalSuppliers,
        totalPurchases,
        totalValue,
        productReports,
        purchaseReports,
        supplierReports
      });

      console.log('🎉 Report data loaded successfully:', {
        totalProducts,
        totalSuppliers,
        totalPurchases,
        totalValue,
        reportCounts: {
          products: productReports.length,
          purchases: purchaseReports.length,
          suppliers: supplierReports.length
        }
      });

      toast({
        title: "تم تحديث التقارير",
        description: "تم تحميل البيانات بنجاح",
        variant: "default",
      });
      
    } catch (error) {
      console.error('❌ Error loading report data:', error);
      toast({
        title: "خطأ في تحميل البيانات",
        description: `فشل في تحميل بيانات التقارير: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // تحميل فوري عند تحميل المكون
  useEffect(() => {
    console.log('🚀 ReportsManager mounted, loading data...');
    loadReportData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="animate-fade-in bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <FileText className="h-5 w-5 text-yellow-500" />
            التقارير والإحصائيات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <Label htmlFor="dateFrom" className="text-slate-200">من تاريخ</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="dateTo" className="text-slate-200">إلى تاريخ</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div>
              <Label className="text-slate-200">الفئة</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="اختر الفئة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="الكل">الكل</SelectItem>
                  <SelectItem value="أقمشة">أقمشة</SelectItem>
                  <SelectItem value="خامات">خامات</SelectItem>
                  <SelectItem value="أدوات">أدوات</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-slate-200">نوع التقرير</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="اختر نوع التقرير" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="شامل">تقرير شامل</SelectItem>
                  <SelectItem value="منتجات">المنتجات فقط</SelectItem>
                  <SelectItem value="مشتريات">المشتريات فقط</SelectItem>
                  <SelectItem value="موردين">الموردين فقط</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={loadReportData}
            className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-slate-900 font-bold transition-all duration-200 shadow-lg hover:shadow-yellow-500/25"
            disabled={isLoading}
          >
            <BarChart3 className="h-4 w-4 ml-2" />
            {isLoading ? "جاري التحديث..." : "تحديث التقرير"}
          </Button>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="animate-scale-in bg-gradient-to-br from-green-600 to-green-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">إجمالي المنتجات</p>
                <p className="text-3xl font-bold">{reportData.totalProducts}</p>
              </div>
              <Package className="h-12 w-12 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="animate-scale-in bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">إجمالي الموردين</p>
                <p className="text-3xl font-bold">{reportData.totalSuppliers}</p>
              </div>
              <Users className="h-12 w-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="animate-scale-in bg-gradient-to-br from-yellow-600 to-yellow-700 text-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-800">إجمالي المشتريات</p>
                <p className="text-3xl font-bold">{reportData.totalPurchases}</p>
              </div>
              <ShoppingCart className="h-12 w-12 text-yellow-800" />
            </div>
          </CardContent>
        </Card>

        <Card className="animate-scale-in bg-gradient-to-br from-purple-600 to-purple-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">القيمة الإجمالية</p>
                <p className="text-2xl font-bold">{reportData.totalValue.toLocaleString('ar-EG')} ر.س</p>
              </div>
              <FileText className="h-12 w-12 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      {(reportType === "شامل" || reportType === "منتجات") && (
        <Card className="animate-fade-in bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">تقرير المنتجات</CardTitle>
          </CardHeader>
          <CardContent>
            {reportData.productReports.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-slate-200">اسم المنتج</TableHead>
                    <TableHead className="text-slate-200">الفئة</TableHead>
                    <TableHead className="text-slate-200">الكمية</TableHead>
                    <TableHead className="text-slate-200">السعر</TableHead>
                    <TableHead className="text-slate-200">القيمة الإجمالية</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.productReports.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-slate-300">{product.name}</TableCell>
                      <TableCell className="text-slate-300">{product.category}</TableCell>
                      <TableCell className="text-slate-300">{product.quantity}</TableCell>
                      <TableCell className="text-slate-300">{product.price.toLocaleString('ar-EG')} ر.س</TableCell>
                      <TableCell className="text-green-400 font-bold">{product.totalValue.toLocaleString('ar-EG')} ر.س</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Alert>
                <AlertDescription>لا توجد بيانات منتجات للعرض</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {(reportType === "شامل" || reportType === "مشتريات") && (
        <Card className="animate-fade-in bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">تقرير المشتريات</CardTitle>
          </CardHeader>
          <CardContent>
            {reportData.purchaseReports.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-slate-200">اسم المنتج</TableHead>
                    <TableHead className="text-slate-200">الكمية</TableHead>
                    <TableHead className="text-slate-200">سعر الوحدة</TableHead>
                    <TableHead className="text-slate-200">المبلغ الإجمالي</TableHead>
                    <TableHead className="text-slate-200">التاريخ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.purchaseReports.map((purchase, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-slate-300">{purchase.productName}</TableCell>
                      <TableCell className="text-slate-300">{purchase.quantity}</TableCell>
                      <TableCell className="text-slate-300">{purchase.unitPrice.toLocaleString('ar-EG')} ر.س</TableCell>
                      <TableCell className="text-green-400 font-bold">{purchase.totalAmount.toLocaleString('ar-EG')} ر.س</TableCell>
                      <TableCell className="text-slate-400">{new Date(purchase.date).toLocaleDateString('ar-EG')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Alert>
                <AlertDescription>لا توجد بيانات مشتريات للعرض</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {(reportType === "شامل" || reportType === "موردين") && (
        <Card className="animate-fade-in bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">تقرير الموردين</CardTitle>
          </CardHeader>
          <CardContent>
            {reportData.supplierReports.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-slate-200">اسم المورد</TableHead>
                    <TableHead className="text-slate-200">الشخص المسؤول</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.supplierReports.map((supplier, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-slate-300">{supplier.name}</TableCell>
                      <TableCell className="text-slate-300">{supplier.contactPerson}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Alert>
                <AlertDescription>لا توجد بيانات موردين للعرض</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportsManager;
