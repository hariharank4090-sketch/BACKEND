import express from 'express';
 

// import AttendanceRouter from './attendance.js';
import AuthorizationRouter from './authorization.js';
// import DashboardRouter from './dashboard.js';
import dataEntryRouter from './dataEntry.js';
// import TopicsRouter from './discussionForem.js';
import MastersRouter from './master.js';
import projectRoute from './projectsAndTasks.js';
import UserModule from './userModule.js';
// import ReportRouter from './reports.js';
import SalesRouter from './sales.js';
import PurchaseRouter from './purchase.js'
import inventoryRouter from './inventory.js';
// import DeliveryRouter from './delivery.js';
// import ReceiptsRouter from './receipts.js';
// import PaymentRouter from './payment.js';
// import AnalalyticsRouter from './analytics.js';
// import JournalRouter from './journal.js';

const indexRouter = express.Router();

// indexRouter.use('/empAttendance', AttendanceRouter);
indexRouter.use('/authorization', AuthorizationRouter);
// indexRouter.use('/analytics', AnalalyticsRouter);
// indexRouter.use('/dashboard', DashboardRouter);
indexRouter.use('/dataEntry', dataEntryRouter);
// indexRouter.use('/discussionForum', TopicsRouter);
indexRouter.use('/masters', MastersRouter);
indexRouter.use('/sales', SalesRouter);
indexRouter.use('/purchase', PurchaseRouter);
indexRouter.use('/inventory', inventoryRouter);
indexRouter.use('/taskManagement', projectRoute);
// indexRouter.use('/reports', ReportRouter);
indexRouter.use('/userModule', UserModule);
// indexRouter.use('/delivery', DeliveryRouter);
// indexRouter.use('/receipt', ReceiptsRouter);
// indexRouter.use('/payment', PaymentRouter);
// indexRouter.use('/journal', JournalRouter);


export default indexRouter;