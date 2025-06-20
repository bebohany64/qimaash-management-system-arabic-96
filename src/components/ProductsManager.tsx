import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Plus, Edit, Trash2, Search, Save, X } from "lucide-react";
import { toast } from "sonner";
import { executeQuery } from '@/utils/database';
interface Product {
  id: number;
  name: string;
  category: string;
  customCategory?: string;
  unit: string;
  price: number;
  previousBalance: number;
  outgoing: number;
  total: number;
}
const ProductsManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("list");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    customCategory: "",
    unit: "",
    price: 0,
    previousBalance: 0,
    outgoing: 0
  });
  const categories = ["أقمشة", "خيوط", "اكسسوارات", "منتجات نهائية", "أخرى"];
  const units = ["متر", "قطعة", "لفة", "كيلو جرام", "عبوة"];

  // Load products from database
  const loadProducts = async () => {
    try {
      setIsLoading(true);
      console.log('Loading products from database...');
      const result = await executeQuery('SELECT * FROM products ORDER BY created_at DESC');
      console.log('Products query result:', result);
      if (result?.results?.[0]?.response?.result?.rows) {
        const rows = result.results[0].response.result.rows;
        console.log('Raw rows from database:', rows);
        const productsData = rows.map((row: any[], index: number) => {
          console.log(`Processing row ${index}:`, row);
          return {
            id: Number(row[0]) || 0,
            name: String(row[1] || ""),
            category: String(row[3] || row[2] || ""),
            customCategory: row[3] ? String(row[3]) : undefined,
            unit: String(row[4] || ""),
            price: Number(row[5]) || 0,
            previousBalance: Number(row[6]) || 0,
            outgoing: Number(row[7]) || 0,
            total: Number(row[8]) || 0
          };
        });
        console.log('Processed products data:', productsData);
        setProducts(productsData);
      } else {
        console.log('No products found or unexpected result structure');
        setProducts([]);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('خطأ في تحميل المنتجات');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadProducts();
  }, []);
  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      customCategory: "",
      unit: "",
      price: 0,
      previousBalance: 0,
      outgoing: 0
    });
    setEditingProduct(null);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('يرجى إدخال اسم المنتج');
      return;
    }
    if (!formData.category) {
      toast.error('يرجى اختيار فئة المنتج');
      return;
    }
    if (formData.category === "أخرى" && !formData.customCategory.trim()) {
      toast.error('يرجى إدخال الفئة المخصصة');
      return;
    }
    if (!formData.unit) {
      toast.error('يرجى اختيار وحدة القياس');
      return;
    }
    setIsLoading(true);
    try {
      const finalCategory = formData.category === "أخرى" ? formData.customCategory : formData.category;
      const total = formData.previousBalance - formData.outgoing;
      console.log('Submitting product data:', {
        name: formData.name,
        category: finalCategory,
        customCategory: formData.category === "أخرى" ? formData.customCategory : null,
        unit: formData.unit,
        price: formData.price,
        previousBalance: formData.previousBalance,
        outgoing: formData.outgoing,
        total: total
      });
      if (editingProduct) {
        const updateResult = await executeQuery('UPDATE products SET name = ?, category = ?, custom_category = ?, unit = ?, price = ?, previous_balance = ?, outgoing = ?, total = ? WHERE id = ?', [formData.name, finalCategory, formData.category === "أخرى" ? formData.customCategory : null, formData.unit, formData.price, formData.previousBalance, formData.outgoing, total, editingProduct.id]);
        console.log('Update result:', updateResult);
        toast.success("تم تحديث المنتج بنجاح");
      } else {
        const insertResult = await executeQuery('INSERT INTO products (name, category, custom_category, unit, price, previous_balance, outgoing, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [formData.name, finalCategory, formData.category === "أخرى" ? formData.customCategory : null, formData.unit, formData.price, formData.previousBalance, formData.outgoing, total]);
        console.log('Insert result:', insertResult);
        toast.success("تم إضافة المنتج بنجاح");
      }
      await loadProducts();
      resetForm();
      setActiveTab("list");
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('خطأ في حفظ المنتج');
    } finally {
      setIsLoading(false);
    }
  };
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.customCategory ? "أخرى" : product.category,
      customCategory: product.customCategory || "",
      unit: product.unit,
      price: product.price,
      previousBalance: product.previousBalance,
      outgoing: product.outgoing
    });
    setActiveTab("add");
  };
  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    try {
      setIsLoading(true);
      console.log('Deleting product with id:', id);
      const deleteResult = await executeQuery('DELETE FROM products WHERE id = ?', [id]);
      console.log('Delete result:', deleteResult);
      await loadProducts();
      toast.success("تم حذف المنتج بنجاح");
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('خطأ في حذف المنتج');
    } finally {
      setIsLoading(false);
    }
  };
  const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.category.toLowerCase().includes(searchTerm.toLowerCase()));
  return <div className="space-y-6 animate-fade-in">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Package className="h-5 w-5" />
            إدارة المنتجات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-700 border-gray-600">
              <TabsTrigger value="list" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300">
                قائمة المنتجات
              </TabsTrigger>
              <TabsTrigger value="add" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300">
                {editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-6 mt-6">
              {/* Search Section */}
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Search className="h-5 w-5 text-gray-400" />
                  <Input placeholder="البحث عن منتج..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="max-w-sm bg-gray-600 border-gray-500 text-white placeholder:text-gray-400" />
                  <Button onClick={() => setActiveTab("add")} className="bg-green-600 hover:bg-green-700 text-white mr-auto">
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة منتج جديد
                  </Button>
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                
                <Card className="bg-yellow-600 border-yellow-500">
                  
                </Card>
              </div>

              {/* Products Table */}
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">جدول المنتجات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border border-gray-600 overflow-hidden">
                    <Table>
                      <TableHeader className="bg-gray-600">
                        <TableRow className="border-gray-500">
                          <TableHead className="text-gray-200 font-semibold">اسم المنتج</TableHead>
                          <TableHead className="text-gray-200 font-semibold">الفئة</TableHead>
                          <TableHead className="text-gray-200 font-semibold">وحدة القياس</TableHead>
                          <TableHead className="text-gray-200 font-semibold">السعر (جنيه)</TableHead>
                          <TableHead className="text-gray-200 font-semibold">الرصيد السابق</TableHead>
                          <TableHead className="text-gray-200 font-semibold">المنصرف</TableHead>
                          <TableHead className="text-gray-200 font-semibold">الإجمالي</TableHead>
                          <TableHead className="text-gray-200 font-semibold">الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="bg-gray-800">
                        {isLoading ? <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-gray-400">
                              جاري التحميل...
                            </TableCell>
                          </TableRow> : filteredProducts.length === 0 ? <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-gray-400">
                              {searchTerm ? 'لا توجد منتجات تطابق البحث' : 'لا توجد منتجات مضافة حالياً'}
                            </TableCell>
                          </TableRow> : filteredProducts.map((product, index) => <TableRow key={product.id} className={`border-gray-600 hover:bg-gray-700 transition-colors ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}`}>
                              <TableCell className="text-white font-medium">{product.name}</TableCell>
                              <TableCell className="text-gray-300">{product.category}</TableCell>
                              <TableCell className="text-gray-300">{product.unit}</TableCell>
                              <TableCell className="text-green-400 font-bold">{product.price.toFixed(2)}</TableCell>
                              <TableCell className="text-blue-400 font-bold">{product.previousBalance}</TableCell>
                              <TableCell className="text-red-400 font-bold">{product.outgoing}</TableCell>
                              <TableCell className={`font-bold ${product.total >= 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                                {product.total}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2 space-x-reverse">
                                  <Button size="sm" variant="outline" onClick={() => handleEdit(product)} className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-200" disabled={isLoading}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => handleDelete(product.id)} className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200" disabled={isLoading}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>)}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="add" className="space-y-4 mt-6">
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    {editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Product Name */}
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-300 font-medium">اسم المنتج *</Label>
                        <Input id="name" type="text" value={formData.name} onChange={e => setFormData({
                        ...formData,
                        name: e.target.value
                      })} required className="bg-gray-600 border-gray-500 text-white placeholder:text-gray-400" placeholder="أدخل اسم المنتج" />
                      </div>

                      {/* Category */}
                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-gray-300 font-medium">الفئة *</Label>
                        <Select value={formData.category} onValueChange={value => setFormData({
                        ...formData,
                        category: value,
                        customCategory: ""
                      })}>
                          <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                            <SelectValue placeholder="اختر الفئة" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-600 border-gray-500">
                            {categories.map(category => <SelectItem key={category} value={category} className="text-white hover:bg-gray-500">
                                {category}
                              </SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Custom Category */}
                      {formData.category === "أخرى" && <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="customCategory" className="text-gray-300 font-medium">الفئة المخصصة *</Label>
                          <Input id="customCategory" type="text" value={formData.customCategory} onChange={e => setFormData({
                        ...formData,
                        customCategory: e.target.value
                      })} required className="bg-gray-600 border-gray-500 text-white placeholder:text-gray-400" placeholder="أدخل الفئة المخصصة" />
                        </div>}

                      {/* Unit */}
                      <div className="space-y-2">
                        <Label htmlFor="unit" className="text-gray-300 font-medium">وحدة القياس *</Label>
                        <Select value={formData.unit} onValueChange={value => setFormData({
                        ...formData,
                        unit: value
                      })}>
                          <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                            <SelectValue placeholder="اختر وحدة القياس" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-600 border-gray-500">
                            {units.map(unit => <SelectItem key={unit} value={unit} className="text-white hover:bg-gray-500">
                                {unit}
                              </SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Price */}
                      <div className="space-y-2">
                        <Label htmlFor="price" className="text-gray-300 font-medium">السعر (جنيه مصري)</Label>
                        <Input id="price" type="number" step="0.01" min="0" value={formData.price} onChange={e => setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0
                      })} className="bg-gray-600 border-gray-500 text-white placeholder:text-gray-400" placeholder="0.00" />
                      </div>

                      {/* Previous Balance */}
                      <div className="space-y-2">
                        <Label htmlFor="previousBalance" className="text-gray-300 font-medium">الرصيد السابق</Label>
                        <Input id="previousBalance" type="number" min="0" value={formData.previousBalance} onChange={e => setFormData({
                        ...formData,
                        previousBalance: parseInt(e.target.value) || 0
                      })} className="bg-gray-600 border-gray-500 text-white placeholder:text-gray-400" placeholder="0" />
                      </div>

                      {/* Outgoing */}
                      <div className="space-y-2">
                        <Label htmlFor="outgoing" className="text-gray-300 font-medium">المنصرف</Label>
                        <Input id="outgoing" type="number" min="0" value={formData.outgoing} onChange={e => setFormData({
                        ...formData,
                        outgoing: parseInt(e.target.value) || 0
                      })} className="bg-gray-600 border-gray-500 text-white placeholder:text-gray-400" placeholder="0" />
                      </div>
                    </div>

                    {/* Total (Read-only) */}
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                      <Label className="text-gray-300 font-medium">الإجمالي المتاح</Label>
                      <div className={`text-2xl font-bold mt-2 ${formData.previousBalance - formData.outgoing >= 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {formData.previousBalance - formData.outgoing} {formData.unit}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 space-x-reverse pt-4 border-t border-gray-600">
                      <Button type="button" variant="outline" onClick={() => {
                      resetForm();
                      setActiveTab("list");
                    }} className="border-gray-500 text-gray-300 hover:bg-gray-600 hover:text-white" disabled={isLoading}>
                        <X className="h-4 w-4 ml-2" />
                        إلغاء
                      </Button>
                      <Button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white" disabled={isLoading}>
                        <Save className="h-4 w-4 ml-2" />
                        {isLoading ? "جاري الحفظ..." : editingProduct ? "تحديث المنتج" : "إضافة المنتج"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>;
};
export default ProductsManager;