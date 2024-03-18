import { useEffect, useState } from "react";
import { getActiveTab, parseUrl } from "~utils/tab";
// @ts-ignore
import Tab = chrome.tabs.Tab;

function useActiveTab() {
	const [tab, setTab] = useState<Tab>();
	const origin = tab?.url ? parseUrl(tab?.url)?.origin : "";
	const hostname = tab?.url ? parseUrl(tab?.url)?.hostname : "";

	useEffect(() => {
		getActiveTab().then(( tab ) => {
			setTab(tab);
		});
	}, []);

	return {tab, origin, hostname} as const;
}

export { useActiveTab };
