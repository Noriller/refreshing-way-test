import { vi } from 'vitest';
import { render, screen, userEvent, waitFor } from '../test-utils';
import App from './App';

describe('<App>', () => {
  window.fetch = vi.fn().mockResolvedValue({
    json: () => ({ id: 'foo' }),
  });
  window.crypto = {
    randomUUID: vi.fn().mockReturnValue('test'),
  };

  const getTitle = () => screen.getByPlaceholderText('title');
  const getBody = () => screen.getByPlaceholderText('body');
  const getButton = () => screen.getByRole('button', { name: 'Submit' });

  const setup = () => render(<App />);

  const titleValue = 'my title';
  const bodyValue = 'my body';

  const inputValues = async () => {
    await userEvent.type(getTitle(), titleValue);
    await userEvent.type(getBody(), bodyValue);
  };
  const inputTitle = async () => {
    await userEvent.type(getTitle(), titleValue);
  };
  const inputBody = async () => {
    await userEvent.type(getBody(), bodyValue);
  };

  const clickButton = async () => userEvent.click(getButton());

  describe('on default render', () => {
    afterEach(() => {
      vi.clearAllMocks();
    });

    it('renders the component', async () => {
      setup();
      expect(screen.getByText('Not Submitted')).toBeInTheDocument();
      expect(getTitle()).toBeInTheDocument();
      expect(getBody()).toBeInTheDocument();
      expect(getButton()).toBeInTheDocument();
      expect(getButton()).toBeEnabled();
      expect(screen.queryByLabelText('title')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('body')).not.toBeInTheDocument();
    });

    describe('when you submit a form', () => {
      describe('inputting both values', () => {
        it('has both values', async () => {
          setup();
          await inputValues();
          expect(getTitle()).toHaveValue(titleValue);
          expect(getBody()).toHaveValue(bodyValue);
        });

        describe('when submitting', () => {
          it('disables the button', async () => {
            setup();
            await inputValues();
            clickButton();
            await waitFor(() => {
              expect(getButton()).toBeDisabled();
            });
          });

          describe('after api call complete', () => {
            it('get the id and clears the form', async () => {
              setup();
              await inputValues();
              await clickButton();
              expect(getButton()).toBeEnabled();
              expect(screen.getByText('ID is foo')).toBeInTheDocument();
              expect(window.fetch).toHaveBeenCalledTimes(1);
              expect(window.fetch).toHaveBeenCalledWith(
                'https://jsonplaceholder.typicode.com/posts',
                expect.objectContaining({
                  method: 'POST',
                  body: JSON.stringify({
                    title: titleValue,
                    body: bodyValue,
                    userId: 'test',
                  }),
                }),
              );
              expect(
                screen.queryByText('Not Submitted'),
              ).not.toBeInTheDocument();
              expect(screen.getByText('ID is foo')).toBeInTheDocument();
              expect(getTitle()).toHaveValue('');
              expect(getBody()).toHaveValue('');
            });
          });
        });
      });

      describe('without inputting values', () => {
        it('shows errors', async () => {
          setup();
          await clickButton();
          expect(screen.getByLabelText('Add a title')).toBeInTheDocument();
          expect(screen.getByLabelText('Add a body')).toBeInTheDocument();
          expect(window.fetch).toHaveBeenCalledTimes(0);
        });
      });

      describe('inputting only the title', () => {
        it('shows error for the body', async () => {
          setup();
          await inputTitle();
          await clickButton();
          expect(
            screen.queryByLabelText('Add a title'),
          ).not.toBeInTheDocument();
          expect(screen.getByLabelText('Add a body')).toBeInTheDocument();
          expect(window.fetch).toHaveBeenCalledTimes(0);
          expect(getTitle()).toHaveValue(titleValue);
          expect(getBody()).toHaveValue('');
        });
      });

      describe('inputting only the body', () => {
        it('shows error for the title', async () => {
          setup();
          await inputBody();
          await clickButton();
          expect(screen.getByLabelText('Add a title')).toBeInTheDocument();
          expect(screen.queryByLabelText('Add a body')).not.toBeInTheDocument();
          expect(window.fetch).toHaveBeenCalledTimes(0);
          expect(getTitle()).toHaveValue('');
          expect(getBody()).toHaveValue(bodyValue);
        });
      });
    });
  });
});
