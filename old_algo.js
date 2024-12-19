function bravoAlgo(data) {
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
    // EXTRACT ALL PRODUCTS
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
    const productsArray = productSection.split(/\d+\.\s+/).slice(1);
    console.log(productsArray);

    const p1Regex =
      /(\d{13,14})\s+.*?\s+(P\s?1)\s+(\d+\.\d+)\s+.*?(\d+)\s+(P1)/g;

    const products = [];
    let matchP1;

    while ((matchP1 = p1Regex.exec(productSection)) !== null) {
      const product = {
        barcode: matchP1[1], // Barcode
        price: parseFloat(matchP1[3]), // Price after P1
        count: parseInt(matchP1[4], 10), // Count after P1
      };
      products.push(product);
    }

    //   const regex = /(\d{13,14})\s+.*?\s+BX\s+(\d+\.\d+)\s+.*?(\d+)\s+BX/g;
    //   const regex = /(\d{13,14})\s+.*?\s+(B\s?X)\s+(\d+\.\d+)\s+.*?(\d+)\s+(BX)/g;
    const regex = /(\d{13,14})\s+.*?B\s?X\s+(\d+\.\d+)\s+(\d+)\s+BX/g;

    let matchBx;

    while ((matchBx = regex.exec(productSection)) !== null) {
      const product = {
        barcode: matchBx[1], // Barcode
        price: parseFloat(matchBx[3]), // Price
        count: parseInt(matchBx[4], 10), // Count
      };
      products.push(product);
    }

    return {
      orderNo,
      products,
    };
  } catch (error) {
    //   notification.warning({ message: error.message });
    return false;
  }
}
