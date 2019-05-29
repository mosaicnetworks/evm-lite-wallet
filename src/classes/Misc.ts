export default class Misc {
	public static MARGIN_CONSTANT = 100;
	public static integerWithCommas(x: number | string) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}

	public static capitalize = (word: string) =>
		word
			.toString()
			.charAt(0)
			.toUpperCase() + word.slice(1);

	private constructor() {}
}
