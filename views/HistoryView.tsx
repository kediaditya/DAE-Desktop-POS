
import React, { useState } from 'react';
import { OverlayType } from '../types';
import { THEME, UI_CLASSES } from '../theme';
import { Icon } from '../icons';
import { Button, Card, Modal, Badge, Input } from '../components/UI';

interface HistoryViewProps {
  onBack: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ onBack }) => {
  const [selectedTx, setSelectedTx] = useState<number | null>(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [overlay, setOverlay] = useState<OverlayType | null>(null);

  const transactions = [
    { id: '182746', date: '2026-01-23 15:09:57', staff: 'Luo Yun', type: 'Sale', amount: 60.93, status: 'Completed', pos: 'T202192G40579' },
    { id: '182745', date: '2026-01-23 14:18:38', staff: 'Luo Yun', type: 'Sale', amount: 51.28, status: 'Completed', pos: 'T202192G40579' },
    { id: '182744', date: '2026-01-23 10:16:33', staff: 'Luo Yun', type: 'Sale', amount: 38.46, status: 'Completed', pos: 'T202192G40579' },
    { id: '182743', date: '2026-01-23 10:13:34', staff: 'Luo Yun', type: 'Sale', amount: 54.16, status: 'Completed', pos: 'T202192G40579' },
    { id: '182742', date: '2026-01-23 10:10:53', staff: 'Luo Yun', type: 'Sale', amount: 67.70, status: 'Completed', pos: 'T202192G40579' },
    { id: '182741', date: '2026-01-22 14:57:33', staff: 'Luo Yun', type: 'Sale', amount: 372.35, status: 'Pending', pos: 'T202192G40579' },
  ];

  const closeOverlay = () => setOverlay(null);

  return (
    <div className={`h-full flex flex-col bg-${THEME.colors.background} animate-in fade-in duration-300 relative`}>
      {/* Header */}
      <div className={`bg-${THEME.colors.surface} border-b border-${THEME.colors.border} px-8 py-4 flex justify-between items-center`}>
        <div className="flex items-center gap-4">
          <button onClick={onBack} className={`p-2 hover:bg-${THEME.colors.surfaceAlt} ${THEME.radius.base} transition-colors text-${THEME.colors.text.muted}`}>
            <Icon.ArrowBack className="w-6 h-6" />
          </button>
          <div>
            <h1 className={`text-2xl font-semibold text-${THEME.colors.text.base}`}>Transaction History</h1>
            <p className={`text-sm text-${THEME.colors.text.light} font-normal`}>Review past orders and print receipts</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setOverlay(OverlayType.FIND_TRANSACTION)} 
            variant="outline"
            className="px-4 py-2"
            icon={Icon.Search}
          >
            Find Specific
          </Button>
          <button className={`p-2 bg-${THEME.colors.surface} border border-${THEME.colors.border} ${THEME.radius.base} hover:bg-${THEME.colors.surfaceAlt} transition-colors`}>
            <Icon.Filter className={`w-5 h-5 text-${THEME.colors.text.muted}`} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* List Section */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <Card className="overflow-hidden p-0">
            <table className="w-full text-left">
              <thead>
                <tr className={`bg-${THEME.colors.surfaceAlt} border-b border-${THEME.colors.border}`}>
                  <th className={`px-6 py-4 ${THEME.typography.subheading} text-${THEME.colors.text.muted}`}>Transaction ID</th>
                  <th className={`px-6 py-4 ${THEME.typography.subheading} text-${THEME.colors.text.muted}`}>Date & Time</th>
                  <th className={`px-6 py-4 ${THEME.typography.subheading} text-${THEME.colors.text.muted}`}>Amount</th>
                  <th className={`px-6 py-4 ${THEME.typography.subheading} text-${THEME.colors.text.muted}`}>Status</th>
                  <th className={`px-6 py-4 ${THEME.typography.subheading} text-${THEME.colors.text.muted} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody className={`divide-y divide-${THEME.colors.borderLight}`}>
                {transactions.map((tx, idx) => (
                  <tr 
                    key={tx.id} 
                    onClick={() => setSelectedTx(idx)} 
                    className={`hover:bg-${THEME.colors.primaryLight} cursor-pointer transition-colors ${selectedTx === idx ? `bg-${THEME.colors.primaryLight}` : ''}`}
                  >
                    <td className={`px-6 py-5 font-semibold text-${THEME.colors.text.base}`}>#{tx.id}</td>
                    <td className={`px-6 py-5 text-sm text-${THEME.colors.text.muted}`}>{tx.date}</td>
                    <td className={`px-6 py-5 font-bold text-${THEME.colors.text.base}`}>${tx.amount.toFixed(2)}</td>
                    <td className="px-6 py-5">
                      <Badge color={tx.status === 'Completed' ? 'success' : 'warning'}>{tx.status}</Badge>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setShowReceipt(true); }} 
                          className={`p-2 hover:bg-slate-200 rounded-full text-slate-500 hover:text-${THEME.colors.primary} transition-colors`}
                          title="Reprint Receipt"
                        >
                          <Icon.Print className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setShowReceipt(true)} 
                          className={`text-${THEME.colors.primary} hover:underline font-semibold text-sm`}
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Sidebar Actions */}
        <div className={`w-80 bg-${THEME.colors.surface} border-l border-${THEME.colors.border} p-8 flex flex-col gap-4`}>
           <Button onClick={() => setShowReceipt(true)} variant="secondary" className="w-full py-4" icon={Icon.Document}>View Receipt</Button>
           <Button variant="outline" className="w-full py-4" icon={Icon.Print}>Re-print</Button>
           <Button onClick={() => setOverlay(OverlayType.AUTHORIZATION)} variant="danger" className="w-full py-4" icon={Icon.Delete}>Refund Item</Button>
           
           <div className={`mt-auto p-6 bg-${THEME.colors.surfaceAlt} ${THEME.radius.large} border border-${THEME.colors.borderLight}`}>
             <p className={THEME.typography.subheading}>Day Summary</p>
             <div className="space-y-3 mt-4">
               <div className="flex justify-between">
                 <span className={`text-sm text-${THEME.colors.text.muted}`}>Total Sales</span>
                 <span className={`text-sm font-semibold text-${THEME.colors.text.base}`}>$1,452.90</span>
               </div>
               <div className="flex justify-between">
                 <span className={`text-sm text-${THEME.colors.text.muted}`}>Count</span>
                 <span className={`text-sm font-semibold text-${THEME.colors.text.base}`}>42</span>
               </div>
             </div>
           </div>
        </div>
      </div>

      {/* Find Transaction Modal */}
      <Modal 
        isOpen={overlay === OverlayType.FIND_TRANSACTION} 
        onClose={closeOverlay} 
        title="Search Transaction"
      >
        <div className="space-y-8">
           <div className="text-center space-y-2">
              <p className={`text-${THEME.colors.text.muted}`}>Locate record by phone or date range</p>
           </div>
           <div className="space-y-4">
              <Input type="text" placeholder="Member Phone Number" />
              <div className="grid grid-cols-2 gap-3">
                 <Input type="date" className="text-sm" />
                 <Input type="date" className="text-sm" />
              </div>
           </div>
           <div className="flex gap-4">
              <Button onClick={closeOverlay} variant="outline" className="flex-1">Cancel</Button>
              <Button onClick={closeOverlay} className="flex-1">Search</Button>
           </div>
        </div>
      </Modal>

      {/* Manager Auth for Refund */}
      <Modal 
        isOpen={overlay === OverlayType.AUTHORIZATION} 
        onClose={closeOverlay} 
        title="Elevated Access"
      >
        <div className="space-y-8">
          <div className={`w-20 h-20 bg-${THEME.colors.status.warningBg} rounded-full flex items-center justify-center mx-auto`}>
             <Icon.Security className={`w-10 h-10 text-${THEME.colors.status.warningText}`} />
          </div>
          <div className="text-center space-y-2">
             <p className={`text-${THEME.colors.text.muted}`}>Please provide manager authorization to proceed with refund</p>
          </div>
          <div className="space-y-4">
             <Input type="text" placeholder="Admin ID" />
             <Input type="password" placeholder="Passcode" />
          </div>
          <div className="flex gap-4">
             <Button onClick={closeOverlay} variant="outline" className="flex-1">Dismiss</Button>
             <Button onClick={closeOverlay} variant="secondary" className="flex-1">Confirm Auth</Button>
          </div>
        </div>
      </Modal>

      {/* Receipt Details Modal */}
      <Modal 
        isOpen={showReceipt} 
        onClose={() => setShowReceipt(false)} 
        title="Receipt Details"
      >
         <div className="space-y-6">
            <div className={`flex justify-between items-end border-b border-dashed border-${THEME.colors.border} pb-6`}>
              <div>
                <p className={THEME.typography.subheading}>Product</p>
                <p className={`font-bold text-${THEME.colors.text.base} text-xl`}>92# Gasoline</p>
                <p className={`text-sm text-${THEME.colors.text.muted}`}>Pump No. 1</p>
              </div>
              <div className="text-right">
                <p className={THEME.typography.subheading}>Total</p>
                <p className={`font-bold text-${THEME.colors.text.base} text-2xl`}>$15.83</p>
              </div>
            </div>
            <div className="space-y-3">
               <div className="flex justify-between text-sm">
                 <span className={`text-${THEME.colors.text.muted}`}>Unit Price</span>
                 <span className={`font-semibold text-${THEME.colors.text.base}`}>$6.41</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className={`text-${THEME.colors.text.muted}`}>Quantity</span>
                 <span className={`font-semibold text-${THEME.colors.text.base}`}>2.47 Liters</span>
               </div>
               <div className={`flex justify-between text-sm pt-3 border-t border-${THEME.colors.borderLight}`}>
                 <span className={`text-${THEME.colors.text.muted}`}>Subtotal</span>
                 <span className={`font-semibold text-${THEME.colors.text.base}`}>$15.83</span>
               </div>
            </div>
            <div className={`pt-6 border-t border-dashed border-${THEME.colors.border}`}>
              <div className="flex justify-between items-center mb-8">
                <span className={`text-lg font-bold text-${THEME.colors.text.base}`}>Paid by Cash</span>
                <span className={`text-2xl font-bold text-${THEME.colors.primary}`}>$15.83</span>
              </div>
              <Button onClick={() => setShowReceipt(false)} className="w-full py-4" icon={Icon.Print}>Print Receipt</Button>
            </div>
         </div>
      </Modal>
    </div>
  );
};

export default HistoryView;
