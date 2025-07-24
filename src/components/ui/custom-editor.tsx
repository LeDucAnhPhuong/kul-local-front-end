import dynamic from "next/dynamic";

import type { EditorProps } from "./quill-editor";
const QuillEditor = dynamic(() => import("./quill-editor"), { ssr: false });

const CustomEditor = ({ ...props }: EditorProps) => {
  return <QuillEditor {...props} />;
};

export default CustomEditor;
