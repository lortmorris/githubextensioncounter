import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app component', () => {
  render(<App />);
  const linkElement = screen.getByText(/Github counter extensions/i);
  expect(linkElement).toBeInTheDocument();
});
