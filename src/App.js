import "./App.css";
import * as React from "react";

function App() {
  const [state, setState] = React.useState({
    mid: "",
    phoneNumber: "",
  });

  const [response, setResponse] = React.useState();
  const [userOTP, setUserOTP] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleCekMerchant = (e) => {
    e.preventDefault();
    fetchApi();
    console.log("submitted");
  };

  const handleCekUser = (e) => {
    e.preventDefault();
    fetchApiUser();
    console.log("submitted user");
  };

  const handleCekUserOTP = (e) => {
    e.preventDefault();
    fetchApiUserOTP();
    console.log("submitted user");
  };

  const fetchApi = () => {
    setIsLoading(true);
    console.log("Fecthinbg api...");
    fetch("https://api.zipay.id/api/Merchant/QrisKYCDetailSingle", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*", // It can be used to overcome cors errors
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        adminPhoneNumber: "08170012002",
        adminPassword: "123456",
        userPhoneNumber: state.phoneNumber,
        userMid: state.mid,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        setResponse(response?.result);
        setIsLoading(false);
      });
  };

  const fetchApiUser = () => {
    setIsLoading(true);
    console.log("Fecthing api user...");
    fetch("https://api.zipay.id/api/User/KYCDetail", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*", // It can be used to overcome cors errors
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        adminPhoneNumber: "08170012002",
        adminPassword: "123456",
        userPhoneNumber: state.phoneNumber,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        setResponse(response?.result);
        setIsLoading(false);
      });
  };

  const fetchApiUserOTP = () => {
    setIsLoading(true);
    console.log("Fecthing api user...");
    fetch(`https://zipay-dev-toolbox.vercel.app/getotp/${state.phoneNumber}`, {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*", // It can be used to overcome cors errors
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setUserOTP(response?.result[0]);
        setIsLoading(false);
      });
  };

  console.log("response : " + JSON.stringify(userOTP));

  return (
    <div className="meme-container">
      <div>
        <form>
          <h1 style={{ color: "white" }}>Zipay Toolbox</h1>
          <input
            type="text"
            name="mid"
            placeholder="User MID"
            value={state.mid}
            onChange={handleChange}
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="User Phone Number"
            value={state.phoneNumber}
            onChange={handleChange}
          />
          <button onClick={handleCekMerchant}>Cek Merchant</button>
          <button onClick={handleCekUser}>Cek User</button>
          <button onClick={handleCekUserOTP}>Cek User OTP DEV</button>

          {isLoading && (
            <div style={{ textAlign: "left", padding: 20 }}>
              <p style={{ color: "white" }}>LOADING....</p>
            </div>
          )}

          {response && (
            <div style={{ textAlign: "left", padding: 20 }}>
              <p style={{ color: "white" }}>
                Master MID : {response?.mid ?? "...."}
              </p>
              <p style={{ color: "white" }}>
                User Name : {response?.firstName + response?.lastName ?? "...."}
              </p>
              <p style={{ color: "white" }}>
                Email : {response?.email ?? "...."}
              </p>
              <p style={{ color: "white" }}>
                Phone Number: {response?.phoneNumber ?? "...."}
              </p>
              <p style={{ color: "white" }}>
                KYC Status :{response?.kycStatus ?? "...."}
              </p>
              <p style={{ color: "white" }}>
                Reject Reason : {response?.rejectReason ?? "...."}
              </p>
              <p style={{ color: "white" }}>
                Request Date : {response?.requestDate ?? "...."}
              </p>
              <p style={{ color: "white" }}>
                NPWP : {response?.npwp ?? "...."}
              </p>
            </div>
          )}
          {userOTP && (
            <div style={{ textAlign: "left", padding: 20 }}>
              <p style={{ color: "white" }}>
                User OTP : {userOTP?.OTP ?? "...."}
              </p>
              <p style={{ color: "white" }}>
                User ID : {userOTP?.UserId ?? "...."}
              </p>
            </div>
          )}
        </form>
      </div>
      {response && (
        <div className="image-container">
          <div className="meme">
            <img
              src={`data:image/png;base64,${response?.ktpImage}`}
              alt="KTP Image"
            />
            <h2 className="bottom">{"KTP"}</h2>
          </div>
          <div className="meme">
            <img
              src={`data:image/png;base64,${response?.selfieImage}`}
              alt="Selfie Image"
            />
            <h2 className="bottom">{"SELFIE"}</h2>
          </div>
          <div className="meme">
            <img
              src={`data:image/png;base64,${response?.npwpImage}`}
              alt="NPWP Image"
            />
            <h2 className="bottom">{"NPWP"}</h2>
          </div>
          <div className="meme">
            <img
              src={`data:image/png;base64,${response?.businessImage}`}
              alt="Business Image"
            />
            <h2 className="bottom">{"BUSINESS"}</h2>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
