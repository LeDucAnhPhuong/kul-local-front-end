import React from "react";
import dynamic from "next/dynamic";

import type { EditorProps } from "./News";
const QuillEditor = dynamic(() => import("./News"), { ssr: false });

const CustomEditor = ({ ...props }: EditorProps) => {
  return <QuillEditor {...props} />;
};

export default CustomEditor;
