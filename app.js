const express = require('express');
const cors = require('cors');
const userRoutes = require('./user');

const app = express();

// 配置 CORS 与 JSON 解析
app.use(cors());
app.use(express.json());

// 挂载路由
app.use('/', userRoutes);

// 启动服务器（测试时自动跳过，避免端口冲突）
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;