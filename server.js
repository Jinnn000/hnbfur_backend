const express = require("express");
const cors = require("cors");
const pool = require("./db"); // Import kết nối Database vừa tạo
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 1. Tạo thư mục 'uploads' để chứa ảnh (nếu chưa có thì tự tạo)
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 2. Cấu hình nơi lưu và tên file (đổi tên file thêm thời gian để không bị trùng)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname),
    );
  },
});
const upload = multer({ storage: storage });

// 3. Cho phép Frontend truy cập vào thư mục 'uploads' qua đường link
app.use("/uploads", express.static("uploads"));

// 4. API chuyên dụng để Upload Ảnh
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Không có file nào được tải lên" });
  }
  // Tạo đường link url đầy đủ trả về cho Frontend
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

// API chuyên dụng để Upload NHIỀU ẢNH (Thư viện ảnh) - Tối đa 10 ảnh 1 lần
app.post("/api/upload-multiple", upload.array("images", 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "Không có file nào được tải lên" });
  }

  // Tạo mảng chứa các đường link url của tất cả các ảnh vừa up
  const imageUrls = req.files.map(
    (file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
  );

  res.json({ urls: imageUrls });
});

app.get("/", (req, res) => {
  res.send("Chào mừng đến với API Nhà Xinh - CHẠY 100% BẰNG MYSQL!");
});

// 1. API lấy danh sách sản phẩm (Có hỗ trợ lọc category và search)
app.get("/api/products", async (req, res) => {
  try {
    const { category, search } = req.query;

    let query = "SELECT * FROM products WHERE 1=1";
    let queryParams = [];

    if (category) {
      if (!isNaN(category)) {
        // Nếu Frontend gửi lên ID số (VD: ?category=1)
        query += " AND JSON_CONTAINS(category_ids, CAST(? AS CHAR))";
        queryParams.push(String(category));
      } else {
        // Nếu Frontend gửi lên chữ (VD: ?category=sofa)
        query +=
          " AND JSON_CONTAINS(category_ids, (SELECT CAST(id AS CHAR) FROM categories WHERE slug = ? OR name = ? LIMIT 1))";
        queryParams.push(category, category);
      }
    }

    if (search) {
      query += " AND name LIKE ?";
      queryParams.push(`%${search}%`);
    }

    query += " ORDER BY id DESC"; // Sản phẩm mới lên đầu
    const [rows] = await pool.query(query, queryParams);

    res.json({ data: rows, meta: { total: rows.length } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi Server!" });
  }
});

// 2. API lấy chi tiết 1 sản phẩm theo Slug
app.get("/api/products/:slug", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products WHERE slug = ?", [
      req.params.slug,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.json({ data: rows[0] });
  } catch (error) {
    console.error("Lỗi lấy chi tiết sản phẩm:", error);
    res.status(500).json({ message: "Lỗi Server" });
  }
});

// ==========================================
// API DANH MỤC & PHÒNG
// ==========================================

// Lấy danh sách Danh mục
app.get("/api/categories", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categories");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh mục" });
  }
});

// Lấy danh sách Phòng
app.get("/api/rooms", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM rooms");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách phòng" });
  }
});

// ==========================================
// API CRUD CHO DANH MỤC (CATEGORIES)
// ==========================================
// Thêm danh mục mới
app.post("/api/categories", async (req, res) => {
  try {
    const { name, slug, image } = req.body;
    await pool.query(
      "INSERT INTO categories (name, slug, image) VALUES (?, ?, ?)",
      [name, slug, image],
    );
    res.json({ message: "Thêm thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi thêm danh mục" });
  }
});

// Xóa danh mục
app.delete("/api/categories/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM categories WHERE id = ?", [req.params.id]);
    res.json({ message: "Xóa thành công!" });
  } catch (error) {
    res.status(500).json({
      message:
        "Lỗi xóa danh mục (Có thể do đang có sản phẩm dùng danh mục này)",
    });
  }
});

// ==========================================
// API CRUD CHO PHÒNG (ROOMS)
// ==========================================
// Thêm phòng mới
app.post("/api/rooms", async (req, res) => {
  try {
    const { name, slug, image } = req.body;
    await pool.query("INSERT INTO rooms (name, slug, image) VALUES (?, ?, ?)", [
      name,
      slug,
      image,
    ]);
    res.json({ message: "Thêm thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi thêm phòng" });
  }
});

