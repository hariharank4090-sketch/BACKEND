import express from 'express';
import LoginController from '../controllers/Authorization/login.js'; 
import appMenu from '../controllers/Authorization/appMenu.js';
import authenticateToken from '../middleware/auth.js';

const AuthorizationRouter = express.Router();


AuthorizationRouter.post('/login', LoginController.login);
AuthorizationRouter.get('/userAuth', LoginController.getUserByAuth);
AuthorizationRouter.post('/userPortal/login', LoginController.globalLogin);
AuthorizationRouter.get('/userPortal/accounts', LoginController.getAccountsInUserPortal);
AuthorizationRouter.get('/userAuthmobile', LoginController.mobileApplogin);


AuthorizationRouter.get('/appMenu', authenticateToken, appMenu.newAppMenu);
AuthorizationRouter.get('/newAppMenu', authenticateToken, appMenu.newAppMenu)

AuthorizationRouter.get('/userRights', appMenu.getNewUserBasedRights);
AuthorizationRouter.post('/userRights', appMenu.newModifyUserRights);

AuthorizationRouter.get('/userTypeRights', appMenu.getNewUserTypeBasedRights);
AuthorizationRouter.post('/userTypeRights', appMenu.newModifyUserTypeRights);

AuthorizationRouter.get('/menuMaster', appMenu.listMenu);
AuthorizationRouter.post('/menuMaster', appMenu.createNewMenu);
AuthorizationRouter.put('/menuMaster', appMenu.updateMenu);

// AuthorizationRouter.get('/companysAccess', companyAccess.getMYCompanyAccess);
// AuthorizationRouter.post('/companysAccess', companyAccess.postCompanyAccess);


export default AuthorizationRouter;