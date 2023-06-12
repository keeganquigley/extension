import i18n from "@src/utils/i18n";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { TotalBalance } from "./TotalBalance";
import { act } from "react-dom/test-utils";

const renderComponent = () => {
  return render(
    <I18nextProvider i18n={i18n}>
      <TotalBalance />
    </I18nextProvider>
  );
};

const updateAccountName = vi.fn();

describe("TotalBalance", () => {
  beforeAll(() => {
    vi.mock("@src/providers", () => ({
      useAssetContext: () => ({
        state: {
          assets: [
            {
              amount: 100,
            },
          ],
        },
      }),
      useAccountContext: () => ({
        state: {
          selectedAccount: {},
        },
        updateAccountName: () => updateAccountName(),
      }),
      useThemeContext: () => ({
        color: "red",
      }),
    }));

    vi.mock("react-router-dom", () => ({
      useNavigate: () => vi.fn(),
    }));
  });

  it("should render", () => {
    const { container } = renderComponent();
    expect(container).toBeDefined();
  });

  it("should render total balance", () => {
    const { getByTestId } = renderComponent();

    const balance = getByTestId("balance");

    expect(balance.innerHTML).include("100");
  });

  it("should hide balance", async () => {
    const { getByTestId } = renderComponent();

    const hideBalance = getByTestId("hide-balance");

    act(() => {
      fireEvent.click(hideBalance);
    });

    await waitFor(() => {
      expect(getByTestId("show-balance")).toBeDefined();
    });
  });

  it("should update account name", async () => {
    const { getByTestId } = renderComponent();

    const accountName = getByTestId("account-name");

    act(() => {
      fireEvent.click(accountName);
    });

    await waitFor(() => {
      expect(getByTestId("account-name-input")).toBeDefined();
    });

    act(() => {
      fireEvent.change(getByTestId("account-name-input"), {
        target: { value: "new name" },
      });
      fireEvent.keyDown(getByTestId("account-name-input"), {
        key: "Enter",
      });
    });

    await waitFor(() => {
      expect(updateAccountName).toBeCalled();
    });
  });
});
