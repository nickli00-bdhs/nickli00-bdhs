// 引用 express 和 mysql2
const express = require('express');
const mysql = require('mysql2');
const path = require('path');  // <--- 新增這行

// --- 建立 Express 應用程式 ---
const app = express();
const port = 3000; // 您的 Node.js 伺服器將運行的通訊埠

// 建立連線池 (Pool)，效能比單一連線更好
const pool = mysql.createPool({
  host: '10.232.73.222',   // 您的伺服器 IP 位址
  port: 8878,              // MySQL 預設連接埠
  user: 'std_1',       // 學生的帳號
  password: 'pwd@BDstd',    // 學生的密碼
  database: 'std_1',// 學生的資料庫名稱
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise(); // 加上 .promise() 讓我們可以使用 async/await

// --- 建立一個 API 路由 (Route) ---
// 我們建立一個 http://localhost:3000/get_all_students 的 API
app.get('/get_all_students', async (req, res) => {
 
  console.log("收到 /get_all_students 的請求...");

  try {
    // 1. 從連線池取得一個連線
    // 2. 執行 SQL 查詢 (SELECT * FROM std)
    // 3. 取得查詢結果 [rows]
    const [rows] = await pool.query("SELECT * FROM std");

    // 4. 將查詢結果 (這4筆資料) 以 JSON 格式回傳
    console.log("查詢成功:", rows);
    res.json(rows);

  } catch (err) {
    // 如果發生錯誤
    console.error('資料庫查詢失敗:', err);
    res.status(500).json({ error: '查詢失敗' });
  }
});
app.get('/students', (req, res) => {
  res.sendFile(path.join(__dirname, 'students.html'));
});
// --- 啟動 Express 伺服器 ---
app.listen(port, () => {
  console.log(`Node.js 伺服器已啟動，正在監聽 http://localhost:${port}`);
  console.log('---');
  console.log('請在您的瀏覽器中開啟:');
  console.log(`http://localhost:${port}/get_all_students`);
  console.log('---');
});

