import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MetaTraderModalProps {
  triggerText?: string;
  onConnect?: (data: any) => void;
}

export const MetaTraderModal: React.FC<MetaTraderModalProps> = ({
  triggerText = "اتصال به متاتریدر",
  onConnect,
}) => {
  const [formData, setFormData] = useState({
    platform: "MT5",
    accountNumber: "",
    password: "",
    server: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onConnect) {
      onConnect(formData);
    }
    console.log("اطلاعات متاتریدر ارسال شد:", formData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium">
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 text-slate-100 border-slate-800 dir-rtl" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle className="text-xl font-bold text-slate-100">
            اتصال حساب متاتریدر
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-sm mt-1">
            اطلاعات حساب MetaTrader خود را برای دریافت خودکار معاملات وارد کنید.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-right">
          <div className="space-y-1">
            <label className="text-xs text-slate-300">نسخه متاتریدر</label>
            <select
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="MT5">MetaTrader 5 (MT5)</option>
              <option value="MT4">MetaTrader 4 (MT4)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-300">شماره حساب (Login / Account ID)</label>
            <input
              type="text"
              name="accountNumber"
              placeholder="مثلاً: 12345678"
              value={formData.accountNumber}
              onChange={handleChange}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-300">رمز عبور سرمایه‌گذار / اصلی</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-300">نام سرور (Server)</label>
            <input
              type="text"
              name="server"
              placeholder="مثلاً: IC markets-Live"
              value={formData.server}
              onChange={handleChange}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2"
            >
              برقراری اتصال
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};