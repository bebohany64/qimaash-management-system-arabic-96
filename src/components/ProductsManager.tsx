
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash2, Package } from "lucide-react";
import { toast } from "sonner";

const ProductsManager = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "قماش قطني أبيض",
      code: "CT001",
      category: "قطني",
      color: "أبيض",
      width: "150 سم",
      price: 25.50,
      quantity: 120,
      supplier: "شركة النسيج الحديث",
      location: "رف A1"
    },
    {
      id: 2,
      name: "حرير طبيعي أزرق",
      code: "SL002",
      category: "حرير",
      color: "أزرق",
      width: "120 سم",
      price: 85.00,
      quantity: 45,
      supplier: "مؤسسة الحرير الذهبي",
      location: "رف B2"
    },
    {
      id: 3,
      name: "قماش كتان بيج",
      code: "LN003",
      category: "كتان",
      color: "بيج",
      width: "140 سم",
      price: 35.75,
      quantity: 80,
      supplier: "شركة الكتان العربي",
      location: "رف C1"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    category: "",
    color: "",
    width: "",
    price: "",
    quantity: "",
    supplier: "",
    location: "",
    description: ""
  });

  const categories = ["قطني", "حرير", "كتان", "صوف", "مخلوط", "صناعي"];
  const colors = ["أبيض", "أسود", "أزرق", "أحمر", "أخضر", "أصفر", "بني", "رمادي", "بيج", "وردي"];

  const filteredProducts = products.filter(product =>
    product.name.includes(searchTerm) ||
    product.code.includes(searchTerm) ||
    product.category.includes(searchTerm) ||
    product.supplier.includes(searchTerm)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingProduct) {
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...formData, id: editingProduct.id, price: parseFloat(formData.price), quantity: parseInt(formData.quantity) }
          : p
      ));
      toast.success("تم تحديث المنتج بنجاح");
      setEditingProduct(null);
    } else {
      const newProduct = {
        ...formData,
        id: Date.now(),
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity)
      };
      setProducts([...products, newProduct]);
      toast.success("تم إضافة المنتج بنجاح");
    }
    
    setFormData({
      name: "", code: "", category: "", color: "", width: "",
      price: "", quantity: "", supplier: "", location: "", description: ""
    });
    setIsAddingProduct(false);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      price: product.price.toString(),
      quantity: product.quantity.toString()
    });
    setIsAddingProduct(true);
  };

  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success("تم حذف المنتج بنجاح");
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              إدارة المنتجات
            </CardTitle>
            <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
              <DialogTrigger asChild>
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة منتج جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">اسم المنتج</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="code">كود المنتج</Label>
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) => setFormData({...formData, code: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">الفئة</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الفئة" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="color">اللون</Label>
                      <Select value={formData.color} onValueChange={(value) => setFormData({...formData, color: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر اللون" />
                        </SelectTrigger>
                        <SelectContent>
                          {colors.map(color => (
                            <SelectItem key={color} value={color}>{color}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="width">العرض</Label>
                      <Input
                        id="width"
                        value={formData.width}
                        onChange={(e) => setFormData({...formData, width: e.target.value})}
                        placeholder="150 سم"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">السعر</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="quantity">الكمية</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="supplier">المورد</Label>
                      <Input
                        id="supplier"
                        value={formData.supplier}
                        onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">موقع التخزين</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        placeholder="رف A1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">وصف المنتج</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddingProduct(false)}>
                      إلغاء
                    </Button>
                    <Button type="submit">
                      {editingProduct ? "تحديث" : "إضافة"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
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
                className="pr-10"
              />
            </div>
            <div className="text-sm text-gray-500">
              إجمالي المنتجات: {filteredProducts.length}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الكود</TableHead>
                <TableHead className="text-right">اسم المنتج</TableHead>
                <TableHead className="text-right">الفئة</TableHead>
                <TableHead className="text-right">اللون</TableHead>
                <TableHead className="text-right">العرض</TableHead>
                <TableHead className="text-right">السعر</TableHead>
                <TableHead className="text-right">الكمية</TableHead>
                <TableHead className="text-right">المورد</TableHead>
                <TableHead className="text-right">الموقع</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-mono">{product.code}</TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      {product.color}
                    </span>
                  </TableCell>
                  <TableCell>{product.width}</TableCell>
                  <TableCell>{product.price.toFixed(2)} ر.س</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.quantity > 50 ? 'bg-green-100 text-green-800' : 
                      product.quantity > 20 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.quantity}
                    </span>
                  </TableCell>
                  <TableCell>{product.supplier}</TableCell>
                  <TableCell>{product.location}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsManager;