// Xóa phòng
app.delete("/api/rooms/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM rooms WHERE id = ?", [req.params.id]);
    res.json({ message: "Xóa thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa phòng" });
  }
});

// API Sửa Danh mục (PUT)
// Sửa danh mục (Có ảnh)
app.put("/api/categories/:id", async (req, res) => {
  try {
    const { name, slug, image } = req.body;
    await pool.query(
      "UPDATE categories SET name = ?, slug = ?, image = ? WHERE id = ?",
      [name, slug, image, req.params.id],
    );
    res.json({ message: "Cập nhật thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật danh mục" });
  }
});

// API Sửa Phòng (PUT)
app.put("/api/rooms/:id", async (req, res) => {
  try {
    const { name, slug, image } = req.body;
    await pool.query(
      "UPDATE rooms SET name = ?, slug = ?, image = ? WHERE id = ?",
      [name, slug, image, req.params.id],
    );
    res.json({ message: "Cập nhật thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật phòng" });
  }
});

// ==========================================
// API CRUD CHO MÀU SẮC (COLORS)
// ==========================================

// 1. Lấy danh sách màu sắc
app.get("/api/colors", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM colors ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách màu" });
  }
});

// 2. Thêm màu mới
app.post("/api/colors", async (req, res) => {
  try {
    const { name, value } = req.body;
    await pool.query("INSERT INTO colors (name, value) VALUES (?, ?)", [
      name,
      value,
    ]);
    res.json({ message: "Thêm màu thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi thêm màu" });
  }
});

// 3. Sửa màu
app.put("/api/colors/:id", async (req, res) => {
  try {
    const { name, value } = req.body;
    await pool.query("UPDATE colors SET name = ?, value = ? WHERE id = ?", [
      name,
      value,
      req.params.id,
    ]);
    res.json({ message: "Cập nhật màu thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật màu" });
  }
});

// 4. Xóa màu
app.delete("/api/colors/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM colors WHERE id = ?", [req.params.id]);
    res.json({ message: "Xóa màu thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa màu" });
  }
});

// ==========================================
// API CRUD CHO THIẾT KẾ NỘI THẤT (ALBUMS 3D)
// ==========================================

// 1. Lấy danh sách Albums (Hỗ trợ lọc theo type)
app.get("/api/interior-albums", async (req, res) => {
  try {
    const { type } = req.query;
    let query = "SELECT * FROM interior_albums";
    let queryParams = [];

    if (type) {
      query += " WHERE type = ?";
      queryParams.push(type);
    }

    query += " ORDER BY id DESC"; // Mới nhất lên đầu
    const [rows] = await pool.query(query, queryParams);

    res.json(rows);
  } catch (error) {
    console.error("Lỗi lấy danh sách album:", error);
    res.status(500).json({ message: "Lỗi Server" });
  }
});

// 2. Lấy chi tiết 1 Album theo Slug
app.get("/api/interior-albums/:slug", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM interior_albums WHERE slug = ?",
      [req.params.slug],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy dự án" });
    }

    res.json({ data: rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server" });
  }
});

