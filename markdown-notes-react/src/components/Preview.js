import React from "react";
import { useTheme } from "@mui/material/styles";
import ReactMarkdown from "react-markdown";

const MarkdownPreview = ({ editorHeight, sideMenuWidth, editorContent, fontFamily }) => {
    const theme = useTheme();

    return (
        <div
            className="markdown-preview"
            style={{
                position: "absolute",
                top: editorHeight + 60,
                left: sideMenuWidth + 5,
                width: `calc(100% - ${sideMenuWidth}px - 25px)`,
                height: `calc(100% - ${editorHeight}px - 80px)`,
                overflow: "auto",
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                padding: "10px",
                fontFamily: fontFamily,
                whiteSpace: "normal",
                overflowX: "hidden"
            }}
        >
            <ReactMarkdown>{editorContent}</ReactMarkdown>
        </div>
    );
};

export default MarkdownPreview;
