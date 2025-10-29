import express from 'express';
import employeeMaster from '../controllers/UserModule/employeeMaster.js';

const UserModule = express.Router();

UserModule.get('/employeeActivity/maplatitude',employeeMaster.maplatitudelongitude)


export default UserModule;