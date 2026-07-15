CREATE TABLE public.speaking_topic (
  id       text    PRIMARY KEY,
  emoji    text    NOT NULL,
  title    text    NOT NULL,
  position integer NOT NULL
);

CREATE TABLE public.speaking_sentence (
  id       text    PRIMARY KEY,
  topic_id text    NOT NULL REFERENCES public.speaking_topic(id) ON DELETE CASCADE,
  text     text    NOT NULL,
  position integer NOT NULL
);

GRANT SELECT ON public.speaking_topic, public.speaking_sentence TO anon, authenticated;
GRANT ALL    ON public.speaking_topic, public.speaking_sentence TO service_role;

ALTER TABLE public.speaking_topic ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.speaking_sentence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read speaking_topic" ON public.speaking_topic FOR SELECT USING (true);
CREATE POLICY "Public read speaking_sentence" ON public.speaking_sentence FOR SELECT USING (true);

-- Seed: curated speaking-practice topics for kids aged 5-12, migrated 1:1 from
-- the formerly-hardcoded src/data/speaking-topics.ts (SPEAKING_TOPICS).

INSERT INTO public.speaking_topic (id, emoji, title, position) VALUES
  ('noi-chao-hoi',    '👋',  'Chào hỏi & Giới thiệu',   0),
  ('noi-am-thuc',     '🍜',  'Ẩm thực & Món ăn',        1),
  ('noi-con-vat',     '🐶',  'Con vật quanh em',        2),
  ('noi-mau-sac',     '🎨',  'Màu sắc & Hình dạng',     3),
  ('noi-so-dem',      '🔢',  'Số đếm & Thời gian',      4),
  ('noi-thoi-tiet',   '🌦️', 'Thời tiết & Bốn mùa',     5),
  ('noi-co-the',      '🧑‍⚕️', 'Cơ thể & Sức khỏe',      6),
  ('noi-quan-ao',     '👕',  'Quần áo của em',          7),
  ('noi-cam-xuc',     '😊',  'Cảm xúc của em',          8),
  ('noi-le-tet',      '🧧',  'Lễ Tết & Ngày vui',       9),
  ('noi-ngoi-nha',    '🏠',  'Ngôi nhà của em',         10),
  ('noi-di-cho',      '🛒',  'Đi chợ & Mua sắm',        11),
  ('noi-phuong-tien', '🚌',  'Phương tiện đi lại',      12),
  ('noi-the-thao',    '⚽',  'Thể thao & Trò chơi',     13),
  ('noi-am-nhac',     '🎵',  'Âm nhạc & Sở thích',      14),
  ('noi-du-lich',     '🌊',  'Du lịch & Biển đảo',      15);

