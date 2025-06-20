
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Eye, Trash2, ShoppingCart, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";

const PurchasesManager = () => {
  const [purchases, setPurchases] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingPurchase, setIsAddingPurchase] = useState(false);
  const [formData, setFormData] = useState({
    supplier: "",
    date: null,
    notes: "",
    product: "",
    quantity: "",
    price: ""
  });

  // Sample data - you would get these from your actual data
  const suppliers = [];
  const products = [];

  const filteredPurchases = purchases.filter(purchase =>
    purchase.supplier?.includes(searchTerm)
  );

  const calculateTotal = () => {
    const quantity = parseFloat(formData.quantity) || 0;
    const price = parseFloat(formData.price) || 0;
    return (quantity * price).toFixed(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.supplier || !formData.date || !formData.product || !formData.quantity || !formData.price) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    const newPurchase = {
      ...formData,
      id: Date.now(),
      quantity: parseFloat(formData.quantity),
      price: parseFloat(formData.price),
      total: parseFloat(calculateTotal())
    };
    
    setPurchases([...purchases, newPurchase]);
    toast.success("تم تسجيل المشترى بنجاح");
    
    setFormData({
      supplier: "",
      date: null,
      notes: "",
      product: "",
      quantity: "",
      price: ""
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
      <Card className="animate-fade-in bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <ShoppingCart className="h-5 w-5" />
              إدارة المشتريات
            </CardTitle>
            <Dialog open={isAddingPurchase} onOpenChange={setIsAddingPurchase}>
              <DialogTrigger asChild>
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة مشترى جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-gray-900 dark:text-white">إضافة مشترى جديد</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="supplier" className="text-gray-700 dark:text-gray-300">اختر المورد *</Label>
                    <Select value={formData.supplier} onValueChange={(value) => setFormData({...formData, supplier: value})}>
                      <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                        <SelectValue placeholder="اختر المورد" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        {suppliers.length === 0 ? (
                          <SelectItem value="no-suppliers" disabled>لا توجد موردين مسجلين</SelectItem>
                        ) : (
                          suppliers.map(supplier => (
                            <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">التاريخ *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white",
                            !formData.date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.date ? format(formData.date, "PPP", { locale: ar }) : <span>اختر التاريخ</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.date}
                          onSelect={(date) => setFormData({...formData, date})}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label htmlFor="notes" className="text-gray-700 dark:text-gray-300">ملاحظات (اختياري)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      rows={3}
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      placeholder="أضف ملاحظات إضافية..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="product" className="text-gray-700 dark:text-gray-300">اختر المنتج *</Label>
                    <Select value={formData.product} onValueChange={(value) => setFormData({...formData, product: value})}>
                      <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                        <SelectValue placeholder="اختر المنتج" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        {products.length === 0 ? (
                          <SelectItem value="no-products" disabled>لا توجد منتجات مسجلة</SelectItem>
                        ) : (
                          products.map(product => (
                            <SelectItem key={product} value={product}>{product}</SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quantity" className="text-gray-700 dark:text-gray-300">الكمية *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        step="0.01"
                        value={formData.quantity}
                        onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                        required
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price" className="text-gray-700 dark:text-gray-300">السعر *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        required
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">الإجمالي</Label>
                    <Input
                      value={`${calculateTotal()} ر.س`}
                      disabled
                      className="bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white font-bold text-lg"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddingPurchase(false)}>
                      إلغاء
                    </Button>
                    <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
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
                className="pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              إجمالي المشتريات: {filteredPurchases.length}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchases Table */}
      {filteredPurchases.length > 0 ? (
        <Card className="animate-scale-in bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 dark:border-gray-700">
                  <TableHead className="text-right text-gray-900 dark:text-white">المورد</TableHead>
                  <TableHead className="text-right text-gray-900 dark:text-white">التاريخ</TableHead>
                  <TableHead className="text-right text-gray-900 dark:text-white">المنتج</TableHead>
                  <TableHead className="text-right text-gray-900 dark:text-white">الكمية</TableHead>
                  <TableHead className="text-right text-gray-900 dark:text-white">السعر</TableHead>
                  <TableHead className="text-right text-gray-900 dark:text-white">الإجمالي</TableHead>
                  <TableHead className="text-right text-gray-900 dark:text-white">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPurchases.map((purchase) => (
                  <TableRow key={purchase.id} className="border-gray-200 dark:border-gray-700">
                    <TableCell className="text-gray-900 dark:text-white">{purchase.supplier}</TableCell>
                    <TableCell className="text-gray-900 dark:text-white">
                      {purchase.date ? format(purchase.date, "yyyy/MM/dd", { locale: ar }) : "-"}
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-white">{purchase.product}</TableCell>
                    <TableCell className="text-gray-900 dark:text-white">{purchase.quantity}</TableCell>
                    <TableCell className="text-gray-900 dark:text-white">{purchase.price.toFixed(2)} ر.س</TableCell>
                    <TableCell className="font-medium text-green-600 dark:text-green-400">
                      {purchase.total.toFixed(2)} ر.س
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(purchase.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card className="animate-fade-in bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="text-center py-12">
            <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              لا توجد مشتريات مسجلة حتى الآن
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PurchasesManager;
