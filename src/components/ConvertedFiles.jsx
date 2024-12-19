import { useState } from "react";
import downloadIcon from "../assets/download.svg";
import excelIcon from "../assets/excel.svg";
import * as XLSX from "xlsx";
import { Button, notification, Spin } from "antd";
import { PiFileZipBold } from "react-icons/pi";
import { saveAs } from "file-saver"; // You might also need this library
import JSZip from "jszip";
import { nanoid } from "nanoid";

const ConvertedFiles = ({ files = [], loading }) => {
  const [downloadStatus, setDownloadStatus] = useState([]);
  const [zipLoading, setZipLoading] = useState(false);

  function handleDownload(excel, fileName, id) {
    XLSX.writeFile(excel, `${fileName}.xlsx`);
    setDownloadStatus([...downloadStatus, id]);
  }

  function downloadZip() {
    if (files.length) {
      setZipLoading(true);
      const zip = new JSZip();
      // Loop through the array of excel files and add them to the zip
      for (const file of files) {
        const fileNameWithExtension = `${file.fileName}.xlsx`; // You can customize the file naming
        const content = XLSX.write(file.excel, {
          bookType: "xlsx",
          type: "binary",
        });
        zip.file(fileNameWithExtension, content, { binary: true });
      }

      // Generate the zip file and trigger download
      zip
        .generateAsync({ type: "blob" })
        .then((content) => {
          saveAs(content, `bravo_${nanoid()}.zip`);
        })
        .catch((error) => {
          notification.error({ message: error.name });
        });
    } else {
      notification.info({ message: "Fayl yoxdur" });
    }

    setZipLoading(false);
  }

  return (
    <div className="mt-5">
      <div className="flex justify-between items-center">
        <p>Sifariş siyahısı ({files.length}) </p>
        <Button
          type=""
          size="middle"
          className="font-semibold"
          onClick={() => downloadZip()}
          icon={<PiFileZipBold />}
          loading={zipLoading}
        >
          ZIP endir
        </Button>
      </div>
      {files.length > 0 ? (
        <ul className="px-2 mt-4 divide-y divide-gray-200 ">
          <Spin spinning={loading}>
            {files.map((file, index) => (
              <li className="py-3 sm:pb-4" key={index}>
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="flex-shrink-0">
                    <img className="w-8 h-8" src={excelIcon} alt="icon" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      SİFARİŞ: {file.orderNo}
                    </p>
                    <p className="text-sm text-gray-500 truncate ">{`${file.fileName}.xlsx`}</p>
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900 ">
                    {downloadStatus.includes(file.id) ? (
                      <p className="font-light text-xs mr-2">YÜKLƏNDİ</p>
                    ) : (
                      ""
                    )}
                    <img
                      className="w-8 h-8 cursor-pointer"
                      src={downloadIcon}
                      alt="Neil image"
                      onClick={() =>
                        handleDownload(file.excel, file.fileName, file.id)
                      }
                    />
                  </div>
                </div>
              </li>
            ))}
          </Spin>
        </ul>
      ) : (
        <p className="text-slate-300 text-xs py-10 text-center">
          SİFARİŞ YOXDUR
        </p>
      )}
    </div>
  );
};

export default ConvertedFiles;
