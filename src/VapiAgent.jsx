import React, { useEffect } from "react";
import Vapi from "@vapi-ai/web";

const VapiAgent = () => {
  useEffect(() => {
    const vapi = new Vapi(import.meta.env.VITE_VAPI_KEY);
    vapi.start(import.meta.env.VITE_VAPI_ASSISTANT_ID);
    // Add event listeners as needed
    return () => vapi.stop();
  }, []);

  return <div>Vapi Agent is running!</div>;
};

export default VapiAgent;