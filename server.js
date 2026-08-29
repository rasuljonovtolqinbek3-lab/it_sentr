const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

// Agar dev = false bo'lsa (production), bu avtomatik ravishda .next papkasidan buildni oladi
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Xatolik yuz berdi:', req.url, err);
      res.statusCode = 500;
      res.end('Ichki server xatosi (Internal Server Error)');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Server ishga tushdi: http://${hostname}:${port}`);
  });
});
