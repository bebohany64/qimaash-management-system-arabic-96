
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash2, Users, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { executeQuery } from '@/utils/database';

interface Supplier {
  id: number;
  name: string;
  contactPerson: string;
  notes?: string;
}

const SuppliersManager = () => {
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingSupplier, setIsAddingSupplier] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    notes: ""
  });

  // Load suppliers from database - محسنة للتحميل السريع
  const loadSuppliers = async () => {
    try {
      setIsLoading(true);
      console.log('Loading suppliers...');
      
      const result = await executeQuery('SELECT id, name, contact_person, notes FROM suppliers ORDER BY created_at DESC');
      console.log('Raw suppliers result:', result);
      
      if (result && result.results && result.results[0] && result.results[0].response && result.results[0].response.result && result.results[0].response.result.rows) {
        const suppliersData = result.results[0].response.result.rows.map((row: any) => ({
          id: parseInt(row[0]) || 0,
          name: String(row[1] || ""),
          contactPerson: String(row[2] || ""),
          notes: String(row[3] || "")
        }));
        setSuppliers(suppliersData);
        console.log('Processed suppliers:', suppliersData);
      } else {
        console.log('No suppliers found or unexpected result structure');
        setSuppliers([]);
      }
    } catch (error) {
      console.error('Error loading suppliers:', error);
      toast({
        title: "خطأ في تحميل الموردين",
        description: error.message,
        variant: "destructive"
      });
      setSuppliers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // تحميل فوري بدون تأخير
    loadSuppliers();
  }, []);

  const filteredSuppliers = suppliers.filter(supplier => {
    const name = String(supplier.name || "").toLowerCase();
    const contactPerson = String(supplier.contactPerson || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    return name.includes(search) || contactPerson.includes(search);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.contactPerson.trim()) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Submitting supplier:', formData);
      
      if (editingSupplier) {
        const updateResult = await executeQuery(
          'UPDATE suppliers SET name = ?, contact_person = ?, notes = ? WHERE id = ?',
          [formData.name.trim(), formData.contactPerson.trim(), formData.notes.trim(), editingSupplier.id]
        );
        console.log('Supplier update result:', updateResult);
        toast({
          title: "تم التحديث بنجاح",
          description: "تم تحديث بيانات المورد بنجاح"
        });
      } else {
        const insertResult = await executeQuery(
          'INSERT INTO suppliers (name, contact_person, notes) VALUES (?, ?, ?)',
          [formData.name.trim(), formData.contactPerson.trim(), formData.notes.trim()]
        );
        console.log('Supplier insert result:', insertResult);
        toast({
          title: "تم الإضافة بنجاح",
          description: "تم إضافة المورد بنجاح"
        });
      }

      await loadSuppliers();
      setFormData({ name: "", contactPerson: "", notes: "" });
      setIsAddingSupplier(false);
      setEditingSupplier(null);
    } catch (error) {
      console.error('Error saving supplier:', error);
      toast({
        title: "خطأ في الحفظ",
        description: 'خطأ في حفظ المورد: ' + error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      contactPerson: supplier.contactPerson,
      notes: supplier.notes || ""
    });
    setIsAddingSupplier(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المورد؟')) return;
    
    try {
      setIsLoading(true);
      console.log('Deleting supplier:', id);
      
      const deleteResult = await executeQuery('DELETE FROM suppliers WHERE id = ?', [id]);
      console.log('Supplier delete result:', deleteResult);
      
      await loadSuppliers();
      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف المورد بنجاح"
      });
    } catch (error) {
      console.error('Error deleting supplier:', error);
      toast({
        title: "خطأ في الحذف",
        description: 'خطأ في حذف المورد: ' + error.message,
        variant: "destructive"
      });
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
              <Users className="h-5 w-5 text-blue-500" />
              إدارة الموردين
            </CardTitle>
            <Dialog open={isAddingSupplier} onOpenChange={setIsAddingSupplier}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-200 shadow-lg hover:shadow-blue-500/25">
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة مورد جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-slate-800 border-slate-700" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    {editingSupplier ? "تعديل بيانات المورد" : "إضافة مورد جديد"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-slate-200">اسم المورد *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="أدخل اسم المورد"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contactPerson" className="text-slate-200">الشخص المسؤول *</Label>
                    <Input
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                      required
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="أدخل اسم الشخص المسؤول"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes" className="text-slate-200">ملاحظات</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      rows={3}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="أضف ملاحظات إضافية..."
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsAddingSupplier(false);
                        setEditingSupplier(null);
                        setFormData({ name: "", contactPerson: "", notes: "" });
                      }} 
                      className="border-slate-600 text-slate-300 hover:bg-slate-700 transition-all duration-200"
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4 ml-2" />
                      إلغاء
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
                      disabled={isLoading}
                    >
                      <Save className="h-4 w-4 ml-2" />
                      {isLoading ? "جاري الحفظ..." : editingSupplier ? "تحديث" : "إضافة"}
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
                placeholder="البحث في الموردين..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="text-sm text-slate-400">
              إجمالي الموردين: {filteredSuppliers.length}
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card className="animate-fade-in bg-slate-800 border-slate-700">
          <CardContent className="text-center py-12">
            <p className="text-slate-400 text-lg">جاري التحميل...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map((supplier) => (
            <Card key={supplier.id} className="hover:shadow-lg transition-shadow animate-scale-in bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-white">{supplier.name}</CardTitle>
                    <p className="text-sm text-slate-400 mt-1">{supplier.contactPerson}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(supplier)}
                      className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
                      disabled={isLoading}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(supplier.id)}
                      className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200 shadow-lg hover:shadow-red-500/25"
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {supplier.notes && (
                <CardContent>
                  <div className="text-sm text-slate-400">
                    <strong>ملاحظات:</strong> {supplier.notes}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {filteredSuppliers.length === 0 && !isLoading && (
        <Card className="animate-fade-in bg-slate-800 border-slate-700">
          <CardContent className="text-center py-12">
            <Users className="h-16 w-16 mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400 text-lg">
              لا توجد موردين مسجلين حتى الآن
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SuppliersManager;