// 3. Thêm Album mới (POST)
app.post("/api/interior-albums", async (req, res) => {
  try {
    const { title, slug, type, style, description, cover_image, images } =
      req.body;

    const query = `
      INSERT INTO interior_albums 
      (title, slug, type, style, description, cover_image, images) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    // Ép mảng images thành JSON string trước khi lưu
    const values = [
      title,
      slug,
      type,
      style,
      description,
      cover_image,
      JSON.stringify(images || []),
    ];

    await pool.query(query, values);
    res.status(201).json({ message: "Thêm album thành công!" });
  } catch (error) {
    console.error("Lỗi thêm album:", error);
    res.status(500).json({ message: "Lỗi Server" });
  }
});

// 4. Sửa Album (PUT)
app.put("/api/interior-albums/:id", async (req, res) => {
  try {
    const { title, slug, type, style, description, cover_image, images } =
      req.body;

    const query = `
      UPDATE interior_albums SET 
        title=?, slug=?, type=?, style=?, description=?, cover_image=?, images=?
      WHERE id=?
    `;

    const values = [
      title,
      slug,
      type,
      style,
      description,
      cover_image,
      JSON.stringify(images || []),
      req.params.id,
    ];

    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy album để cập nhật" });
    }

    res.json({ message: "Cập nhật album thành công!" });
  } catch (error) {
    console.error("Lỗi cập nhật album:", error);
    res.status(500).json({ message: "Lỗi Server" });
  }
});

// 5. Xóa Album (DELETE)
app.delete("/api/interior-albums/:id", async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM interior_albums WHERE id = ?",
      [req.params.id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy album để xóa" });
    }

    res.json({ message: "Xóa album thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server" });
  }
});
// ==========================================
// API CRUD CHO DANH MỤC THIẾT KẾ (ALBUM CATEGORIES)
// ==========================================

// Lấy danh sách danh mục thiết kế
app.get("/api/album-categories", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM album_categories ORDER BY id ASC",
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh mục thiết kế" });
  }
});

// Thêm danh mục mới
app.post("/api/album-categories", async (req, res) => {
  try {
    const { name, slug } = req.body;
    await pool.query(
      "INSERT INTO album_categories (name, slug) VALUES (?, ?)",
      [name, slug],
    );
    res.json({ message: "Thêm thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi thêm danh mục thiết kế" });
  }
});

// Sửa danh mục
app.put("/api/album-categories/:id", async (req, res) => {
  try {
    const { name, slug } = req.body;
    await pool.query(
      "UPDATE album_categories SET name = ?, slug = ? WHERE id = ?",
      [name, slug, req.params.id],
    );
    res.json({ message: "Cập nhật thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật danh mục" });
  }
});

// Xóa danh mục
app.delete("/api/album-categories/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM album_categories WHERE id = ?", [
      req.params.id,
    ]);
    res.json({ message: "Xóa thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa danh mục" });
  }
});

// ==========================================
// API CRUD CHO LOOKBOOK (SHOP THE LOOK)
// ==========================================

// 1. Lấy danh sách Lookbooks
app.get("/api/lookbooks", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM lookbooks ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    console.error("Lỗi lấy lookbooks:", error);
    res.status(500).json({ message: "Lỗi Server" });
  }
});

// 2. Lấy chi tiết 1 Lookbook theo Slug (Có kèm data sản phẩm)
app.get("/api/lookbooks/:slug", async (req, res) => {
  try {
    const [lookbooks] = await pool.query(
      "SELECT * FROM lookbooks WHERE slug = ?",
      [req.params.slug],
    );

    if (lookbooks.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy Lookbook" });
    }

    const lookbook = lookbooks[0];

    // Nếu có điểm neo, tự động đi fetch thông tin cơ bản của các Product đó luôn
    // để Frontend không phải gọi API nhiều lần
    let hotspots = [];
    try {
      hotspots =
        typeof lookbook.hotspots === "string"
          ? JSON.parse(lookbook.hotspots)
          : lookbook.hotspots || [];
    } catch (e) {}

    // Lấy danh sách Product IDs từ hotspots
    const productIds = hotspots.map((h) => h.product_id).filter((id) => id);

    if (productIds.length > 0) {
      // Truy vấn lấy Tên, Giá, Ảnh, Slug của các sản phẩm có trong Lookbook này
      const [products] = await pool.query(
        "SELECT id, name, slug, price, image FROM products WHERE id IN (?)",
        [productIds],
      );

      // Ghép thông tin sản phẩm vào điểm neo tương ứng
      lookbook.hotspots = hotspots.map((spot) => {
        // Dùng == hoặc Number() để đồng nhất kiểu dữ liệu
        const productData = products.find((p) => p.id == spot.product_id);
        return { ...spot, product: productData || null };
      });
    } else {
      lookbook.hotspots = [];
    }

    res.json({ data: lookbook });
  } catch (error) {
    console.error("Lỗi lấy chi tiết Lookbook:", error);
    res.status(500).json({ message: "Lỗi Server" });
  }
});

// 3. Thêm Lookbook (POST)
app.post("/api/lookbooks", async (req, res) => {
  try {
    const { title, slug, description, image, hotspots } = req.body;

    const query = `INSERT INTO lookbooks (title, slug, description, image, hotspots) VALUES (?, ?, ?, ?, ?)`;
    const values = [
      title,
      slug,
      description,
      image,
      JSON.stringify(hotspots || []),
    ];

    await pool.query(query, values);
    res.status(201).json({ message: "Thêm Lookbook thành công!" });
  } catch (error) {
    console.error("Lỗi thêm Lookbook:", error);
    res.status(500).json({ message: "Lỗi Server" });
  }
});

// 4. Sửa Lookbook (PUT)
app.put("/api/lookbooks/:id", async (req, res) => {
  try {
    const { title, slug, description, image, hotspots } = req.body;

    const query = `UPDATE lookbooks SET title=?, slug=?, description=?, image=?, hotspots=? WHERE id=?`;
    const values = [
      title,
      slug,
      description,
      image,
      JSON.stringify(hotspots || []),
      req.params.id,
    ];

    await pool.query(query, values);
    res.json({ message: "Cập nhật Lookbook thành công!" });
  } catch (error) {
    console.error("Lỗi cập nhật Lookbook:", error);
    res.status(500).json({ message: "Lỗi Server" });
  }
});

// 5. Xóa Lookbook (DELETE)
app.delete("/api/lookbooks/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM lookbooks WHERE id = ?", [req.params.id]);
    res.json({ message: "Xóa Lookbook thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server" });
  }
});

// ==========================================
// CÁC API DÀNH CHO TRANG ADMIN (THÊM, SỬA, XÓA)
// ==========================================

// 3. API Thêm sản phẩm mới (POST)
app.post("/api/products", async (req, res) => {
  try {
    // BƯỚC 1: Lấy đúng tên biến có chữ 's' từ Frontend gửi lên
    const {
      id,
      name,
      slug,
      price,
      sku,
      description,
      isNew,
      category_ids,
      room_ids,
      image,
      images,
      colors,
      dimensions,
      materials,
    } = req.body;

    const query = `
  INSERT INTO products 
  (id, name, slug, price, sku, description, isNew, category_ids, room_ids, image, images, colors, dimensions, materials) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

    // BƯỚC 2: Bọc JSON.stringify() cho category_ids và room_ids trước khi lưu
    const values = [
      id,
      name,
      slug,
      price,
      sku,
      description,
      isNew ? 1 : 0,
      JSON.stringify(category_ids || []), // Thêm dòng này
      JSON.stringify(room_ids || []), // Thêm dòng này
      image,
      JSON.stringify(images || []),
      JSON.stringify(colors || []),
      JSON.stringify(dimensions || {}),
      JSON.stringify(materials || []),
    ];

    await pool.query(query, values);
    res.status(201).json({ message: "Thêm sản phẩm thành công!" });
  } catch (error) {
    console.error("Lỗi thêm sản phẩm:", error);
    res.status(500).json({ message: "Lỗi Server", error: error.message });
  }
});

