# TELEGRAM BOT SETUP INSTRUCTIONS

To receive website registrations directly in your Telegram chat, follow these simple steps:

## 1. Create a Bot
1. Open Telegram and search for **@BotFather** (the official bot creator).
2. Send the command `/newbot`.
3. Give your bot a name (e.g., `IT Centr Turtkul Bot`).
4. Give it a username (must end in `bot`, e.g., `turtkul_it_bot`).
5. BotFather will reply with your **Bot Token** (it looks like `1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ`).

## 2. Get Your Chat ID
1. Open Telegram and search for **@userinfobot** or **@RawDataBot**.
2. Send any message to it.
3. It will reply with your information. Look for your **Id** (a number like `123456789`). This is your **Chat ID**.
4. *(Optional)* If you want the bot to send messages to a group, add the bot to the group, send a message in the group, and use a bot like @RawDataBot in the group to get the group's Chat ID (usually starts with a minus sign `-`).

## 3. Configure the Website
1. In the root of your project folder (`it_sentr`), create a file named exactly `.env.local`
2. Add your Bot Token and Chat ID to the file like this:
   ```env
   TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ
   TELEGRAM_CHAT_ID=123456789
   ```

## 4. Test It
1. Restart your development server (`npm run dev`) or rebuild the production app.
2. Open the website, fill out the "Kursga yozilish" form, and click "Yuborish".
3. You should instantly receive a formatted message in your Telegram from your new bot!

> **Security Note:** Never share your `.env.local` file or your Bot Token with anyone. It is secure on the server.
