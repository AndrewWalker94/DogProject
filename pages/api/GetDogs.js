import { useState, useEffect } from "react";
import axios from "axios";

const GetDogs = params => {
  const [details, setDetails] = useState();
  const [status, setStatus] = useState();

  useEffect(() => {
    try {
      (async () => {
        setStatus("LOADING");
        const response = await axios({
          method: "get",
          url: "https://dog.ceo/api/breeds/list/all"
        });
        console.log(response.data)
        setDetails(response.data.message);
        setStatus("OK");
      })();
    } catch (e) {
      setStatus("ERROR");
    }
  }, []);

    return details;
};

export default GetDogs;