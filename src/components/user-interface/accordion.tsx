import React, { useState } from 'react';
import styled from 'styled-components';
import {
  defaultTheme,
  ChevronDownIcon,
  ChevronUpIcon,
  IconButton
} from 'evergreen-ui';

const ContentPanel = styled.div<{ open: boolean }>`
  display: block;
  box-sizing: border-box;
  position: relative;
  transition: all 500ms ease-in-out;
  height: auto;

  max-height: ${({ open }) => (open ? '100vh' : 0)};
  opacity: ${({ open }) => (open ? 1 : 0)};
`;

const TitleBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${defaultTheme.scales.neutral.N5A};
  color: ${defaultTheme.scales.neutral.N9};
  font-size: 0.9em;
  font-weight: 500;
  margin-bottom: 12px;
`;

interface Props {
  label: string;
}

export const Accordion: React.FC<Props> = ({ children, label }) => {
  const [open, setIsOpen] = useState(true);
  return (
    <div>
      <TitleBar>
        <span>{label}</span>
        <IconButton
          height={24}
          appearance="minimal"
          icon={open ? <ChevronUpIcon /> : <ChevronDownIcon />}
          onClick={() => setIsOpen(!open)}
        />
      </TitleBar>
      <ContentPanel open={open}>{children}</ContentPanel>
    </div>
  );
};
