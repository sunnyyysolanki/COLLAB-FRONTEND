import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { useParams } from "react-router";
import { sendMessage, receiveMessage } from "../../socket";
import { X, Play, Plus, Trash2, Edit3 } from "lucide-react";

const WorkSpace = ({
  currentFile,
  setCurrentFile,
  fileTree,
  setFileTree,
  openFiles,
  setOpenFiles,
  webContainer,
  saveFileTree,
}) => {
  const codeRef = useRef(null);
  const [iframeURL, setIframeURL] = useState(null);
  const [RunProcess, setRunProcess] = useState(null);
  const project_id = useParams().id;

  useEffect(() => {
    receiveMessage("project-code", (data) => {
      setFileTree(data);
    });
  }, [project_id, setFileTree]);

  async function sendCode(file) {
    sendMessage("project-code", file);
  }
  const createNewFile = () => {
    let counter = 1;
    let newFileName = `newFile${counter}.js`;

    // Ensure unique filename
    while (fileTree[newFileName]) {
      counter++;
      newFileName = `newFile${counter}.js`;
    }

    const updatedFileTree = {
      ...fileTree,
      [newFileName]: { file: { contents: "" } },
    };

    setFileTree(updatedFileTree);
    setOpenFiles((prev) => [...prev, newFileName]);
    setCurrentFile(newFileName);
    saveFileTree(updatedFileTree);
  };

  const deleteFile = (fileName) => {
    const updatedFileTree = { ...fileTree };
    delete updatedFileTree[fileName];
    setFileTree(updatedFileTree);
    setOpenFiles(openFiles.filter((file) => file !== fileName));
    if (currentFile === fileName) {
      setCurrentFile(openFiles.length > 1 ? openFiles[0] : null);
    }
    saveFileTree(updatedFileTree);
  };

  const renameFile = (oldName) => {
    const newName = prompt("Enter new file name:", oldName);
    if (newName && newName !== oldName) {
      const updatedFileTree = { ...fileTree, [newName]: fileTree[oldName] };
      delete updatedFileTree[oldName];
      setFileTree(updatedFileTree);
      setOpenFiles(
        openFiles.map((file) => (file === oldName ? newName : file))
      );
      if (currentFile === oldName) {
        setCurrentFile(newName);
      }
      saveFileTree(updatedFileTree);
    }
  };

  const runProject = async () => {
    await webContainer.mount(fileTree);
    const install_process = await webContainer.spawn("npm", ["install"]);
    install_process.output.pipeTo(
      new WritableStream({
        write(chunk) {
          console.log(chunk.toString());
        },
      })
    );

    if (RunProcess) {
      await RunProcess.kill();
    }

    const TempRunProcess = await webContainer.spawn("npm", ["start"]);
    setRunProcess(TempRunProcess);

    webContainer.on("server-ready", (port, url) => {
      setIframeURL(url);
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] w-full bg-gray-950 text-white">
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 p-4 bg-gray-900 shadow-lg rounded-lg overflow-auto scrollbar-thin scrollbar-thumb-gray-700">
          <h2 className="text-lg font-semibold mb-4 text-purple-400">Files</h2>
          {Object.keys(fileTree).map((fileName, index) => (
            <div key={index} className="flex items-center justify-between">
              <button
                onClick={() => {
                  setCurrentFile(fileName);
                  if (!openFiles.includes(fileName)) {
                    setOpenFiles([...openFiles, fileName]);
                  }
                }}
                className={`block flex-1 px-2 py-2 mb-2 rounded-lg text-left transition-all ${
                  currentFile === fileName
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                <p className="m-0 max-w-28 overflow-scroll">{fileName}</p>
              </button>
              <Edit3
                className="text-blue-400 hover:text-blue-600 cursor-pointer ml-2"
                onClick={() => renameFile(fileName)}
              />
              <Trash2
                className="text-red-400 hover:text-red-600 cursor-pointer ml-2"
                onClick={() => deleteFile(fileName)}
              />
            </div>
          ))}
          <button
            className="w-full flex items-center justify-center px-4 py-2 mt-4 bg-blue-500 rounded-lg hover:bg-blue-600 transition-all"
            onClick={createNewFile}
          >
            <Plus className="mr-2" /> New File
          </button>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col bg-gray-900 p-4 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4 bg-gray-800 p-3 rounded-lg">
            <div className="flex space-x-2 overflow-auto scrollbar-thin scrollbar-thumb-gray-700">
              {openFiles.map((file, index) => (
                <div
                  key={index}
                  className={`flex items-center px-4 py-2 rounded-md cursor-pointer transition-all ${
                    currentFile === file
                      ? "bg-purple-500"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                  onClick={() => setCurrentFile(file)}
                >
                  <span className="mr-2 truncate max-w-[150px]">{file}</span>
                  <X
                    className="text-red-400 hover:text-red-600 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenFiles(openFiles.filter((f) => f !== file));
                      if (currentFile === file) {
                        setCurrentFile(
                          openFiles.length > 1 ? openFiles[0] : null
                        );
                      }
                    }}
                  />
                </div>
              ))}
            </div>
            <button
              className="flex items-center bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
              onClick={runProject}
            >
              <Play className="mr-2" /> RUN
            </button>
          </div>

          {/* Reduced Height Code Editor */}
          <div className="bg-gray-950 flex-1 overflow-auto p-4 rounded-lg text-2xl h-[60%]">
            {currentFile ? (
              <pre className="hljs h-full">
                <code
                  ref={codeRef}
                  className="hljs outline-none p-4"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const updatedContent = e.target.innerText;
                    const updatedFileTree = {
                      ...fileTree,
                      [currentFile]: { file: { contents: updatedContent } },
                    };
                    setFileTree(updatedFileTree);
                    saveFileTree(updatedFileTree);
                    sendCode(updatedFileTree);
                  }}
                  dangerouslySetInnerHTML={{
                    __html: hljs.highlightAuto(
                      fileTree[currentFile]?.file.contents || ""
                    ).value,
                  }}
                />
              </pre>
            ) : (
              <p className="text-gray-500 text-lg">Select a file to edit</p>
            )}
          </div>

          {/* Iframe Section (Appears Only If URL Exists) */}
          {iframeURL && (
            <div className="h-[40%] mt-4 border-2 border-gray-700 rounded-lg overflow-hidden bg-gray-900 shadow-lg">
              <div className="flex items-center justify-between p-3 bg-gray-800">
                <input
                  type="text"
                  value={iframeURL || ""}
                  onChange={(e) => setIframeURL(e.target.value)}
                  placeholder="Enter a URL..."
                  className="w-full px-3 py-2 text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <iframe
                src={iframeURL}
                title="Project Preview"
                className="w-full h-full rounded-b-lg border-none bg-gray-200"
              ></iframe>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkSpace;

WorkSpace.propTypes = {
  currentFile: PropTypes.string,
  setCurrentFile: PropTypes.func.isRequired,
  fileTree: PropTypes.object.isRequired,
  setFileTree: PropTypes.func.isRequired,
  openFiles: PropTypes.array.isRequired,
  setOpenFiles: PropTypes.func.isRequired,
  webContainer: PropTypes.object.isRequired,
  saveFileTree: PropTypes.func.isRequired,
};
