import {Alert, Button, Card, Divider, Form, Input, message, Upload} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCookie, faCopy, faEllipsis, faFileExport, faFileImport} from "@fortawesome/free-solid-svg-icons";
import {useActiveTab} from "~hooks/tab.hook";
import {getCookies, setCookies} from "~utils/cookies";
import {useState} from "react";
import {decryptPayload, encryptPayload} from "~utils/secure";
import {downloadFile, getTime, onReadFileContent, validateFileExtension} from "~utils/app";
import {FileFilterMode, Status} from "~enum/app.enum";
import type {RcFile} from "antd/lib/upload";
import * as randomstring from 'randomstring';

function CookiesETLForm() {
  const {origin, hostname} = useActiveTab();
  const [password, setPassword] = useState<string>();
  const [token, setToken] = useState<string>('');
  const [importStatus, setImportStatus] = useState<Status>(Status.IDLE);

  const uploadProps = {
    name: 'file',
    accept: '.json',
    multiple: false,
    maxCount: 1,
    onChange: async (info) => {
      try {
        if (info?.file?.status === 'done') {
          setImportStatus(Status.PENDING);
          if (!password) {
            message.error('Password is required for secure!');
            return;
          }
          const {file} = info;
          const encryptedFileContent = await onReadFileContent(file?.originFileObj);
          console.log({password})
          const decryptedFileContent = await decryptPayload(encryptedFileContent, password);
          setCookies(decryptedFileContent?.cookies, decryptedFileContent?.url);
          setImportStatus(Status.FULFILLED);
          message.success('Import cookies successfully!');
          chrome.tabs.reload(function () {
          });
        }
      } catch (error) {

        setImportStatus(Status.REJECTED);
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
      const cookies = await getCookies({url: origin});
      const payload = {
        url: origin,
        domain: hostname,
        cookies
      };
      const token = randomstring.generate({
        readable: false
      });
      setToken(token);
      const encryptedPayload = encryptPayload(payload, token);
      downloadFile(encryptedPayload, `${hostname}_${getTime()}_encrypted.json`);
    } catch {
      setToken('');
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
      <Form.Item className={'mb-0'}>
        <Button
          block
          onClick={onExportCookies}
          type={'primary'}
          icon={<FontAwesomeIcon icon={faFileExport}/>}>
          Export
        </Button>
      </Form.Item>
      {token &&
          <Alert
              className={'mt-3'}
              message={`Secure information: ${token}`}
              type="warning"
              action={<Button type={'text'} shape={'circle'} onClick={() => {
                navigator.clipboard.writeText(token)
                  .then(() => {
                    message.success('Copied to clipboard!')
                  })
              }}>
                <FontAwesomeIcon icon={faCopy} color={'#dd9955'}/>
              </Button>}
              showIcon/>}
      <Divider className={'my-4'}/>
      <div className={'flex gap-4'}>
        <Form.Item className={'mb-4 flex-grow-1'}>
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={"Password..."}/>
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
      {importStatus === Status.FULFILLED && <Alert
          message="Import cookies successfullyyyyyyyy =))"
          type="warning"
          showIcon/>}
      {importStatus === Status.REJECTED &&
          <Alert
              message="Faileddddddddd to import cookies =(("
              type="error"
              showIcon/>}
    </Form>
  </Card>;
}

export default CookiesETLForm;
