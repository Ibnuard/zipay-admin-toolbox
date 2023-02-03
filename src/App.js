import "./App.css";
import * as React from "react";

function App() {
  const [state, setState] = React.useState({
    mid: "",
    phoneNumber: "",
  });

  const [response, setResponse] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [kycLoading, setKycLoading] = React.useState(false);
  const [kycResponse, setKycResponse] = React.useState();
  const [mode, setMode] = React.useState("kyc");
  const [user, setUser] = React.useState();
  const [balance, setBalance] = React.useState();
  const [receiver, setReceiver] = React.useState();
  const [amount, setAmount] = React.useState();
  const [tranferResult, setTranferResult] = React.useState();

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

  // ==================== KYC DETAIL
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

  // ======================= KYC DETAIL
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

  // =================== ACC/RJJ KYC
  const fetchApiKYC = (e, types) => {
    e.preventDefault();
    setKycLoading(true);
    console.log("Fecthing api user...");
    const type = types == "acc" ? "ApprovalKYC" : "RejectKYC";
    fetch(`https://api.zipay.id/api/User/${type}`, {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*", // It can be used to overcome cors errors
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        adminPhoneNumber: "08170012002",
        adminPassword: "123456",
        userPhoneNumber: state.phoneNumber,
        userMid: "zipay",
        description: "",
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        setKycResponse(
          response?.status == 400 ? response?.errors : response?.result
        );
        setKycLoading(false);
        console.log(JSON.stringify(response));
      });
  };

  //SWITCH MODE
  const switchMode = (e) => {
    e.preventDefault();
    setMode(mode === "transfer" ? "kyc" : "transfer");
  };

  React.useEffect(() => {
    loginDEV();
    setIsLoading(false);
    setTranferResult();
  }, [mode]);

  // ==================== LOGIN DEV
  const loginDEV = () => {
    console.log("DEV LOGIN");
    setIsLoading(true);
    console.log("Fecthinbg api...");
    fetch("https://apidev.zipay.id/api/Auth/Login", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*", // It can be used to overcome cors errors
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "85741894533",
        password: "123456",
        deviceType: "android",
        deviceId: "string",
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        setUser(response?.result);
        setIsLoading(false);
      });
  };

  // ==================== LOGIN DEV
  const balanceDEV = (e) => {
    e.preventDefault();
    console.log("token : " + user?.token);
    setIsLoading(true);
    fetch("https://apidev.zipay.id/api/Wallet/balance/me", {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*", // It can be used to overcome cors errors
        Authorization: `Bearer ${user?.token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setBalance(response?.result?.walletAmount);
        setIsLoading(false);
      });
  };

  // ==================== LOGIN DEV
  const transferDEV = (e) => {
    e.preventDefault();
    console.log("DEV TRANFER");
    setIsLoading(true);
    console.log("Fecthinbg api...");
    fetch("https://apidev.zipay.id/api/Wallet/TransferMoney", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*", // It can be used to overcome cors errors
        Authorization: `Bearer ${user?.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        receiver: receiver,
        amount: amount,
        description: "Testing transfer money",
        transactionId: 0,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        setIsLoading(false);
        const res = response?.result;
        if (res == "Balance Transfered.") {
          setTranferResult("TRANNSFER SUCCESS");
        } else {
          setTranferResult("TRANNSFER FAILED");
        }
      });
  };

  //===================== RENDER GAP

  return (
    <div className="meme-container">
      <div>
        {mode === "kyc" ? (
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
            <button onClick={switchMode}>Tranfer Balance Dev</button>

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
                  User Name :{" "}
                  {response?.firstName + response?.lastName ?? "...."}
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
            {response &&
              (kycResponse ? (
                <p>KYC Approval : {kycResponse}</p>
              ) : (
                <div>
                  <button
                    onClick={(e) => (kycLoading ? null : fetchApiKYC(e, "acc"))}
                  >
                    {kycLoading ? "Loading..." : "Approve KYC"}
                  </button>
                  <button
                    onClick={(e) => (kycLoading ? null : fetchApiKYC(e, "rjj"))}
                  >
                    {kycLoading ? "Loading..." : "Reject KYC"}
                  </button>
                </div>
              ))}
          </form>
        ) : (
          <form>
            <h2 style={{ color: "white" }}>Tranfer Balance Zipay ( DEV )</h2>
            <p style={{ fontWeight: "bold", color: "white", marginBottom: 14 }}>
              Balance Tersedia : {balance ?? "0"}
            </p>
            <input
              type="text"
              name="phoneNumber"
              placeholder="Nomor Tujuan"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
            />
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={balanceDEV}>Get Available Balance</button>
            {balance && <button onClick={transferDEV}>Tranfer Balance</button>}
            <button onClick={switchMode}>Mode KYC</button>
            <div>
              <h2 style={{ marginTop: 14, color: "white" }}>
                {isLoading ? "LOADING TRANSFER BALANCE..." : tranferResult}
              </h2>
            </div>
          </form>
        )}
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