// 4. API Xóa sản phẩm (DELETE)
app.delete("/api/products/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM products WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm để xóa" });
    }

    res.json({ message: "Xóa sản phẩm thành công!" });
  } catch (error) {
    console.error("Lỗi xóa sản phẩm:", error);
    res.status(500).json({ message: "Lỗi Server" });
  }
});

// 5. API Cập nhật sản phẩm (PUT)
app.put("/api/products/:id", async (req, res) => {
  try {
    // Tương tự, lấy đúng tên biến có chữ 's'
    const {
      name,
      slug,
      price,
      sku,
      description,
      isNew,
      category_ids,
      room_ids,
      image,
      images,
      colors,
      dimensions,
      materials,
    } = req.body;

    const query = `
  UPDATE products SET 
    name=?, slug=?, price=?, sku=?, description=?, isNew=?, category_ids=?, room_ids=?, 
    image=?, images=?, colors=?, dimensions=?, materials=?
  WHERE id=?
`;

    // Bọc bằng JSON.stringify()
    const values = [
      name,
      slug,
      price,
      sku,
      description,
      isNew ? 1 : 0,
      JSON.stringify(category_ids || []), // Thêm dòng này
      JSON.stringify(room_ids || []), // Thêm dòng này
      image,
      JSON.stringify(images || []),
      JSON.stringify(colors || []),
      JSON.stringify(dimensions || {}),
      JSON.stringify(materials || []),
      req.params.id,
    ];

    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm để cập nhật" });
    }

    res.json({ message: "Cập nhật sản phẩm thành công!" });
  } catch (error) {
    console.error("Lỗi cập nhật sản phẩm:", error);
    res.status(500).json({ message: "Lỗi Server" });
  }
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
