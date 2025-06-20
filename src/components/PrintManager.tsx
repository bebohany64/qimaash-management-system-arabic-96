
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Printer } from "lucide-react";

const PrintManager = () => {
  return (
    <div className="space-y-6">
      <Card className="animate-fade-in bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Printer className="h-5 w-5" />
            إدارة الطباعة والتصدير
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Printer className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              ستتم إضافة وظائف الطباعة هنا قريباً
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrintManager;
