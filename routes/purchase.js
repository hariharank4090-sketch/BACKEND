import express from 'express';
import purchaseOrder from '../controllers/Purchase/purchaseOrder.js';

const PurchaseRoute = express.Router();

PurchaseRoute.get('/purchaseOrder', purchaseOrder.getPurchaseOrder);
PurchaseRoute.post('/purchaseOrder', purchaseOrder.purchaseOrderCreation);
PurchaseRoute.put('/purchaseOrder', purchaseOrder.editPurchaseOrder);
PurchaseRoute.delete('/purchaseOrder', purchaseOrder.cancelPurchaseOrder);
PurchaseRoute.get('/involvedStaffs', purchaseOrder.getInvolvedStaffs);

PurchaseRoute.get('/voucherType', purchaseOrder.getVoucherType);
PurchaseRoute.get('/stockItemLedgerName', purchaseOrder.getStockItemLedgerName);


export default PurchaseRoute;