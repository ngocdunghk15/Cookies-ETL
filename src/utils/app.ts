export function downloadFile( payload: any, fileName: string = "cookies" ) {
	const blob = new Blob([payload], {
		type: 'application/octet-stream'
	});
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `${fileName}.json`;
	a.click();
	URL.revokeObjectURL(url);
}

export function getTime() {
	const time = new Date();
	const hour = time.getHours();
	const minute = time.getMinutes();
	const day = time.getDate();
	const month = time.getMonth() + 1;
	const year = time.getFullYear();
	return `${day}-${month}-${year}_${hour}h${minute}`;
}
