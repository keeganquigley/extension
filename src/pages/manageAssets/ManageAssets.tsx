import {
  InputErrorMessage,
  LoadingButton,
  PageWrapper,
} from "@src/components/common";
import { useTranslation } from "react-i18next";
import { BiLeftArrowAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useToast } from "@src/hooks";
import { useNetworkContext } from "@src/providers/networkProvider/NetworkProvider";
import { useMemo } from "react";
import Extension from "../../Extension";
import { BALANCE } from "../../routes/paths";
import { useAssetContext } from "@src/providers/assetProvider";
import { number, object, string } from "yup";
import { isHex } from "@polkadot/util";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

interface AssetForm {
  address: string;
  decimals: number;
  symbol: string;
}

const defaultValues: AssetForm = {
  address: "",
  symbol: "",
  decimals: 0,
};

export const ManageAssets = () => {
  const { t } = useTranslation("manage_assets");
  const {
    state: { selectedChain },
  } = useNetworkContext();
  const { loadAssets } = useAssetContext();

  const navigate = useNavigate();
  const { showErrorToast } = useToast();

  const schema = useMemo(() => {
    return object({
      address: string().test(
        "adress validation",
        t("invalid_address") as string,
        (val) => {
          return isHex(val);
        }
      ),
      decimals: number()
        .typeError(t("invalid_number") as string)
        .required(t("required") as string),
      symbol: string().required(t("required") as string),
    });
  }, [t]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AssetForm>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await Extension.addAsset(selectedChain.name, data);
      loadAssets();
      navigate(BALANCE);
    } catch (error) {
      showErrorToast(error);
    }
  });

  return (
    <>
      <PageWrapper>
        <div className="flex gap-3 items-center mb-7">
          <BiLeftArrowAlt
            size={26}
            className="cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <p className="text-xl">{t("title")}</p>
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-1">
              {t("address")}
            </label>
            <input
              id="address"
              {...register("address")}
              className=" border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
            />
            <InputErrorMessage message={errors.address?.message} />
          </div>

          <div>
            <label htmlFor="symbol" className="block text-sm font-medium mb-1">
              {t("symbol")}
            </label>
            <input
              id="symbol"
              {...register("symbol")}
              className=" border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
            />
            <InputErrorMessage message={errors.symbol?.message} />
          </div>

          <div>
            <label
              htmlFor="decimals"
              className="block text-sm font-medium mb-1"
            >
              {t("decimals")}
            </label>
            <input
              id="decimals"
              {...register("decimals")}
              className=" border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
            />
            <InputErrorMessage message={errors.decimals?.message} />
          </div>
          <div className="flex justify-end" data-testid="submitbtn">
            <LoadingButton onClick={onSubmit} isLoading={isSubmitting}>
              {t("create_asset")}
            </LoadingButton>
          </div>
        </div>
      </PageWrapper>
    </>
  );
};
