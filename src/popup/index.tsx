import 'antd-css-utilities/utility.min.css';
import AppLayout from "~popup/components/layout/AppLayout";
import CookiesETLForm from "~popup/components/app/CookiesETLForm";
import './index.css';

function IndexPopup() {
	return (
		<AppLayout>
			<CookiesETLForm/>
		</AppLayout>
	);
}

export default IndexPopup;
