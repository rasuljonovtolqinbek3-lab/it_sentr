const fs = require('fs');
const path = require('path');

function copyFolderSync(from, to) {
  if (!fs.existsSync(from)) return;
  if (!fs.existsSync(to)) fs.mkdirSync(to, { recursive: true });
  
  fs.readdirSync(from).forEach(element => {
    if (fs.lstatSync(path.join(from, element)).isFile()) {
      fs.copyFileSync(path.join(from, element), path.join(to, element));
    } else {
      copyFolderSync(path.join(from, element), path.join(to, element));
    }
  });
}

function copyFileSync(from, to) {
  if (fs.existsSync(from)) {
    fs.copyFileSync(from, to);
  }
}

const standaloneDir = path.join(__dirname, '../.next/standalone');
const nextStaticDir = path.join(standaloneDir, '.next/static');
const publicDir = path.join(standaloneDir, 'public');

console.log('Avtomatlashtirish boshlandi: Fayllar standalone papkasiga ko\'chirilmoqda...');

if (!fs.existsSync(standaloneDir)) {
  console.error("XATO: .next/standalone papkasi topilmadi. Iltimos, oldin 'npm run build' qiling.");
  process.exit(1);
}

// Copy .next/static -> .next/standalone/.next/static
console.log('1. .next/static papkasi ko\'chirilmoqda...');
copyFolderSync(path.join(__dirname, '../.next/static'), nextStaticDir);

// Copy public -> .next/standalone/public
console.log('2. public papkasi ko\'chirilmoqda...');
copyFolderSync(path.join(__dirname, '../public'), publicDir);

// Copy database migrations
console.log('3. migrate.js va drizzle_migrations ko\'chirilmoqda...');
copyFileSync(path.join(__dirname, '../migrate.js'), path.join(standaloneDir, 'migrate.js'));
copyFolderSync(path.join(__dirname, '../drizzle_migrations'), path.join(standaloneDir, 'drizzle_migrations'));

// Create empty pdfs folder to prevent crashes
const pdfDir = path.join(standaloneDir, 'data/certificates/pdfs');
if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
}

console.log('----------------------------------------------------');
console.log('MUVAFFAQIYATLI YAKUNLANDI! 🎉');
console.log('Endi ".next/standalone" papkasi to\'liq tayyor bo\'ldi.');
console.log('Siz ".next/standalone" papkasining ichidagi BARCHA fayllarni ZIP qilib,');
console.log('Eskiz hostingingizga yuklashingiz mumkin!');
console.log('----------------------------------------------------');
