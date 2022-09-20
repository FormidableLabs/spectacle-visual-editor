import React from 'react';
import styled from 'styled-components';

const KeySequence = styled.kbd`
  font: inherit;
  margin-left: 10px;
`;

const Key = styled.kbd`
  font: inherit;
  font-size: 0.9em;
  font-weight: 700;
`;

/**
 * Converts a limited set of keyboard shortcut sequences into kbd HTML
 */
export const KeyboardShortcut = ({ sequence }: { sequence: string }) => {
  // Platform detection using the deprecated `navigator.platform`, but this is
  // exactly what mousetrap uses in its detection logic as well, so we'll sink
  // along with them.
  const isMacLike = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const keyOrder: { [key: string]: number } = isMacLike
    ? { ctrl: 1, alt: 2, shift: 3, mod: 4 }
    : { ctrl: 1, mod: 1, shift: 2, alt: 3 };
  const keyMapping: { [key: string]: string } = isMacLike
    ? { shift: '⇧', mod: '⌘', ctrl: '⌃', alt: '⌥' }
    : { shift: 'Shift', mod: 'Ctrl', ctrl: 'Ctrl', alt: 'Alt' };

  return (
    <KeySequence>
      {sequence
        .split('+')
        .sort(
          (a, b) =>
            (keyOrder[a.toLowerCase()] ?? 999) -
            (keyOrder[b.toLowerCase()] ?? 999)
        )
        .map((key, index) => {
          let keyString = keyMapping[key.toLowerCase()] ?? key.toUpperCase();

          return (
            <React.Fragment key={index}>
              {!isMacLike && index !== 0 ? '+' : ''}
              <Key>{keyString}</Key>
            </React.Fragment>
          );
        })}
    </KeySequence>
  );
};
