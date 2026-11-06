import React, { useState, useEffect, useRef } from 'react';
import { 
  Download,
  Upload, 
  Share2, 
  Edit3, 
  Eye, 
  Plus, 
  Trash2, 
  Calendar as CalendarIcon, 
  Clock, 
  CreditCard, 
  BookOpen, 
  Compass, 
  Phone, 
  GraduationCap, 
  Check, 
  RefreshCw,
  Users,
  ChevronLeft,
  ChevronRight,
  Heart,
  Cloud,
  Stars,
  Sparkles
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { generateVietQRPayload } from './vietqr';
import LZString from 'lz-string';
import { CARD_BG } from './bgImage';
import { TITLE_BG } from './titleBgImage';
import { AVATAR_IMG } from './avatarImage';

// Cinnamoroll Cloud / Pastel Palette
// Primary pastel blues, soft cream/white, sky-blue accents, rounded bubbly borders

const SAMPLE_STUDENTS = [
  {
    id: "s1",
    studentName: "Khánh Hà",
    studentGrade: "Lớp 8",
    pricePerLesson: 200000,
    hoursPerLesson: 1.25,
    selectedDates: [
      "2026-09-05", "2026-09-06", "2026-09-12", "2026-09-13", 
      "2026-09-16", "2026-09-19", "2026-09-20", "2026-09-23", 
      "2026-09-26", "2026-09-27"
    ],
    reviews: [
      {
        subject: "Đại số",
        points: [
          "Cơ bản có ý thức làm BTVN, tinh thần học tốt.",
          "Hoàn thành chương trình đại số kì 1, thành thạo các dạng toán cơ bản đến vận dụng thấp, có khả năng học các dạng bài chuyên đề vận dụng."
        ]
      },
      {
        subject: "Hình học",
        points: [
          "Có tiến bộ trong tư duy hình học, hình thành được hệ thống kiến thức hình, biết cách áp dụng lý thuyết và các phương pháp chứng minh.",
          "Cơ bản làm được đến ý b hình. Tuy nhiên hay gặp lỗi trong trình bày, dễ bị lan man, trình bày chưa gãy gọn."
        ]
      }
    ],
    roadmaps: [
      { time: "Tháng 10", desc: "Hoàn thành chuyên đề phân thức đại số kì 2 và chuyên đề hình học kì 1" },
      { time: "Tháng 11", desc: "Hoàn thành chuyên đề hàm số bậc nhất kì 2 và ôn tập kì 1" },
      { time: "Tháng 12", desc: "Ôn tập các chuyên đề đại số, học chuyên đề tam giác đồng dạng kì 2" },
      { time: "Tháng 1/2027", desc: "Học chuyên đề xác suất, ôn tập chuyên đề hình học" },
      { time: "Tổng kết", desc: "Kết thúc chương trình lớp 8 trước tháng 3, sau đó ôn tập, học chuyên đề VD - VDC, ôn thi kì 2." }
    ],
    schedule: [
      { day: "Sáng Thứ 7", time: "7h30 - 9h00 (Hình)" },
      { day: "Sáng Chủ Nhật", time: "7h30 - 9h30 (Số)" }
    ]
  },
  {
    id: "s2",
    studentName: "Minh Triết",
    studentGrade: "Lớp 9 - Ôn thi vào 10",
    pricePerLesson: 250000,
    hoursPerLesson: 1.5,
    selectedDates: [
      "2026-09-02", "2026-09-05", "2026-09-09", "2026-09-12",
      "2026-09-16", "2026-09-19", "2026-09-23", "2026-09-26"
    ],
    reviews: [
      {
        subject: "Toán 9 & Luyện Đề",
        points: [
          "Nắm vững các dạng rút gọn biểu thức chứa căn và giải bài toán bằng cách lập hệ phương trình.",
          "Cần rèn thêm kỹ năng vẽ đường tròn phụ và chứng minh tứ giác nội tiếp nhanh."
        ]
      }
    ],
    roadmaps: [
      { time: "Tháng 10", desc: "Luyện đề khảo sát tháng 10 và hoàn thiện chuyên đề Parabol - Đường thẳng." },
      { time: "Tháng 11", desc: "Hệ thức Vi-ét và các bài toán phân loại điểm 9-10." }
    ],
    schedule: [
      { day: "Tối Thứ 3", time: "19h30 - 21h00" },
      { day: "Tối Thứ 7", time: "19h30 - 21h00" }
    ]
  }
];

const INITIAL_TEACHER = {
  teacherName: "GV. Mai Thị Linh Trang",
  teacherPhone: "0978783058",
  monthTitle: "HỌC PHÍ THÁNG 9/2026",
  bankName: "TECHCOMBANK",
  bankNumber: "0978783058",
  bankOwner: "MAI THI LINH TRANG",
  customQr: "",
  footerNote: "Phụ huynh vui lòng kiểm tra thông tin học phí. Em cảm ơn ạ!"
};

// Cinnamoroll Mascot SVG Illustration
function CinnamorollMascot({ className = "w-16 h-16" }) {
  return (
    <svg viewBox="0 0 200 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cloud/Ears left */}
      <path d="M50 45 C20 40, 5 60, 20 80 C32 95, 65 75, 75 55 Z" fill="#FFFFFF" stroke="#BAE6FD" strokeWidth="3" />
      {/* Cloud/Ears right */}
      <path d="M150 45 C180 40, 195 60, 180 80 C168 95, 135 75, 125 55 Z" fill="#FFFFFF" stroke="#BAE6FD" strokeWidth="3" />
      {/* Head */}
      <ellipse cx="100" cy="55" rx="55" ry="38" fill="#FFFFFF" stroke="#BAE6FD" strokeWidth="3.5" />
      {/* Blue Eyes */}
      <ellipse cx="80" cy="54" rx="4.5" ry="7" fill="#38BDF8" />
      <ellipse cx="120" cy="54" rx="4.5" ry="7" fill="#38BDF8" />
      <circle cx="82" cy="52" r="2" fill="#FFFFFF" />
      <circle cx="122" cy="52" r="2" fill="#FFFFFF" />
      {/* Rosy Cheeks */}
      <ellipse cx="70" cy="65" rx="7" ry="4" fill="#FBCFE8" />
      <ellipse cx="130" cy="65" rx="7" ry="4" fill="#FBCFE8" />
      {/* Cute Mouth */}
      <path d="M94 63 Q100 68 106 63" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
      {/* Blue Ribbon / Hat Accent */}
      <path d="M92 20 C95 14, 105 14, 108 20 C114 17, 118 25, 110 27 C100 29, 90 27, 92 20 Z" fill="#7DD3FC" />
    </svg>
  );
}

// Helper to format date YYYY-MM-DD to DD/MM
function formatShortDate(iso) {
  if (!iso) return "";
  const parts = iso.split('-');
  if (parts.length === 3) return `${parts[2]}/${parts[1]}`;
  return iso;
}

export default function App() {
  const [teacher, setTeacher] = useState(INITIAL_TEACHER);
  const [students, setStudents] = useState(SAMPLE_STUDENTS);
  const [activeStudentId, setActiveStudentId] = useState("s1");
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 8, 1)); // September 2026

  const cardRef = useRef(null);

  // Active student object
  const activeStudent = students.find(s => s.id === activeStudentId) || students[0];

  // Load from URL Hash (Parent view mode)
  useEffect(() => {
    try {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#data=')) {
        const encoded = hash.replace('#data=', '');
        const decompressed = LZString.decompressFromEncodedURIComponent(encoded);
        if (decompressed) {
          const parsed = JSON.parse(decompressed);
          if (parsed.teacher && parsed.student) {
            setTeacher(parsed.teacher);
            setStudents([parsed.student]);
            setActiveStudentId(parsed.student.id);
            setIsEditMode(false);
            return;
          }
        }
      }
    } catch (e) {
      console.error("Error reading data from URL hash", e);
    }
  }, []);

  // Update student helper
  const updateActiveStudent = (patch) => {
    setStudents(prev => prev.map(s => s.id === activeStudent.id ? { ...s, ...patch } : s));
  };

  // Add new student
  const handleAddNewStudent = () => {
    const newId = "s_" + Date.now();
    const newStudent = {
      id: newId,
      studentName: `Học sinh mới ${students.length + 1}`,
      studentGrade: "Lớp 8",
      pricePerLesson: 200000,
      hoursPerLesson: 1.5,
      selectedDates: [],
      reviews: [{ subject: "Toán", points: ["Ý thức học tập tốt, cần chăm chỉ làm bài tập."] }],
      roadmaps: [{ time: "Tháng tới", desc: "Ôn tập và bám sát kiến thức trên lớp." }],
      schedule: [{ day: "Thứ 7", time: "18h00 - 19h30" }]
    };
    setStudents(prev => [...prev, newStudent]);
    setActiveStudentId(newId);
  };

  // Delete current student
  const handleDeleteStudent = (id) => {
    if (students.length <= 1) {
      alert("Cần giữ ít nhất 1 học sinh.");
      return;
    }
    const filtered = students.filter(s => s.id !== id);
    setStudents(filtered);
    setActiveStudentId(filtered[0].id);
  };

  // Toggle calendar date
  const toggleDate = (dateStr) => {
    const dates = activeStudent.selectedDates || [];
    let updated;
    if (dates.includes(dateStr)) {
      updated = dates.filter(d => d !== dateStr);
    } else {
      updated = [...dates, dateStr].sort();
    }
    updateActiveStudent({ selectedDates: updated });
  };

  // Calculate stats
  const totalLessons = (activeStudent.selectedDates || []).length;
  const totalHours = (totalLessons * (activeStudent.hoursPerLesson || 1.25)).toFixed(1);
  const totalTuition = totalLessons * (activeStudent.pricePerLesson || 200000);
  const formattedTuition = new Intl.NumberFormat('vi-VN').format(totalTuition) + " đ";
  const formattedPricePerLesson = new Intl.NumberFormat('vi-VN').format(activeStudent.pricePerLesson || 200000) + " đ/buổi";

  // Xử lý upload ảnh QR tùy chỉnh (tự động resize và nén nhẹ để lưu trữ tiện lợi)
  const handleQrUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 350;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setTeacher(prev => ({ ...prev, customQr: compressedDataUrl }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Generate QR code locally as base64 data URL to avoid CORS / canvas taint issues
  useEffect(() => {
    const memo = `HOC PHI ${activeStudent.studentName.toUpperCase()}`;
    const payload = generateVietQRPayload({
      bankBin: '970407', // Techcombank
      accountNo: teacher.bankNumber,
      amount: totalTuition,
      memo: memo
    });

    QRCode.toDataURL(payload, {
      margin: 1,
      width: 280,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    }).then(url => {
      setQrDataUrl(url);
    }).catch(err => {
      console.error('Failed to generate local QR:', err);
    });
  }, [teacher.bankNumber, totalTuition, activeStudent.studentName]);


  // Share URL for the active student only
  const generateShareUrl = () => {
    try {
      const payload = {
        teacher,
        student: activeStudent
      };
      const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(payload));
      return `${window.location.origin}${window.location.pathname}#data=${compressed}`;
    } catch (e) {
      return window.location.href;
    }
  };

  const handleCopyLink = () => {
    const url = generateShareUrl();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportPdf = async () => {
    if (!cardRef.current) return;
    setIsExportingPdf(true);
    try {
      await new Promise(r => setTimeout(r, 200));
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: false,
        skipFonts: true,
        pixelRatio: 2,
        backgroundColor: '#F0F9FF'
      });

      if (dataUrl) {
        const img = new Image();
        img.src = dataUrl;
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        // Xuất PDF vừa khít 100% theo tỉ lệ và kích thước của Card (không bị bóp méo, không thừa lề)
        // Chiều rộng chuẩn 210mm (bằng khổ ngang A4), chiều cao tự động theo đúng tỉ lệ ảnh gốc
        const pdfWidth = 210;
        const pdfHeight = (img.height * pdfWidth) / img.width;

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: [pdfWidth, pdfHeight]
        });

        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
        pdf.save();
      }
    } catch (err) {
      console.error('Export PDF error:', err);
      alert('Lỗi xuất PDF: ' + (err?.message || String(err)));
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleExportPng = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      await new Promise(r => setTimeout(r, 200));

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: false,
        skipFonts: true,
        pixelRatio: 2,
        backgroundColor: '#F0F9FF'
      });

      if (dataUrl) {
        const link = document.createElement('a');
        link.download = `Phieu-Hoc-Phi-Cinnamoroll-${activeStudent.studentName.replace(/\s+/g, '_')}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error("Export PNG error:", err);
      alert("Lỗi xuất ảnh: " + (err?.message || String(err)));
    } finally {
      setIsExporting(false);
    }
  };

  // VietQR Code URL
  const getVietQrUrl = () => {
    const bankBin = "TCB"; // Techcombank
    const amount = totalTuition;
    const memo = encodeURIComponent(`HOC PHI ${activeStudent.studentName.toUpperCase()}`);
    return `https://img.vietqr.io/image/${bankBin}-${teacher.bankNumber}-compact2.png?amount=${amount}&addInfo=${memo}&accountName=${encodeURIComponent(teacher.bankOwner)}`;
  };

  // Calendar rendering helper
  const renderCalendar = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // 0 is Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Monday as first day adjustment: Sun (0) -> 6, Mon (1) -> 0
    const startOffset = (firstDay + 6) % 7;
    const days = [];
    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const monthStr = String(month + 1).padStart(2, '0');
      const dayStr = String(d).padStart(2, '0');
      days.push(`${year}-${monthStr}-${dayStr}`);
    }

    return (
      <div className="bg-sky-50/70 p-3 rounded-2xl border border-sky-100">
        <div className="flex items-center justify-between mb-2">
          <button 
            type="button"
            onClick={() => setCalendarMonth(new Date(year, month - 1, 1))}
            className="p-1 hover:bg-sky-200/50 rounded-lg text-sky-700"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-bold text-xs text-sky-800">
            Tháng {month + 1} / {year}
          </span>
          <button 
            type="button"
            onClick={() => setCalendarMonth(new Date(year, month + 1, 1))}
            className="p-1 hover:bg-sky-200/50 rounded-lg text-sky-700"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-sky-600 mb-1">
          <div>T2</div><div>T3</div><div>T4</div><div>T5</div><div>T6</div><div>T7</div><div>CN</div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((dateStr, idx) => {
            if (!dateStr) return <div key={idx} className="h-7" />;
            const isSelected = (activeStudent.selectedDates || []).includes(dateStr);
            const dayNum = parseInt(dateStr.split('-')[2], 10);
            return (
              <button
                key={dateStr}
                type="button"
                onClick={() => toggleDate(dateStr)}
                className={`h-7 w-full rounded-xl text-xs font-semibold flex items-center justify-center transition-all ${
                  isSelected 
                    ? 'bg-sky-400 text-white shadow-sm scale-105 font-bold' 
                    : 'bg-white hover:bg-sky-100/70 text-slate-700 border border-sky-100'
                }`}
              >
                {dayNum}
              </button>
            );
          })}
        </div>
        <div className="text-[11px] text-sky-700 mt-2 text-center font-medium">
          Đã chọn: <span className="font-bold text-sky-600">{(activeStudent.selectedDates || []).length} buổi</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-sky-50 to-blue-50 text-slate-800 flex flex-col items-center py-6 px-3 sm:px-6">
      
      {/* Top Navbar / Actions */}
      <header className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 mb-6 bg-white/90 backdrop-blur border-2 border-sky-200 p-3.5 sm:p-4 rounded-3xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-10 bg-white rounded-2xl border-2 border-sky-200 shadow-inner flex items-center justify-center overflow-hidden p-0.5 shrink-0">
            <img src={AVATAR_IMG} alt="Avatar" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg text-sky-900 tracking-tight">
                Cinnamoroll Tutor Report
              </h1>
              <span className="text-[10px] bg-sky-200/80 text-sky-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Heart className="w-3 h-3 text-pink-400 fill-pink-400" /> Sanrio Theme
              </span>
            </div>
            <p className="text-xs text-sky-600">Phiếu báo học tập & học phí cho nhiều học sinh</p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition shadow-sm ${
              isEditMode 
                ? 'bg-sky-500 text-white hover:bg-sky-600' 
                : 'bg-sky-100 text-sky-800 hover:bg-sky-200 border border-sky-300'
            }`}
          >
            {isEditMode ? <Eye className="w-4 h-4" /> : <Edit3 className="w-4 h-4 text-sky-600" />}
            <span>{isEditMode ? 'Xem kết quả' : 'Quản lý & Sửa'}</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-sky-400 to-blue-400 hover:from-sky-500 hover:to-blue-500 text-white rounded-2xl text-xs sm:text-sm font-bold transition shadow-md"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-100" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Đã copy link PH!' : 'Copy Link gửi PH'}</span>
          </button>

          <button
            onClick={handleExportPng}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-pink-400 hover:bg-pink-500 text-white rounded-2xl text-xs sm:text-sm font-bold transition shadow-md disabled:opacity-50"
          >
            {isExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>{isExporting ? 'Đang xuất...' : 'Xuất ảnh'}</span>
          </button>

          <button
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white rounded-2xl text-xs sm:text-sm font-bold transition shadow-md disabled:opacity-50"
          >
            {isExportingPdf ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>{isExportingPdf ? 'Đang tạo PDF...' : 'Xuất PDF'}</span>
          </button>
        </div>
      </header>

      {/* Student Switcher Bar (Tabs for multiple students) */}
      <div className="w-full max-w-4xl flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
        <div className="flex items-center gap-1 text-xs font-bold text-sky-800 shrink-0 mr-1">
          <Users className="w-4 h-4 text-sky-500" />
          <span>Danh sách học sinh:</span>
        </div>
        {students.map(std => {
          const isActive = std.id === activeStudent.id;
          return (
            <button
              key={std.id}
              onClick={() => setActiveStudentId(std.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                isActive 
                  ? 'bg-sky-400 text-white shadow-md border-2 border-white scale-105' 
                  : 'bg-white text-sky-700 hover:bg-sky-100 border border-sky-200'
              }`}
            >
              <span>{std.studentName}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-sky-500 text-sky-100' : 'bg-sky-100 text-sky-600'}`}>
                {std.studentGrade}
              </span>
            </button>
          );
        })}

        {isEditMode && (
          <button
            onClick={handleAddNewStudent}
            className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl border border-emerald-300 flex items-center gap-1 shrink-0 transition"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm học sinh
          </button>
        )}
      </div>

      {/* Main Grid: Editor on Left (if toggled) and Preview on Right */}
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Editor Form */}
        {isEditMode && (
          <div className="lg:col-span-5 bg-white/95 border-2 border-sky-200 p-5 rounded-3xl shadow-xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-sky-100">
              <h2 className="font-extrabold text-sm text-sky-900 flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-sky-500" />
                Chỉnh sửa: {activeStudent.studentName}
              </h2>
              <button
                onClick={() => handleDeleteStudent(activeStudent.id)}
                className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" /> Xóa HS này
              </button>
            </div>

            <div className="space-y-3 text-xs">
              
              {/* Teacher info section */}
              <div className="bg-sky-50/50 p-3 rounded-2xl border border-sky-100 space-y-2">
                <span className="font-bold text-sky-800 block text-[11px] uppercase tracking-wider">Thông tin Gia sư</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-500 font-medium">Tên Gia sư</label>
                    <input 
                      type="text" 
                      value={teacher.teacherName} 
                      onChange={e => setTeacher({...teacher, teacherName: e.target.value})}
                      className="w-full bg-white border border-sky-200 rounded-xl px-2.5 py-1.5 text-slate-800 font-semibold focus:outline-none focus:border-sky-400" 
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium">Số điện thoại</label>
                    <input 
                      type="text" 
                      value={teacher.teacherPhone} 
                      onChange={e => setTeacher({...teacher, teacherPhone: e.target.value})}
                      className="w-full bg-white border border-sky-200 rounded-xl px-2.5 py-1.5 text-slate-800 font-semibold focus:outline-none focus:border-sky-400" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-slate-500 font-medium">Tiêu đề tháng</label>
                  <input 
                    type="text" 
                    value={teacher.monthTitle} 
                    onChange={e => setTeacher({...teacher, monthTitle: e.target.value})}
                    className="w-full bg-white border border-sky-200 rounded-xl px-2.5 py-1.5 text-slate-800 font-semibold focus:outline-none focus:border-sky-400" 
                  />
                </div>
              </div>

              {/* Student info */}
              <div className="bg-sky-50/50 p-3 rounded-2xl border border-sky-100 space-y-2">
                <span className="font-bold text-sky-800 block text-[11px] uppercase tracking-wider">Thông tin Học sinh</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-500 font-medium">Tên Học sinh</label>
                    <input 
                      type="text" 
                      value={activeStudent.studentName} 
                      onChange={e => updateActiveStudent({ studentName: e.target.value })}
                      className="w-full bg-white border border-sky-200 rounded-xl px-2.5 py-1.5 text-slate-800 font-semibold focus:outline-none focus:border-sky-400" 
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium">Lớp học</label>
                    <input 
                      type="text" 
                      value={activeStudent.studentGrade} 
                      onChange={e => updateActiveStudent({ studentGrade: e.target.value })}
                      className="w-full bg-white border border-sky-200 rounded-xl px-2.5 py-1.5 text-slate-800 font-semibold focus:outline-none focus:border-sky-400" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-500 font-medium">Học phí 1 buổi (VNĐ)</label>
                    <input 
                      type="number" 
                      step="10000"
                      value={activeStudent.pricePerLesson} 
                      onChange={e => updateActiveStudent({ pricePerLesson: Number(e.target.value) })}
                      className="w-full bg-white border border-sky-200 rounded-xl px-2.5 py-1.5 text-slate-800 font-semibold focus:outline-none focus:border-sky-400" 
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium">Số giờ / 1 buổi</label>
                    <input 
                      type="number" 
                      step="0.25"
                      value={activeStudent.hoursPerLesson} 
                      onChange={e => updateActiveStudent({ hoursPerLesson: Number(e.target.value) })}
                      className="w-full bg-white border border-sky-200 rounded-xl px-2.5 py-1.5 text-slate-800 font-semibold focus:outline-none focus:border-sky-400" 
                    />
                  </div>
                </div>
              </div>

              {/* Select Calendar Dates */}
              <div className="space-y-1.5">
                <span className="font-bold text-sky-800 block text-[11px] uppercase tracking-wider flex items-center gap-1">
                  <CalendarIcon className="w-3.5 h-3.5 text-sky-500" />
                  Chọn lịch học trong tháng
                </span>
                {renderCalendar()}
              </div>

              {/* Bank & Payment */}
              <div className="bg-sky-50/50 p-3 rounded-2xl border border-sky-100 space-y-2">
                <span className="font-bold text-sky-800 block text-[11px] uppercase tracking-wider">Tài khoản nhận học phí</span>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="Ngân hàng (VD: TECHCOMBANK)"
                    value={teacher.bankName} 
                    onChange={e => setTeacher({...teacher, bankName: e.target.value})}
                    className="w-full bg-white border border-sky-200 rounded-xl px-2.5 py-1.5 text-slate-800 font-semibold focus:outline-none focus:border-sky-400" 
                  />
                  <input 
                    type="text" 
                    placeholder="Số tài khoản"
                    value={teacher.bankNumber} 
                    onChange={e => setTeacher({...teacher, bankNumber: e.target.value})}
                    className="w-full bg-white border border-sky-200 rounded-xl px-2.5 py-1.5 text-slate-800 font-semibold focus:outline-none focus:border-sky-400" 
                  />
                </div>
                <input 
                  type="text" 
                  placeholder="Chủ tài khoản"
                  value={teacher.bankOwner} 
                  onChange={e => setTeacher({...teacher, bankOwner: e.target.value})}
                  className="w-full bg-white border border-sky-200 rounded-xl px-2.5 py-1.5 text-slate-800 font-semibold focus:outline-none focus:border-sky-400" 
                />

                {/* Upload ảnh QR cá nhân */}
                <div className="pt-1 border-t border-sky-200/60">
                  <div className="text-[11px] font-bold text-sky-800 mb-1.5 flex items-center justify-between">
                    <span>Mã QR Chuyển khoản:</span>
                    {teacher.customQr ? (
                      <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Đang dùng QR tải lên
                      </span>
                    ) : (
                      <span className="text-[10px] text-sky-600 font-medium">
                        Tự tạo theo STK
                      </span>
                    )}
                  </div>

                  {teacher.customQr ? (
                    <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-sky-200">
                      <img 
                        src={teacher.customQr} 
                        alt="QR tải lên" 
                        className="w-12 h-12 object-contain rounded-lg border border-slate-200" 
                      />
                      <div className="flex-1 text-xs">
                        <div className="font-bold text-slate-700">Đã upload ảnh QR</div>
                        <div className="text-[10px] text-slate-400">Ưu tiên hiển thị trên phiếu</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setTeacher(prev => ({ ...prev, customQr: '' }))}
                        className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 bg-red-50 rounded-lg hover:bg-red-100 transition"
                      >
                        Gỡ bỏ
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 w-full py-2 px-3 border-2 border-dashed border-sky-300 hover:border-sky-400 rounded-xl cursor-pointer bg-white/70 hover:bg-white text-sky-700 transition text-xs font-semibold">
                      <Upload className="w-4 h-4 text-sky-500" />
                      <span>Tải ảnh mã QR lên</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleQrUpload} 
                        className="hidden" 
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Edit Nhận Xét Học Tập */}
              <div className="bg-sky-50/50 p-3 rounded-2xl border border-sky-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sky-800 text-[11px] uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-sky-500" /> Nhận xét học tập
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(activeStudent.reviews || [])];
                      updated.push({ subject: "Môn mới", points: ["Nội dung nhận xét mới..."] });
                      updateActiveStudent({ reviews: updated });
                    }}
                    className="text-[11px] bg-sky-200/70 hover:bg-sky-300/70 text-sky-800 font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 transition"
                  >
                    <Plus className="w-3 h-3" /> Thêm môn
                  </button>
                </div>

                {(activeStudent.reviews || []).map((rev, revIdx) => (
                  <div key={revIdx} className="bg-white p-2.5 rounded-xl border border-sky-200/80 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <input 
                        type="text" 
                        value={rev.subject} 
                        onChange={e => {
                          const updated = [...activeStudent.reviews];
                          updated[revIdx].subject = e.target.value;
                          updateActiveStudent({ reviews: updated });
                        }}
                        className="font-extrabold text-xs text-sky-900 bg-sky-50 px-2 py-1 rounded-lg border border-sky-200 w-full focus:outline-none focus:border-sky-400"
                        placeholder="Tên môn / Kỹ năng (VD: Đại số, Hình học)"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = activeStudent.reviews.filter((_, i) => i !== revIdx);
                          updateActiveStudent({ reviews: updated });
                        }}
                        className="text-red-400 hover:text-red-600 p-1 rounded-lg"
                        title="Xóa môn này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1.5 pl-1">
                      {rev.points.map((pt, ptIdx) => (
                        <div key={ptIdx} className="flex items-start gap-1.5">
                          <textarea
                            rows={2}
                            value={pt}
                            onChange={e => {
                              const updated = [...activeStudent.reviews];
                              updated[revIdx].points[ptIdx] = e.target.value;
                              updateActiveStudent({ reviews: updated });
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-slate-700 focus:outline-none focus:border-sky-400"
                            placeholder="Nhập ý nhận xét..."
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...activeStudent.reviews];
                              updated[revIdx].points = updated[revIdx].points.filter((_, i) => i !== ptIdx);
                              updateActiveStudent({ reviews: updated });
                            }}
                            className="text-slate-400 hover:text-red-500 mt-1 p-0.5"
                            title="Xóa ý này"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...activeStudent.reviews];
                          updated[revIdx].points.push("Thêm ý nhận xét mới...");
                          updateActiveStudent({ reviews: updated });
                        }}
                        className="text-[10px] text-sky-600 hover:text-sky-800 font-semibold flex items-center gap-1 pt-0.5"
                      >
                        <Plus className="w-3 h-3" /> Thêm gạch đầu dòng
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit Lộ Trình Sắp Tới */}
              <div className="bg-sky-50/50 p-3 rounded-2xl border border-sky-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sky-800 text-[11px] uppercase tracking-wider flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-sky-500" /> Lộ trình sắp tới
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(activeStudent.roadmaps || [])];
                      updated.push({ time: `Tháng ${updated.length + 1}`, desc: "Kế hoạch học tập tiếp theo..." });
                      updateActiveStudent({ roadmaps: updated });
                    }}
                    className="text-[11px] bg-sky-200/70 hover:bg-sky-300/70 text-sky-800 font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 transition"
                  >
                    <Plus className="w-3 h-3" /> Thêm mốc
                  </button>
                </div>

                <div className="space-y-1.5">
                  {(activeStudent.roadmaps || []).map((rm, rmIdx) => (
                    <div key={rmIdx} className="flex items-center gap-1.5 bg-white p-1.5 rounded-xl border border-sky-200/80">
                      <input 
                        type="text" 
                        value={rm.time}
                        onChange={e => {
                          const updated = [...activeStudent.roadmaps];
                          updated[rmIdx].time = e.target.value;
                          updateActiveStudent({ roadmaps: updated });
                        }}
                        className="w-24 shrink-0 font-bold text-xs text-sky-900 bg-sky-50 px-2 py-1 rounded-lg border border-sky-200 focus:outline-none"
                        placeholder="Thời gian"
                      />
                      <input 
                        type="text" 
                        value={rm.desc}
                        onChange={e => {
                          const updated = [...activeStudent.roadmaps];
                          updated[rmIdx].desc = e.target.value;
                          updateActiveStudent({ roadmaps: updated });
                        }}
                        className="w-full text-xs text-slate-700 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 focus:outline-none focus:border-sky-400"
                        placeholder="Nội dung mục tiêu / chuyên đề"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = activeStudent.roadmaps.filter((_, i) => i !== rmIdx);
                          updateActiveStudent({ roadmaps: updated });
                        }}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Edit Lịch Học Cố Định */}
              <div className="bg-sky-50/50 p-3 rounded-2xl border border-sky-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sky-800 text-[11px] uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-sky-500" /> Lịch học cố định
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(activeStudent.schedule || [])];
                      updated.push({ day: "Thứ ...", time: "00h00 - 00h00" });
                      updateActiveStudent({ schedule: updated });
                    }}
                    className="text-[11px] bg-sky-200/70 hover:bg-sky-300/70 text-sky-800 font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 transition"
                  >
                    <Plus className="w-3 h-3" /> Thêm lịch
                  </button>
                </div>

                <div className="space-y-1.5">
                  {(activeStudent.schedule || []).map((sch, schIdx) => (
                    <div key={schIdx} className="flex items-center gap-1.5 bg-white p-1.5 rounded-xl border border-sky-200/80">
                      <input 
                        type="text" 
                        value={sch.day}
                        onChange={e => {
                          const updated = [...activeStudent.schedule];
                          updated[schIdx].day = e.target.value;
                          updateActiveStudent({ schedule: updated });
                        }}
                        className="w-28 shrink-0 font-bold text-xs text-sky-900 bg-sky-50 px-2 py-1 rounded-lg border border-sky-200 focus:outline-none"
                        placeholder="Thứ / Ngày"
                      />
                      <input 
                        type="text" 
                        value={sch.time}
                        onChange={e => {
                          const updated = [...activeStudent.schedule];
                          updated[schIdx].time = e.target.value;
                          updateActiveStudent({ schedule: updated });
                        }}
                        className="w-full text-xs text-slate-700 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 focus:outline-none focus:border-sky-400"
                        placeholder="Khung giờ (VD: 7h30 - 9h00)"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = activeStudent.schedule.filter((_, i) => i !== schIdx);
                          updateActiveStudent({ schedule: updated });
                        }}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cinnamoroll Themed Report Card Preview */}
        <div className={`w-full ${isEditMode ? 'lg:col-span-7' : 'lg:col-span-12 flex justify-center'}`}>
          <div 
            ref={cardRef}
            className="w-full max-w-[620px] rounded-3xl shadow-2xl overflow-hidden border-4 border-sky-300 relative bg-cover bg-center bg-no-repeat"
            style={{ 
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              backgroundImage: `url(${CARD_BG})`
            }}
          >
            {/* White overlay for high contrast & readability */}
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] pointer-events-none" />

            {/* Background Clouds decoration */}
            <div className="absolute top-2 right-4 opacity-25 pointer-events-none">
              <Cloud className="w-24 h-24 text-sky-400" />
            </div>

            {/* Top Cinnamoroll Banner Header */}
            <div className="bg-gradient-to-r from-sky-500 via-sky-400 to-blue-500 text-white px-6 py-4 flex items-center justify-between relative shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-14 h-11 bg-white rounded-2xl flex items-center justify-center shadow-md overflow-hidden p-1 border-2 border-sky-100 shrink-0">
                  <img src={AVATAR_IMG} alt="Avatar" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="font-extrabold text-sm sm:text-base tracking-wide text-white drop-shadow-sm whitespace-nowrap leading-tight mb-1">
                    <span>{teacher.teacherName}</span>
                  </div>
                  <div className="text-xs text-sky-100 font-medium flex items-center gap-1 whitespace-nowrap leading-none">
                    <Phone className="w-3 h-3 text-sky-100 shrink-0" />
                    <span>{teacher.teacherPhone}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-bold uppercase bg-white/30 text-white px-3 py-1 rounded-full backdrop-blur-sm shadow-inner whitespace-nowrap shrink-0">
                  Gia Sư & Luyện Thi
                </span>
              </div>
            </div>

            {/* Title Ribbon */}
            <div 
              className="text-center py-5 px-6 border-b-2 border-dashed border-sky-200 relative bg-cover bg-center overflow-hidden"
              style={{
                backgroundImage: `url(${TITLE_BG})`
              }}
            >
              {/* Soft white/pastel overlay for title background to keep text crystal clear */}
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] pointer-events-none" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1 bg-white/95 text-sky-900 rounded-full text-xs font-black uppercase tracking-wider mb-1.5 shadow-sm border border-sky-200 whitespace-nowrap">
                  <Stars className="w-3.5 h-3.5 text-sky-600" />
                  <span>Báo Cáo Tiến Độ & Học Phí</span>
                  <Stars className="w-3.5 h-3.5 text-sky-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-sky-950 tracking-tight uppercase drop-shadow-sm bg-white/80 inline-block px-4 py-0.5 rounded-2xl border border-sky-100">
                  {teacher.monthTitle}
                </h2>
              </div>
            </div>

            {/* Student Stats Box */}
            <div className="p-5 sm:p-6 space-y-4 relative">
              
              {/* 4-Box Quick Stats with Price Per Lesson */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-white/95 backdrop-blur-sm border-2 border-sky-200 rounded-2xl p-2.5 text-center shadow-sm">
                  <div className="text-[10px] text-sky-700 font-bold uppercase">Học sinh</div>
                  <div className="font-black text-sky-950 text-sm sm:text-base mt-0.5">{activeStudent.studentName}</div>
                </div>
                <div className="bg-white/95 backdrop-blur-sm border-2 border-sky-200 rounded-2xl p-2.5 text-center shadow-sm">
                  <div className="text-[10px] text-sky-700 font-bold uppercase">Lớp học</div>
                  <div className="font-black text-sky-950 text-sm sm:text-base mt-0.5">{activeStudent.studentGrade}</div>
                </div>
                <div className="bg-white/95 backdrop-blur-sm border-2 border-blue-200 rounded-2xl p-2.5 text-center shadow-sm">
                  <div className="text-[10px] text-blue-700 font-bold uppercase">Số buổi (Tổng giờ)</div>
                  <div className="font-black text-blue-900 text-sm sm:text-base mt-0.5">{totalLessons} buổi ({totalHours}h)</div>
                </div>
                <div className="bg-white/95 backdrop-blur-sm border-2 border-pink-200 rounded-2xl p-2.5 text-center shadow-sm">
                  <div className="text-[10px] text-pink-700 font-bold uppercase">Đơn giá / buổi</div>
                  <div className="font-black text-pink-700 text-xs sm:text-sm mt-0.5">{formattedPricePerLesson}</div>
                </div>
              </div>

              {/* Lesson Dates (Generated from chosen calendar dates) */}
              <div className="bg-white/95 backdrop-blur-sm border-2 border-sky-200 rounded-2xl p-3 text-xs text-sky-950 flex items-start gap-2 shadow-sm">
                <div className="p-1 bg-sky-100 rounded-xl text-sky-700 mt-0.5">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-extrabold text-sky-950 mr-1.5">Ngày học trong tháng:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {(activeStudent.selectedDates && activeStudent.selectedDates.length > 0) ? (
                      activeStudent.selectedDates.map((d, i) => (
                        <span key={i} className="bg-sky-50 border border-sky-300 text-sky-950 font-black px-2 py-0.5 rounded-lg text-[11px] shadow-2xs">
                          {formatShortDate(d)}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 italic">Chưa chọn ngày học trong lịch</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Learning Reviews */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-2 text-sm font-extrabold text-sky-950 pb-1 border-b-2 border-sky-200">
                  <BookOpen className="w-4 h-4 text-sky-600" />
                  <span>NHẬN XÉT HỌC TẬP</span>
                </div>

                <div className="space-y-2.5 text-xs sm:text-sm">
                  {activeStudent.reviews.map((rev, idx) => (
                    <div key={idx} className="bg-white/95 backdrop-blur-sm p-3 rounded-2xl border-2 border-sky-150 shadow-sm space-y-1.5">
                      <div className="font-extrabold text-sky-950 flex items-center gap-1.5 text-xs sm:text-sm">
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-2xs"></span>
                        <span>{rev.subject}:</span>
                      </div>
                      <ul className="space-y-1.5 pl-4 list-disc text-slate-800 text-xs sm:text-[13px] leading-relaxed font-medium">
                        {rev.points.map((pt, pIdx) => (
                          <li key={pIdx}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tuition & VietQR Box (Cinnamoroll Sky-Blue Theme) */}
              <div className="bg-white/95 backdrop-blur-sm border-2 border-sky-300 rounded-3xl p-4 sm:p-5 shadow-md">
                <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-sky-200">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-sky-500 text-white rounded-xl shadow-xs">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-black text-xs sm:text-sm text-sky-950 uppercase tracking-tight block">TỔNG HỌC PHÍ THÁNG</span>
                      <span className="text-[11px] text-sky-700 font-bold">({totalLessons} buổi × {formattedPricePerLesson})</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-black text-sky-700 tracking-tight">{formattedTuition}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-3.5">
                  <div className="sm:col-span-7 space-y-2 text-xs">
                    <div className="text-slate-700 flex items-center gap-1.5">
                      <span className="font-bold text-slate-900">Ngân hàng:</span>
                      <span className="font-black text-sky-900 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200">{teacher.bankName}</span>
                    </div>
                    <div className="text-slate-700 flex items-center gap-1.5">
                      <span className="font-bold text-slate-900">Số tài khoản:</span>
                      <span className="font-black text-sky-950 bg-sky-100/70 px-2.5 py-0.5 rounded-xl border border-sky-300 text-xs tracking-wider shadow-2xs">
                        {teacher.bankNumber}
                      </span>
                    </div>
                    <div className="text-slate-700 flex items-center gap-1.5">
                      <span className="font-bold text-slate-900">Chủ tài khoản:</span>
                      <span className="font-black text-slate-900 uppercase">{teacher.bankOwner}</span>
                    </div>
                    <div className="text-[11px] text-sky-800 font-semibold italic pt-1 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                      <span>Quét mã VietQR chuyển khoản nhanh đúng số tiền & nội dung</span>
                    </div>
                  </div>

                  <div className="sm:col-span-5 flex flex-col items-center justify-center">
                    <div className="bg-white p-2 rounded-2xl shadow-md border-2 border-sky-300">
                      <img 
                        src={teacher.customQr || qrDataUrl || getVietQrUrl()}
                        alt="Mã QR Chuyển khoản"
                        className="w-28 h-28 object-contain rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Roadmap & Next Steps */}
              <div className="pt-2 space-y-2.5">
                <div className="flex items-center gap-2 text-sm font-extrabold text-sky-950 pb-1 border-b-2 border-sky-200">
                  <Compass className="w-4 h-4 text-sky-600" />
                  <span>LỘ TRÌNH SẮP TỚI</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  {activeStudent.roadmaps.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-white/95 backdrop-blur-sm p-2.5 rounded-xl border border-sky-150 shadow-2xs">
                      <span className="font-black text-sky-900 shrink-0 w-24">{item.time}:</span>
                      <span className="text-slate-800 leading-snug font-medium">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Schedule */}
              <div className="pt-2 space-y-2">
                <div className="flex items-center gap-2 text-sm font-extrabold text-sky-950 pb-1 border-b-2 border-sky-200">
                  <Clock className="w-4 h-4 text-sky-600" />
                  <span>LỊCH HỌC CỐ ĐỊNH</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {activeStudent.schedule.map((sch, idx) => (
                    <div key={idx} className="bg-white/95 backdrop-blur-sm border-2 border-sky-200 rounded-2xl p-2.5 text-center shadow-2xs">
                      <span className="font-black text-sky-950 block">{sch.day}</span>
                      <span className="text-sky-800 font-bold text-[11px]">{sch.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Note */}
              <div className="text-center pt-3 text-xs text-slate-700 font-medium italic border-t border-sky-200 flex items-center justify-center gap-1.5">
                <Heart className="w-3 h-3 text-pink-500 fill-pink-500" />
                <span>{teacher.footerNote}</span>
              </div>

            </div>
          </div>
        </div>

      </div>

      <footer className="mt-8 text-xs text-sky-600 text-center font-medium">
        Cinnamoroll Sanrio Theme • Phiếu Báo Học Phí & Tiến Độ Gia Sư
      </footer>
    </div>
  );
}
