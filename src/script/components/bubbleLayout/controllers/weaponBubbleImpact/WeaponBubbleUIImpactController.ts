
import { IWeaponBubbleImpactInfo } from "../../GamePlayEngineModelInterfaces";
import { BubbleType } from "../../model/LayoutInterface";
import { TileIndex } from "../../../../types/BubbleGridInterfaces";
import { IWeaponBubbleUIImpactControllerDependency } from "./WeaponBubbleUIImpactControllerBase";
import ColorWBUIImpactController from "./normal/ColorWBUIImpactController";

export default class WeaponBubbleUIImpactController {
    init(dependency: IWeaponBubbleUIImpactControllerDependency) {
        this.colorBubbleImpactController.init(dependency);
    }

    async performWeaponBubbleTask(weaponBubbleImpactInfo: IWeaponBubbleImpactInfo) {
        if (weaponBubbleImpactInfo.weaponBubbleType === BubbleType.ColorBubble) {
            await this.colorBubbleImpactController.performWeaponBubbleTask(weaponBubbleImpactInfo);
        } 
    }

    removeColorBubbleCluster(bubbleCluster: TileIndex[]) {
        return this.colorBubbleImpactController.removeCluster(bubbleCluster);
    }

    get colorBubbleController(): ColorWBUIImpactController {
        return this.colorBubbleImpactController;
    }

    private colorBubbleImpactController: ColorWBUIImpactController = new ColorWBUIImpactController();
}