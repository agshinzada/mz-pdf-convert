import { notification } from "antd";

export default function tamstoreAlgo(data) {
  // Sipariş Numarasını Çıkartma
  const orderNumber = data.match(/Sifariş No\s+(\d+)/)[1];
  console.log("Sifariş Nömrəsi:", orderNumber);

  // Məhsul satırlarını çıkartma
  const productRegex =
    /(\d{6})\s+([\w\s]+)\s+(\d{13})\s+(\d+)\s+ADET\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+AZN\s+([\d.]+)/g;
  const products = [];
  let match;
  while ((match = productRegex.exec(data)) !== null) {
    products.push({
      kodu: match[1], // Məhsul Kodu
      adi: match[2].trim(), // Məhsul Adı
      barkod: match[3], // Əsas Barkod
      miqdar: match[4], // Miqdar
      net: match[5], // Net
      enet: match[6], // E.NET
      etotal: match[7], // E.TOTAL
      mebleg: match[8] + " AZN", // Məbləğ
    });
  }
}

export function bazarstoreAlgo(data) {
  // Sipariş numarasını ayıklamak için regex
  const orderRegex = data.match(/SİPARİŞ NO\s+:\s+(\d+)/);
  const orderNo = orderRegex ? orderRegex[1] : "Order number not found";

  // Ürün bilgilerini ayıklamak için regex
  const prodRegex = /(\d+)\s+(.+?)\s+(\d{13})\s+(\d+)\s+([\d,]+)/g;

  let products = [];
  let match;
  while ((match = prodRegex.exec(data)) !== null) {
    products.push({
      barcode: match[3],
      count: match[4],
      price: parseFloat(match[5].replace(",", ".")),
    });
  }
  return {
    orderNo: orderNo,
    products,
  };
}

export function bravoAlgo(data) {
  try {
    if (!data) {
      throw new Error("Fayl formatı düzgün deyil!");
    }
    const orderNoRegex = /ORDER,\s*No\.\s*(\d+)/;
    const matchOrder = data.match(orderNoRegex);
    let orderNo;

    if (matchOrder && matchOrder[1]) {
      orderNo = matchOrder[1];
    } else {
      throw new Error("Sifariş nömrəsi tapılmadı!");
    }
    // EXTRACT ALL PRODUCTS SECTION
    const startKeyword = "PU Type  ";
    const endKeyword = "Total:";
    const startIndex = data.indexOf(startKeyword);
    const endIndex = data.indexOf(endKeyword);
    if (startIndex === -1 || endIndex === -1) {
      throw new Error("Məhsul məlumatlarında yanlışlıq var!");
    }
    const productSection = data
      .substring(startIndex + startKeyword.length, endIndex)
      .trim();
    const productsArray = productSection.split(/\d+\.\s+/).slice(1); // PRODUCTLARDAN IBARET ARRAY
    //PRODUCTLARI STANDART ARRAY HALINA GETIRIR
    const standardProductsArray = productsArray.map((item) => {
      const parts = item.split(/\s+/);
      const startIndex = parts.findIndex((part) => /^\d{13}$/.test(part)); // 13 REQEMLI BARCODE
      const endIndex = parts.findIndex((part) => /^\d{6}$/.test(part)); // 6 REQEMLI
      // IKISI ARASINI PAS KECIR
      if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        const relevantParts = [
          ...parts.slice(0, startIndex + 1),
          ...parts.slice(endIndex + 1),
        ];
        return relevantParts;
      }
    });
    //HER ARRAY FIELDIN SONUNCU BOSLUQUNU SILIR
    const cleanedProductsArray = standardProductsArray.map((item) => {
      if (item[item.length - 1] === "") {
        return item.slice(0, -1); // Son elemanı kaldır
      }
      return item; // Son eleman boş değilse, olduğu gibi döndür
    });

    // GERI DONDERILECEK OBJECT HALINA YIGIR
    const formattedProductsArray = cleanedProductsArray
      .map((item) => {
        if (item.length === 12) {
          return {
            barcode: item[0],
            price: item[8],
            count: item[10],
          };
        } else if (item.length === 11) {
          return {
            barcode: item[0],
            price: item[7],
            count: item[9],
          };
        } else if (item.length === 10) {
          return {
            barcode: item[0],
            price: item[6],
            count: item[8],
          };
        }
        return null;
      })
      .filter(Boolean);
    return {
      orderNo,
      products: formattedProductsArray,
    };
  } catch (error) {
    notification.warning({ message: error.message });
    console.log(error);
    return false;
  }
}

export function rahatAlgo(data) {
  try {
    if (!data) {
      throw new Error("Fayl formatı düzgün deyil!");
    }
    const orderNoRegex = /A_Ord-(\d+)/;
    const matchOrder = data.match(orderNoRegex);
    let orderNo;
    if (matchOrder && matchOrder[1]) {
      orderNo = matchOrder[1];
    } else {
      throw new Error("Sifariş nömrəsi tapılmadı!");
    }

    // EXTRACT ALL PRODUCTS SECTION
    const startKeyword = "Price  ";
    const startIndex = data.indexOf(startKeyword);
    if (startIndex === -1) {
      throw new Error("Məhsul məlumatlarında yanlışlıq var!");
    }
    const productSection = data
      .substring(startIndex + startKeyword.length)
      .trim();
    let productsArray;
    let barcodeLength;
    // PRODUCTLARDAN IBARET ARRAY
    // const productsArray = productSection.split(/(?<=\s)(?=\d+\s\d{9,}\s)/);
    if (productSection.includes("KODAK")) {
      productsArray = productSection.split(/(?<=\s)\d+\s+(?=\d{12}\s)/);
      barcodeLength = true;
    } else {
      productsArray = productSection.split(/(?<=\s)\d+\s+(?=\d{13}\s)/);
      barcodeLength = false;
    }

    //PRODUCTLARI STANDART ARRAY HALINA GETIRIR
    const standardProductsArray = productsArray.map((item) => {
      let startIndex;
      const parts = item.split(/\s+/);
      if (barcodeLength) {
        startIndex = parts.findIndex((part) => /^\d{12}$/.test(part));
      } else {
        startIndex = parts.findIndex((part) => /^\d{13}$/.test(part));
      }
      const endIndex = parts.findIndex((part) => /^\d+\.\d{2}$/.test(part));
      // IKISI ARASINI PAS KECIR
      if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        const relevantParts = [
          ...parts.slice(0, startIndex + 1),
          ...parts.slice(endIndex),
        ];
        return relevantParts;
      }
    });
    //HER ARRAY FIELDIN SONUNCU BOSLUQUNU SILIR
    const cleanedProductsArray = standardProductsArray.map((item) => {
      if (item[item.length - 1] === "") {
        return item.slice(0, -1); // Son elemanı kaldır
      }
      return item; // Son eleman boş değilse, olduğu gibi döndür
    });
    // GERI DONDERILECEK OBJECT HALINA YIGIR
    const formattedProductsArray = cleanedProductsArray
      .map((item, index) => {
        if (index === 0) {
          return {
            barcode: item[1],
            price: item[3],
            count: item[2].split(".")[0],
          };
        }
        return {
          barcode: item[0],
          price: item[2],
          count: item[1].split(".")[0],
        };
      })
      .filter(Boolean);
    return {
      orderNo,
      products: formattedProductsArray,
    };
  } catch (error) {
    notification.warning({ message: error.message });
    console.log(error);
    return false;
  }
}
