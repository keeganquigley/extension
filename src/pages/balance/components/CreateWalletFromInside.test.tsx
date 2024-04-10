import { PropsWithChildren } from "react"
import i18n from "@src/utils/i18n";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { CreateWalletFromInside } from "./CreateWalletFromInside";

const functionMocks = {
  onBack: vi.fn(),
  onFinish: vi.fn(),
  onClose: vi.fn(),
  createAccount: vi.fn(),
};

const renderComponent = () => {
  return render(
    <I18nextProvider i18n={i18n}>
      <CreateWalletFromInside
        onBack={functionMocks.onBack}
        onFinish={functionMocks.onFinish}
        onClose={functionMocks.onClose}
      />
    </I18nextProvider>
  );
};

describe("CreateWalletFromInside", () => {
  beforeAll(() => {

    vi.mock("@src/components/accountForm/RecoveryPhrase", () => ({
      RecoveryPhrase: () => <div data-testid="recovery-phrase" />,
    }))

    vi.mock("@src/providers", () => ({
      useAccountContext: () => ({
        createAccount: () => functionMocks.createAccount(),
        deriveAccount: vi.fn(),
      }),
    }));

    vi.mock("react-hook-form", () => {
      return {
        FormProvider: ({ children }: PropsWithChildren) => children,
        useForm: () => ({
          handleSubmit: vi.fn((cb: (props: { seed: string }) => void) => () => {
            cb({
              seed: "SEED SEED SEED SEED SEED SEED SEED SEED SEED SEED SEED SEED",
            });
          }),
          setValue: vi.fn(),
          watch: vi.fn(),
        }),
      };
    });

    vi.mock("@src/utils/env", () => ({
      version: "1.0.0",
      getWebAPI: () => ({
        tabs: {
          getCurrent: () => Promise.resolve(undefined),
        },
        runtime: {
          getURL: vi.fn(),
          connect: vi.fn().mockReturnValue({
            onMessage: {
              addListener: vi.fn(),
            },
            onDisconnect: {
              addListener: vi.fn(),
            },
          }),
        },
      }),
    }));
  });

  describe("render", () => {
    it("should render", () => {
      const { container } = renderComponent();
      expect(container).toBeDefined();
    });
  });

  describe('create account', () => {
    it('should call createAccount', async () => {
      const { getByTestId } = renderComponent();

      fireEvent.click(getByTestId('option1-button'));

      await waitFor(() => {
        expect(getByTestId('create-button')).toBeDefined();
      })

      fireEvent.click(getByTestId('create-button'));

      await waitFor(() => {
        expect(functionMocks.createAccount).toHaveBeenCalled();
      })
    });
  })
});
