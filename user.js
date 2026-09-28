const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('./db');

// 1. GET /users - 获取所有用户 (排除 userPassword 字段)
router.get('/users', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT userEmail, userFirstName, userLastName, userTel, dateOfBirth FROM user'
    );
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// 2. POST /users - 用户注册 (包含密码加密 & 校验)
router.post('/users', async (req, res) => {
  const { userEmail, userPassword, userFirstName, userLastName, userTel, dateOfBirth } = req.body;

  // IT-4 验证：缺失必填字段 (至少需要 userEmail 和 userPassword)
  if (!userEmail || !userPassword) {
    return res.status(400).json({ message: 'Missing required mandatory fields' });
  }

  try {
    // IT-3 验证：检查邮箱是否已被注册
    const [existing] = await db.query('SELECT userEmail FROM user WHERE userEmail = ?', [userEmail]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // 密码 bcrypt 加密
    const hashedPassword = await bcrypt.hash(userPassword, 10);

    // 插入数据库
    await db.query(
      `INSERT INTO user (userEmail, userPassword, userFirstName, userLastName, userTel, dateOfBirth) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userEmail,
        hashedPassword,
        userFirstName || '',
        userLastName || '',
        userTel || null,
        dateOfBirth || null
      ]
    );

    return res.status(201).json({ message: 'Created' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;