import { notification } from "antd";
import * as XLSX from "xlsx";

export function exportToExcel(data, type) {
  try {
    // COLUMN NAMES
    const headers = ["barkodu", "net_alis", "eded"];

    // CONNECT DATA TO COLUMN
    let worksheetData;
    if (type === 2) {
      worksheetData = [
        headers,
        ...data.map((item) => [
          item.barcode,
          parseFloat(item.price) * 1.18,
          item.count,
        ]),
      ];
    } else {
      worksheetData = [
        headers,
        ...data.map((item) => [item.barcode, item.price, item.count]),
      ];
    }

    // CONFIGURE SHEET
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    return workbook;
  } catch (error) {
    notification.error({ message: error.message });
  }
}

export function generateFileName(order) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let randomString = "";
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }
  return order + "_" + randomString;
}
