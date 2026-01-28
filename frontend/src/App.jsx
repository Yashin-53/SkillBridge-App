// import AppRoutes from "./routes/AppRoutes";
// import "./assets/css/styles.css";
// import 'react-toastify/dist/ReactToastify.css';
// // --- 2. Import the ToastContainer ---
// import { ToastContainer } from 'react-toastify';

// function App() {
//   return <AppRoutes />;

//   <ToastContainer>
//     position="bottom-right"
//     autoClose={5000}
//     hideProgressBar={false}
//     newestOnTop={true}
//     closeOnClick
//     rtl={false}
//     pauseOnFocusLoss
//     draggable
//     pauseOnHover
//     theme="light"
//   </ToastContainer>

// }



// export default App;

import AppRoutes from "./routes/AppRoutes";
import "./assets/css/styles.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
      <AppRoutes />

      {/* ✅ FIX: Props go inside the opening tag, and it sits inside the return */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;