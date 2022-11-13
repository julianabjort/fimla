import Footer from "./Footer";
import Header from "./Header";

// type Content = {
//   children: JSX.Element;
// };

const Layout = ({ children }: any) => {
  return (
    <div className="mx-56 h-screen flex flex-col justify-between">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
