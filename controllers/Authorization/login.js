import sql from "mssql";
import {
  servError,
  dataFound,
  failed,
  invalidInput,
  success,
  noData,
} from "../../res.js";
import { decryptPasswordFun, LocalDateTime } from "../../helper_functions.js";
import dotenv from "dotenv";
dotenv.config();

const userPortalDB = process.env.USERPORTALDB;

const LoginController = () => {
  // 🔹 Fetch accounts in user portal
  const getAccountsInUserPortal = async (req, res) => {
    const { username } = req.query;
    if (!username) return invalidInput(res, "username is required");

    try {
      const result = await new sql.Request()
        .input("username", username)
        .query(`
          SELECT 
              c.Company_Name,
              c.Local_Comp_Id AS Local_Id,
              c.Global_Comp_Id AS Global_Id,
              c.Web_Api,
              u.Global_User_ID
          FROM [${userPortalDB}].[dbo].[tbl_Company] AS c
          JOIN [${userPortalDB}].[dbo].[tbl_Users] AS u 
            ON u.Company_Id = c.Local_Comp_Id
          WHERE u.UserName = @username
        `);

      result.recordset.length > 0
        ? dataFound(res, result.recordset)
        : noData(res);
    } catch (e) {
      servError(e, res);
    }
  };

  // 🔹 Global login
  const globalLogin = async (req, res) => {
    const { Global_User_ID, Password } = req.body;

    try {
      const decryptedPassword = decryptPasswordFun(Password);
      const result = await new sql.Request()
        .input("Global_User_ID", Global_User_ID)
        .input("Password", decryptedPassword)
        .query(`
          SELECT 
              c.Web_Api,
              u.Autheticate_Id,
              (c.Web_Api + '?Auth=' + u.Autheticate_Id) AS LOGIN_URL
          FROM [${userPortalDB}].[dbo].[tbl_Company] AS c
          JOIN [${userPortalDB}].[dbo].[tbl_Users] AS u 
            ON u.Company_Id = c.Local_Comp_Id
          WHERE u.Global_User_ID = @Global_User_ID
            AND u.Password = @Password
        `);

      result.recordset.length > 0
        ? success(res, "Login successful", result.recordset[0])
        : failed(res, "Invalid Password");
    } catch (e) {
      servError(e, res);
    }
  };

  // 🔹 Standard login
  const login = async (req, res) => {
    const { username, password } = req.body;
    console.log("Login Request:", req.body);

    if (!username || !password)
      return invalidInput(res, "username and password are required");

    try {
      const query = `
        SELECT
          u.UserTypeId,
          u.UserId,
          u.UserName,
          u.BranchId,
          b.BranchName,
          u.Name,
          ut.UserType,
          u.Autheticate_Id,
          u.Company_id,
          c.Company_Name
        FROM tbl_Users AS u
        LEFT JOIN tbl_Branch_Master AS b ON b.BranchId = u.BranchId
        LEFT JOIN tbl_User_Type AS ut ON ut.Id = u.UserTypeId
        LEFT JOIN tbl_Company_Master AS c ON c.Company_id = u.Company_Id
        WHERE LOWER(u.UserName) = LOWER(@UserName)
          AND u.Password = @Password
          AND u.UDel_Flag = 0
      `;

      const loginReq = new sql.Request();
      loginReq.input("UserName", String(username).trim());
      loginReq.input("Password", decryptPasswordFun(password));

      const loginResult = await loginReq.query(query);

      if (loginResult.recordset.length > 0) {
        const userInfo = loginResult.recordset[0];
        const ssid = `${Math.floor(
          100000 + Math.random() * 900000
        )}${LocalDateTime().trim()}`;

        try {
          await new sql.Request()
            .input("Id", 0)
            .input("UserId", userInfo.UserId)
            .input("SessionId", ssid)
            .input("LogStatus", 1)
            .input("APP_Type", 1)
            .execute("UserLogSP");
        } catch (er) {
          console.error("Error while creating login session:", er);
        }

        return res.status(200).json({
          user: userInfo,
          sessionInfo: {
            InTime: new Date(),
            SessionId: ssid,
            UserId: userInfo.UserId,
          },
          success: true,
          message: "Login successfully",
        });
      } else {
        failed(res, "Invalid username or password");
      }
    } catch (e) {
      servError(e, res);
    }
  };

  // 🔹 Get user by Auth key
  const getUserByAuth = async (req, res) => {
    const Auth = req.header("Authorization");
    try {
      const query = `
        SELECT
          u.UserTypeId,
          u.UserId,
          u.UserName,
          u.Password,
          u.BranchId,
          b.BranchName,
          u.Name,
          ut.UserType,
          u.Autheticate_Id,
          u.Company_Id AS Company_id,
          c.Company_Name,
          (
            SELECT TOP (1) UserId, SessionId, InTime
            FROM tbl_User_Log
            WHERE UserId = u.UserId
            ORDER BY InTime DESC
            FOR JSON PATH
          ) AS session
        FROM tbl_Users AS u
        LEFT JOIN tbl_Branch_Master AS b ON b.BranchId = u.BranchId
        LEFT JOIN tbl_User_Type AS ut ON ut.Id = u.UserTypeId
        LEFT JOIN tbl_Company_Master AS c ON c.Company_id = u.Company_Id
        WHERE u.Autheticate_Id = @auth AND u.UDel_Flag = 0
      `;

      const request = new sql.Request();
      request.input("auth", Auth);

      const result = await request.query(query);
      if (result.recordset.length > 0) {
        const record = result.recordset[0];
        record.session = record.session
          ? JSON.parse(record.session)
          : [{ UserId: record.UserId, SessionId: new Date(), InTime: new Date() }];

        dataFound(res, [record]);
      } else {
        failed(res, "User Not Found");
      }
    } catch (e) {
      servError(e, res);
    }
  };

  // 🔹 Mobile App Login
  const mobileApplogin = async (req, res) => {
    const Auth = req.header("Authorization");
    try {
      const query = `
        SELECT
          u.UserTypeId,
          u.UserId,
          u.UserName,
          u.Password,
          u.BranchId,
          b.BranchName,
          u.Name,
          ut.UserType,
          u.Autheticate_Id,
          u.Company_Id AS Company_id,
          c.Company_Name,
          cc.Cost_Center_Id,
          (
            SELECT TOP (1) UserId, SessionId, InTime
            FROM tbl_User_Log
            WHERE UserId = u.UserId
            ORDER BY InTime DESC
            FOR JSON PATH
          ) AS session
        FROM tbl_Users AS u
        LEFT JOIN tbl_Branch_Master AS b ON b.BranchId = u.BranchId
        LEFT JOIN tbl_User_Type AS ut ON ut.Id = u.UserTypeId
        LEFT JOIN tbl_Company_Master AS c ON c.Company_id = u.Company_Id
        LEFT JOIN tbl_ERP_Cost_Center AS cc ON cc.User_Id = u.UserId
        WHERE u.Autheticate_Id = @auth AND u.UDel_Flag = 0
      `;

      const request = new sql.Request();
      request.input("auth", Auth);
      const result = await request.query(query);

      if (result.recordset.length > 0) {
        const userInfo = result.recordset[0];
        const ssid = `${Math.floor(
          100000 + Math.random() * 900000
        )}${new Date().toISOString().trim()}`;

        try {
          await new sql.Request()
            .input("Id", 0)
            .input("UserId", userInfo.UserId)
            .input("SessionId", ssid)
            .input("LogStatus", 1)
            .input("APP_Type", 2)
            .execute("UserLogSP");
        } catch (err) {
          console.error("Error while creating login session:", err);
        }

        return res.status(200).json({
          user: userInfo,
          sessionInfo: {
            InTime: new Date(),
            SessionId: ssid,
            UserId: userInfo.UserId,
          },
          success: true,
          message: "Login successfully",
        });
      } else {
        failed(res, "Invalid username or password");
      }
    } catch (e) {
      servError(e, res);
    }
  };

  return {
    getAccountsInUserPortal,
    globalLogin,
    login,
    getUserByAuth,
    mobileApplogin,
  };
};

export default LoginController();
