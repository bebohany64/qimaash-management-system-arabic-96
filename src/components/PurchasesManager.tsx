
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Eye, Trash2, ShoppingCart, Calendar } from "lucide-react";
import { toast } from "sonner";

const PurchasesManager = () => {
  const [purchases, setPurchases] = useState([
    {
      id: 1,
      invoiceNumber: "INV-2024-001",
      supplier: "شركة النسيج الحديث",
      date: "2024-01-15",
      totalAmount: 15750.00,
      status: "مكتملة",
      items: [
        { product: "قماش قطني أبيض", quantity: 50, price: 25.50, total: 1275.00 },
        { product: "قماش قطني أزرق", quantity: 75, price: 27.00, total: 2025.00 }
      ]
    },
    {
      id: 2,
      invoiceNumber: "INV-2024-002",
      supplier: "مؤسسة الحرير الذهبي",
      date: "2024-01-18",
      totalAmount: 8900.00,
      status: "قيد المراجعة",
      items: [
        { product: "حرير طبيعي أحمر", quantity: 20, price: 85.00, total: 1700.00 },
        { product: "حرير صناعي أسود", quantity: 40, price: 65.00, total: 2600.00 }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingPurchase, setIsAddingPurchase] = useState(false);
  const [viewingPurchase, setViewingPurchase] = useState(null);
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    supplier: "",
    date: "",
    items: [{ product: "", quantity: "", price: "", total: 0 }]
  });

  const suppliers = ["شركة النسيج الحديث", "مؤسسة الحرير الذهبي", "شركة الكتان العربي"];
  const products = ["قماش قطني أبيض", "قماش قطني أزرق", "حرير طبيعي أحمر", "حرير صناعي أسود"];

  const filteredPurchases = purchases.filter(purchase =>
    purchase.invoiceNumber.includes(searchTerm) ||
    purchase.supplier.includes(searchTerm)
  );

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product: "", quantity: "", price: "", total: 0 }]
    });
  };

  const removeItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    
    // Calculate total for this item
    if (field === 'quantity' || field === 'price') {
      const quantity = parseFloat(newItems[index].quantity) || 0;
      const price = parseFloat(newItems[index].price) || 0;
      newItems[index].total = quantity * price;
    }
    
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotalAmount = () => {
    return formData.items.reduce((sum, item) => sum + (item.total || 0), 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newPurchase = {
      ...formData,
      id: Date.now(),
      totalAmount: calculateTotalAmount(),
      status: "مكتملة"
    };
    
    setPurchases([...purchases, newPurchase]);
    toast.success("تم تسجيل المشترى بنجاح");
    
    setFormData({
      invoiceNumber: "",
      supplier: "",
      date: "",
      items: [{ product: "", quantity: "", price: "", total: 0 }]
    });
    setIsAddingPurchase(false);
  };

  const handleDelete = (id) => {
    setPurchases(purchases.filter(p => p.id !== id));
    toast.success("تم حذف المشترى بنجاح");
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              إدارة المشتريات
            </CardTitle>
            <Dialog open={isAddingPurchase} onOpenChange={setIsAddingPurchase}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة مشترى جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
                <DialogHeader>
                  <DialogTitle>إضافة مشترى جديد</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="invoiceNumber">رقم الفاتورة</Label>
                      <Input
                        id="invoiceNumber"
                        value={formData.invoiceNumber}
                        onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="supplier">المورد</Label>
                      <Select value={formData.supplier} onValueChange={(value) => setFormData({...formData, supplier: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المورد" />
                        </SelectTrigger>
                        <SelectContent>
                          {suppliers.map(supplier => (
                            <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="date">تاريخ المشترى</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  {/* Items Section */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <Label className="text-lg font-medium">تفاصيل المنتجات</Label>
                      <Button type="button" onClick={addItem} size="sm">
                        <Plus className="h-4 w-4 ml-1" />
                        إضافة منتج
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {formData.items.map((item, index) => (
                        <div key={index} className="grid grid-cols-5 gap-4 p-4 border rounded-lg">
                          <div>
                            <Label>المنتج</Label>
                            <Select 
                              value={item.product} 
                              onValueChange={(value) => updateItem(index, 'product', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="اختر المنتج" />
                              </SelectTrigger>
                              <SelectContent>
                                {products.map(product => (
                                  <SelectItem key={product} value={product}>{product}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>الكمية</Label>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Label>السعر</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={item.price}
                              onChange={(e) => updateItem(index, 'price', e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Label>الإجمالي</Label>
                            <Input
                              value={item.total.toFixed(2)}
                              disabled
                              className="bg-gray-50"
                            />
                          </div>
                          <div className="flex items-end">
                            {formData.items.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeItem(index)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium">المبلغ الإجمالي:</span>
                        <span className="text-2xl font-bold text-green-600">
                          {calculateTotalAmount().toFixed(2)} ر.س
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddingPurchase(false)}>
                      إلغاء
                    </Button>
                    <Button type="submit">
                      حفظ المشترى
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
                placeholder="البحث في المشتريات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <div className="text-sm text-gray-500">
              إجمالي المشتريات: {filteredPurchases.length}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchases Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">رقم الفاتورة</TableHead>
                <TableHead className="text-right">المورد</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right">المبلغ الإجمالي</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPurchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell className="font-mono">{purchase.invoiceNumber}</TableCell>
                  <TableCell>{purchase.supplier}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {new Date(purchase.date).toLocaleDateString('ar-SA')}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {purchase.totalAmount.toFixed(2)} ر.س
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      purchase.status === 'مكتملة' ? 'bg-green-100 text-green-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {purchase.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl" dir="rtl">
                          <DialogHeader>
                            <DialogTitle>تفاصيل المشترى - {purchase.invoiceNumber}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>المورد</Label>
                                <p className="text-lg">{purchase.supplier}</p>
                              </div>
                              <div>
                                <Label>التاريخ</Label>
                                <p className="text-lg">{new Date(purchase.date).toLocaleDateString('ar-SA')}</p>
                              </div>
                            </div>
                            
                            <div>
                              <Label className="text-lg font-medium">المنتجات</Label>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="text-right">المنتج</TableHead>
                                    <TableHead className="text-right">الكمية</TableHead>
                                    <TableHead className="text-right">السعر</TableHead>
                                    <TableHead className="text-right">الإجمالي</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {purchase.items.map((item, index) => (
                                    <TableRow key={index}>
                                      <TableCell>{item.product}</TableCell>
                                      <TableCell>{item.quantity}</TableCell>
                                      <TableCell>{item.price.toFixed(2)} ر.س</TableCell>
                                      <TableCell>{item.total.toFixed(2)} ر.س</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                            
                            <div className="border-t pt-4">
                              <div className="flex justify-between items-center">
                                <span className="text-xl font-medium">المبلغ الإجمالي:</span>
                                <span className="text-2xl font-bold text-green-600">
                                  {purchase.totalAmount.toFixed(2)} ر.س
                                </span>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(purchase.id)}
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

export default PurchasesManager;
