export default abstract class WeaponBubbleImpactComputationModelBase {
    init(dependency: IWeaponBubbleComputationModelDependency) {
        this.getFirstVisibleRowIndex = dependency.getFirstVisibleRowIndex;
        this.getLastVisibleRowIndex = dependency.getLastVisibleRowIndex;
    }

    protected getLastVisibleRowIndex: () => number;
    protected getFirstVisibleRowIndex: () => number;
}

export interface IWeaponBubbleComputationModelDependency {
    getLastVisibleRowIndex: () => number;
    getFirstVisibleRowIndex: () => number;
}