import React from "react";

const TextComponent = ({text}) => {
  return (
    <>
      {text}
    </>
  );
};

const FunComponent = () => {
  const cities = ["New York", "Los Angeles", "Chicago"];
  return (
    <div>
      {cities.map(city => <TextComponent text={city} key={city} />)}
    </div>
  );
};

export default FunComponent;