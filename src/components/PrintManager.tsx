
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Printer, Download, FileSpreadsheet, FileText, Package, Users, ShoppingCart, BarChart3 } from "lucide-react";

const PrintManager = () => {
  const [selectedReport, setSelectedReport] = useState("");

  const handlePrint = () => {
    if (!selectedReport) return;
    window.print();
  };

  const handleExportExcel = () => {
    if (!selectedReport) return;
    // This would normally integrate with a library like xlsx or similar
    console.log(`تصدير ${selectedReport} إلى Excel`);
    alert(`سيتم تصدير ${selectedReport} إلى Excel قريباً`);
  };

  const reportOptions = [
    { value: "products", label: "تقرير المنتجات", icon: Package },
    { value: "suppliers", label: "تقرير الموردين", icon: Users },
    { value: "purchases", label: "تقرير المشتريات", icon: ShoppingCart },
    { value: "financial", label: "التقرير المالي", icon: BarChart3 }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Printer className="h-5 w-5" />
            إدارة الطباعة والتصدير
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Report Selection */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                اختر التقرير المراد طباعته أو تصديره
              </label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="اختر التقرير..." />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
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

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={handlePrint}
                disabled={!selectedReport}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 h-12 animate-scale-in"
              >
                <Printer className="h-5 w-5" />
                طباعة التقرير
              </Button>
              
              <Button 
                onClick={handleExportExcel}
                disabled={!selectedReport}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 h-12 animate-scale-in"
              >
                <FileSpreadsheet className="h-5 w-5" />
                تصدير إلى Excel
              </Button>
            </div>
          </div>

          {/* Print Options */}
          {selectedReport && (
            <Card className="bg-gray-700 border-gray-600 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-white text-lg">خيارات الطباعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">حجم الورق</label>
                    <Select defaultValue="a4">
                      <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-600 border-gray-500">
                        <SelectItem value="a4">A4</SelectItem>
                        <SelectItem value="a3">A3</SelectItem>
                        <SelectItem value="letter">Letter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">الاتجاه</label>
                    <Select defaultValue="portrait">
                      <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-600 border-gray-500">
                        <SelectItem value="portrait">عمودي</SelectItem>
                        <SelectItem value="landscape">أفقي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-600 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-400" />
                    <span className="text-white">معاينة قبل الطباعة</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-gray-500 text-gray-300 hover:bg-gray-500"
                  >
                    معاينة
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Export Options */}
          {selectedReport && (
            <Card className="bg-gray-700 border-gray-600 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-white text-lg">خيارات التصدير</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    variant="outline" 
                    className="border-gray-500 text-gray-300 hover:bg-gray-600 flex items-center gap-2 h-12"
                  >
                    <FileSpreadsheet className="h-5 w-5 text-green-400" />
                    Excel
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="border-gray-500 text-gray-300 hover:bg-gray-600 flex items-center gap-2 h-12"
                  >
                    <FileText className="h-5 w-5 text-red-400" />
                    PDF
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="border-gray-500 text-gray-300 hover:bg-gray-600 flex items-center gap-2 h-12"
                  >
                    <FileText className="h-5 w-5 text-blue-400" />
                    CSV
                  </Button>
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
