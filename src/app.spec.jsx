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

      describe('inputing both values', () => {
        beforeEach(async () => {
          await userEvent.type(getTitle(), titleValue);
          await userEvent.type(getBody(), bodyValue);
        });

        it('the title input has the inputed value', () => {
          expect(getTitle()).toHaveValue(titleValue);
        });

        it('the body input has the inputed value', () => {
          expect(getBody()).toHaveValue(bodyValue);
        });

        describe('when submitting', () => {
          beforeEach(() => {
            userEvent.click(getButton());
          });

          it('disables the button', async () => {
            expect(getButton()).toBeDisabled();
          });
        });
      });

      describe('without inputing values', () => {
        it('');
      });

      describe('inputing only the title', () => {
        it('');
      });

      describe('inputing only the body', () => {
        it('');
      });
    });
  });
});
