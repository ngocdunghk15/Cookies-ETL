// @ts-ignore
import GetAllDetails = chrome.cookies.GetAllDetails;
// @ts-ignore
import Cookie = chrome.cookies.Cookie;

export function getCookies(details: GetAllDetails) {
  return new Promise(resolve => {
    chrome.cookies.getAll(details, cookies => {
      resolve(cookies);
    })
  });
}

export function setCookies(cookies: Cookie[], url: string) {
  cookies.forEach(item => {
    chrome.cookies.set({
      url,
      name: item?.name,
      value: item?.value,
      storeId: item?.storeId,
      expirationDate: item?.expirationDate,
      domain: item?.domain,
      path: item?.path,
      sameSite: item?.sameSite,
      httpOnly: item?.httpOnly,
      secure: item?.secure,
    })
  })
}
