import React from "react";
import PropTypes from "prop-types";

const Ai_File_Container = ({
  fileTree,
  setCurrentFile,
  setOpenFiles,
  openFiles,
}) => {
  return <div></div>;
};

Ai_File_Container.propTypes = {
  fileTree: PropTypes.objectOf(PropTypes.object).isRequired,
  setCurrentFile: PropTypes.func.isRequired,
  setOpenFiles: PropTypes.func.isRequired,
  openFiles: PropTypes.array.isRequired,
};

export default Ai_File_Container;
