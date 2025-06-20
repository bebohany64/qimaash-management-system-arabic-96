
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash2, Users } from "lucide-react";
import { toast } from "sonner";

const SuppliersManager = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingSupplier, setIsAddingSupplier] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    notes: ""
  });

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.includes(searchTerm) ||
    supplier.contactPerson.includes(searchTerm)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingSupplier) {
      setSuppliers(suppliers.map(s => 
        s.id === editingSupplier.id 
          ? { ...s, ...formData }
          : s
      ));
      toast.success("تم تحديث بيانات المورد بنجاح");
      setEditingSupplier(null);
    } else {
      const newSupplier = {
        ...formData,
        id: Date.now()
      };
      setSuppliers([...suppliers, newSupplier]);
      toast.success("تم إضافة المورد بنجاح");
    }
    
    setFormData({
      name: "", 
      contactPerson: "", 
      notes: ""
    });
    setIsAddingSupplier(false);
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      contactPerson: supplier.contactPerson,
      notes: supplier.notes || ""
    });
    setIsAddingSupplier(true);
  };

  const handleDelete = (id) => {
    setSuppliers(suppliers.filter(s => s.id !== id));
    toast.success("تم حذف المورد بنجاح");
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
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
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
                    <Label htmlFor="name" className="text-slate-200">اسم المورد</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contactPerson" className="text-slate-200">الشخص المسؤول</Label>
                    <Input
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                      required
                      className="bg-slate-700 border-slate-600 text-white"
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
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddingSupplier(false)} className="border-slate-600 text-slate-300 hover:bg-slate-700">
                      إلغاء
                    </Button>
                    <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
                      {editingSupplier ? "تحديث" : "إضافة"}
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
                    className="border-slate-600 text-blue-400 hover:bg-slate-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(supplier.id)}
                    className="text-red-400 hover:text-red-300 border-slate-600 hover:bg-slate-700"
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

      {filteredSuppliers.length === 0 && (
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
