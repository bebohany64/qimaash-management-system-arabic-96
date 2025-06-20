
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Users, ShoppingCart, FileText, Printer } from "lucide-react";
import ProductsManager from "@/components/ProductsManager";
import SuppliersManager from "@/components/SuppliersManager";
import PurchasesManager from "@/components/PurchasesManager";
import ReportsManager from "@/components/ReportsManager";
import PrintManager from "@/components/PrintManager";

const Index = () => {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="min-h-screen bg-slate-900" dir="rtl">
      {/* Header */}
      <header className="bg-slate-800 shadow-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Package className="h-8 w-8 text-green-500" />
              <h1 className="text-2xl font-bold text-white">نظام إدارة مخازن الأقمشة</h1>
            </div>
            <div className="text-right flex items-center gap-3">
              {/* ماكينة الخياطة المتحركة */}
              <div className="relative">
                {/* ماكينة الخياطة مصنوعة من SVG مخصص */}
                <div className="w-8 h-8 text-blue-400 animate-bounce">
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="w-full h-full"
                  >
                    <rect x="3" y="12" width="18" height="4" rx="1"/>
                    <path d="M7 12V8a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v4"/>
                    <path d="M12 8V4"/>
                    <circle cx="8" cy="16" r="1"/>
                    <circle cx="16" cy="16" r="1"/>
                    <path d="M12 12l2-2"/>
                    <path d="M10 10l2 2"/>
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
              </div>
              <h2 className="text-lg font-semibold text-yellow-400" style={{ fontFamily: 'Cairo, sans-serif' }}>
                وزارة العمل - مركز التدريب 2025
              </h2>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-slate-800 border-slate-700">
            <TabsTrigger 
              value="products" 
              className="flex items-center gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white text-slate-300"
            >
              <Package className="h-4 w-4" />
              المنتجات
            </TabsTrigger>
            <TabsTrigger 
              value="suppliers" 
              className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white text-slate-300"
            >
              <Users className="h-4 w-4" />
              الموردين
            </TabsTrigger>
            <TabsTrigger 
              value="purchases" 
              className="flex items-center gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white text-slate-300"
            >
              <ShoppingCart className="h-4 w-4" />
              المشتريات
            </TabsTrigger>
            <TabsTrigger 
              value="reports" 
              className="flex items-center gap-2 data-[state=active]:bg-yellow-500 data-[state=active]:text-slate-900 text-slate-300"
            >
              <FileText className="h-4 w-4" />
              التقارير
            </TabsTrigger>
            <TabsTrigger 
              value="print" 
              className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white text-slate-300"
            >
              <Printer className="h-4 w-4" />
              الطباعة
            </TabsTrigger>
          </TabsList>

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
