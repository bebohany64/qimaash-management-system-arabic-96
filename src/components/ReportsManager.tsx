
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, BarChart3, Download, Eye, Calendar, Package, Users, ShoppingCart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const ReportsManager = () => {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");

  // Sample data for charts
  const inventoryData = [
    { name: 'قطني', value: 45, color: '#3B82F6' },
    { name: 'حرير', value: 25, color: '#10B981' },
    { name: 'كتان', value: 20, color: '#F59E0B' },
    { name: 'صوف', value: 10, color: '#EF4444' }
  ];

  const monthlyPurchases = [
    { month: 'يناير', amount: 45000 },
    { month: 'فبراير', amount: 52000 },
    { month: 'مارس', amount: 48000 },
    { month: 'أبريل', amount: 61000 },
    { month: 'مايو', amount: 55000 },
    { month: 'يونيو', amount: 67000 }
  ];

  const supplierPerformance = [
    { name: 'شركة النسيج الحديث', orders: 25, amount: 125000 },
    { name: 'مؤسسة الحرير الذهبي', orders: 18, amount: 89500 },
    { name: 'شركة الكتان العربي', orders: 12, amount: 45000 }
  ];

  const lowStockItems = [
    { name: 'قماش حرير أحمر', quantity: 5, minLevel: 20 },
    { name: 'قماش قطني أسود', quantity: 8, minLevel: 25 },
    { name: 'قماش كتان بيج', quantity: 12, minLevel: 30 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            التقارير والإحصائيات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="dateFrom">من تاريخ</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dateTo">إلى تاريخ</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="category">الفئة</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="الكل">جميع الفئات</SelectItem>
                  <SelectItem value="قطني">قطني</SelectItem>
                  <SelectItem value="حرير">حرير</SelectItem>
                  <SelectItem value="كتان">كتان</SelectItem>
                  <SelectItem value="صوف">صوف</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button>
                <BarChart3 className="h-4 w-4 ml-2" />
                تحديث التقرير
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inventory">تقرير المخزون</TabsTrigger>
          <TabsTrigger value="purchases">تقرير المشتريات</TabsTrigger>
          <TabsTrigger value="suppliers">تقرير الموردين</TabsTrigger>
          <TabsTrigger value="financial">التقرير المالي</TabsTrigger>
        </TabsList>

        {/* Inventory Report */}
        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inventory Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  توزيع المخزون حسب الفئة
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={inventoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {inventoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Low Stock Alert */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <Package className="h-5 w-5" />
                  تنبيه: مخزون منخفض
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lowStockItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">الحد الأدنى: {item.minLevel}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-orange-600">{item.quantity}</span>
                        <p className="text-sm text-gray-500">متبقي</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Inventory Summary */}
          <Card>
            <CardHeader>
              <CardTitle>ملخص المخزون</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">156</div>
                  <div className="text-sm text-gray-600">إجمالي المنتجات</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">125,450</div>
                  <div className="text-sm text-gray-600">قيمة المخزون (ر.س)</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Calendar className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-600">23</div>
                  <div className="text-sm text-gray-600">منتجات تحتاج تجديد</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Eye className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">8</div>
                  <div className="text-sm text-gray-600">فئات المنتجات</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Purchases Report */}
        <TabsContent value="purchases" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                المشتريات الشهرية
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyPurchases}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value.toLocaleString()} ر.س`, 'المبلغ']} />
                  <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">إجمالي المشتريات</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-blue-600">328,500</div>
                <div className="text-sm text-gray-600">ر.س هذا العام</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-center">عدد الفواتير</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-green-600">67</div>
                <div className="text-sm text-gray-600">فاتورة هذا العام</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-center">متوسط الفاتورة</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-purple-600">4,903</div>
                <div className="text-sm text-gray-600">ر.س لكل فاتورة</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Suppliers Report */}
        <TabsContent value="suppliers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                أداء الموردين
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={supplierPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [
                    name === 'amount' ? `${value.toLocaleString()} ر.س` : value,
                    name === 'amount' ? 'إجمالي المبلغ' : 'عدد الطلبات'
                  ]} />
                  <Bar dataKey="orders" fill="#3B82F6" name="orders" />
                  <Bar dataKey="amount" fill="#10B981" name="amount" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supplierPerformance.map((supplier, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{supplier.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>عدد الطلبات:</span>
                      <span className="font-bold">{supplier.orders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>إجمالي المبلغ:</span>
                      <span className="font-bold">{supplier.amount.toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex justify-between">
                      <span>متوسط الطلب:</span>
                      <span className="font-bold">{Math.round(supplier.amount / supplier.orders).toLocaleString()} ر.س</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Financial Report */}
        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                  إجمالي المشتريات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">328,500 ر.س</div>
                <div className="text-sm text-green-600">+12% عن الشهر الماضي</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-green-600" />
                  قيمة المخزون
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">125,450 ر.س</div>
                <div className="text-sm text-gray-600">قيمة حالية</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  مستحقات الموردين
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">45,750 ر.س</div>
                <div className="text-sm text-red-600">مستحقة الدفع</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-orange-600" />
                  الربح المتوقع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">89,250 ر.س</div>
                <div className="text-sm text-green-600">هامش ربح 35%</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>الملخص المالي الشهري</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-6 py-3">الشهر</th>
                      <th className="px-6 py-3">المشتريات</th>
                      <th className="px-6 py-3">قيمة المخزون</th>
                      <th className="px-6 py-3">المستحقات</th>
                      <th className="px-6 py-3">الربح المتوقع</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b">
                      <td className="px-6 py-4 font-medium">يناير</td>
                      <td className="px-6 py-4">45,000 ر.س</td>
                      <td className="px-6 py-4">98,500 ر.س</td>
                      <td className="px-6 py-4">12,000 ر.س</td>
                      <td className="px-6 py-4 text-green-600">15,750 ر.س</td>
                    </tr>
                    <tr className="bg-white border-b">
                      <td className="px-6 py-4 font-medium">فبراير</td>
                      <td className="px-6 py-4">52,000 ر.س</td>
                      <td className="px-6 py-4">105,200 ر.س</td>
                      <td className="px-6 py-4">8,500 ر.س</td>
                      <td className="px-6 py-4 text-green-600">18,200 ر.س</td>
                    </tr>
                    <tr className="bg-white border-b">
                      <td className="px-6 py-4 font-medium">مارس</td>
                      <td className="px-6 py-4">48,000 ر.س</td>
                      <td className="px-6 py-4">112,800 ر.س</td>
                      <td className="px-6 py-4">15,200 ر.س</td>
                      <td className="px-6 py-4 text-green-600">16,800 ر.س</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsManager;
