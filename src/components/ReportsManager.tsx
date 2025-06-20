
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, BarChart3, Download, Package, Users, ShoppingCart } from "lucide-react";

const ReportsManager = () => {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");

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
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <BarChart3 className="h-4 w-4 ml-2" />
                تحديث التقرير
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
                <div className="text-2xl font-bold text-blue-400">0</div>
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
                <div className="text-2xl font-bold text-green-400">0</div>
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
                <div className="text-2xl font-bold text-purple-400">0</div>
                <div className="text-sm text-gray-400">عملية شراء</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700 hover:shadow-lg transition-shadow animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BarChart3 className="h-5 w-5 text-orange-400" />
                  قيمة المخزون
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-400">0</div>
                <div className="text-sm text-gray-400">جنيه مصري</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Inventory Report */}
        <TabsContent value="inventory" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                تقرير المخزون
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Download className="h-4 w-4" />
                  تصدير
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto mb-4 text-gray-500" />
                <p className="text-gray-400 text-lg">
                  لا توجد بيانات مخزون حالياً
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  ابدأ بإضافة المنتجات لعرض تقرير المخزون
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Report */}
        <TabsContent value="financial" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                التقرير المالي
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Download className="h-4 w-4" />
                  تصدير
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-500" />
                <p className="text-gray-400 text-lg">
                  لا توجد بيانات مالية حالياً
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  ابدأ بتسجيل المشتريات لعرض التقرير المالي
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsManager;