INSERT INTO public.speaking_sentence (id, topic_id, text, position) VALUES
  ('noi-chao-hoi#0', 'noi-chao-hoi', 'Xin chào các bạn!', 0),
  ('noi-chao-hoi#1', 'noi-chao-hoi', 'Em tên là Minh.', 1),
  ('noi-chao-hoi#2', 'noi-chao-hoi', 'Em năm nay bảy tuổi.', 2),
  ('noi-chao-hoi#3', 'noi-chao-hoi', 'Rất vui được gặp bạn.', 3),
  ('noi-chao-hoi#4', 'noi-chao-hoi', 'Bạn tên là gì?', 4),
  ('noi-chao-hoi#5', 'noi-chao-hoi', 'Bạn có khỏe không?', 5),
  ('noi-chao-hoi#6', 'noi-chao-hoi', 'Em khỏe, cảm ơn bạn.', 6),
  ('noi-chao-hoi#7', 'noi-chao-hoi', 'Chào tạm biệt, hẹn gặp lại!', 7),
  ('noi-chao-hoi#8', 'noi-chao-hoi', 'Chúc bạn một ngày vui vẻ.', 8),

  ('noi-am-thuc#0', 'noi-am-thuc', 'Em thích ăn phở bò.', 0),
  ('noi-am-thuc#1', 'noi-am-thuc', 'Bánh mì Việt Nam rất ngon.', 1),
  ('noi-am-thuc#2', 'noi-am-thuc', 'Mẹ nấu cơm rất ngon.', 2),
  ('noi-am-thuc#3', 'noi-am-thuc', 'Em uống nước cam mỗi sáng.', 3),
  ('noi-am-thuc#4', 'noi-am-thuc', 'Bữa tối nhà em có cá kho.', 4),
  ('noi-am-thuc#5', 'noi-am-thuc', 'Em thích ăn chè đậu xanh.', 5),
  ('noi-am-thuc#6', 'noi-am-thuc', 'Quả xoài này ngọt quá!', 6),
  ('noi-am-thuc#7', 'noi-am-thuc', 'Em mời cả nhà ăn cơm.', 7),
  ('noi-am-thuc#8', 'noi-am-thuc', 'Ăn nhiều rau rất tốt.', 8),

  ('noi-con-vat#0', 'noi-con-vat', 'Con mèo nhà em màu trắng.', 0),
  ('noi-con-vat#1', 'noi-con-vat', 'Chú chó con rất đáng yêu.', 1),
  ('noi-con-vat#2', 'noi-con-vat', 'Con gà trống gáy ò ó o.', 2),
  ('noi-con-vat#3', 'noi-con-vat', 'Đàn cá bơi trong hồ.', 3),
  ('noi-con-vat#4', 'noi-con-vat', 'Con voi có cái vòi dài.', 4),
  ('noi-con-vat#5', 'noi-con-vat', 'Chim én bay trên bầu trời.', 5),
  ('noi-con-vat#6', 'noi-con-vat', 'Con trâu giúp bác nông dân.', 6),
  ('noi-con-vat#7', 'noi-con-vat', 'Em thích xem đàn bướm bay.', 7),
  ('noi-con-vat#8', 'noi-con-vat', 'Con thỏ thích ăn cà rốt.', 8),

  ('noi-mau-sac#0', 'noi-mau-sac', 'Quả táo màu đỏ.', 0),
  ('noi-mau-sac#1', 'noi-mau-sac', 'Bầu trời màu xanh.', 1),
  ('noi-mau-sac#2', 'noi-mau-sac', 'Bông hoa màu vàng.', 2),
  ('noi-mau-sac#3', 'noi-mau-sac', 'Chiếc lá có màu xanh lá.', 3),
  ('noi-mau-sac#4', 'noi-mau-sac', 'Ông mặt trời hình tròn.', 4),
  ('noi-mau-sac#5', 'noi-mau-sac', 'Quyển vở hình chữ nhật.', 5),
  ('noi-mau-sac#6', 'noi-mau-sac', 'Em thích nhất màu hồng.', 6),
  ('noi-mau-sac#7', 'noi-mau-sac', 'Cầu vồng có bảy màu.', 7),
  ('noi-mau-sac#8', 'noi-mau-sac', 'Viên gạch hình vuông.', 8),

  ('noi-so-dem#0', 'noi-so-dem', 'Một, hai, ba, bốn, năm.', 0),
  ('noi-so-dem#1', 'noi-so-dem', 'Em có hai bàn tay.', 1),
  ('noi-so-dem#2', 'noi-so-dem', 'Nhà em có bốn người.', 2),
  ('noi-so-dem#3', 'noi-so-dem', 'Bây giờ là tám giờ sáng.', 3),
  ('noi-so-dem#4', 'noi-so-dem', 'Một tuần có bảy ngày.', 4),
  ('noi-so-dem#5', 'noi-so-dem', 'Hôm nay là thứ hai.', 5),
  ('noi-so-dem#6', 'noi-so-dem', 'Em đi ngủ lúc chín giờ.', 6),
  ('noi-so-dem#7', 'noi-so-dem', 'Một năm có mười hai tháng.', 7),
  ('noi-so-dem#8', 'noi-so-dem', 'Em học bài lúc bảy giờ tối.', 8),

  ('noi-thoi-tiet#0', 'noi-thoi-tiet', 'Hôm nay trời nắng đẹp.', 0),
  ('noi-thoi-tiet#1', 'noi-thoi-tiet', 'Ngoài trời đang mưa to.', 1),
  ('noi-thoi-tiet#2', 'noi-thoi-tiet', 'Mùa hè trời rất nóng.', 2),
  ('noi-thoi-tiet#3', 'noi-thoi-tiet', 'Mùa đông trời lạnh lắm.', 3),
  ('noi-thoi-tiet#4', 'noi-thoi-tiet', 'Gió thổi mát quá!', 4),
  ('noi-thoi-tiet#5', 'noi-thoi-tiet', 'Mùa xuân hoa nở khắp nơi.', 5),
  ('noi-thoi-tiet#6', 'noi-thoi-tiet', 'Mùa thu lá vàng rơi.', 6),
  ('noi-thoi-tiet#7', 'noi-thoi-tiet', 'Em mang ô khi trời mưa.', 7),
  ('noi-thoi-tiet#8', 'noi-thoi-tiet', 'Sau cơn mưa có cầu vồng.', 8),

  ('noi-co-the#0', 'noi-co-the', 'Em có hai mắt để nhìn.', 0),
  ('noi-co-the#1', 'noi-co-the', 'Em đánh răng mỗi sáng.', 1),
  ('noi-co-the#2', 'noi-co-the', 'Em rửa tay trước khi ăn.', 2),
  ('noi-co-the#3', 'noi-co-the', 'Em tập thể dục mỗi ngày.', 3),
  ('noi-co-the#4', 'noi-co-the', 'Đôi chân giúp em chạy nhảy.', 4),
  ('noi-co-the#5', 'noi-co-the', 'Em ngủ sớm để khỏe mạnh.', 5),
  ('noi-co-the#6', 'noi-co-the', 'Khi ốm em đi khám bác sĩ.', 6),
  ('noi-co-the#7', 'noi-co-the', 'Em uống đủ nước mỗi ngày.', 7),
  ('noi-co-the#8', 'noi-co-the', 'Nụ cười giúp em xinh hơn.', 8),

  ('noi-quan-ao#0', 'noi-quan-ao', 'Em mặc áo mới ngày Tết.', 0),
  ('noi-quan-ao#1', 'noi-quan-ao', 'Chiếc áo dài rất đẹp.', 1),
  ('noi-quan-ao#2', 'noi-quan-ao', 'Mùa đông em mặc áo ấm.', 2),
  ('noi-quan-ao#3', 'noi-quan-ao', 'Em đội mũ khi ra nắng.', 3),
  ('noi-quan-ao#4', 'noi-quan-ao', 'Đôi giày của em màu trắng.', 4),
  ('noi-quan-ao#5', 'noi-quan-ao', 'Mẹ mua cho em chiếc váy hồng.', 5),
  ('noi-quan-ao#6', 'noi-quan-ao', 'Em tự gấp quần áo.', 6),
  ('noi-quan-ao#7', 'noi-quan-ao', 'Chiếc khăn này ấm quá!', 7),
  ('noi-quan-ao#8', 'noi-quan-ao', 'Em đi dép ở trong nhà.', 8),

  ('noi-cam-xuc#0', 'noi-cam-xuc', 'Hôm nay em rất vui.', 0),
  ('noi-cam-xuc#1', 'noi-cam-xuc', 'Em yêu bố mẹ nhiều lắm.', 1),
  ('noi-cam-xuc#2', 'noi-cam-xuc', 'Em buồn khi trời mưa.', 2),
  ('noi-cam-xuc#3', 'noi-cam-xuc', 'Bạn ấy làm em cười.', 3),
  ('noi-cam-xuc#4', 'noi-cam-xuc', 'Em hồi hộp trước giờ thi.', 4),
  ('noi-cam-xuc#5', 'noi-cam-xuc', 'Em tự hào là người Việt Nam.', 5),
  ('noi-cam-xuc#6', 'noi-cam-xuc', 'Cảm ơn bạn đã giúp em.', 6),
  ('noi-cam-xuc#7', 'noi-cam-xuc', 'Em xin lỗi vì đến muộn.', 7),
  ('noi-cam-xuc#8', 'noi-cam-xuc', 'Em nhớ ông bà ở quê.', 8),

  ('noi-le-tet#0', 'noi-le-tet', 'Tết đến em được lì xì.', 0),
  ('noi-le-tet#1', 'noi-le-tet', 'Nhà em gói bánh chưng.', 1),
  ('noi-le-tet#2', 'noi-le-tet', 'Hoa đào nở vào mùa xuân.', 2),
  ('noi-le-tet#3', 'noi-le-tet', 'Em chúc ông bà mạnh khỏe.', 3),
  ('noi-le-tet#4', 'noi-le-tet', 'Trung thu em rước đèn ông sao.', 4),
  ('noi-le-tet#5', 'noi-le-tet', 'Cả nhà cùng đón giao thừa.', 5),
  ('noi-le-tet#6', 'noi-le-tet', 'Em múa lân cùng các bạn.', 6),
  ('noi-le-tet#7', 'noi-le-tet', 'Ngày Tết em mặc áo dài.', 7),
  ('noi-le-tet#8', 'noi-le-tet', 'Em thích ăn mứt Tết.', 8),

  ('noi-ngoi-nha#0', 'noi-ngoi-nha', 'Nhà em có ba phòng.', 0),
  ('noi-ngoi-nha#1', 'noi-ngoi-nha', 'Phòng của em rất gọn gàng.', 1),
  ('noi-ngoi-nha#2', 'noi-ngoi-nha', 'Em giúp mẹ quét nhà.', 2),
  ('noi-ngoi-nha#3', 'noi-ngoi-nha', 'Vườn nhà em trồng nhiều hoa.', 3),
  ('noi-ngoi-nha#4', 'noi-ngoi-nha', 'Em học bài ở bàn học.', 4),
  ('noi-ngoi-nha#5', 'noi-ngoi-nha', 'Cả nhà ăn cơm ở phòng bếp.', 5),
  ('noi-ngoi-nha#6', 'noi-ngoi-nha', 'Em tưới cây mỗi buổi chiều.', 6),
  ('noi-ngoi-nha#7', 'noi-ngoi-nha', 'Cửa sổ phòng em nhìn ra vườn.', 7),
  ('noi-ngoi-nha#8', 'noi-ngoi-nha', 'Em thích đọc sách trên ghế.', 8),

  ('noi-di-cho#0', 'noi-di-cho', 'Em đi chợ cùng mẹ.', 0),
  ('noi-di-cho#1', 'noi-di-cho', 'Chợ quê bán nhiều rau tươi.', 1),
  ('noi-di-cho#2', 'noi-di-cho', 'Cô ơi, quả này bao nhiêu tiền?', 2),
  ('noi-di-cho#3', 'noi-di-cho', 'Mẹ mua cho em que kem.', 3),
  ('noi-di-cho#4', 'noi-di-cho', 'Em xách giỏ giúp mẹ.', 4),
  ('noi-di-cho#5', 'noi-di-cho', 'Siêu thị có nhiều đồ chơi.', 5),
  ('noi-di-cho#6', 'noi-di-cho', 'Em chọn một quyển truyện.', 6),
  ('noi-di-cho#7', 'noi-di-cho', 'Cảm ơn cô, cháu xin ạ.', 7),
  ('noi-di-cho#8', 'noi-di-cho', 'Đi chợ Tết vui thật là vui.', 8),

  ('noi-phuong-tien#0', 'noi-phuong-tien', 'Em đi học bằng xe đạp.', 0),
  ('noi-phuong-tien#1', 'noi-phuong-tien', 'Bố lái ô tô đi làm.', 1),
  ('noi-phuong-tien#2', 'noi-phuong-tien', 'Chiếc thuyền trôi trên sông.', 2),
  ('noi-phuong-tien#3', 'noi-phuong-tien', 'Máy bay bay trên bầu trời.', 3),
  ('noi-phuong-tien#4', 'noi-phuong-tien', 'Em thích ngồi tàu hỏa.', 4),
  ('noi-phuong-tien#5', 'noi-phuong-tien', 'Xe buýt dừng ở bến.', 5),
  ('noi-phuong-tien#6', 'noi-phuong-tien', 'Em đội mũ bảo hiểm khi đi xe.', 6),
  ('noi-phuong-tien#7', 'noi-phuong-tien', 'Đèn đỏ dừng lại, đèn xanh đi.', 7),
  ('noi-phuong-tien#8', 'noi-phuong-tien', 'Em qua đường ở vạch trắng.', 8),

  ('noi-the-thao#0', 'noi-the-thao', 'Em thích đá bóng với bạn.', 0),
  ('noi-the-thao#1', 'noi-the-thao', 'Chúng em chơi nhảy dây.', 1),
  ('noi-the-thao#2', 'noi-the-thao', 'Em biết bơi từ năm ngoái.', 2),
  ('noi-the-thao#3', 'noi-the-thao', 'Cả lớp chơi kéo co.', 3),
  ('noi-the-thao#4', 'noi-the-thao', 'Em chạy rất nhanh.', 4),
  ('noi-the-thao#5', 'noi-the-thao', 'Bạn Nam đá cầu giỏi lắm.', 5),
  ('noi-the-thao#6', 'noi-the-thao', 'Em chơi trốn tìm cùng em gái.', 6),
  ('noi-the-thao#7', 'noi-the-thao', 'Mỗi sáng em tập thể dục.', 7),
  ('noi-the-thao#8', 'noi-the-thao', 'Đội của em đã thắng.', 8),

  ('noi-am-nhac#0', 'noi-am-nhac', 'Em thích hát cùng các bạn.', 0),
  ('noi-am-nhac#1', 'noi-am-nhac', 'Em đang học đàn piano.', 1),
  ('noi-am-nhac#2', 'noi-am-nhac', 'Em thích vẽ tranh phong cảnh.', 2),
  ('noi-am-nhac#3', 'noi-am-nhac', 'Bài hát này hay quá!', 3),
  ('noi-am-nhac#4', 'noi-am-nhac', 'Em đọc truyện trước khi ngủ.', 4),
  ('noi-am-nhac#5', 'noi-am-nhac', 'Em thích chơi xếp hình.', 5),
  ('noi-am-nhac#6', 'noi-am-nhac', 'Cả nhà cùng hát karaoke.', 6),
  ('noi-am-nhac#7', 'noi-am-nhac', 'Em nhảy theo điệu nhạc.', 7),
  ('noi-am-nhac#8', 'noi-am-nhac', 'Sở thích của em là chụp ảnh.', 8),

  ('noi-du-lich#0', 'noi-du-lich', 'Hè này nhà em đi biển.', 0),
  ('noi-du-lich#1', 'noi-du-lich', 'Vịnh Hạ Long đẹp tuyệt vời.', 1),
  ('noi-du-lich#2', 'noi-du-lich', 'Em xây lâu đài cát.', 2),
  ('noi-du-lich#3', 'noi-du-lich', 'Nước biển xanh và mát.', 3),
  ('noi-du-lich#4', 'noi-du-lich', 'Em được đi Đà Lạt.', 4),
  ('noi-du-lich#5', 'noi-du-lich', 'Hà Nội có Hồ Gươm.', 5),
  ('noi-du-lich#6', 'noi-du-lich', 'Em chụp ảnh cùng gia đình.', 6),
  ('noi-du-lich#7', 'noi-du-lich', 'Chuyến đi thật là vui.', 7),
  ('noi-du-lich#8', 'noi-du-lich', 'Em muốn thăm Sài Gòn.', 8);
