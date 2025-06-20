
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash2, Package, Moon, Sun } from "lucide-react";
import { toast } from "sonner";

const ProductsManager = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    customCategory: "",
    unit: "",
    price: "",
    previousBalance: "",
    withdrawal: "",
    total: 0,
    description: ""
  });

  const categories = ["أقمشة", "خيوط", "إكسسوارات", "منتجات نهائية", "أخرى"];
  const units = ["متر", "قطعة", "لفة", "كيلو جرام", "عبوة"];

  // حساب الإجمالي تلقائياً
  const calculateTotal = () => {
    const previous = parseFloat(formData.previousBalance) || 0;
    const withdrawal = parseFloat(formData.withdrawal) || 0;
    return previous - withdrawal;
  };

  // تحديث الإجمالي عند تغيير القيم
  React.useEffect(() => {
    const newTotal = calculateTotal();
    setFormData(prev => ({ ...prev, total: newTotal }));
  }, [formData.previousBalance, formData.withdrawal]);

  const filteredProducts = products.filter(product =>
    product.name.includes(searchTerm) ||
    product.category.includes(searchTerm)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const finalCategory = formData.category === "أخرى" ? formData.customCategory : formData.category;
    
    if (editingProduct) {
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { 
              ...formData, 
              id: editingProduct.id, 
              category: finalCategory,
              price: parseFloat(formData.price),
              previousBalance: parseFloat(formData.previousBalance),
              withdrawal: parseFloat(formData.withdrawal),
              total: calculateTotal()
            }
          : p
      ));
      toast.success("تم تحديث المنتج بنجاح");
      setEditingProduct(null);
    } else {
      const newProduct = {
        ...formData,
        id: Date.now(),
        category: finalCategory,
        price: parseFloat(formData.price),
        previousBalance: parseFloat(formData.previousBalance),
        withdrawal: parseFloat(formData.withdrawal),
        total: calculateTotal()
      };
      setProducts([...products, newProduct]);
      toast.success("تم إضافة المنتج بنجاح");
    }
    
    setFormData({
      name: "", category: "", customCategory: "", unit: "", price: "",
      previousBalance: "", withdrawal: "", total: 0, description: ""
    });
    setIsAddingProduct(false);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      price: product.price?.toString() || "",
      previousBalance: product.previousBalance?.toString() || "",
      withdrawal: product.withdrawal?.toString() || "",
      customCategory: product.category && !categories.includes(product.category) ? product.category : ""
    });
    setIsAddingProduct(true);
  };

  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success("تم حذف المنتج بنجاح");
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`space-y-6 transition-all duration-500 ${isDarkMode ? 'dark' : ''}`}>
      {/* Header Section */}
      <Card className="animate-fade-in">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 animate-scale-in">
              <Package className="h-5 w-5 animate-pulse" />
              إدارة المنتجات
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                onClick={toggleDarkMode}
                variant="outline"
                size="sm"
                className="hover-scale transition-all duration-300"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-500 hover:bg-blue-600 hover-scale transition-all duration-300 animate-slide-in-right">
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة منتج جديد
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in" dir="rtl">
                  <DialogHeader>
                    <DialogTitle className="animate-fade-in">
                      {editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
                    {/* اسم المنتج */}
                    <div className="animate-slide-in-right" style={{animationDelay: '0.1s'}}>
                      <Label htmlFor="name" className="text-lg font-semibold">اسم المنتج</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        className="mt-2 transition-all duration-300 focus:scale-[1.02]"
                      />
                    </div>

                    {/* الفئة */}
                    <div className="animate-slide-in-right" style={{animationDelay: '0.2s'}}>
                      <Label htmlFor="category" className="text-lg font-semibold">الفئة</Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(value) => setFormData({...formData, category: value, customCategory: ""})}
                      >
                        <SelectTrigger className="mt-2 transition-all duration-300 focus:scale-[1.02]">
                          <SelectValue placeholder="اختر الفئة" />
                        </SelectTrigger>
                        <SelectContent className="animate-scale-in">
                          {categories.map(cat => (
                            <SelectItem key={cat} value={cat} className="hover:bg-accent transition-colors">
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* حقل الفئة المخصصة */}
                    {formData.category === "أخرى" && (
                      <div className="animate-fade-in">
                        <Label htmlFor="customCategory" className="text-lg font-semibold">اكتب الفئة</Label>
                        <Input
                          id="customCategory"
                          value={formData.customCategory}
                          onChange={(e) => setFormData({...formData, customCategory: e.target.value})}
                          placeholder="اكتب الفئة المخصصة"
                          className="mt-2 transition-all duration-300 focus:scale-[1.02]"
                        />
                      </div>
                    )}

                    {/* وحدة القياس */}
                    <div className="animate-slide-in-right" style={{animationDelay: '0.3s'}}>
                      <Label htmlFor="unit" className="text-lg font-semibold">وحدة القياس</Label>
                      <Select value={formData.unit} onValueChange={(value) => setFormData({...formData, unit: value})}>
                        <SelectTrigger className="mt-2 transition-all duration-300 focus:scale-[1.02]">
                          <SelectValue placeholder="اختر وحدة القياس" />
                        </SelectTrigger>
                        <SelectContent className="animate-scale-in">
                          {units.map(unit => (
                            <SelectItem key={unit} value={unit} className="hover:bg-accent transition-colors">
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* السعر */}
                    <div className="animate-slide-in-right" style={{animationDelay: '0.4s'}}>
                      <Label htmlFor="price" className="text-lg font-semibold">السعر</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="mt-2 transition-all duration-300 focus:scale-[1.02]"
                        placeholder="0.00"
                      />
                    </div>

                    {/* الرصيد السابق */}
                    <div className="animate-slide-in-right" style={{animationDelay: '0.5s'}}>
                      <Label htmlFor="previousBalance" className="text-lg font-semibold">الرصيد السابق</Label>
                      <Input
                        id="previousBalance"
                        type="number"
                        step="0.01"
                        value={formData.previousBalance}
                        onChange={(e) => setFormData({...formData, previousBalance: e.target.value})}
                        className="mt-2 transition-all duration-300 focus:scale-[1.02]"
                        placeholder="0.00"
                      />
                    </div>

                    {/* المنصرف */}
                    <div className="animate-slide-in-right" style={{animationDelay: '0.6s'}}>
                      <Label htmlFor="withdrawal" className="text-lg font-semibold">المنصرف</Label>
                      <Input
                        id="withdrawal"
                        type="number"
                        step="0.01"
                        value={formData.withdrawal}
                        onChange={(e) => setFormData({...formData, withdrawal: e.target.value})}
                        className="mt-2 transition-all duration-300 focus:scale-[1.02]"
                        placeholder="0.00"
                      />
                    </div>

                    {/* الإجمالي (للقراءة فقط) */}
                    <div className="animate-slide-in-right" style={{animationDelay: '0.7s'}}>
                      <Label htmlFor="total" className="text-lg font-semibold text-green-600">الإجمالي</Label>
                      <Input
                        id="total"
                        type="number"
                        value={formData.total.toFixed(2)}
                        readOnly
                        className="mt-2 bg-green-50 border-green-300 text-green-800 font-bold text-lg transition-all duration-300"
                      />
                    </div>

                    {/* وصف المنتج */}
                    <div className="animate-slide-in-right" style={{animationDelay: '0.8s'}}>
                      <Label htmlFor="description" className="text-lg font-semibold">وصف المنتج</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={3}
                        className="mt-2 transition-all duration-300 focus:scale-[1.02]"
                      />
                    </div>

                    <div className="flex justify-end gap-4 pt-4 animate-fade-in" style={{animationDelay: '0.9s'}}>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsAddingProduct(false)}
                        className="hover-scale transition-all duration-300"
                      >
                        إلغاء
                      </Button>
                      <Button 
                        type="submit"
                        className="hover-scale transition-all duration-300 bg-green-600 hover:bg-green-700"
                      >
                        {editingProduct ? "تحديث" : "إضافة"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="البحث في المنتجات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 transition-all duration-300 focus:scale-[1.02]"
              />
            </div>
            <div className="text-sm text-gray-500 animate-pulse">
              إجمالي المنتجات: {filteredProducts.length}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="animate-fade-in" style={{animationDelay: '0.3s'}}>
        <CardContent className="p-0">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <Package className="h-16 w-16 mx-auto text-gray-300 mb-4 animate-pulse" />
              <p className="text-gray-500 text-lg">لا توجد منتجات حالياً</p>
              <p className="text-gray-400">قم بإضافة منتج جديد للبدء</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">اسم المنتج</TableHead>
                  <TableHead className="text-right">الفئة</TableHead>
                  <TableHead className="text-right">وحدة القياس</TableHead>
                  <TableHead className="text-right">السعر</TableHead>
                  <TableHead className="text-right">الرصيد السابق</TableHead>
                  <TableHead className="text-right">المنصرف</TableHead>
                  <TableHead className="text-right">الإجمالي</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product, index) => (
                  <TableRow 
                    key={product.id} 
                    className="animate-fade-in hover:bg-accent transition-colors duration-300"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.unit}</TableCell>
                    <TableCell>{product.price?.toFixed(2) || '0.00'} ر.س</TableCell>
                    <TableCell>{product.previousBalance?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell>{product.withdrawal?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        product.total > 0 ? 'bg-green-100 text-green-800' : 
                        product.total < 0 ? 'bg-red-100 text-red-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {product.total?.toFixed(2) || '0.00'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(product)}
                          className="hover-scale transition-all duration-300"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-700 hover-scale transition-all duration-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsManager;
