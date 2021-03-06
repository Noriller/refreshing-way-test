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

    it('renders text of not submitted', async () => {
      setup();
      expect(screen.getByText('Not Submitted')).toBeInTheDocument();
    });

    it('renders input for title', async () => {
      setup();
      expect(getTitle()).toBeInTheDocument();
    });

    it('renders input for body', async () => {
      setup();
      expect(getBody()).toBeInTheDocument();
    });

    describe('renders a button', () => {
      it('with submit text', async () => {
        setup();
        expect(getButton()).toBeInTheDocument();
      });

      it('that is enabled', async () => {
        setup();
        expect(getButton()).toBeEnabled();
      });
    });

    it('dont render the title error label', async () => {
      setup();
      expect(screen.queryByLabelText('title')).not.toBeInTheDocument();
    });

    it('dont render the body error label', async () => {
      setup();
      expect(screen.queryByLabelText('body')).not.toBeInTheDocument();
    });

    describe('when you submit a form', () => {
      describe('inputting both values', () => {
        it('the title input has the input value', async () => {
          setup();
          await inputValues();
          expect(getTitle()).toHaveValue(titleValue);
        });

        it('the body input has the input value', async () => {
          setup();
          await inputValues();
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
            it('reenables the button', async () => {
              setup();
              await inputValues();
              await clickButton();
              expect(getButton()).toBeEnabled();
            });

            it('renders the id', async () => {
              setup();
              await inputValues();
              await clickButton();
              expect(screen.getByText('ID is foo')).toBeInTheDocument();
            });

            it('has called the API once', async () => {
              setup();
              await inputValues();
              await clickButton();
              expect(window.fetch).toHaveBeenCalledTimes(1);
            });

            it('has called the API with', async () => {
              setup();
              await inputValues();
              await clickButton();
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
            });

            it('changes the text with the id', async () => {
              setup();
              await inputValues();
              await clickButton();
              expect(
                screen.queryByText('Not Submitted'),
              ).not.toBeInTheDocument();
              expect(screen.getByText('ID is foo')).toBeInTheDocument();
            });

            it('clears the form', async () => {
              setup();
              await inputValues();
              await clickButton();
              expect(getTitle()).toHaveValue('');
              expect(getBody()).toHaveValue('');
            });
          });
        });
      });

      describe('without inputting values', () => {
        it('shows a title error', async () => {
          setup();
          await clickButton();
          expect(screen.getByLabelText('Add a title')).toBeInTheDocument();
        });

        it('shows a body error', async () => {
          setup();
          await clickButton();
          expect(screen.getByLabelText('Add a body')).toBeInTheDocument();
        });

        it('doesnt call the API', async () => {
          setup();
          await clickButton();
          expect(window.fetch).toHaveBeenCalledTimes(0);
        });
      });

      describe('inputting only the title', () => {
        it('dont show a title error', async () => {
          setup();
          await inputTitle();
          await clickButton();
          expect(
            screen.queryByLabelText('Add a title'),
          ).not.toBeInTheDocument();
        });

        it('shows a body error', async () => {
          setup();
          await inputTitle();
          await clickButton();
          expect(screen.getByLabelText('Add a body')).toBeInTheDocument();
        });

        it('doesnt call the API', async () => {
          setup();
          await inputTitle();
          await clickButton();
          expect(window.fetch).toHaveBeenCalledTimes(0);
        });

        it('dont clear the form', async () => {
          setup();
          await inputTitle();
          await clickButton();
          expect(getTitle()).toHaveValue(titleValue);
          expect(getBody()).toHaveValue('');
        });
      });

      describe('inputting only the body', () => {
        it('shows a title error', async () => {
          setup();
          await inputBody();
          await clickButton();
          expect(screen.getByLabelText('Add a title')).toBeInTheDocument();
        });

        it('dont show a body error', async () => {
          setup();
          await inputBody();
          await clickButton();
          expect(screen.queryByLabelText('Add a body')).not.toBeInTheDocument();
        });

        it('doesnt call the API', async () => {
          setup();
          await inputBody();
          await clickButton();
          expect(window.fetch).toHaveBeenCalledTimes(0);
        });

        it('dont clear the form', async () => {
          setup();
          await inputBody();
          await clickButton();
          expect(getTitle()).toHaveValue('');
          expect(getBody()).toHaveValue(bodyValue);
        });
      });
    });
  });
});
