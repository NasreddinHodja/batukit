export class Color {
  private _hex: string;

  constructor(hex: string) {
    if (!Color.isColor(hex)) {
      throw new Error(`Invalid hex color: ${hex}`);
    }

    this._hex = hex.toLocaleLowerCase();
  }

  get hex() {
    return this._hex;
  }

  toString(): string {
    return this._hex;
  }

  // 3 | 6 | 8 digit hex color
  static isColor(str: string): boolean {
    return /^#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(str);
  }
}
