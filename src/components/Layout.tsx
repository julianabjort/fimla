import Footer from "./Footer";
import Header from "./Header";

// type Content = {
//   children: JSX.Element;
// };

const Layout = ({ children }: any) => {
  return (
    <div className="mx-20">
      <Header />
      <div className="mx-36 h-[90vh] flex flex-col justify-around">
        {children}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
