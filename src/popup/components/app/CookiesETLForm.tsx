import { Button, Card, Form, Input, message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faFileExport, faFileImport } from "@fortawesome/free-solid-svg-icons";
import { parseUrl } from "~utils/tab.utils";
import { useActiveTab } from "~hooks/tab.hook";
import { getCookies } from "~utils/cookies.utils";
import { useState } from "react";
import { encryptPayload } from "~utils/secure";
import { downloadFile, getTime } from "~utils/app";

function CookiesETLForm() {
	const {origin, hostname} = useActiveTab();
	const [password, setPassword] = useState();


	async function onExportCookies() {
		if (!password) {
			message.error('Password is required for secure!');
			return;
		}
		const cookies = await getCookies({url: origin});
		const payload = {
			url: origin,
			domain: hostname,
			cookies
		};
		const encryptedPayload = encryptPayload(payload, password);
		downloadFile(encryptedPayload, `${hostname}_${getTime()}_encrypted.json`);
	}

	return <Card
		bordered={false} title={`Cookies for ${hostname}`}
		extra={<FontAwesomeIcon icon={faEllipsis}/>}>
		<Form
			layout={'vertical'}
		>
			<Form.Item className={'mb-4'} label={"Encryption password for the cookies data:"}>
				<Input.Password
					value={password}
					onChange={( e ) => setPassword(e.target.value)}
					placeholder={"Password..."}/>
			</Form.Item>
			<div className={'flex gap-4'}>
				<Form.Item className={'mb-0'}>
					<Button
						onClick={onExportCookies}
						type={'primary'}
						icon={<FontAwesomeIcon icon={faFileExport}/>}>
						Export
					</Button>
				</Form.Item>
				<Form.Item className={'mb-0'}>
					<Button
						danger
						type={'primary'}
						htmlType={'submit'}
						icon={<FontAwesomeIcon icon={faFileImport}/>}>
						Import
					</Button>
				</Form.Item>
			</div>
		</Form>
	</Card>;
}

export default CookiesETLForm;
