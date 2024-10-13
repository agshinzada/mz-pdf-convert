import downloadIcon from "../assets/download.svg";
import excelIcon from "../assets/excel.svg";

const ConvertedFiles = ({ files = [] }) => {
  function handleDownload(params) {}
  return (
    <div className="mt-5">
      <p>EXCEL fayllar</p>
      {files.length > 0 ? (
        <ul className="px-2 mt-4 divide-y divide-gray-200 ">
          {files.map((file, index) => (
            <li className="py-3 sm:pb-4" key={index}>
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="flex-shrink-0">
                  <img className="w-8 h-8" src={excelIcon} alt="icon" />
                </div>
                <div className="flex-1 min-w-0">
                  {/* <p className="text-sm font-medium text-gray-900 truncate ">
          {store?.name}
        </p> */}
                  <p className="text-sm text-gray-500 truncate ">{file.name}</p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 ">
                  <img
                    className="w-8 h-8 cursor-pointer"
                    src={downloadIcon}
                    alt="Neil image"
                    onClick={() => handleDownload(file.name)}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-300 text-xs py-4 text-center">FAYL YOXDUR</p>
      )}
    </div>
  );
};

export default ConvertedFiles;
