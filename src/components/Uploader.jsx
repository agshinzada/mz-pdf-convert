import Dropzone from "react-dropzone";

const Uploader = ({ setFiles }) => {
  function onDrop(acceptedFiles) {
    setFiles(acceptedFiles);
  }

  return (
    <div>
      <Dropzone
        onDrop={onDrop}
        accept={{
          "application/pdf": [".pdf", ".PDF"],
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <section className="p-10 bg-slate-100 mt-5">
            <div {...getRootProps()} className="flex justify-center">
              <input {...getInputProps()} />
              <p className="opacity-50">PDF faylı bura əlavə et</p>
            </div>
          </section>
        )}
      </Dropzone>
    </div>
  );
};

export default Uploader;
