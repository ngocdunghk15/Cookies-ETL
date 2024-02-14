import { useEffect, useState } from "react";
import { getActiveTab } from "~utils/tab.utils";
import Tab = chrome.tabs.Tab;

function useTab() {
	const [activeTab, setActiveTab] = useState<Tab>();

	useEffect(() => {
		getActiveTab().then(( tab ) => {
			setActiveTab(tab);
		});
	}, []);

	return activeTab as const;
}

export { useTab };
