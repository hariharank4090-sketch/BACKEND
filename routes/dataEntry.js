import express from 'express';

import godownActivity from "../controllers/DataEntry/godownActivity.js";
import purchaseOrder from '../controllers/DataEntry/purchaseOrder.js';
import costCenter from '../controllers/DataEntry/costCenter.js';

const dataEntryRouter = express.Router();

// Godown Activities
dataEntryRouter.get('/godownActivities', godownActivity.getGodownActivity)
dataEntryRouter.get('/godownActivities/abstract', godownActivity.getGodownAbstract)
dataEntryRouter.post('/godownActivities', godownActivity.postGWActivity)
dataEntryRouter.put('/godownActivities', godownActivity.updateGWActivity)

// // Purchase Order
dataEntryRouter.get('/godownLocationMaster', purchaseOrder.godownLocation);
dataEntryRouter.get('/purchaseOrderEntry', purchaseOrder.getPurchaseOrder)
dataEntryRouter.post('/purchaseOrderEntry', purchaseOrder.createPurchaseOrder)
dataEntryRouter.put('/purchaseOrderEntry', purchaseOrder.updatePurchaseOrder)
dataEntryRouter.delete('/purchaseOrderEntry', purchaseOrder.deleteOrderPermanantly);
dataEntryRouter.get('/purchaseOrderEntry/delivery/partyBased', purchaseOrder.getDeliveryByPartyId);
dataEntryRouter.put('/purchaseOrderEntry/ArrivalUpdate', purchaseOrder.updateArrivalDetails);
dataEntryRouter.get('/pendingPartyInvoice', purchaseOrder.getPartyForInvoice);


dataEntryRouter.get('/costCenter', costCenter.getCostCenter);
dataEntryRouter.post('/costCenter', costCenter.createCostCenter);
dataEntryRouter.put('/costCenter', costCenter.updateCostCenter);

dataEntryRouter.get('/costCenter/category',costCenter.getCostCenterCategory)
dataEntryRouter.post('/costCategory',costCenter.createCostCategory)
dataEntryRouter.put('/costCategory',costCenter.updateCostCategory)
dataEntryRouter.delete('/costCategory',costCenter.deleteCostCategory)
dataEntryRouter.get('/costCategory/DropDown',costCenter.costCategoryDropDown)

dataEntryRouter.get('/costCenter/report',costCenter.costCenterInvolvedReports)
dataEntryRouter.get('/costCenter/report/employee',costCenter.costCenterEmployeeReports)

export default dataEntryRouter;