const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDB() {
  try {
    // 1. 连接 MySQL 服务
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS
    });

    console.log('正在连接 MySQL 并创建数据库...');

    // 2. 创建数据库
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    await connection.query(`USE \`${process.env.DB_NAME}\`;`);

    // 3. 创建 user 数据表
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS user (
        userEmail VARCHAR(85) PRIMARY KEY,
        userPassword VARCHAR(255) NOT NULL,
        userFirstName VARCHAR(50) NOT NULL,
        userLastName VARCHAR(50) NOT NULL,
        userTel VARCHAR(50),
        dateOfBirth DATE
      );
    `;
    await connection.query(createTableSQL);

    // 4. 清空并插入示例数据
    await connection.query(`DELETE FROM user;`);
    const insertSQL = `
      INSERT INTO user (userEmail, userPassword, userFirstName, userLastName, userTel, dateOfBirth) VALUES
      ('daranporn@gmail.com', 'yjdf1716', 'Sira', 'Weerakittana', '0891234567', '2012-05-26'),
      ('boonpoj@gmail.com', 'mmjt9876', 'Rosanan', 'Suvanabhumiwong', '0641825563', '2011-10-17'),
      ('bodin_thai@gmail.com', 'mmyb4577', 'Tankwan', 'Srisuk', '0986345661', '2007-04-29');
    `;
    await connection.query(insertSQL);

    console.log('✅ 数据库、数据表及示例数据初始化成功！');
    await connection.end();
  } catch (err) {
    console.error('❌ 初始化失败，请检查 .env 中的数据库密码是否正确：', err.message);
  }
}

initDB();