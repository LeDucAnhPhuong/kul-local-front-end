import dynamic from 'next/dynamic';

// import type { EditorProps } from './News';
const QuillEditor = dynamic(() => import('./News'), { ssr: false });

const CustomEditor = ({ ...props }: any) => {
  return <QuillEditor {...props} />;
};

export default CustomEditor;
