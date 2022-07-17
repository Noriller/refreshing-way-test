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

  describe('on default render', () => {
    beforeEach(() => {
      render(<App />);
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('renders text of not submitted', () => {
      expect(screen.getByText('Not Submitted')).toBeInTheDocument();
    });

    it('renders input for title', () => {
      expect(getTitle()).toBeInTheDocument();
    });

    it('renders input for body', () => {
      expect(getBody()).toBeInTheDocument();
    });

    describe('renders a button', () => {
      it('with submit text', () => {
        expect(getButton()).toBeInTheDocument();
      });

      it('that is enabled', () => {
        expect(getButton()).toBeEnabled();
      });
    });

    it('dont render the title error label', () => {
      expect(screen.queryByLabelText('title')).not.toBeInTheDocument();
    });

    it('dont render the body error label', () => {
      expect(screen.queryByLabelText('body')).not.toBeInTheDocument();
    });

    describe('when you submit a form', () => {
      const titleValue = 'my title';
      const bodyValue = 'my body';

      describe('inputting both values', () => {
        beforeEach(async () => {
          await userEvent.type(getTitle(), titleValue);
          await userEvent.type(getBody(), bodyValue);
        });

        it('the title input has the input value', () => {
          expect(getTitle()).toHaveValue(titleValue);
        });

        it('the body input has the input value', () => {
          expect(getBody()).toHaveValue(bodyValue);
        });

        describe('when submitting', () => {
          it('disables the button', async () => {
            userEvent.click(getButton());
            await waitFor(() => {
              expect(getButton()).toBeDisabled();
            });
          });

          describe('after api call complete', () => {
            beforeEach(async () => {
              await userEvent.click(getButton());
            });

            it('reenables the button', () => {
              expect(getButton()).toBeEnabled();
            });

            it('renders the id', async () => {
              expect(screen.getByText('ID is foo')).toBeInTheDocument();
            });

            it('has called the API once', () => {
              expect(window.fetch).toHaveBeenCalledTimes(1);
            });

            it('has called the API with', () => {
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

            it('changes the text with the id', () => {
              expect(
                screen.queryByText('Not Submitted'),
              ).not.toBeInTheDocument();
              expect(screen.getByText('ID is foo')).toBeInTheDocument();
            });

            it('clears the form', () => {
              expect(getTitle()).toHaveValue('');
              expect(getBody()).toHaveValue('');
            });
          });
        });
      });

      describe('without inputting values', () => {
        beforeEach(async () => {
          await userEvent.click(getButton());
        });

        it('shows a title error', () => {
          expect(screen.getByLabelText('Add a title')).toBeInTheDocument();
        });

        it('shows a body error', () => {
          expect(screen.getByLabelText('Add a body')).toBeInTheDocument();
        });

        it('doesnt call the API', () => {
          expect(window.fetch).toHaveBeenCalledTimes(0);
        });
      });

      describe('inputting only the title', () => {
        beforeEach(async () => {
          await userEvent.type(getTitle(), titleValue);
          await userEvent.click(getButton());
        });

        it('dont show a title error', () => {
          expect(
            screen.queryByLabelText('Add a title'),
          ).not.toBeInTheDocument();
        });

        it('shows a body error', () => {
          expect(screen.getByLabelText('Add a body')).toBeInTheDocument();
        });

        it('doesnt call the API', () => {
          expect(window.fetch).toHaveBeenCalledTimes(0);
        });

        it('dont clear the form', () => {
          expect(getTitle()).toHaveValue(titleValue);
          expect(getBody()).toHaveValue('');
        });
      });

      describe('inputting only the body', () => {
        beforeEach(async () => {
          await userEvent.type(getBody(), bodyValue);
          await userEvent.click(getButton());
        });

        it('shows a title error', () => {
          expect(screen.getByLabelText('Add a title')).toBeInTheDocument();
        });

        it('dont show a body error', () => {
          expect(screen.queryByLabelText('Add a body')).not.toBeInTheDocument();
        });

        it('doesnt call the API', () => {
          expect(window.fetch).toHaveBeenCalledTimes(0);
        });

        it('dont clear the form', () => {
          expect(getTitle()).toHaveValue('');
          expect(getBody()).toHaveValue(bodyValue);
        });
      });
    });
  });
});
