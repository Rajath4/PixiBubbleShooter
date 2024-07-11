export function getScaleFactor() {
    const designWidth = 1080;  // Design resolution width
    const designHeight = 1920; // Design resolution height
    const scaleX = window.innerWidth / designWidth;
    const scaleY = window.innerHeight / designHeight;
    return Math.min(scaleX, scaleY); // Choose the smaller scale to fit the design within the screen
}