require('dotenv').config();
const mysql = require('mysql2/promise');
const productsData = require('./data'); // Lấy dữ liệu từ file data.js của bạn

async function importData() {
  // 1. Kết nối vào MySQL
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    console.log("⌛ Đang tạo bảng products...");
    
    // 2. Tự động tạo bảng nếu chưa có
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        price BIGINT NOT NULL,
        sku VARCHAR(50),
        description TEXT,
        isNew BOOLEAN DEFAULT FALSE,
        category VARCHAR(100),
        room VARCHAR(100),
        image VARCHAR(500),
        images JSON,
        colors JSON,
        dimensions JSON,
        materials JSON
      )
    `);

    console.log("✅ Đã tạo bảng thành công!");
    
    // (Tùy chọn) Xóa dữ liệu cũ nếu bạn muốn chạy lại script này nhiều lần
    await connection.execute('DELETE FROM products');

    console.log("⌛ Đang import dữ liệu từ data.js vào Database...");

    // 3. Duyệt qua từng sản phẩm trong data.js và lưu vào CSDL
    for (const product of productsData) {
      await connection.execute(
        `INSERT INTO products 
        (id, name, slug, price, sku, description, isNew, category, room, image, images, colors, dimensions, materials) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product.id,
          product.name,
          product.slug,
          product.price,
          product.sku || '',
          product.description || '',
          product.isNew ? 1 : 0, // MySQL lưu Boolean là 1 (true) và 0 (false)
          product.category || '',
          product.room || '',
          product.image || '', // Ảnh đại diện chính
          JSON.stringify(product.images || []), // Chuyển mảng thành chuỗi JSON
          JSON.stringify(product.colors || []),
          JSON.stringify(product.dimensions || {}), // Chuyển object thành chuỗi JSON
          JSON.stringify(product.materials || [])
        ]
      );
    }

    console.log("🎉 IMPORT DỮ LIỆU THÀNH CÔNG RỰC RỠ!");

  } catch (error) {
    console.error("❌ Xảy ra lỗi trong quá trình import:", error);
  } finally {
    // Đóng kết nối
    await connection.end();
  }
}

// Chạy hàm
importData();