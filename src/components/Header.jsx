import logo from "../assets/logo.svg";

const Header = () => {
  return (
    <div className="flex gap-2 items-center justify-center mb-8">
      <img src={logo} alt="logo" className="w-8" />
      <h1 className="text-lg font-semibold">File Converter</h1>
    </div>
  );
};

export default Header;
