const mysql = require('mysql2/promise');
require('dotenv').config();

async function main() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
    });

    console.log('正在连接 MySQL...');

    await connection.query('CREATE DATABASE IF NOT EXISTS se_course_db;');
    await connection.query('USE se_course_db;');

    await connection.query(`
      CREATE TABLE IF NOT EXISTS user (
        userEmail VARCHAR(85) PRIMARY KEY,
        userPassword VARCHAR(255) NOT NULL,
        userFirstName VARCHAR(50) NOT NULL,
        userLastName VARCHAR(50) NOT NULL,
        userTel VARCHAR(50),
        dateOfBirth DATE
      );
    `);

    await connection.query('DELETE FROM user;');

    await connection.query(`
      INSERT INTO user (userEmail, userPassword, userFirstName, userLastName, userTel, dateOfBirth) VALUES
      ('daranporn@gmail.com', 'yjdf1716', 'Sira', 'Weerakittana', '0891234567', '2012-05-26'),
      ('boonpoj@gmail.com', 'mmjt9876', 'Rosanan', 'Suvanabhumiwong', '0641825563', '2011-10-17'),
      ('bodin_thai@gmail.com', 'mmyb4577', 'Tankwan', 'Srisuk', '0986345661', '2007-04-29');
    `);

    console.log('🎉 数据库 setup 成功！');
    await connection.end();
  } catch (err) {
    console.error('❌ 执行失败:', err.message);
  }
}

main();