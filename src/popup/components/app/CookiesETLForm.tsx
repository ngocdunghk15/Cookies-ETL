import {Alert, Button, Card, Form, Input, message, Upload} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCookie, faEllipsis, faFileExport, faFileImport} from "@fortawesome/free-solid-svg-icons";
import {useActiveTab} from "~hooks/tab.hook";
import {getCookies, setCookies} from "~utils/cookies";
import {useState} from "react";
import {decryptPayload, encryptPayload} from "~utils/secure";
import {downloadFile, getTime, onReadFileContent, validateFileExtension} from "~utils/app";
import {FileFilterMode} from "~enum/app.enum";
import type {RcFile} from "antd/lib/upload";

function CookiesETLForm() {
  const {origin, hostname} = useActiveTab();
  const [password, setPassword] = useState<string>();

  const uploadProps = {
    name: 'file',
    accept: '.json',
    multiple: false,
    maxCount: 1,
    onChange: async (info) => {
      try {
        if (info?.file?.status === 'done') {
          if (!password) {
            message.error('Password is required for secure!');
            return;
          }
          const {file} = info;
          const encryptedFileContent = await onReadFileContent(file?.originFileObj);
          const decryptedFileContent = await decryptPayload(encryptedFileContent, password);
          setCookies(decryptedFileContent?.cookies, decryptedFileContent?.url);
          message.success('Import cookies successfully!');
          chrome.tabs.reload(function(){});
        }
      } catch (error) {
        message.error('Somethings went wrongs!')
      }
    },
    beforeUpload: async (file: RcFile) => {
      const isValid = await validateFileExtension({
        file,
        filter: {
          fileTypeRegexes: ['.json'],
          mode: FileFilterMode.ACCEPT
        }
      });
      if (!isValid) {
        message.error('');
      }
      return isValid || Upload.LIST_IGNORE;
    }
  }

  async function onExportCookies() {
    try {
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
    } catch {
      message.error('Failed to encrypted!')
    }
  }

  return <Card
    bordered={false} title={<div className={'gap-2 flex items-center'}>
    <FontAwesomeIcon style={{transform: "translateY(1px)"}} icon={faCookie} color={'#dd9955'}/>
    {`Cookies for ${hostname}`}
  </div>}
    extra={<FontAwesomeIcon icon={faEllipsis}/>}>
    <Form
      layout={'vertical'}
    >
      <Form.Item className={'mb-4'} label={"Encryption password for the cookies data:"}>
        <Input.Password
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={"Password..."}/>
      </Form.Item>
      <div className={'flex gap-4 mb-4'}>
        <Form.Item className={'mb-0'}>
          <Button
            onClick={onExportCookies}
            type={'primary'}
            icon={<FontAwesomeIcon icon={faFileExport}/>}>
            Export
          </Button>
        </Form.Item>
        <Form.Item className={'mb-0'}>
          <Upload {...uploadProps}>
            <Button
              danger
              type={'primary'}
              icon={<FontAwesomeIcon icon={faFileImport}/>}>
              Import
            </Button>
          </Upload>
        </Form.Item>
      </div>
      <Alert
        message="Import cookies successfullyyyyyyyy =))"
        type="warning"
        showIcon/>
    </Form>
  </Card>;
}

export default CookiesETLForm;
