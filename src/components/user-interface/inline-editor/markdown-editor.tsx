import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { useEditElement } from '../../../hooks/use-edit-element';
import { selectedElementSelector } from '../../../slices/deck-slice';

const AceEditor = React.lazy(
  () =>
    import(
      /* webpackChunkName: "react-ace" */
      /* webpackMode: "lazy" */
      'react-ace'
    )
);

export const MarkdownEditor = () => {
  const handleElementChanged = useEditElement();
  const selectedElement = useSelector(selectedElementSelector);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AceEditor
        style={{ minWidth: '500px' }}
        mode="markdown"
        theme="textmate"
        value={String(selectedElement?.children)}
        onChange={(val) => handleElementChanged({ children: val })}
        width="auto"
        height="150px"
        showGutter={false}
        focus
      />
    </Suspense>
  );
};
