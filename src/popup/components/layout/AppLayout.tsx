import type {ReactNode} from "react";
import { ConfigProvider, theme } from "antd";

interface AppLayoutProps {
	children: ReactNode;
}

function AppLayout( props: AppLayoutProps ) {
	return <ConfigProvider
		theme={{
			token: {
				colorPrimary: '#553311',
			},
			components: {
				Button: {
					colorPrimary: "#dd9955",
					colorPrimaryHover: "rgba(170,119,51,0.86)",
					colorPrimaryBorder: "rgba(170,119,51,0.86)",
					colorError: "#553311",
					colorErrorHover: "rgba(85,51,17,0.86)",
					colorErrorBorderHover: "rgba(85,51,17,0.86)"
				},
				Card: {
					borderRadiusLG: 16,
				},
			}
		}}
	>
		<div style={{minWidth: 560}}>{props.children}</div>
	</ConfigProvider>;
}

export default AppLayout;
