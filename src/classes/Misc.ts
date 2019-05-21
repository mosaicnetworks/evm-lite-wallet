export default class Misc {
	public static integerWithCommas(x: number | string) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}

	public static MARGIN_CONSTANT = 100;

	private constructor() {}
}
