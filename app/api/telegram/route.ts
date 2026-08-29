import { NextResponse } from "next/server";

// Simple in-memory rate limiting
const rateLimit = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 60 * 1000;

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown-ip";
    const now = Date.now();
    
    const userLimit = rateLimit.get(ip);
    if (userLimit) {
      if (now - userLimit.lastReset > RATE_LIMIT_WINDOW) {
        rateLimit.set(ip, { count: 1, lastReset: now });
      } else if (userLimit.count >= RATE_LIMIT_MAX) {
        return NextResponse.json(
          { success: false, message: "Juda ko'p so'rov yuborildi. Iltimos, birozdan so'ng qayta urinib ko'ring." },
          { status: 429 }
        );
      } else {
        rateLimit.set(ip, { count: userLimit.count + 1, lastReset: userLimit.lastReset });
      }
    } else {
      rateLimit.set(ip, { count: 1, lastReset: now });
    }

    const body = await req.json();
    const { name, phone, age, course } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0 || name.length > 100) {
      return NextResponse.json({ success: false, message: "Ism noto'g'ri kiritilgan." }, { status: 400 });
    }
    
    if (!phone || typeof phone !== 'string' || !/^\+998[0-9]{9}$/.test(phone.replace(/\s+/g, ''))) {
      return NextResponse.json({ success: false, message: "Telefon raqami noto'g'ri." }, { status: 400 });
    }

    if (!age || isNaN(Number(age)) || Number(age) < 10 || Number(age) > 100) {
      return NextResponse.json({ success: false, message: "Yosh noto'g'ri kiritilgan." }, { status: 400 });
    }

    if (!course || typeof course !== 'string' || course.length > 100) {
      return NextResponse.json({ success: false, message: "Kurs tanlanmagan." }, { status: 400 });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || botToken === "YOUR_BOT_TOKEN_HERE" || !chatId) {
      console.error("TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHAT_ID noto'g'ri sozlangan.");
      return NextResponse.json(
        { success: false, message: "Server konfiguratsiyasida xatolik (Token topilmadi yoki yaroqsiz)." },
        { status: 500 }
      );
    }

    // Use HTML parse_mode for better security and preventing markdown injection issues
    const text = `🆕 <b>YANGI KURS ARIZASI</b>\n\n👤 <b>Ism:</b> ${escapeHtml(name.trim())}\n📞 <b>Telefon:</b> ${escapeHtml(phone.trim())}\n🎓 <b>Yosh:</b> ${escapeHtml(String(age))}\n💻 <b>Kurs:</b> ${escapeHtml(course.trim())}\n📍 <b>Manba:</b> Veb-sayt`;

    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(telegramApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "HTML",
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      console.error("Telegram API Error:", data);
      return NextResponse.json(
        { success: false, message: "Telegram API xatosi." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, message: "Ariza muvaffaqiyatli qabul qilindi!" });
  } catch (error) {
    console.error("Telegram API Route Error:", error);
    return NextResponse.json(
      { success: false, message: "Ichki server xatosi yuz berdi." },
      { status: 500 }
    );
  }
}
