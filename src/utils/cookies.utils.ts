import GetAllDetails = chrome.cookies.GetAllDetails;

export function getCookies(details: GetAllDetails) {
	return new Promise(resolve => {
		chrome.cookies.getAll(details, cookies => {
			resolve(cookies);
		})
	});
}
