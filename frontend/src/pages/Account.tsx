// ...existing code...
import { useEffect, useState } from "react";
import axios from "axios";
import "../../public/root/index.scss";

const Account = () => {
  const [fetchDataValue, setFetchDataValue] = useState(null);
  const fetchData = async () => {
    const res = await axios.get(
      `${process.env.DUMMY_API_URL_DEV}/get-user-info`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    setFetchDataValue(res.data);
    console.log(res);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Account Page</h1>
      <pre>{JSON.stringify(fetchDataValue, null, 2)}</pre>
    </div>
  );
};

export default Account;
