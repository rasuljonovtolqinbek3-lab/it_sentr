# Certificate Verification System — Backup & Recovery Guide

## Muhim Ogohlantirish
Sertifikatlar tizimining to'liq va muammosiz ishlashi uchun quyidagi **ikkita komponent bir xil vaqtda (sinxron) backup qilinishi shart**:
1. SQLite Database (Sertifikat ma'lumotlari, QR, Hash, va Status).
2. PDF jild (Sertifikatlarning jismoniy fayllari).

Agar faqat bittasi backup qilinsa, tizimda yetishmovchilik yuz beradi (orphan records yoki missing files).

---

## 1. Backup Qilish Tartibi

### Database Backup
Database `data/certificates/sqlite.db` faylida va uning WAL jurnallarida saqlanadi. 
Backup qilishda fayllarni to'g'ridan-to'g'ri nusxalashdan oldin SQLite CLI yordamida online backup qilish tavsiya etiladi (fayl qulflanib qolmasligi uchun). Yoki shunchaki butun papkani arxivlash mumkin.

```bash
# Papkani arxivlash
tar -czvf db_backup_$(date +%F).tar.gz data/certificates/sqlite.db data/certificates/sqlite.db-wal data/certificates/sqlite.db-shm
```

### PDF Files Backup
Barcha sertifikat fayllari `data/certificates/pdfs/` ichida joylashgan. 

```bash
# PDF papkasini arxivlash
tar -czvf pdfs_backup_$(date +%F).tar.gz data/certificates/pdfs/
```

### Avtomatlashtirilgan (Birgalikdagi) Backup
Eng xavfsiz usul butun `data/certificates/` papkasini bitta vaqtda nusxalash:
```bash
tar -czvf certificate_system_backup_$(date +%F).tar.gz data/certificates/
```

---

## 2. Restore (Qayta tiklash) Tartibi

Agar tizim qulab tushsa yoki ma'lumotlarni tiklash zarurati tug'ilsa:

1. Dasturni vaqtincha to'xtating (`npm stop` yoki pm2 kabi jarayonni to'xtating).
2. Eskirgan ma'lumotlarni o'chiring yoki nomini o'zgartiring:
   ```bash
   mv data/certificates data/certificates_old
   ```
3. Backup faylni oching:
   ```bash
   tar -xzvf certificate_system_backup_YYYY-MM-DD.tar.gz
   ```
4. Dasturni qayta ishga tushiring:
   ```bash
   npm start
   ```

---

## 3. Integrity (Yaxlitlik) Tekshiruvi
Restore qilgandan keyin:
1. Admin panelga kiring va sertifikatlar ro'yxati to'liq ekanligini tekshiring.
2. Kamida bitta ACTIVE sertifikatning PDF tugmasini bosib ko'ring (yoki `/api/certificates/[id]/pdf` public API orqali).
3. Agar `409 Integrity Check Failed` xatosi bersa, demak database ichidagi SHA-256 hash va PDF fayl mos kelmayapti (ya'ni, eski PDF yoki eski DB tiklangan). Backup fayllarning bitta vaqtdaligiga ishonch hosil qiling.

---

## 4. Xavfsizlik Qoidalari
* Backup fayllari HECH QACHON public qilinmasligi kerak.
* Backup fayllari HECH QACHON Github repository yoki ochiq platformaga yuklanmasligi kerak (`.gitignore` da `data/certificates` allaqachon himoyalangan).
* Backup'larni xavfsiz off-site serverlarda saqlang.
