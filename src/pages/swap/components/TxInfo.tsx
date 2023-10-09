import { FC } from "react"
import { TxInfoState } from "../hooks"
import { useTranslation } from "react-i18next"

type TxInfoProps = TxInfoState

export const TxInfo: FC<TxInfoProps> = ({
  bridgeFee,
  bridgeName,
  destinationAddress,
  gasFee
}) => {
  const { t } = useTranslation("swap")

  return (
    <div className="bg-[#303943] p-3 rounded-xl flex flex-col gap-2 mt-10">
      <div className="flex justify-between items-center">
        <p>{t("bridge_name")}:</p>
        <p>{bridgeName}</p>
      </div>

      <div className="flex justify-between items-center">
        <p>{t("bridge_fee")}:</p>
        <p>{bridgeFee}</p>
      </div>

      <div className="flex justify-between items-center">
        <p>{t("gas_fee")}:</p>
        <p>{gasFee}</p>
      </div>

      <div className="flex justify-between items-center">
        <p>{t("destination_address")}:</p>
        <p>{destinationAddress}</p>
      </div>
    </div>
  )
}
