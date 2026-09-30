export const EVENT_TYPES = [
  { id:'workshop', icon:'🧠', name:'Workshop 50 người', days:10, budget:7000000, target:50, difficulty:'Dễ', desc:'Nhỏ nhưng phải chỉn chu. Phù hợp để học nghề chạy show.', venue:'Phòng workshop', baseReach:20 },
  { id:'conference', icon:'🎤', name:'Hội thảo 200 người', days:14, budget:22000000, target:200, difficulty:'Vừa', desc:'Diễn giả, check-in, truyền thông và đối tác bắt đầu căng.', venue:'Hội trường', baseReach:28 },
  { id:'volunteer', icon:'🤝', name:'Ngày hội tình nguyện', days:12, budget:15000000, target:150, difficulty:'Vừa', desc:'Tối ưu nguồn lực, trải nghiệm người tham gia và điều phối TNV.', venue:'Sân trường', baseReach:25 },
  { id:'sports', icon:'🏆', name:'Hội thao 400 người', days:18, budget:38000000, target:400, difficulty:'Khó', desc:'Lịch thi đấu, y tế, hậu cần và thời tiết có thể phá game.', venue:'Khu thể thao', baseReach:32 },
  { id:'festival', icon:'🎪', name:'Festival 1.000 người', days:24, budget:95000000, target:1000, difficulty:'Ác mộng', desc:'Nhiều sân khấu, nhà tài trợ, nhà cung cấp và một tỷ thứ có thể nổ.', venue:'Quảng trường', baseReach:38 }
]

const names = ['An','Bảo','Chi','Duy','Giang','Hà','Hải','Hân','Huy','Khánh','Lâm','Linh','Mai','Minh','My','Nam','Ngân','Nhi','Phúc','Quân','Thảo','Trang','Trí','Vy','Yến']
const roles = ['Truyền thông','Đối ngoại','Nội dung','Hậu cần','Kỹ thuật']
const quirks = [
  'Deadline càng gần càng chạy nhanh','Rất bình tĩnh khi có sự cố','Hay quên check tin nhắn','Nói chuyện với đối tác cực khéo','Thiết kế nhanh nhưng hơi cầu toàn',
  'Có network nhà cung cấp tốt','Giỏi Excel và timeline','Năng lượng cao nhưng dễ quá tải','Luôn đến sớm 20 phút','Có khả năng cứu deadline',
  'Ghét họp dài','Viết nội dung rất nhanh','Check-list cực kỹ','Khá nhạy với drama','Giỏi xử lý khách khó tính',
  'Biết âm thanh ánh sáng','Có kinh nghiệm check-in','Khéo thương lượng giá','Giỏi điều phối TNV','Rất mạnh social media',
  'Có mắt thẩm mỹ','Hay phát hiện lỗi nhỏ','Làm việc độc lập tốt','Phản ứng nhanh tại hiện trường','Đa nhiệm nhưng cần nghỉ đúng lúc'
]
export const NPCS = names.map((name,i)=>({
  id:`npc-${i+1}`, name, role:roles[i%roles.length], skill:58+((i*13)%39), reliability:52+((i*17)%47), energy:62+((i*11)%37), cost:150000+((i%5)*50000), quirk:quirks[i]
}))

const vendorNames = ['Sao Mai Venue','Pixel Print','FlashLight AV','Mây Catering','Nhanh Tay Rental','Hello Check-in','Mộc Decor','24H Stage','Bếp Nhà Mình','Cánh Diều Media','Vạn Phúc Bus','BlueBox Booth','Tí Tách Coffee','Sunrise Security','CarePlus Medical','Mực In Nhanh','Happy Gift','Green Event','Tada Photo','OneMore LED']
const vendorTypes = ['Địa điểm','In ấn','Âm thanh','F&B','Thiết bị','Check-in','Trang trí','Sân khấu','F&B','Media','Vận chuyển','Booth','F&B','An ninh','Y tế','In ấn','Quà tặng','Trang trí','Media','Màn hình']
export const VENDORS = vendorNames.map((name,i)=>({
  id:`vendor-${i+1}`, name, type:vendorTypes[i], price:500000+((i*370000)%4200000), quality:55+((i*9)%44), reliability:50+((i*13)%49)
}))

