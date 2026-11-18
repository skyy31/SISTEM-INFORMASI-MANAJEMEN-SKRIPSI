/**
 * @format
 */

import React from 'react';
import { Text, Button } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});

test('toggles the class label from Kelas Mobile A to Kelas Mobile B', async () => {
  let component;

  await ReactTestRenderer.act(() => {
    component = ReactTestRenderer.create(<App />);
  });

  const textNode = component.root.findByType(Text);
  expect(textNode.props.children).toBe('Kelas Mobile A');

  await ReactTestRenderer.act(() => {
    component.root.findByType(Button).props.onPress();
  });

  expect(component.root.findByType(Text).props.children).toBe('Kelas Mobile B');
});
