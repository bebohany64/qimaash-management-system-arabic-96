
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Printer, Download, FileSpreadsheet, Package, Users, ShoppingCart, BarChart3 } from "lucide-react";
import { toast } from "sonner";

const PrintManager = () => {
  const [selectedReport, setSelectedReport] = useState("");

  const handlePrint = () => {
    if (!selectedReport) {
      toast.error("يرجى اختيار التقرير المراد طباعته");
      return;
    }
    
    // Create print content based on selected report
    const printWindow = window.open('', '_blank');
    const printContent = generatePrintContent(selectedReport);
    
    printWindow?.document.write(`
      <html>
        <head>
          <title>طباعة ${getReportName(selectedReport)}</title>
          <style>
            body { font-family: Arial, sans-serif; direction: rtl; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
            th { background-color: #f2f2f2; }
            h1 { text-align: center; color: #333; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${printContent}
          <script>window.print(); window.close();</script>
        </body>
      </html>
    `);
    
    toast.success("تم إرسال الطباعة بنجاح");
  };

  const handleExportExcel = () => {
    if (!selectedReport) {
      toast.error("يرجى اختيار التقرير المراد تصديره");
      return;
    }

    // Generate CSV content for Excel compatibility
    const csvContent = generateCSVContent(selectedReport);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${getReportName(selectedReport)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    toast.success(`تم تصدير ${getReportName(selectedReport)} إلى Excel بنجاح`);
  };

  const generatePrintContent = (reportType: string) => {
    const reportName = getReportName(reportType);
    const currentDate = new Date().toLocaleDateString('ar-EG');
    
    switch (reportType) {
      case "products":
        return `
          <h1>تقرير المنتجات</h1>
          <p>تاريخ التقرير: ${currentDate}</p>
          <table>
            <thead>
              <tr>
                <th>اسم المنتج</th>
                <th>الفئة</th>
                <th>وحدة القياس</th>
                <th>السعر (ج.م)</th>
                <th>الرصيد السابق</th>
                <th>المنصرف</th>
                <th>الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              <tr><td colspan="7">لا توجد بيانات للعرض</td></tr>
            </tbody>
          </table>
        `;
      case "suppliers":
        return `
          <h1>تقرير الموردين</h1>
          <p>تاريخ التقرير: ${currentDate}</p>
          <table>
            <thead>
              <tr>
                <th>اسم المورد</th>
                <th>الشخص المسؤول</th>
                <th>ملاحظات</th>
              </tr>
            </thead>
            <tbody>
              <tr><td colspan="3">لا توجد بيانات للعرض</td></tr>
            </tbody>
          </table>
        `;
      case "purchases":
        return `
          <h1>تقرير المشتريات</h1>
          <p>تاريخ التقرير: ${currentDate}</p>
          <table>
            <thead>
              <tr>
                <th>المورد</th>
                <th>التاريخ</th>
                <th>المنتج</th>
                <th>الكمية</th>
                <th>السعر (ج.م)</th>
                <th>الإجمالي (ج.م)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td colspan="6">لا توجد بيانات للعرض</td></tr>
            </tbody>
          </table>
        `;
      case "financial":
        return `
          <h1>التقرير المالي</h1>
          <p>تاريخ التقرير: ${currentDate}</p>
          <table>
            <thead>
              <tr>
                <th>البيان</th>
                <th>المبلغ (ج.م)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>إجمالي المشتريات</td><td>0.00</td></tr>
              <tr><td>قيمة المخزون</td><td>0.00</td></tr>
              <tr><td>عدد المنتجات</td><td>0</td></tr>
            </tbody>
          </table>
        `;
      default:
        return `<h1>تقرير غير محدد</h1>`;
    }
  };

  const generateCSVContent = (reportType: string) => {
    const BOM = '\uFEFF'; // UTF-8 BOM for Arabic support in Excel
    
    switch (reportType) {
      case "products":
        return BOM + "اسم المنتج,الفئة,وحدة القياس,السعر (ج.م),الرصيد السابق,المنصرف,الإجمالي\nلا توجد بيانات للعرض,,,,,,,";
      case "suppliers":
        return BOM + "اسم المورد,الشخص المسؤول,ملاحظات\nلا توجد بيانات للعرض,,";
      case "purchases":
        return BOM + "المورد,التاريخ,المنتج,الكمية,السعر (ج.م),الإجمالي (ج.م)\nلا توجد بيانات للعرض,,,,,";
      case "financial":
        return BOM + "البيان,المبلغ (ج.م)\nإجمالي المشتريات,0.00\nقيمة المخزون,0.00\nعدد المنتجات,0";
      default:
        return BOM + "تقرير غير محدد";
    }
  };

  const getReportName = (reportType: string) => {
    const reportNames: { [key: string]: string } = {
      "products": "تقرير المنتجات",
      "suppliers": "تقرير الموردين", 
      "purchases": "تقرير المشتريات",
      "financial": "التقرير المالي"
    };
    return reportNames[reportType] || "تقرير غير محدد";
  };

  const reportOptions = [
    { value: "products", label: "تقرير المنتجات", icon: Package },
    { value: "suppliers", label: "تقرير الموردين", icon: Users },
    { value: "purchases", label: "تقرير المشتريات", icon: ShoppingCart },
    { value: "financial", label: "التقرير المالي", icon: BarChart3 }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Printer className="h-5 w-5" />
            إدارة الطباعة والتصدير
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                اختر التقرير المراد طباعته أو تصديره
              </label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="اختر التقرير..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {reportOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white">
                      <div className="flex items-center gap-2">
                        <option.icon className="h-4 w-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={handlePrint}
                disabled={!selectedReport}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 h-12 animate-scale-in disabled:opacity-50"
              >
                <Printer className="h-5 w-5" />
                طباعة التقرير
              </Button>
              
              <Button 
                onClick={handleExportExcel}
                disabled={!selectedReport}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 h-12 animate-scale-in disabled:opacity-50"
              >
                <FileSpreadsheet className="h-5 w-5" />
                تصدير إلى Excel
              </Button>
            </div>
          </div>

          {selectedReport && (
            <Card className="bg-slate-700 border-slate-600 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-white text-lg">معلومات التقرير</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-slate-600 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-yellow-400" />
                    <span className="text-white">التقرير المحدد: {getReportName(selectedReport)}</span>
                  </div>
                  <span className="text-slate-300 text-sm">جاهز للطباعة أو التصدير</span>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PrintManager;
