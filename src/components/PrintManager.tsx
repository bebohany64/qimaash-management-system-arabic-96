
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Printer, FileText, Download, Eye, Settings, Package } from "lucide-react";
import { toast } from "sonner";

const PrintManager = () => {
  const [selectedReport, setSelectedReport] = useState("");
  const [printSettings, setPrintSettings] = useState({
    pageSize: "A4",
    orientation: "portrait",
    margins: "normal",
    includeHeader: true,
    includeFooter: true,
    showDate: true,
    showPageNumbers: true
  });

  const reportTypes = [
    { value: "inventory", label: "تقرير المخزون الكامل" },
    { value: "low-stock", label: "تقرير المخزون المنخفض" },
    { value: "purchases", label: "تقرير المشتريات" },
    { value: "suppliers", label: "تقرير الموردين" },
    { value: "financial", label: "التقرير المالي" },
    { value: "invoice", label: "فاتورة مخصصة" }
  ];

  const handlePrint = () => {
    toast.success("تم إرسال التقرير للطباعة بنجاح");
  };

  const handleSavePDF = () => {
    toast.success("تم حفظ التقرير كملف PDF بنجاح");
  };

  const handlePreview = () => {
    toast.info("معاينة التقرير...");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            إدارة الطباعة والتصدير
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reports">طباعة التقارير</TabsTrigger>
          <TabsTrigger value="invoices">طباعة الفواتير</TabsTrigger>
          <TabsTrigger value="settings">إعدادات الطباعة</TabsTrigger>
        </TabsList>

        {/* Reports Printing Tab */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Report Selection */}
            <Card>
              <CardHeader>
                <CardTitle>اختيار التقرير</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="reportType">نوع التقرير</Label>
                  <Select value={selectedReport} onValueChange={setSelectedReport}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع التقرير" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((report) => (
                        <SelectItem key={report.value} value={report.value}>
                          {report.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateFrom">من تاريخ</Label>
                    <Input id="dateFrom" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="dateTo">إلى تاريخ</Label>
                    <Input id="dateTo" type="date" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">تصفية حسب الفئة</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="جميع الفئات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الفئات</SelectItem>
                      <SelectItem value="cotton">قطني</SelectItem>
                      <SelectItem value="silk">حرير</SelectItem>
                      <SelectItem value="linen">كتان</SelectItem>
                      <SelectItem value="wool">صوف</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handlePreview} variant="outline" className="flex-1">
                    <Eye className="h-4 w-4 ml-2" />
                    معاينة
                  </Button>
                  <Button onClick={handleSavePDF} variant="outline" className="flex-1">
                    <Download className="h-4 w-4 ml-2" />
                    PDF
                  </Button>
                  <Button onClick={handlePrint} className="flex-1">
                    <Printer className="h-4 w-4 ml-2" />
                    طباعة
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Reports */}
            <Card>
              <CardHeader>
                <CardTitle>التقارير السريعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-12"
                  onClick={handlePrint}
                >
                  <Package className="h-5 w-5 ml-2" />
                  <div className="text-right">
                    <div className="font-medium">تقرير المخزون اليوم</div>
                    <div className="text-sm text-gray-500">جميع المنتجات الحالية</div>
                  </div>
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full justify-start h-12"
                  onClick={handlePrint}
                >
                  <FileText className="h-5 w-5 ml-2" />
                  <div className="text-right">
                    <div className="font-medium">مشتريات هذا الشهر</div>
                    <div className="text-sm text-gray-500">جميع المشتريات الشهرية</div>
                  </div>
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full justify-start h-12 text-orange-600"
                  onClick={handlePrint}
                >
                  <Settings className="h-5 w-5 ml-2" />
                  <div className="text-right">
                    <div className="font-medium">تنبيه المخزون المنخفض</div>
                    <div className="text-sm text-gray-500">المنتجات التي تحتاج تجديد</div>
                  </div>
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full justify-start h-12"
                  onClick={handlePrint}
                >
                  <Printer className="h-5 w-5 ml-2" />
                  <div className="text-right">
                    <div className="font-medium">قائمة الموردين</div>
                    <div className="text-sm text-gray-500">جميع الموردين وتفاصيلهم</div>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Report Preview */}
          <Card>
            <CardHeader>
              <CardTitle>معاينة التقرير</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center min-h-[400px] flex items-center justify-center">
                <div className="text-gray-500">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">اختر نوع التقرير لعرض المعاينة</p>
                  <p className="text-sm">ستظهر هنا معاينة التقرير قبل الطباعة</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoices Printing Tab */}
        <TabsContent value="invoices" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>طباعة فاتورة مخصصة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="invoiceNumber">رقم الفاتورة</Label>
                  <Input id="invoiceNumber" placeholder="INV-2024-001" />
                </div>

                <div>
                  <Label htmlFor="supplier">المورد</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المورد" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="supplier1">شركة النسيج الحديث</SelectItem>
                      <SelectItem value="supplier2">مؤسسة الحرير الذهبي</SelectItem>
                      <SelectItem value="supplier3">شركة الكتان العربي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="date">تاريخ الفاتورة</Label>
                  <Input id="date" type="date" />
                </div>

                <div>
                  <Label htmlFor="notes">ملاحظات إضافية</Label>
                  <Textarea id="notes" rows={3} placeholder="ملاحظات خاصة بالفاتورة..." />
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Eye className="h-4 w-4 ml-2" />
                    معاينة
                  </Button>
                  <Button className="flex-1">
                    <Printer className="h-4 w-4 ml-2" />
                    طباعة
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>الفواتير الأخيرة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">INV-2024-001</div>
                      <div className="text-sm text-gray-500">شركة النسيج الحديث</div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Printer className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">INV-2024-002</div>
                      <div className="text-sm text-gray-500">مؤسسة الحرير الذهبي</div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Printer className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">INV-2024-003</div>
                      <div className="text-sm text-gray-500">شركة الكتان العربي</div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Printer className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Print Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات الصفحة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="pageSize">حجم الصفحة</Label>
                  <Select 
                    value={printSettings.pageSize} 
                    onValueChange={(value) => setPrintSettings({...printSettings, pageSize: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A4">A4</SelectItem>
                      <SelectItem value="A5">A5</SelectItem>
                      <SelectItem value="Letter">Letter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="orientation">اتجاه الصفحة</Label>
                  <Select 
                    value={printSettings.orientation} 
                    onValueChange={(value) => setPrintSettings({...printSettings, orientation: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">عمودي</SelectItem>
                      <SelectItem value="landscape">أفقي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="margins">الهوامش</Label>
                  <Select 
                    value={printSettings.margins} 
                    onValueChange={(value) => setPrintSettings({...printSettings, margins: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="narrow">ضيق</SelectItem>
                      <SelectItem value="normal">عادي</SelectItem>
                      <SelectItem value="wide">واسع</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>إعدادات المحتوى</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="includeHeader">تضمين الرأسية</Label>
                  <input 
                    type="checkbox" 
                    id="includeHeader"
                    checked={printSettings.includeHeader}
                    onChange={(e) => setPrintSettings({...printSettings, includeHeader: e.target.checked})}
                    className="rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="includeFooter">تضمين التذييل</Label>
                  <input 
                    type="checkbox" 
                    id="includeFooter"
                    checked={printSettings.includeFooter}
                    onChange={(e) => setPrintSettings({...printSettings, includeFooter: e.target.checked})}
                    className="rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="showDate">إظهار التاريخ</Label>
                  <input 
                    type="checkbox" 
                    id="showDate"
                    checked={printSettings.showDate}
                    onChange={(e) => setPrintSettings({...printSettings, showDate: e.target.checked})}
                    className="rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="showPageNumbers">إظهار أرقام الصفحات</Label>
                  <input 
                    type="checkbox" 
                    id="showPageNumbers"
                    checked={printSettings.showPageNumbers}
                    onChange={(e) => setPrintSettings({...printSettings, showPageNumbers: e.target.checked})}
                    className="rounded"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>معلومات الشركة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">اسم الشركة</Label>
                  <Input id="companyName" placeholder="شركة إدارة الأقمشة" />
                </div>
                <div>
                  <Label htmlFor="companyPhone">رقم الهاتف</Label>
                  <Input id="companyPhone" placeholder="0501234567" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="companyAddress">العنوان</Label>
                <Input id="companyAddress" placeholder="الرياض - المملكة العربية السعودية" />
              </div>
              
              <div>
                <Label htmlFor="companyEmail">البريد الإلكتروني</Label>
                <Input id="companyEmail" type="email" placeholder="info@company.com" />
              </div>

              <Button className="w-full">
                <Settings className="h-4 w-4 ml-2" />
                حفظ الإعدادات
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PrintManager;
