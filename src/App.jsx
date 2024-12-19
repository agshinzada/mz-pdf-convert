import Uploader from "./components/Uploader";
import StoreTypes from "./components/StoreTypes";
import Header from "./components/Header";
import UploadedFiles from "./components/UploadedFiles";
import ConvertedFiles from "./components/ConvertedFiles";
import { useEffect, useState } from "react";
import pdfToText from "react-pdftotext";
import { nanoid } from "nanoid";
import MainFooter from "./components/MainFooter";
import { bazarstoreAlgo, bravoAlgo, rahatAlgo } from "./extractFunctions";
import { exportToExcel, generateFileName } from "./exportFunctions";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/build/pdf";

// PDF.js worker ayarı
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.js`;

const stores = [
  {
    key: 1,
    name: "Bazarstore",
    checked: false,
    disabled: true,
  },
  {
    key: 2,
    name: "Bravo",
    checked: true,
    disabled: false,
  },
  {
    key: 3,
    name: "Tamstore",
    checked: false,
    disabled: true,
  },
  {
    key: 4,
    name: "Rahat",
    checked: false,
    disabled: false,
  },
];

function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [selectedStore, setSelectedStore] = useState(stores[1].key);
  const [loading, setLoading] = useState(false);

  async function convertFiles() {
    let extArr = [];
    // console.log(uploadedFiles);
    for (const iterator of uploadedFiles) {
      setLoading(true);
      const data = await fetchPdfText(iterator);
      let extract;
      let excel;
      switch (selectedStore) {
        case 1:
          extract = bazarstoreAlgo(data);
          excel = exportToExcel(extract.products, 1);
          break;
        case 2:
          extract = bravoAlgo(data);
          extract ? (excel = exportToExcel(extract.products, 2)) : "";
          break;
        case 4:
          extract = rahatAlgo(data);
          extract ? (excel = exportToExcel(extract.products, 4)) : "";
          break;
        default:
          break;
      }
      const fileName = iterator.name.replace(".pdf", "");
      extArr.push({ id: nanoid(6), orderNo: extract.orderNo, excel, fileName });
      setLoading(false);
    }
    setConvertedFiles(extArr);
  }

  const fetchPdfText = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      let allText = "";
      fileReader.onload = async () => {
        try {
          const pdfData = new Uint8Array(fileReader.result);
          const loadingTask = getDocument({ data: pdfData });
          const pdf = await loadingTask.promise;
          const numPages = pdf.numPages;

          for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const content = await page.getTextContent();
            const pageText = content.items.map((item) => item.str).join(" ");
            allText += pageText + "\n";
          }
          resolve(allText);
        } catch (error) {
          reject(error);
        }
      };
      fileReader.onerror = () => {
        reject(new Error("Error reading file"));
      };
      fileReader.readAsArrayBuffer(file);
    });
  };

  // const fetchPdfText = async (file) => {
  //   const fileReader = new FileReader();
  //   let allText = "";

  //   // Dosya okuma tamamlandığında bu fonksiyon çalışacak
  //   fileReader.onload = async () => {
  //     const pdfData = new Uint8Array(fileReader.result);
  //     const loadingTask = getDocument({ data: pdfData });
  //     const pdf = await loadingTask.promise;
  //     const numPages = pdf.numPages;

  //     for (let pageNum = 1; pageNum <= numPages; pageNum++) {
  //       const page = await pdf.getPage(pageNum);
  //       const content = await page.getTextContent();
  //       const pageText = content.items.map((item) => item.str).join(" ");
  //       allText += pageText + "\n";
  //       setExtractText(allText);
  //     }
  //   };
  //   // Dosyayı okuyun
  //   fileReader.readAsArrayBuffer(file);
  // };

  return (
    <div className="bg-slate-100 min-h-screen justify-start items-center gap-5 flex flex-col relative">
      <div className="justify-center items-start gap-5 flex w-full px-10 max-w-[1400px]">
        <div className="bg-white p-10 w-1/2 min-h-[600px] shadow-md mt-6 flex-grow">
          <Header />
          <StoreTypes stores={stores} setStore={setSelectedStore} />
          <div className="">
            <Uploader
              setFiles={setUploadedFiles}
              loading={loading}
              setLoading={setLoading}
            />
            <UploadedFiles
              files={uploadedFiles}
              setFiles={setUploadedFiles}
              loading={loading}
            />
          </div>

          <button
            type="button"
            className="w-full mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2  focus:outline-none "
            onClick={convertFiles}
            disabled={uploadedFiles <= 0}
          >
            Convert
          </button>
        </div>
        <div className="bg-white p-10 w-1/2 min-h-[600px] shadow-md mt-6">
          <ConvertedFiles files={convertedFiles} loading={loading} />
        </div>
      </div>

      <MainFooter />
    </div>
  );
}

export default App;
