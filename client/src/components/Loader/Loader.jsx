import React from "react";
import ReactLoading from "react-loading";

export default function Loader({type,color,width,height}) {
  return (
    <ReactLoading {...{type,color,width,height}} />
  );
}
