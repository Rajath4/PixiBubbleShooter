export class PlayerSessionDataModel{
    private currentScore: number = 0;

    getScore(): number {
        return this.currentScore;
    }

    onScoreGain(scoreDelta: number) {
        this.currentScore += scoreDelta;
    }

    
}