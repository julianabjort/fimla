import React from "react";
import { motion } from "framer-motion";
import { useState } from "react";
import LoadingIcon from "../components/LoadingIcon";

const Animate = () => {
  const [move, setMove] = useState(false);
  return (
    <div>
      <LoadingIcon />
    </div>
  );
};

export default Animate;
