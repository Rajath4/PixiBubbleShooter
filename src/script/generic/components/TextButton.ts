import { Text, Texture } from 'pixi.js';
import { Button } from './Button';

export class TextButton extends Button {
    private buttonText: Text;

    constructor(
        texture: Texture,
        text: string,
        fontSize: number = 24,
        textColor: number = 0xffffff,
        width: number = 200,
        height: number = 75
    ) {
        super(texture, width, height);

        this.buttonText = new Text({
            text: text, style: {
                fontFamily: 'Arial',
                fontSize: fontSize,
                fill: textColor,
                align: 'center',
                fontWeight: 'bold'
            }
        });

        this.buttonText.anchor.set(0.5);
        this.buttonText.position.set(0, 0);

        this.addChild(this.buttonText);
    }

    setText(newText: string) {
        this.buttonText.text = newText;
    }

    setFontSize(newSize: number) {
        this.buttonText.style.fontSize = newSize;
    }

    setTextColor(newColor: number) {
        this.buttonText.style.fill = newColor;
    }
}
