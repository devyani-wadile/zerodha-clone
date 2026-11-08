
import React, { useState } from "react";

import BuyActionWindow from "./BuyActionWindow";

const GeneralContext = React.createContext({
  openBuyWindow: (uid, price, mode) => {},
  closeBuyWindow: () => {},
});

export const GeneralContextProvider = (props) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [selectedStockPrice, setSelectedStockPrice] = useState(0);
  const [selectedOrderMode, setSelectedOrderMode] = useState("BUY");

  // Open the order window in BUY or SELL mode
  const handleOpenBuyWindow = (uid, price, mode = "BUY") => {
    setSelectedStockUID(uid);
    setSelectedStockPrice(Number(price) || 0);
    setSelectedOrderMode(mode);
    setIsBuyWindowOpen(true);
  };

  // Close the order window
  const handleCloseBuyWindow = () => {
    setIsBuyWindowOpen(false);
    setSelectedStockUID("");
    setSelectedStockPrice(0);
    setSelectedOrderMode("BUY");
  };

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow: handleOpenBuyWindow,
        closeBuyWindow: handleCloseBuyWindow,
      }}
    >
      {props.children}

      {isBuyWindowOpen && (
        <BuyActionWindow
          uid={selectedStockUID}
          price={selectedStockPrice}
          mode={selectedOrderMode}
        />
      )}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
