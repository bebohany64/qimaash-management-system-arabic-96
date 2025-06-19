
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash2, Users, Phone, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";

const SuppliersManager = () => {
  const [suppliers, setSuppliers] = useState([
    {
      id: 1,
      name: "شركة النسيج الحديث",
      contactPerson: "أحمد محمد",
      phone: "0501234567",
      email: "info@moderntextile.com",
      address: "الرياض - حي الصناعية",
      taxNumber: "123456789",
      rating: 4.5,
      totalOrders: 15,
      totalAmount: 125000
    },
    {
      id: 2,
      name: "مؤسسة الحرير الذهبي",
      contactPerson: "فاطمة أحمد",
      phone: "0559876543",
      email: "sales@goldensilk.sa",
      address: "جدة - شارع الملك عبدالعزيز",
      taxNumber: "987654321",
      rating: 4.8,
      totalOrders: 22,
      totalAmount: 89500
    },
    {
      id: 3,
      name: "شركة الكتان العربي",
      contactPerson: "محمد علي",
      phone: "0501122334",
      email: "contact@arabiclinen.com",
      address: "الدمام - المنطقة الصناعية",
      taxNumber: "456789123",
      rating: 4.2,
      totalOrders: 8,
      totalAmount: 45000
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingSupplier, setIsAddingSupplier] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    taxNumber: "",
    notes: ""
  });

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.includes(searchTerm) ||
    supplier.contactPerson.includes(searchTerm) ||
    supplier.phone.includes(searchTerm) ||
    supplier.email.includes(searchTerm)
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
        id: Date.now(),
        rating: 0,
        totalOrders: 0,
        totalAmount: 0
      };
      setSuppliers([...suppliers, newSupplier]);
      toast.success("تم إضافة المورد بنجاح");
    }
    
    setFormData({
      name: "", contactPerson: "", phone: "", email: "",
      address: "", taxNumber: "", notes: ""
    });
    setIsAddingSupplier(false);
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      contactPerson: supplier.contactPerson,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address,
      taxNumber: supplier.taxNumber,
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
      {/* Header Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              إدارة الموردين
            </CardTitle>
            <Dialog open={isAddingSupplier} onOpenChange={setIsAddingSupplier}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة مورد جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl" dir="rtl">
                <DialogHeader>
                  <DialogTitle>
                    {editingSupplier ? "تعديل بيانات المورد" : "إضافة مورد جديد"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">اسم المورد</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactPerson">الشخص المسؤول</Label>
                      <Input
                        id="contactPerson"
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">رقم الهاتف</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">العنوان</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="taxNumber">الرقم الضريبي</Label>
                    <Input
                      id="taxNumber"
                      value={formData.taxNumber}
                      onChange={(e) => setFormData({...formData, taxNumber: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">ملاحظات</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddingSupplier(false)}>
                      إلغاء
                    </Button>
                    <Button type="submit">
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
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="البحث في الموردين..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <div className="text-sm text-gray-500">
              إجمالي الموردين: {filteredSuppliers.length}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{supplier.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{supplier.contactPerson}</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(supplier)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(supplier.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{supplier.phone}</span>
              </div>
              {supplier.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="truncate">{supplier.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{supplier.address}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{supplier.totalOrders}</div>
                  <div className="text-xs text-gray-500">إجمالي الطلبات</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {supplier.totalAmount.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">إجمالي المبلغ</div>
                </div>
              </div>
              
              {supplier.rating > 0 && (
                <div className="flex items-center gap-2 pt-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-sm ${i < Math.floor(supplier.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({supplier.rating})</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SuppliersManager;
