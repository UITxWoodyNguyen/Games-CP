const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const app = express();
app.use(cors());
app.use(express.json());

const SHEET_ID = '1c3Zy0gG_0Vg_7FofCh0zXMZgzPZI2SczvNBjlflVG7w'; // Thay bằng ID bảng tính của bạn
const SHEET_NAME = 'Hanoi Tower Results'; // hoặc tên sheet bạn dùng

// Load credentials từ file JSON tải về
const auth = new google.auth.GoogleAuth({
  keyFile: 'D:\\Project\\hntower-2712aa06687d.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets = google.sheets({ version: 'v4', auth });

app.post('/delete-row', async (req, res) => {
  const { rowIndex } = req.body; // rowIndex là số thứ tự dòng (bắt đầu từ 1, dòng 1 là header)
  try {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0, // Sheet đầu tiên, hoặc lấy sheetId đúng
                dimension: 'ROWS',
                startIndex: rowIndex - 1, // 0-based, bỏ header
                endIndex: rowIndex,
              },
            },
          },
        ],
      },
    });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));