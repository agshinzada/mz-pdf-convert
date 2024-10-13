import Uploader from "./components/Uploader";
import StoreTypes from "./components/StoreTypes";
import Header from "./components/Header";
import UploadedFiles from "./components/UploadedFiles";
import ConvertedFiles from "./components/ConvertedFiles";
import { useState } from "react";
import pdfToText from "react-pdftotext";
import * as XLSX from "xlsx";

const stores = [
  {
    key: 1,
    name: "Bazarstore",
    checked: true,
  },
  {
    key: 2,
    name: "Bravo",
    checked: false,
  },
  {
    key: 3,
    name: "Tamstore",
    checked: false,
  },
];

function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [selectedStore, setSelectedStore] = useState(stores[0]);
  const [extractedText, setExtraxtedText] = useState(false);
  const [loading, setLoading] = useState(true);

  async function convertFiles() {
    console.log(uploadedFiles);
    for (const iterator of uploadedFiles) {
      const data = await pdfToText(iterator);
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
      console.log("Sifariş Nömrəsi:", orderNumber);
      console.log("Məhsullar:", products);
    }
  }

  return (
    <div className="bg-slate-100 min-h-screen justify-center items-center flex">
      <div className="bg-white p-10 min-w-[700px] min-h-[500px] shadow-md mt-4">
        <Header />
        <StoreTypes stores={stores} setStore={setSelectedStore} />
        <div className="">
          <Uploader setFiles={setUploadedFiles} />
          <UploadedFiles files={uploadedFiles} setFiles={setUploadedFiles} />
          <ConvertedFiles files={[]} />
        </div>

        <button
          type="button"
          className="w-full mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2  focus:outline-none "
          onClick={convertFiles}
          disabled={uploadedFiles <= 0}
        >
          Convert
        </button>
        {/* <button
          type="button"
          className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 "
        >
          Convert
        </button> */}
      </div>
    </div>
  );
}

export default App;