const rawIncidents = [
['Poster sai ngày','media'],['Caption đăng nhầm giờ','media'],['Bài đăng bị flop','media'],['Fanpage bị giới hạn tương tác','media'],['Hashtag bị gõ sai','media'],['Video teaser lỗi âm thanh','media'],['KOL báo đăng trễ','media'],['Ảnh diễn giả bị nhầm','media'],['Link đăng ký bị hỏng','media'],['QR trên poster không quét được','media'],
['Nhà tài trợ xin giảm quyền lợi','partner'],['Nhà tài trợ muốn đổi vị trí logo','partner'],['Đối tác phản hồi chậm','partner'],['Nhà tài trợ rút 30% ngân sách','partner'],['Đối tác yêu cầu thêm booth','partner'],['Logo đối tác bị thiếu trên backdrop','partner'],['Nhà tài trợ muốn phát biểu thêm','partner'],['Đối tác đổi người liên hệ','partner'],['Hợp đồng cần sửa gấp','partner'],['Đối tác xin thêm 20 vé VIP','partner'],
['MC báo khàn giọng','people'],['Diễn giả đến trễ','people'],['Một TNV xin nghỉ','people'],['Trưởng hậu cần mất liên lạc','people'],['Hai thành viên cãi nhau','people'],['TNV check-in thiếu người','people'],['Kỹ thuật viên kẹt xe','people'],['Nhiếp ảnh gia báo bận','people'],['Diễn giả muốn đổi slide phút chót','people'],['Một thành viên quá tải','people'],
['Loa bị rè','tech'],['Micro không dây hết pin','tech'],['Máy chiếu không nhận HDMI','tech'],['Laptop trình chiếu cập nhật Windows','tech'],['Mất Wi-Fi','tech'],['Màn LED chớp','tech'],['Ổ điện quá tải','tech'],['Máy in thẻ kẹt giấy','tech'],['QR check-in tải chậm','tech'],['Mixer âm thanh mất preset','tech'],
['Backdrop giao sai kích thước','vendor'],['Catering thiếu 30 suất','vendor'],['Ghế giao thiếu','vendor'],['Xe vận chuyển đến trễ','vendor'],['Quà tặng in sai màu','vendor'],['Nhà in báo máy hỏng','vendor'],['Đơn vị sân khấu tăng giá','vendor'],['Photobooth giao nhầm mẫu','vendor'],['Nước uống thiếu','vendor'],['Bộ đàm giao thiếu pin','vendor'],
['Trời đổ mưa','weather'],['Nắng nóng bất thường','weather'],['Gió lớn làm rung backdrop','weather'],['Mưa khiến khách đến trễ','weather'],['Sân ngoài trời bị đọng nước','weather'],['Dự báo có giông','weather'],['Nhiệt độ tăng mạnh','weather'],['Mưa tạt vào khu check-in','weather'],['Gió làm đổ standee','weather'],['Thời tiết đổi sát giờ','weather'],
['Đăng ký vượt 120% sức chứa','guest'],['Khách đến sớm 45 phút','guest'],['Khách VIP không có tên','guest'],['Hàng check-in quá dài','guest'],['Khách phản ánh thiếu ghế','guest'],['Một nhóm đi nhầm cổng','guest'],['Khách làm mất vòng tay','guest'],['Người tham gia yêu cầu hoàn phí','guest'],['Khách phàn nàn điều hòa','guest'],['Có trẻ nhỏ đi cùng ngoài dự kiến','guest'],
['Ngân sách lệch 500.000đ','money'],['Một khoản chi chưa có hóa đơn','money'],['Giá thuê thiết bị tăng','money'],['Phát sinh phí vệ sinh','money'],['Cần mua gấp vật tư','money'],['Nhà cung cấp yêu cầu cọc thêm','money'],['Chi phí vận chuyển tăng','money'],['Phải in lại 100 tài liệu','money'],['Phí ngoài giờ phát sinh','money'],['Một khoản tài trợ chuyển chậm','money'],
['Timeline trễ 20 phút','time'],['Tổng duyệt kéo dài','time'],['Check-in mở muộn','time'],['Diễn giả nói quá giờ','time'],['Tiết mục chưa sẵn sàng','time'],['Chuyển sân khấu quá lâu','time'],['Khách chưa ổn định chỗ ngồi','time'],['BTC họp khẩn quá lâu','time'],['Xe đưa đón trễ lịch','time'],['Khâu setup chậm tiến độ','time'],
['Có bình luận tiêu cực','crisis'],['Ảnh hậu trường gây hiểu nhầm','crisis'],['Khách đăng story phàn nàn','crisis'],['Thông tin chương trình bị hiểu sai','crisis'],['Một bài đăng bị tố copy','crisis'],['Tin đồn sự kiện bị hủy','crisis'],['Khách quay clip sự cố kỹ thuật','crisis'],['Đối tác không hài lòng công khai','crisis'],['TNV trả lời khách thiếu lịch sự','crisis'],['Một thông báo nội bộ bị leak','crisis']
]

