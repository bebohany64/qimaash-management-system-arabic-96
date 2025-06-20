
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Plus, Edit, Trash2, Search } from "lucide-react";

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
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    customCategory: "",
    unit: "",
    price: 0,
    previousBalance: 0,
    outgoing: 0
  });

  const categories = [
    "أقمشة",
    "خيوط",
    "اكسسوارات",
    "منتجات نهائية",
    "أخرى"
  ];

  const units = [
    "متر",
    "قطعة",
    "لفة",
    "كيلو جرام",
    "عبوة"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalCategory = formData.category === "أخرى" ? formData.customCategory : formData.category;
    const total = formData.previousBalance - formData.outgoing;
    
    const productData = {
      name: formData.name,
      category: finalCategory,
      unit: formData.unit,
      price: formData.price,
      previousBalance: formData.previousBalance,
      outgoing: formData.outgoing,
      total: total
    };

    if (editingProduct) {
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...productData, id: editingProduct.id }
          : p
      ));
      setEditingProduct(null);
    } else {
      const newProduct = {
        ...productData,
        id: Date.now()
      };
      setProducts([...products, newProduct]);
    }

    setFormData({
      name: "",
      category: "",
      customCategory: "",
      unit: "",
      price: 0,
      previousBalance: 0,
      outgoing: 0
    });
    setIsAddingProduct(false);
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
    setIsAddingProduct(true);
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Package className="h-5 w-5" />
            إدارة المنتجات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-700 border-gray-600">
              <TabsTrigger 
                value="list" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
              >
                قائمة المنتجات
              </TabsTrigger>
              <TabsTrigger 
                value="add" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
                onClick={() => setIsAddingProduct(true)}
              >
                إضافة منتج جديد
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4">
              {/* Search */}
              <div className="flex items-center space-x-2 space-x-reverse">
                <Search className="h-5 w-5 text-gray-400" />
                <Input
                  placeholder="البحث عن منتج..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>

              {/* Products Table */}
              <div className="rounded-md border border-gray-600 overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-700">
                    <TableRow className="border-gray-600">
                      <TableHead className="text-gray-300">اسم المنتج</TableHead>
                      <TableHead className="text-gray-300">الفئة</TableHead>
                      <TableHead className="text-gray-300">وحدة القياس</TableHead>
                      <TableHead className="text-gray-300">السعر (جنيه)</TableHead>
                      <TableHead className="text-gray-300">الرصيد السابق</TableHead>
                      <TableHead className="text-gray-300">المنصرف</TableHead>
                      <TableHead className="text-gray-300">الإجمالي</TableHead>
                      <TableHead className="text-gray-300">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="bg-gray-800">
                    {filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-400">
                          لا توجد منتجات مضافة حالياً
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map((product) => (
                        <TableRow key={product.id} className="border-gray-600 hover:bg-gray-700 transition-colors">
                          <TableCell className="text-white">{product.name}</TableCell>
                          <TableCell className="text-gray-300">{product.category}</TableCell>
                          <TableCell className="text-gray-300">{product.unit}</TableCell>
                          <TableCell className="text-green-400">{product.price}</TableCell>
                          <TableCell className="text-blue-400">{product.previousBalance}</TableCell>
                          <TableCell className="text-red-400">{product.outgoing}</TableCell>
                          <TableCell className="text-yellow-400 font-bold">{product.total}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2 space-x-reverse">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleEdit(product)}
                                className="border-gray-600 text-gray-300 hover:bg-gray-600"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleDelete(product.id)}
                                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="add" className="space-y-4">
              <Card className="bg-gray-700 border-gray-600 animate-scale-in">
                <CardHeader>
                  <CardTitle className="text-white">
                    {editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Product Name */}
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-300">اسم المنتج</Label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                          className="bg-gray-600 border-gray-500 text-white placeholder:text-gray-400"
                          placeholder="أدخل اسم المنتج"
                        />
                      </div>

                      {/* Category */}
                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-gray-300">الفئة</Label>
                        <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                          <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                            <SelectValue placeholder="اختر الفئة" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-600 border-gray-500">
                            {categories.map((category) => (
                              <SelectItem key={category} value={category} className="text-white">
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Custom Category */}
                      {formData.category === "أخرى" && (
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="customCategory" className="text-gray-300">الفئة المخصصة</Label>
                          <Input
                            id="customCategory"
                            type="text"
                            value={formData.customCategory}
                            onChange={(e) => setFormData({...formData, customCategory: e.target.value})}
                            required
                            className="bg-gray-600 border-gray-500 text-white placeholder:text-gray-400"
                            placeholder="أدخل الفئة المخصصة"
                          />
                        </div>
                      )}

                      {/* Unit */}
                      <div className="space-y-2">
                        <Label htmlFor="unit" className="text-gray-300">وحدة القياس</Label>
                        <Select value={formData.unit} onValueChange={(value) => setFormData({...formData, unit: value})}>
                          <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                            <SelectValue placeholder="اختر وحدة القياس" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-600 border-gray-500">
                            {units.map((unit) => (
                              <SelectItem key={unit} value={unit} className="text-white">
                                {unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Price */}
                      <div className="space-y-2">
                        <Label htmlFor="price"  className="text-gray-300">السعر (جنيه مصري)</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                          required
                          className="bg-gray-600 border-gray-500 text-white placeholder:text-gray-400"
                          placeholder="0.00"
                        />
                      </div>

                      {/* Previous Balance */}
                      <div className="space-y-2">
                        <Label htmlFor="previousBalance" className="text-gray-300">الرصيد السابق</Label>
                        <Input
                          id="previousBalance"
                          type="number"
                          value={formData.previousBalance}
                          onChange={(e) => setFormData({...formData, previousBalance: parseInt(e.target.value) || 0})}
                          required
                          className="bg-gray-600 border-gray-500 text-white placeholder:text-gray-400"
                          placeholder="0"
                        />
                      </div>

                      {/* Outgoing */}
                      <div className="space-y-2">
                        <Label htmlFor="outgoing" className="text-gray-300">المنصرف</Label>
                        <Input
                          id="outgoing"
                          type="number"
                          value={formData.outgoing}
                          onChange={(e) => setFormData({...formData, outgoing: parseInt(e.target.value) || 0})}
                          required
                          className="bg-gray-600 border-gray-500 text-white placeholder:text-gray-400"
                          placeholder="0"
                        />
                      </div>

                      {/* Total (Read-only) */}
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-gray-300">الإجمالي</Label>
                        <div className="px-3 py-2 bg-gray-800 border border-gray-500 rounded-md text-yellow-400 font-bold text-lg">
                          {formData.previousBalance - formData.outgoing}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 space-x-reverse pt-4">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          setIsAddingProduct(false);
                          setEditingProduct(null);
                          setFormData({
                            name: "",
                            category: "",
                            customCategory: "",
                            unit: "",
                            price: 0,
                            previousBalance: 0,
                            outgoing: 0
                          });
                        }}
                        className="border-gray-600 text-gray-300 hover:bg-gray-600"
                      >
                        إلغاء
                      </Button>
                      <Button 
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Plus className="h-4 w-4 ml-2" />
                        {editingProduct ? "تحديث المنتج" : "إضافة المنتج"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsManager;
