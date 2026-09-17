import React from 'react';
import { 
  X, 
  Bell, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  Sparkles,
  Trash2
} from 'lucide-react';
import { soundService } from '../utils/audio';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'CREDIT' | 'DEBIT' | 'SECURITY' | 'LOAN';
  read: boolean;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onClearAll: () => void;
  onMarkAllAsRead: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onClearAll,
  onMarkAllAsRead
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end sm:p-4 bg-slate-950/40 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md h-full sm:h-auto sm:max-h-[85vh] sm:rounded-2xl bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Notifications &amp; Activity</h3>
              <p className="text-[11px] text-slate-500">Real-time alerts for your account</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                soundService.playClick();
                onMarkAllAsRead();
              }}
              className="px-2.5 py-1 text-[11px] font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Mark all read
            </button>
            <button
              onClick={() => {
                soundService.playClick();
                onClose();
              }}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Bell className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-semibold">No notifications right now</p>
              <p className="text-[11px]">All your payment alerts and updates will appear here</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div 
                key={item.id}
                className={`py-3 flex items-start gap-3 transition-colors ${
                  !item.read ? 'bg-blue-50/40 -mx-4 px-4' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  item.type === 'CREDIT' 
                    ? 'bg-emerald-50 text-emerald-600'
                    : item.type === 'LOAN'
                    ? 'bg-amber-50 text-amber-600'
                    : item.type === 'SECURITY'
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {item.type === 'CREDIT' && <ArrowDownLeft className="w-4 h-4" />}
                  {item.type === 'DEBIT' && <ArrowUpRight className="w-4 h-4" />}
                  {item.type === 'SECURITY' && <ShieldCheck className="w-4 h-4" />}
                  {item.type === 'LOAN' && <Sparkles className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h5 className="text-xs font-bold text-slate-900 truncate">{item.title}</h5>
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium">{item.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{item.message}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs">
            <span className="text-[11px] text-slate-500 font-medium">
              {notifications.filter(n => !n.read).length} unread updates
            </span>
            <button
              onClick={() => {
                soundService.playClick();
                onClearAll();
              }}
              className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear all</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
