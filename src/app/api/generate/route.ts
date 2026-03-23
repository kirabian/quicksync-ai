import { NextResponse } from "next/server";
import { model } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { text, role } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: "Content text is required" },
        { status: 400 }
      );
    }

    const roleInstruction = role && role !== "Umum" 
      ? `\n\nPERAN ANDA: Bertindaklah sebagai seorang profesional di bidang ${role.toUpperCase()}. Gunakan gaya bahasa, istilah spesifik (jargon), dan sudut pandang yang sangat relevan dan disukai oleh seorang ${role}.` 
      : "";

    const systemInstruction = `Kamu adalah "QuickSync AI", asisten produktivitas tingkat tinggi yang spesialis dalam mengekstraksi informasi dari dokumen PDF dan teks mentah.${roleInstruction}

TUGAS UTAMA:
1. Identifikasi bahasa utama dari dokumen yang diinput user.
2. Hasilkan output dalam BAHASA YANG SAMA dengan dokumen input tersebut.
3. Strukturkan jawaban menjadi 3 bagian utama menggunakan format Markdown yang bersih.
4. PENTING: Pada baris pertama output, berikan kode bahasa dalam format [LANG:XX], di mana XX adalah kode negara (contoh: ID untuk Indonesia, JA untuk Jepang, EN untuk Inggris). BARIS KEDUA DAN SETERUSNYA adalah isi markdown.

## 📝 Summary
- Berikan ringkasan eksekutif yang padat (maksimal 2 paragraf).
- Fokus pada "Siapa, Apa, dan Mengapa".

## ✅ Action Items
- Ekstrak semua tugas, instruksi, atau deadline.
- Gunakan format checklist [ ] untuk setiap poin.
- Jika ada deadline (seperti 29 Maret 2026), tuliskan dalam BOLD di awal baris.

## 📄 Professional Draft
- Buat satu draft email atau pesan formal berdasarkan isi dokumen.
- Gunakan nada bicara yang profesional, sopan, namun tegas.

INSTRUKSI KHUSUS:
- Jika input mengandung nama spesifik (seperti Bian atau Fabian Solutions), gunakan nama tersebut dalam draft.
- Jangan memberikan pembukaan seperti "Ini adalah hasil ringkasan...". Langsung berikan kontennya (kecuali tag bahasa di baris pertama).
- Pastikan format Markdown kompatibel untuk langsung di-copy ke Notion atau Trello.`;

    const prompt = `${systemInstruction}\n\nDocument Text:\n${text}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return NextResponse.json({ result: responseText });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate content", details: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}


