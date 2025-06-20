import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, BarChart3, Download, Package, Users, ShoppingCart } from "lucide-react";
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

  // تحميل التقارير فورياً عند تحميل المكون
  const loadReportData = async () => {
    try {
      setIsLoading(true);
      console.log('Loading report data...');

      // استعلامات متوازية لتسريع التحميل
      const [productsResult, suppliersResult, purchasesResult] = await Promise.all([
        executeQuery('SELECT COUNT(*) as count FROM products'),
        executeQuery('SELECT COUNT(*) as count FROM suppliers'),
        executeQuery('SELECT COUNT(*) as count, SUM(total_amount) as total FROM purchases')
      ]);

      console.log('Products result:', productsResult);
      console.log('Suppliers result:', suppliersResult);
      console.log('Purchases result:', purchasesResult);

      let totalProducts = 0;
      let totalSuppliers = 0;
      let totalPurchases = 0;
      let totalValue = 0;

      // معالجة نتائج المنتجات
      if (productsResult?.results?.[0]?.response?.result?.rows?.[0]) {
        totalProducts = parseInt(productsResult.results[0].response.result.rows[0][0]) || 0;
      }

      // معالجة نتائج الموردين
      if (suppliersResult?.results?.[0]?.response?.result?.rows?.[0]) {
        totalSuppliers = parseInt(suppliersResult.results[0].response.result.rows[0][0]) || 0;
      }

      // معالجة نتائج المشتريات
      if (purchasesResult?.results?.[0]?.response?.result?.rows?.[0]) {
        totalPurchases = parseInt(purchasesResult.results[0].response.result.rows[0][0]) || 0;
        totalValue = parseFloat(purchasesResult.results[0].response.result.rows[0][1]) || 0;
      }

      // تحميل التقارير التفصيلية
      const [productDetailsResult, purchaseDetailsResult, supplierDetailsResult] = await Promise.all([
        executeQuery('SELECT name, category, total_quantity, price FROM products ORDER BY total_quantity DESC LIMIT 10'),
        executeQuery('SELECT p.product_name, p.quantity, p.unit_price, p.total_amount, p.created_at FROM purchases p ORDER BY p.created_at DESC LIMIT 10'),
        executeQuery('SELECT name, contact_person FROM suppliers ORDER BY created_at DESC LIMIT 10')
      ]);

      const productReports = productDetailsResult?.results?.[0]?.response?.result?.rows?.map((row: any) => ({
        name: String(row[0] || ""),
        category: String(row[1] || ""),
        quantity: parseFloat(row[2]) || 0,
        price: parseFloat(row[3]) || 0,
        totalValue: (parseFloat(row[2]) || 0) * (parseFloat(row[3]) || 0)
      })) || [];

      const purchaseReports = purchaseDetailsResult?.results?.[0]?.response?.result?.rows?.map((row: any) => ({
        productName: String(row[0] || ""),
        quantity: parseFloat(row[1]) || 0,
        unitPrice: parseFloat(row[2]) || 0,
        totalAmount: parseFloat(row[3]) || 0,
        date: String(row[4] || "")
      })) || [];

      const supplierReports = supplierDetailsResult?.results?.[0]?.response?.result?.rows?.map((row: any) => ({
        name: String(row[0] || ""),
        contactPerson: String(row[1] || "")
      })) || [];

      setReportData({
        totalProducts,
        totalSuppliers,
        totalPurchases,
        totalValue,
        productReports,
        purchaseReports,
        supplierReports
      });

      console.log('Report data loaded successfully:', {
        totalProducts,
        totalSuppliers,
        totalPurchases,
        totalValue
      });
      
    } catch (error) {
      console.error('Error loading report data:', error);
      toast({
        title: "خطأ في تحميل البيانات",
        description: 'خطأ في تحميل بيانات التقارير: ' + error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // تحميل فوري عند تحميل المكون
  useEffect(() => {
    loadReportData();
  }, []);

  // تحديث فوري عند تغيير المرشحات
  useEffect(() => {
    if (dateFrom || dateTo || selectedCategory !== "الكل" || reportType !== "شامل") {
      loadReportData();
    }
  }, [dateFrom, dateTo, selectedCategory, reportType]);

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
                      <TableCell className="text-slate-300">{product.price} ر.س</TableCell>
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
                      <TableCell className="text-slate-300">{purchase.unitPrice} ر.س</TableCell>
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
