import React, { useState, useEffect } from 'react';
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
import { Plus, Search, Trash2, ShoppingCart, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { executeQuery, updateProductQuantityOnPurchase } from '@/utils/database';

interface Purchase {
  id: number;
  supplierId: number;
  supplierName: string;
  date: string;
  notes: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

interface Supplier {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
}

const PurchasesManager = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingPurchase, setIsAddingPurchase] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    supplier: "",
    date: null as Date | null,
    notes: "",
    product: "",
    quantity: "",
    price: ""
  });

  // Load suppliers from database
  const loadSuppliers = async () => {
    try {
      const result = await executeQuery('SELECT id, name FROM suppliers ORDER BY name');
      if (result && result.results && result.results[0] && result.results[0].response && result.results[0].response.result && result.results[0].response.result.rows) {
        const suppliersData = result.results[0].response.result.rows.map((row: any) => ({
          id: parseInt(row[0]),
          name: String(row[1] || "")
        }));
        setSuppliers(suppliersData);
      }
    } catch (error) {
      console.error('Error loading suppliers:', error);
    }
  };

  // Load products from database
  const loadProducts = async () => {
    try {
      const result = await executeQuery('SELECT id, name FROM products ORDER BY name');
      if (result && result.results && result.results[0] && result.results[0].response && result.results[0].response.result && result.results[0].response.result.rows) {
        const productsData = result.results[0].response.result.rows.map((row: any) => ({
          id: parseInt(row[0]),
          name: String(row[1] || "")
        }));
        setProducts(productsData);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  // Load purchases from database
  const loadPurchases = async () => {
    try {
      setIsLoading(true);
      const result = await executeQuery(`
        SELECT p.id, p.supplier_id, s.name as supplier_name, p.date, p.notes, 
               p.product_name, p.quantity, p.price, p.total
        FROM purchases p
        LEFT JOIN suppliers s ON p.supplier_id = s.id
        ORDER BY p.created_at DESC
      `);
      
      if (result && result.results && result.results[0] && result.results[0].response && result.results[0].response.result && result.results[0].response.result.rows) {
        const purchasesData = result.results[0].response.result.rows.map((row: any) => ({
          id: parseInt(row[0]),
          supplierId: parseInt(row[1]),
          supplierName: String(row[2] || ""),
          date: String(row[3] || ""),
          notes: String(row[4] || ""),
          productName: String(row[5] || ""),
          quantity: parseFloat(row[6]),
          price: parseFloat(row[7]),
          total: parseFloat(row[8])
        }));
        setPurchases(purchasesData);
      }
    } catch (error) {
      console.error('Error loading purchases:', error);
      toast.error('خطأ في تحميل المشتريات');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
    loadProducts();
    loadPurchases();
  }, []);

  const filteredPurchases = purchases.filter(purchase =>
    purchase.supplierName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateTotal = () => {
    const quantity = parseFloat(formData.quantity) || 0;
    const price = parseFloat(formData.price) || 0;
    return (quantity * price).toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.supplier || !formData.date || !formData.product || !formData.quantity || !formData.price) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      setIsLoading(true);
      const dateString = format(formData.date, "yyyy-MM-dd");
      const total = parseFloat(calculateTotal());
      const purchasedQuantity = parseFloat(formData.quantity);
      
      // إضافة المشترى في قاعدة البيانات
      await executeQuery(
        'INSERT INTO purchases (supplier_id, date, notes, product_name, quantity, price, total) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [formData.supplier, dateString, formData.notes, formData.product, formData.quantity, formData.price, total]
      );
      
      // تحديث كمية المنتج في جدول المنتجات
      const updateSuccess = await updateProductQuantityOnPurchase(formData.product, purchasedQuantity);
      
      if (updateSuccess) {
        toast.success("تم تسجيل المشترى بنجاح وتحديث كمية المنتج");
      } else {
        toast.success("تم تسجيل المشترى بنجاح، لكن لم يتم العثور على المنتج لتحديث الكمية");
      }
      
      await loadPurchases();
      
      setFormData({
        supplier: "",
        date: null,
        notes: "",
        product: "",
        quantity: "",
        price: ""
      });
      setIsAddingPurchase(false);
    } catch (error) {
      console.error('Error saving purchase:', error);
      toast.error('خطأ في حفظ المشترى');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المشترى؟')) return;
    
    try {
      setIsLoading(true);
      await executeQuery('DELETE FROM purchases WHERE id = ?', [id]);
      await loadPurchases();
      toast.success("تم حذف المشترى بنجاح");
    } catch (error) {
      console.error('Error deleting purchase:', error);
      toast.error('خطأ في حذف المشترى');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="animate-fade-in bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-white">
              <ShoppingCart className="h-5 w-5 text-green-500" />
              إدارة المشتريات
            </CardTitle>
            <Dialog open={isAddingPurchase} onOpenChange={setIsAddingPurchase}>
              <DialogTrigger asChild>
                <Button className="bg-green-500 hover:bg-green-600 text-white">
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة مشترى جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-white">إضافة مشترى جديد</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="supplier" className="text-slate-200">اختر المورد *</Label>
                    <Select value={formData.supplier} onValueChange={(value) => setFormData({...formData, supplier: value})}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="اختر المورد" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {suppliers.length === 0 ? (
                          <SelectItem value="no-suppliers" disabled>لا توجد موردين مسجلين</SelectItem>
                        ) : (
                          suppliers.map(supplier => (
                            <SelectItem key={supplier.id} value={supplier.id.toString()}>{supplier.name}</SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-slate-200">التاريخ *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal bg-slate-700 border-slate-600 text-white hover:bg-slate-600",
                            !formData.date && "text-slate-400"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.date ? format(formData.date, "PPP", { locale: ar }) : <span>اختر التاريخ</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.date}
                          onSelect={(date) => setFormData({...formData, date})}
                          initialFocus
                          className="p-3"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label htmlFor="notes" className="text-slate-200">ملاحظات (اختياري)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      rows={3}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="أضف ملاحظات إضافية..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="product" className="text-slate-200">اختر المنتج *</Label>
                    <Select value={formData.product} onValueChange={(value) => setFormData({...formData, product: value})}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="اختر المنتج" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {products.length === 0 ? (
                          <SelectItem value="no-products" disabled>لا توجد منتجات مسجلة</SelectItem>
                        ) : (
                          products.map(product => (
                            <SelectItem key={product.id} value={product.name}>{product.name}</SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quantity" className="text-slate-200">الكمية *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        step="0.01"
                        value={formData.quantity}
                        onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                        required
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price" className="text-slate-200">السعر *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        required
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-200">الإجمالي</Label>
                    <Input
                      value={`${calculateTotal()} ج.م`}
                      disabled
                      className="bg-slate-600 text-white font-bold text-lg"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddingPurchase(false)} className="border-slate-600 text-slate-300 hover:bg-slate-700">
                      إلغاء
                    </Button>
                    <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white" disabled={isLoading}>
                      {isLoading ? "جاري الحفظ..." : "حفظ المشترى"}
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
              <Search className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="البحث في المشتريات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="text-sm text-slate-400">
              إجمالي المشتريات: {filteredPurchases.length}
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredPurchases.length > 0 ? (
        <Card className="animate-scale-in bg-slate-800 border-slate-700">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-right text-white">المورد</TableHead>
                  <TableHead className="text-right text-white">التاريخ</TableHead>
                  <TableHead className="text-right text-white">المنتج</TableHead>
                  <TableHead className="text-right text-white">الكمية</TableHead>
                  <TableHead className="text-right text-white">السعر</TableHead>
                  <TableHead className="text-right text-white">الإجمالي</TableHead>
                  <TableHead className="text-right text-white">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPurchases.map((purchase) => (
                  <TableRow key={purchase.id} className="border-slate-700">
                    <TableCell className="text-white">{purchase.supplierName}</TableCell>
                    <TableCell className="text-white">{purchase.date}</TableCell>
                    <TableCell className="text-white">{purchase.productName}</TableCell>
                    <TableCell className="text-white">{purchase.quantity}</TableCell>
                    <TableCell className="text-white">{purchase.price.toFixed(2)} ج.م</TableCell>
                    <TableCell className="font-medium text-green-400">
                      {purchase.total.toFixed(2)} ج.م
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(purchase.id)}
                        className="text-red-400 hover:text-red-300 border-slate-600 hover:bg-slate-700"
                        disabled={isLoading}
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
        <Card className="animate-fade-in bg-slate-800 border-slate-700">
          <CardContent className="text-center py-12">
            <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400 text-lg">
              {isLoading ? "جاري التحميل..." : "لا توجد مشتريات مسجلة حتى الآن"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PurchasesManager;
