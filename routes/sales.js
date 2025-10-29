import express from 'express';
import salesInvoice from '../controllers/Sales/salesInvoice.js';

const SalesRouter = express.Router();

SalesRouter.get('/stockInGodown', salesInvoice.getStockInHandGodownWise);
SalesRouter.get('/salesInvoice/filterValues', salesInvoice.getFilterValues);
SalesRouter.get('/salesInvoice/expenceAccount', salesInvoice.getSalesExpenceAccount);

SalesRouter.get('/salesInvoice/tallySync', salesInvoice.salesTallySync);
SalesRouter.get('/salesInvoice', salesInvoice.getSalesInvoice);
SalesRouter.post('/salesInvoice', salesInvoice.createSalesInvoice);
SalesRouter.put('/salesInvoice', salesInvoice.updateSalesInvoice);
SalesRouter.post('/salesInvoice/liveSales', salesInvoice.liveSalesCreation);

export default SalesRouter;