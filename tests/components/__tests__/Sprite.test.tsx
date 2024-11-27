// tests for the Sprite component
import React from 'react';
import { render } from '@testing-library/react-native';
import { Sprite } from '@/components/Sprite';
import { SpriteID } from '@/constants/sprite';

describe('Sprite', () => {
  const spriteIDs = Object.values(SpriteID);
  spriteIDs.forEach((id) => {
    it(`renders the correct sprite for the given id: ${id}`, () => {
      const { getByTestId } = render(<Sprite id={id} />);
      expect(getByTestId('Sprite').props.source).toEqual(
        //require(`@/assets/sprites/${id}.png`),
        // add 512 to the end of the file name
        require(`@/assets/sprites/${id}.png`),
      );
    });
  });
});
