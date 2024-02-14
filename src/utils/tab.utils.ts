import Tab = chrome.tabs.Tab;

export function getActiveTab(): Promise<Tab> {
	return new Promise(( resolve ) => {
		chrome.tabs.query({active: true, currentWindow: true}, function ( tabs ) {
			const activeTab = tabs[0];
			resolve(activeTab);
		});
	});
}

export function parseUrl( url: string ): URL {
	return new URL(url);
}