const effects = {
  media:[
    {label:'Sửa ngay và đăng đính chính',delta:{budget:-100000,reach:3,reputation:1,stress:4}},
    {label:'Im lặng, tiếp tục chạy ads',delta:{budget:-350000,reach:7,reputation:-4,stress:2}},
    {label:'Biến lỗi thành content vui',delta:{budget:0,reach:9,reputation:2,stress:5}}
  ],
  partner:[
    {label:'Gọi trực tiếp để thương lượng',delta:{budget:300000,reputation:2,partner:6,stress:5}},
    {label:'Chấp nhận yêu cầu để giữ quan hệ',delta:{budget:-700000,partner:9,reputation:1,stress:2}},
    {label:'Giữ đúng thỏa thuận ban đầu',delta:{budget:0,partner:-8,reputation:2,stress:4}}
  ],
  people:[
    {label:'Điều người dự phòng',delta:{budget:-200000,team:-2,stress:3,reputation:1}},
    {label:'Tự ôm việc',delta:{budget:0,team:-5,stress:10,reputation:0}},
    {label:'Thuê hỗ trợ gấp',delta:{budget:-650000,team:2,stress:-3,reputation:2}}
  ],
  tech:[
    {label:'Chuyển sang thiết bị dự phòng',delta:{budget:-250000,reputation:2,stress:4}},
    {label:'Gọi kỹ thuật xử lý tại chỗ',delta:{budget:-500000,reputation:1,stress:2}},
    {label:'Tiếp tục chương trình không dùng nó',delta:{budget:0,reputation:-6,stress:5}}
  ],
  vendor:[
    {label:'Ép nhà cung cấp khắc phục ngay',delta:{budget:-150000,partner:-2,reputation:2,stress:5}},
    {label:'Mua/thuê bổ sung từ đơn vị khác',delta:{budget:-800000,reputation:3,stress:2}},
    {label:'Cắt bớt hạng mục',delta:{budget:100000,reputation:-5,stress:3}}
  ],
  weather:[
    {label:'Kích hoạt phương án B',delta:{budget:-900000,reputation:4,stress:4}},
    {label:'Mua vật tư che chắn',delta:{budget:-450000,reputation:1,stress:6}},
    {label:'Cầu trời và tiếp tục',delta:{budget:0,reputation:-8,stress:8}}
  ],
  guest:[
    {label:'Mở thêm quầy hỗ trợ',delta:{budget:-300000,guests:5,reputation:4,stress:4}},
    {label:'Ưu tiên xử lý theo nhóm',delta:{budget:-100000,guests:2,reputation:1,stress:3}},
    {label:'Giữ nguyên quy trình',delta:{budget:0,guests:-8,reputation:-5,stress:5}}
  ],
  money:[
    {label:'Dùng quỹ dự phòng',delta:{budget:-600000,reputation:1,stress:2}},
    {label:'Cắt một hạng mục ít quan trọng',delta:{budget:250000,reputation:-2,stress:3}},
    {label:'Thương lượng lại giá',delta:{budget:100000,partner:-2,stress:5}}
  ],
  time:[
    {label:'Rút ngắn một phần chương trình',delta:{budget:0,reputation:-1,stress:3}},
    {label:'Tăng người xử lý song song',delta:{budget:-350000,team:-1,reputation:2,stress:4}},
    {label:'Chấp nhận trễ timeline',delta:{budget:0,reputation:-6,stress:6}}
  ],
  crisis:[
    {label:'Phản hồi minh bạch ngay',delta:{budget:-100000,reach:3,reputation:4,stress:5}},
    {label:'Liên hệ riêng người phản ánh',delta:{budget:-150000,reputation:2,partner:1,stress:3}},
    {label:'Xóa/ẩn và không phản hồi',delta:{budget:0,reach:-2,reputation:-9,stress:7}}
  ]
}
export const INCIDENTS = rawIncidents.map(([title,category],i)=>({
  id:`incident-${i+1}`, title, category,
  body:`Ngày chạy show phát sinh: ${title.toLowerCase()}. Bạn có ít thời gian để quyết định trước khi tình hình lan rộng.`,
  choices:effects[category]
}))

