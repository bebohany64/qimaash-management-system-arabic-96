import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Users, ShoppingCart, FileText, Printer, Home, Plus } from "lucide-react";
import ProductsManager from "@/components/ProductsManager";
import SuppliersManager from "@/components/SuppliersManager";
import PurchasesManager from "@/components/PurchasesManager";
import ReportsManager from "@/components/ReportsManager";
import PrintManager from "@/components/PrintManager";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const dashboardStats = [
    { title: "إجمالي المنتجات", value: "0", icon: Package, color: "bg-blue-500" },
    { title: "الموردين", value: "0", icon: Users, color: "bg-green-500" },
    { title: "المشتريات هذا الشهر", value: "0", icon: ShoppingCart, color: "bg-purple-500" },
    { title: "قيمة المخزون", value: "0 ر.س", icon: FileText, color: "bg-orange-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800" dir="rtl">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Package className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">نظام إدارة مخازن الأقمشة</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8 bg-white dark:bg-gray-800">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <Home className="h-4 w-4" />
              لوحة التحكم
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <Package className="h-4 w-4" />
              المنتجات
            </TabsTrigger>
            <TabsTrigger value="suppliers" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <Users className="h-4 w-4" />
              الموردين
            </TabsTrigger>
            <TabsTrigger value="purchases" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <ShoppingCart className="h-4 w-4" />
              المشتريات
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <FileText className="h-4 w-4" />
              التقارير
            </TabsTrigger>
            <TabsTrigger value="print" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <Printer className="h-4 w-4" />
              الطباعة
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardStats.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow animate-fade-in bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {stat.title}
                    </CardTitle>
                    <div className={`${stat.color} p-2 rounded-lg`}>
                      <stat.icon className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card className="animate-scale-in bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Plus className="h-5 w-5" />
                  الإجراءات السريعة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => setActiveTab('products')}
                    className="h-24 bg-blue-500 hover:bg-blue-600 text-white flex-col gap-2 hover-scale"
                  >
                    <Package className="h-6 w-6" />
                    إضافة منتج جديد
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('suppliers')}
                    className="h-24 bg-green-500 hover:bg-green-600 text-white flex-col gap-2 hover-scale"
                  >
                    <Users className="h-6 w-6" />
                    إضافة مورد جديد
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('purchases')}
                    className="h-24 bg-purple-500 hover:bg-purple-600 text-white flex-col gap-2 hover-scale"
                  >
                    <ShoppingCart className="h-6 w-6" />
                    تسجيل مشترى جديد
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>النشاطات الأخيرة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>تم إضافة منتج جديد: قماش قطني أزرق</span>
                    </div>
                    <span className="text-sm text-gray-500">منذ ساعتين</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>تم تحديث بيانات المورد: شركة النسيج المتقدمة</span>
                    </div>
                    <span className="text-sm text-gray-500">منذ 4 ساعات</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>تم تسجيل مشترى جديد بقيمة 15,750 ر.س</span>
                    </div>
                    <span className="text-sm text-gray-500">أمس</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other Tabs */}
          <TabsContent value="products">
            <ProductsManager />
          </TabsContent>

          <TabsContent value="suppliers">
            <SuppliersManager />
          </TabsContent>

          <TabsContent value="purchases">
            <PurchasesManager />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsManager />
          </TabsContent>

          <TabsContent value="print">
            <PrintManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
