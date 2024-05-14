import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MANAGE_ASSETS } from "@src/routes/paths";
import {
  useAccountContext,
  useAssetContext,
} from "@src/providers";
import { Loading, Button } from "@src/components/common";
import { Switch } from "@headlessui/react";
import { Asset } from "./Asset";
import { AllAsset } from "./AllAssets"
import { CgOptions } from "react-icons/cg";
import { formatAmountWithDecimals } from "@src/utils/assets";

export const Assets = () => {
  const { t } = useTranslation("balance");
  const navigate = useNavigate();
  const {
    state: { assets, isLoadingAssets },
  } = useAssetContext();
  const {state: {selectedAccount}} = useAccountContext();

  const [showAllAssets, setShowAllAssets] = useState(true);
  const [showManageAssets, setShowManageAssets] = useState(false);

  const filteredAsset = useMemo(() => {
    if(selectedAccount?.value){
      const allAssets = Object.values(assets).flatMap(asset => {
        return Object.values(asset).flatMap(subasset => {
          return subasset.assets
        });
      }
      )
      if(showAllAssets){
        return allAssets
      }
      else{
        return allAssets.filter((asset) => asset.id === "-1")
      }
    }
    else{
      const outputObject: any = {};
      if(Object.keys(assets).length !== 0){
        if(showAllAssets){
          Object.keys(assets).forEach(address => {
            const networks = assets[address];
            Object.keys(networks).forEach((network : any) => {
                const assets = networks[network].assets;
                assets.forEach((asset: any) => {
                    if (!outputObject[asset.symbol]) {
                        outputObject[asset.symbol] = [];
                    }
                    outputObject[asset.symbol].push({ ...asset, address: address });
                });
            });
          });
        }
        else{
          Object.keys(assets).forEach(address => {
            const networks = assets[address];
            Object.keys(networks).forEach((network : any) => {
                const assets = networks[network].assets;
                assets.forEach((asset: any) => {
                    if (!outputObject[asset.symbol]) {
                        outputObject[asset.symbol] = [];
                    }
                    if(asset.id === "-1"){
                    outputObject[asset.symbol].push({ ...asset, address: address });
                  }
                });
            });
          });
        }
    return outputObject
      }
      
    
    }
} , [JSON.stringify(assets),showAllAssets]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center mb-2 justify-end">
        <Switch.Group>
          <div className="flex items-center">
            <Switch.Label className="mr-2 text-xs font-medium">
              {t("show_all_assets")}
            </Switch.Label>
            <Switch
              checked={showAllAssets}
              onChange={() => setShowAllAssets(!showAllAssets)}
              className={`${showAllAssets ? `bg-primary-default` : "bg-custom-gray-bg"
                } relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200`}
            >
              <span className="sr-only">{t("show_all_assets")}</span>
              <span
                className={`${showAllAssets ? "translate-x-6" : "translate-x-1"
                  } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200`}
              />
            </Switch>
          </div>
        </Switch.Group>
      </div>

      {isLoadingAssets && <Loading />}

      {
      selectedAccount?.value && filteredAsset && filteredAsset?.length !==0 ? Object.keys(filteredAsset).map((asset, index) =>{
        return (<Asset asset={filteredAsset[asset]} key={index} />)
    }) : Object.keys(filteredAsset).length !== 0 && Object.keys(filteredAsset).map((_assets: string) => {  
      return (<AllAsset assets={filteredAsset[_assets]} symbol={_assets} />)
    })
      }
      
      {showManageAssets && (
        <div className="flex justify-center mt-2">
          <Button onClick={() => navigate(MANAGE_ASSETS)} variant="text">
            <span className="flex gap-1 items-center">
              <CgOptions />
              <span>{t("manage_assets")}</span>
            </span>
          </Button>
        </div>
      )}
    </div>
  );
};