export const ACHIEVEMENTS = [
  ['first-show','🎬','Show đầu đời','Hoàn thành ván đầu tiên'],['rich','💰','Tay hòm chìa khóa','Kết thúc với hơn 25% ngân sách'],
  ['beloved','💖','Khách mê','Uy tín đạt 90+'],['sold-out','🔥','Sold out','Đạt ít nhất 100% mục tiêu khách'],
  ['calm','🧊','Đầu lạnh','Kết thúc với stress dưới 35'],['viral','📱','Lên xu hướng','Độ phủ truyền thông đạt 90+'],
  ['team','🫶','Team không vỡ','Tinh thần đội ngũ đạt 85+'],['festival','🎪','Trùm festival','Hoàn thành Festival 1.000 người']
].map(([id,icon,name,desc])=>({id,icon,name,desc}))

export const TASKS = [
  {id:'venue',label:'Chốt địa điểm',icon:'📍',cost:900000,effects:{reputation:4,stress:-2}},
  {id:'recruit',label:'Tuyển thêm BTC',icon:'👥',cost:300000,effects:{team:8,stress:-4}},
  {id:'content',label:'Lên kế hoạch nội dung',icon:'📝',cost:150000,effects:{reputation:3,reach:2}},
  {id:'media',label:'Chạy truyền thông',icon:'📣',cost:450000,effects:{reach:12,guests:8}},
  {id:'sponsor',label:'Tìm tài trợ',icon:'🤝',cost:100000,effects:{budget:900000,partner:7,stress:3}},
  {id:'checkin',label:'Chuẩn bị check-in',icon:'🎟️',cost:350000,effects:{reputation:4,stress:-2}},
  {id:'tech',label:'Test kỹ thuật',icon:'🎛️',cost:500000,effects:{reputation:5,stress:-3}},
  {id:'rehearsal',label:'Tổng duyệt',icon:'🎭',cost:250000,effects:{team:4,reputation:4,stress:-2}},
  {id:'backup',label:'Chuẩn bị phương án B',icon:'🧯',cost:600000,effects:{reputation:6,stress:-5}},
  {id:'care',label:'Chăm sóc BTC',icon:'🍜',cost:250000,effects:{team:10,stress:-8}},
  {id:'ads',label:'Boost đăng ký',icon:'🚀',cost:750000,effects:{reach:16,guests:15}},
  {id:'vendor',label:'Rà soát nhà cung cấp',icon:'📦',cost:200000,effects:{partner:5,reputation:3}}
]
