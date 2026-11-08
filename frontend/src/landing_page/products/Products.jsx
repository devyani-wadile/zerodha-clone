
import React from "react";

import Hero from "./Hero";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import Universe from "./Universe";

import kiteImage from "../../../media/images/images/kite.png";
import consoleImage from "../../../media/images/images/console.png";
import coinImage from "../../../media/images/images/coin.png";
import kiteConnectImage from "../../../media/images/images/kiteconnect.png";
import varsityImage from "../../../media/images/images/varsity.png";

function Products() {
  return (
    <>
      <Hero />

      <LeftSection
        imageURL={kiteImage}
        productName="Kite"
        productDesription="Our ultra-fast flagship trading platform with streaming market data, advanced charts, an elegant UI, and more. Enjoy the Kite experience seamlessly on your Android and iOS devices."
        tryDemo=""
        learnMore=""
        googlePlay=""
        appStore=""
      />

      <RightSection
        imageURL={consoleImage}
        productName="Console"
        productDesription="The central dashboard for your Zerodha account. Gain insights into your trades and investments with in-depth reports and visualisations."
        learnMore=""
      />

      <LeftSection
        imageURL={coinImage}
        productName="Coin"
        productDesription="Buy direct mutual funds online, commission-free, delivered directly to your Demat account. Enjoy the investment experience on your Android and iOS devices."
        tryDemo=""
        learnMore=""
        googlePlay=""
        appStore=""
      />

      <RightSection
        imageURL={kiteConnectImage}
        productName="Kite Connect API"
        productDesription="Build powerful trading platforms and experiences with our super simple HTTP/JSON APIs. If you are a startup, build your investment app and showcase it to our clientbase."
        learnMore=""
      />

      <LeftSection
        imageURL={varsityImage}
        productName="Varsity mobile"
        productDesription="An easy to grasp, collection of stock market lessons with in-depth coverage and illustrations. Content is broken down into bite-size cards to help you learn on the go."
        tryDemo=""
        learnMore=""
        googlePlay=""
        appStore=""
      />

      <p className="text-center mt-5 mb-5">
        Want to know more about our technology stack? Check out the Zerodha.tech
        blog.
      </p>

      <Universe />
    </>
  );
}

export default Products;
