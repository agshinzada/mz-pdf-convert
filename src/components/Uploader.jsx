import { Spin } from "antd";
import Dropzone from "react-dropzone";

const Uploader = ({ setFiles, loading, setLoading }) => {
  function onDrop(acceptedFiles) {
    setLoading(true);
    setFiles(acceptedFiles);
    setLoading(false);
  }

  return (
    <div>
      <Spin spinning={loading}>
        <Dropzone
          onDrop={onDrop}
          accept={{
            "application/pdf": [".pdf", ".PDF"],
          }}
        >
          {({ getRootProps, getInputProps }) => (
            <section className=" bg-slate-100 mt-5">
              <div {...getRootProps()} className="flex p-10 justify-center">
                <input {...getInputProps()} />
                <p className="opacity-50">PDF faylı bura əlavə et</p>
              </div>
            </section>
          )}
        </Dropzone>
      </Spin>
    </div>
  );
};

export default Uploader;
