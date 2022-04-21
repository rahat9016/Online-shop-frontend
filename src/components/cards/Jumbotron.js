import React from "react";
import Typewrite from "typewriter-effect";
const Jumbotron = ({ text }) => {
  return (
    <>
      <Typewrite
        options={{
          strings: text,
          autoStart: true,
          loop: true,
        }}
      />
    </>
  );
};

export default Jumbotron;
