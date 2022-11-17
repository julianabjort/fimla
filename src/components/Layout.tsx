import Footer from "./Footer";
import Header from "./Header";

// type Content = {
//   children: JSX.Element;
// };

const Layout = ({ children }: any) => {
  return (
    <div className="mx-6 md:mx-20">
      <Header />
      <div className="flex flex-col justify-around md:mx-20 lg:mx-36">
        {children}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
