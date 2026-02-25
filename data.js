const PRODUCTS = [
  // --- PHÒNG KHÁCH (LIVING ROOM) ---
  {
    id: 1,
    name: "Sofa Da Bò Ý 3 Chỗ",
    slug: "sofa-da-bo-y",
    category: "Sofa",
    room: "living",
    price: 45000000,
    isNew: true,
    sku: "SF-IT-01",
    description: "Sofa da bò Ý tự nhiên mang đến vẻ đẹp sang trọng và cảm giác êm ái tuyệt vời. Khung gỗ sồi chắc chắn, đệm mút lông vũ cao cấp chống xẹp lún.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=2070",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=2070",
      "https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?auto=format&fit=crop&q=80&w=2009",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=2070"
    ],
    colors: [
      { name: "Nâu da bò", value: "#8B4513" },
      { name: "Đen tuyền", value: "#1a1a1a" }
    ],
    dimensions: { length: "220 cm", width: "90 cm", height: "85 cm" },
    materials: ["Da bò Ý thật", "Khung gỗ sồi", "Chân thép"]
  },
  {
    id: 2,
    name: "Sofa Góc Vải Nỉ Hiện Đại",
    slug: "sofa-goc-vai-ni",
    category: "Sofa",
    room: "living",
    price: 18500000,
    isNew: false,
    sku: "SF-CN-02",
    description: "Thiết kế góc L tối ưu không gian, chất liệu vải nỉ nhập khẩu Hàn Quốc thoáng mát, dễ dàng vệ sinh.",
    image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&q=80&w=2070",
    images: [
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&q=80&w=2070",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=2070"
    ],
    colors: [
      { name: "Xám ghi", value: "#808080" },
      { name: "Xanh Navy", value: "#000080" }
    ],
    dimensions: { length: "260 cm", width: "160 cm", height: "80 cm" },
    materials: ["Vải nỉ cao cấp", "Khung gỗ thông", "Đệm mút D40"]
  },
  {
    id: 3,
    name: "Bàn Trà Mặt Đá Marble",
    slug: "ban-tra-mat-da",
    category: "Bàn",
    room: "living",
    price: 6500000,
    isNew: true,
    sku: "BT-MB-03",
    description: "Bàn trà tròn đôi với mặt đá Marble vân mây tự nhiên, chân sắt sơn tĩnh điện vàng đồng sang trọng.",
    image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=1888",
    images: [
      "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=1888",
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=1992"
    ],
    colors: [
      { name: "Trắng vân mây", value: "#FFFFFF" },
      { name: "Đen tia chớp", value: "#000000" }
    ],
    dimensions: { length: "80 cm", width: "80 cm", height: "45 cm" },
    materials: ["Đá Marble", "Sắt sơn tĩnh điện"]
  },
  {
    id: 4,
    name: "Kệ Tivi Gỗ Sồi Nhật",
    slug: "ke-tivi-go-soi",
    category: "Tủ & Kệ",
    room: "living",
    price: 8900000,
    isNew: false,
    sku: "TV-JP-04",
    description: "Kệ Tivi phong cách Japandi tối giản, nhiều ngăn chứa đồ tiện lợi, gỗ sồi tự nhiên được xử lý chống mối mọt.",
    image: "https://images.unsplash.com/photo-1601760562234-9814eea66632?auto=format&fit=crop&q=80&w=1974",
    images: [
      "https://images.unsplash.com/photo-1601760562234-9814eea66632?auto=format&fit=crop&q=80&w=1974",
      "https://images.unsplash.com/photo-1484154218962-a1c002085d2f?auto=format&fit=crop&q=80&w=1974"
    ],
    colors: [
      { name: "Màu gỗ tự nhiên", value: "#D2B48C" },
      { name: "Màu óc chó", value: "#5D4037" }
    ],
    dimensions: { length: "180 cm", width: "40 cm", height: "55 cm" },
    materials: ["Gỗ sồi Nga", "Tay nắm đồng"]
  },
  {
    id: 5,
    name: "Ghế Thư Giãn Armchair",
    slug: "ghe-thu-gian",
    category: "Ghế",
    room: "living",
    price: 4500000,
    isNew: false,
    sku: "AC-05",
    description: "Ghế thư giãn đọc sách với lưng tựa cao, kèm đôn gác chân, bọc vải nhung êm ái.",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd94611?auto=format&fit=crop&q=80&w=1974",
    images: [
       "https://images.unsplash.com/photo-1567538096630-e0c55bd94611?auto=format&fit=crop&q=80&w=1974",
       "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&q=80&w=1932"
    ],
    colors: [
      { name: "Xám tiêu", value: "#808080" },
      { name: "Vàng Mustard", value: "#E1AD01" }
    ],
    dimensions: { length: "80 cm", width: "75 cm", height: "95 cm" },
    materials: ["Vải nhung", "Chân gỗ sồi"]
  },

  // --- PHÒNG ĂN (DINING ROOM) ---
  {
    id: 6,
    name: "Bộ Bàn Ăn Gỗ Óc Chó 6 Ghế",
    slug: "bo-ban-an-go-oc-cho",
    category: "Bàn",
    room: "dining",
    price: 28900000,
    isNew: true,
    sku: "DT-WALNUT-06",
    description: "Tuyệt phẩm bàn ăn từ gỗ óc chó Bắc Mỹ, vân gỗ cuộn xoáy đẹp mắt, ghế bọc da Microfiber cao cấp.",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=1932",
    images: [
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=1932",
      "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&q=80&w=1935"
    ],
    colors: [
      { name: "Nâu trầm", value: "#4A3728" }
    ],
    dimensions: { length: "180 cm", width: "90 cm", height: "75 cm" },
    materials: ["Gỗ óc chó", "Da Microfiber"]
  },
  {
    id: 7,
    name: "Ghế Ăn Wishbone",
    slug: "ghe-an-wishbone",
    category: "Ghế",
    room: "dining",
    price: 2500000,
    isNew: false,
    sku: "CH-WB-07",
    description: "Chiếc ghế kinh điển của Hans Wegner, khung gỗ Tần bì uốn cong, mặt ngồi đan dây cói thủ công.",
    image: "https://images.unsplash.com/photo-1595515106967-1437503b326d?auto=format&fit=crop&q=80&w=1780",
    images: [
      "https://images.unsplash.com/photo-1595515106967-1437503b326d?auto=format&fit=crop&q=80&w=1780"
    ],
    colors: [
      { name: "Gỗ tự nhiên", value: "#DEB887" },
      { name: "Đen", value: "#000000" }
    ],
    dimensions: { length: "55 cm", width: "51 cm", height: "76 cm" },
    materials: ["Gỗ Tần bì", "Dây cói"]
  },

  // --- PHÒNG NGỦ (BEDROOM) ---
  {
    id: 8,
    name: "Giường Ngủ Bọc Nỉ Đầu Giường",
    slug: "giuong-ngu-boc-ni",
    category: "Giường ngủ",
    room: "bedroom",
    price: 15500000,
    isNew: true,
    sku: "BD-NI-08",
    description: "Giường ngủ phong cách Châu Âu, đầu giường bọc nỉ êm ái, nan cong chịu lực tốt.",
    image: "https://images.unsplash.com/photo-1505693416388-b0346ef414b9?auto=format&fit=crop&q=80&w=2070",
    images: [
        "https://images.unsplash.com/photo-1505693416388-b0346ef414b9?auto=format&fit=crop&q=80&w=2070",
        "https://images.unsplash.com/photo-1522771753035-4a5042305a63?auto=format&fit=crop&q=80&w=1920"
    ],
    colors: [
      { name: "Xám nhạt", value: "#D3D3D3" },
      { name: "Be", value: "#F5F5DC" }
    ],
    dimensions: { length: "200 cm", width: "180 cm", height: "35 cm" },
    materials: ["Gỗ công nghiệp MDF", "Vải nỉ"]
  },
  {
    id: 9,
    name: "Tủ Quần Áo Cánh Kính",
    slug: "tu-quan-ao-canh-kinh",
    category: "Tủ & Kệ",
    room: "bedroom",
    price: 22000000,
    isNew: true,
    sku: "WD-GL-09",
    description: "Tủ áo cánh kính cường lực khung nhôm, tích hợp đèn LED cảm biến bên trong cực sang trọng.",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=1974",
    images: [
       "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=1974"
    ],
    colors: [
      { name: "Kính đen khói", value: "#36454F" }
    ],
    dimensions: { length: "240 cm", width: "60 cm", height: "220 cm" },
    materials: ["Kính cường lực", "Khung nhôm"]
  },
  {
    id: 10,
    name: "Bàn Trang Điểm Treo Tường",
    slug: "ban-trang-diem",
    category: "Bàn",
    room: "bedroom",
    price: 3500000,
    isNew: false,
    sku: "MU-WALL-10",
    description: "Bàn phấn thiết kế treo tường nhỏ gọn, gương đèn LED cảm ứng, phù hợp phòng ngủ nhỏ.",
    image: "https://images.unsplash.com/photo-1616594039964-40891f913d56?auto=format&fit=crop&q=80&w=1980",
    images: [
        "https://images.unsplash.com/photo-1616594039964-40891f913d56?auto=format&fit=crop&q=80&w=1980"
    ],
    colors: [
      { name: "Trắng", value: "#FFFFFF" }
    ],
    dimensions: { length: "80 cm", width: "40 cm", height: "15 cm" },
    materials: ["Gỗ MDF chống ẩm", "Gương Bỉ"]
  },

  // --- TRANG TRÍ & LÀM VIỆC ---
  {
    id: 11,
    name: "Đèn Thả Trần Nordic",
    slug: "den-tha-tran",
    category: "Đèn & Trang trí",
    room: "living",
    price: 1800000,
    isNew: false,
    sku: "LT-ND-11",
    description: "Đèn thả trần phong cách Bắc Âu, chao đèn thủy tinh khói, ánh sáng vàng ấm áp.",
    image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80&w=1935",
    images: [
       "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80&w=1935"
    ],
    colors: [
      { name: "Thủy tinh khói", value: "#708090" }
    ],
    dimensions: { length: "30 cm", width: "30 cm", height: "120 cm" },
    materials: ["Thủy tinh", "Đui đồng"]
  },
  {
    id: 12,
    name: "Bàn Làm Việc Minimalist",
    slug: "ban-lam-viec",
    category: "Bàn",
    room: "office",
    price: 4200000,
    isNew: true,
    sku: "DK-MINI-12",
    description: "Bàn làm việc chân chữ Z độc đáo, mặt bàn gỗ cao su ghép thanh bền bỉ.",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=1936",
    images: [
        "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=1936"
    ],
    colors: [
      { name: "Gỗ tự nhiên", value: "#DEB887" },
      { name: "Nâu cafe", value: "#4B3621" }
    ],
    dimensions: { length: "120 cm", width: "60 cm", height: "75 cm" },
    materials: ["Gỗ cao su", "Sắt sơn tĩnh điện"]
  }
];

module.exports = PRODUCTS;