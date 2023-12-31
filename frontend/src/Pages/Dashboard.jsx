import { Box, Stack, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import Container from "@mui/material/Container";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ClearIcon from "@mui/icons-material/Clear";
import { CopyToClipboard } from "react-copy-to-clipboard";
import toast, { Toaster } from "react-hot-toast";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";

import { useState, useRef, useEffect } from "react";

const StyledTextarea = styled(TextareaAutosize)(
  ({ theme }) => `
    width: 100%;
    resize:none;
    margin:20px 0;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    outline:none;
    padding: 12px;
    border-radius:0px 0px 5px 5px;
    border: 1px solid #fff;`
);

export default function Dashboard() {
  const [text, setText] = useState("");
  const [filesContent, setFilesContent] = useState([]);
  const textRef = useRef(null);

  const focusText = () => {
    textRef.current.focus();
  };

  useEffect(() => {
    focusText();
  }, []);
  //                                          Download file to PC

  const handleFileSelection = (event) => {
    const selectedFiles = event.target.files;

    // Process each selected file
    const preparedFiles = Array.from(selectedFiles).map((file) => {
      return {
        content: file, // Store the File object itself
        type: file.type, // Get the MIME type of the file
        name: file.name, // Get the file name
      };
    });

    // Update state with the prepared files
    setFilesContent((prevFiles) => [...prevFiles, ...preparedFiles]);
  };

  const handleDownload = () => {
    // Loop through each file in filesContent array
    filesContent.forEach((file, index) => {
      // Create a Blob object for each file
      const blob = new Blob([file.content], { type: file.type });

      // Create a temporary URL for the Blob object
      const url = URL.createObjectURL(blob);

      // Create an anchor element to trigger the download
      const a = document.createElement("a");
      a.href = url;
      a.download = `file_${index + 1}.${file.extension}`; // Set the file name

      // Append the anchor element to the body and trigger the download
      document.body.appendChild(a);
      a.click();

      // Remove the anchor element after download
      document.body.removeChild(a);

      // Clean up the temporary URL created
      URL.revokeObjectURL(url);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFilesContent([...filesContent, ...droppedFiles]);
  };

  useEffect(() => {
    console.log(filesContent);
  }, [filesContent]);

  return (
    <Container maxWidth="md" sx={{ my: 5 }}>
      <Toaster />
      <Stack direction="row" gap={2} flexWrap="wrap">
        <Stack gap={0} flex={1}>
          <Typography
            variant="h5"
            fontWeight={700}
            color="#fff"
            bgcolor="#1976D2"
            textAlign="center"
            p={1}
            borderRadius="5px 5px 0px 0px"
          >
            Text
          </Typography>
          <StyledTextarea
            sx={{ margin: 0 }}
            minRows={16}
            maxRows={16}
            id="outlined-basic"
            variant="outlined"
            value={text}
            onChange={(e) => setText(e.target.value)}
            ref={textRef}
          />
          <Stack direction="row" mt={2} gap={2}>
            <CopyToClipboard text={text}>
              <Button
                size="small"
                endIcon={<ContentCopyIcon />}
                sx={{ width: "fit-content", fontWeight: 700 }}
                variant="contained"
                onClick={() => {
                  if (text) {
                    toast.success("Copied to clipboard");
                  } else {
                    toast.error("Nothing to copy");
                  }
                }}
              >
                Copy
              </Button>
            </CopyToClipboard>

            <Button
              color="error"
              size="small"
              endIcon={<ClearIcon />}
              sx={{ width: "fit-content", fontWeight: 700 }}
              variant="contained"
              onClick={() => {
                setText("");
                focusText();
              }}
            >
              Clear
            </Button>
          </Stack>
        </Stack>
        <Stack flex={1} gap={0} borderRadius={2}>
          <Typography
            variant="h5"
            fontWeight={700}
            color="#fff"
            bgcolor="#38c949"
            textAlign="center"
            p={1}
            borderRadius="5px 5px 0px 0px"
          >
            Files
          </Typography>
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{ height: "100%", border: "dashed #fff", padding: "10px" }}
          >
            <Stack gap={1} alignItems="center">
              <Typography
                textAlign="center"
                variant="h5"
                color="rgba(255, 255, 255, 0.8)"
              >
                Drag and drop files
              </Typography>
              <Typography
                textAlign="center"
                variant="h6"
                color="rgb(255, 255, 255)"
              >
                or
              </Typography>
              <label htmlFor="image-upload">
                <Button
                  component="span"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload File
                </Button>
              </label>
              <input
                id="image-upload"
                type="file"
                multiple
                onChange={handleFileSelection}
                style={{ display: "none" }}
              />
            </Stack>
          </div>
          <Stack direction="row" mt={2} gap={2}>
            <Button
              size="small"
              endIcon={<DownloadIcon />}
              sx={{ width: "fit-content", fontWeight: 700 }}
              variant="contained"
              onClick={handleDownload}
            >
              Download
            </Button>

            <Button
              color="error"
              size="small"
              endIcon={<ClearIcon />}
              sx={{ width: "fit-content", fontWeight: 700 }}
              variant="contained"
              onClick={() => {
                setText("");
                focusText();
              }}
            >
              Clear
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}
