import Header from "./Header";

// type Content = {
//   children: JSX.Element;
// };

const Layout = ({ children }: any) => {
  return (
    <div className="mx-56">
      <Header />
      {children}
    </div>
  );
};

export default Layout;
